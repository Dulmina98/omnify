"use client";

import {useEffect, useState} from "react";
import {
    fetchEntryFeeTransactions,
    fetchMatchResult,
    fetchPrizeClaimedTransactions,
    fetchTournamentData,
} from "@/lib/contract";
import {
    FaCalendarAlt,
    FaChessBoard,
    FaChessKnight,
    FaEthereum,
    FaExternalLinkAlt,
    FaFlagCheckered,
    FaGift,
    FaTrophy,
    FaUsers,
    FaUserTie,
} from "react-icons/fa";
import {MdOutlinePending} from "react-icons/md";
import {ethers} from "ethers";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";

interface TournamentDetailsProps {
    contractAddress: string;
}

interface TournamentData {
    entryFee: string;
    totalPrizePool: string;
    numberOfPlayersRequired: number;
    startDate: number;
    endDate: number;
    organizer: string;
    status: number;
    prizeDistributionMethod: number;
}

interface Transaction {
    player: string;
    amount: string;
    transactionHash: string;
    blockNumber: number;
}

interface PrizeClaimedTransaction {
    winner: string;
    amount: string;
    transactionHash: string;
    blockNumber: number;
}

interface MatchResult {
    matchId: number;
    player1: string;
    player2: string;
    player1Submission: string;
    player2Submission: string;
    winner: string;
    disputed: boolean;
}

interface Submission {
    matchId: number;
    player: string;
    submission: string;
    transactionHash: string;
    submittedBy: string;
    status: "Pending" | "Completed" | "Disputed" | "Resolved";
    winner?: string;
}

export default function TournamentDetails({contractAddress}: TournamentDetailsProps) {
    const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [prizeClaimedTransactions, setPrizeClaimedTransactions] = useState<PrizeClaimedTransaction[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const convexMatchResults = useQuery(api.match_results.getMatchResultsByContract, {
        contractAddress,
    }) || [];

    useEffect(() => {
        const loadData = async () => {
            if (!contractAddress) {
                setError("No contract address provided.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const data = await fetchTournamentData(contractAddress);
                setTournamentData(data);

                const txs = await fetchEntryFeeTransactions(contractAddress);
                setTransactions(txs);

                const prizeTxs = await fetchPrizeClaimedTransactions(contractAddress);
                setPrizeClaimedTransactions(prizeTxs);

                const matchIds = convexMatchResults.map((mr) =>
                    parseInt(mr.matchId.replace("match-", ""), 10)
                );
                const blockchainResults = await Promise.all(
                    matchIds.map((id) => fetchMatchResult(contractAddress, id))
                );

                const filteredResults = blockchainResults.filter(
                    (result) =>
                        result.player1Submission !== ethers.ZeroAddress ||
                        result.player2Submission !== ethers.ZeroAddress
                );

                const submissionList = filteredResults.flatMap((result) => {
                    const convexResult = convexMatchResults.find(
                        (mr) => mr.matchId === `match-${result.matchId}`
                    );
                    const submissions: Submission[] = [];

                    let playerStatus: "Pending" | "Completed" | "Disputed";
                    if (
                        result.player1Submission !== ethers.ZeroAddress &&
                        result.player2Submission !== ethers.ZeroAddress
                    ) {
                        playerStatus =
                            result.player1Submission === result.player2Submission ? "Completed" : "Disputed";
                    } else {
                        playerStatus = "Pending";
                    }

                    if (result.player1Submission !== ethers.ZeroAddress) {
                        const txHash = convexResult?.player1TransactionHash || convexResult?.transactionHash;
                        if (txHash) {
                            submissions.push({
                                matchId: result.matchId,
                                player: result.player1,
                                submission: result.player1Submission,
                                transactionHash: txHash,
                                submittedBy: result.player1,
                                status: playerStatus,
                                winner: playerStatus === "Completed" ? result.player1Submission : undefined,
                            });
                        }
                    }

                    if (result.player2Submission !== ethers.ZeroAddress) {
                        const txHash = convexResult?.player2TransactionHash || convexResult?.transactionHash;
                        if (txHash) {
                            submissions.push({
                                matchId: result.matchId,
                                player: result.player2,
                                submission: result.player2Submission,
                                transactionHash: txHash,
                                submittedBy: result.player2,
                                status: playerStatus,
                                winner: playerStatus === "Completed" ? result.player2Submission : undefined,
                            });
                        }
                    }

                    if (convexResult?.resolutionTransactionHash && convexResult?.resolvedBy) {
                        submissions.push({
                            matchId: result.matchId,
                            player: data.organizer,
                            submission: result.winner,
                            transactionHash: convexResult.resolutionTransactionHash,
                            submittedBy: data.organizer,
                            status: "Resolved",
                            winner: result.winner,
                        });
                    }

                    return submissions;
                });

                setSubmissions(submissionList);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch tournament data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [contractAddress, convexMatchResults]);

    if (loading) {
        return (
            <div className="text-white flex items-center justify-center">
                <MdOutlinePending className="animate-spin mr-2"/> Loading tournament data...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    if (!tournamentData) {
        return <div className="text-white text-center">No data available.</div>;
    }

    const statusLabels = ["Ongoing", "Distributed", "Canceled"];
    const prizeMethodLabels = ["Winner Takes All", "Top 3"];
    const etherscanBaseUrl = "https://sepolia.etherscan.io";
    const sourcifyBaseUrl = "https://sourcify.dev/#/lookup";

    return (
        <div
            className="bg-black/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-white shadow-lg mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaChessKnight className="mr-2 text-teal-400"/> Tournament Details (On-Chain)
            </h3>

            <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="flex">
                        <span className="font-semibold mr-2">Contract Address:</span>
                        <span className="truncate">{contractAddress}</span>
                    </p>
                    <p>
                        <a
                            href={`${etherscanBaseUrl}/address/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-theme-crimson hover:text-white transition-colors mr-4"
                        >
                            <FaExternalLinkAlt className="mr-1"/> View on Etherscan
                        </a>
                        <a
                            href={`${sourcifyBaseUrl}/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-theme-crimson hover:text-white transition-colors mt-2"
                        >
                            <FaExternalLinkAlt className="mr-1"/> View on Sourcify
                        </a>
                    </p>
                    <p className="flex items-center">
                        <FaEthereum className="mr-2 text-blue-400"/>
                        <span className="font-semibold mr-2">Entry Fee:</span> {tournamentData.entryFee} ETH
                    </p>
                    <p className="flex items-center">
                        <FaEthereum className="mr-2 text-green-400"/>
                        <span
                            className="font-semibold mr-2">Total Prize Pool:</span> {tournamentData.totalPrizePool} ETH
                    </p>
                    <p className="flex items-center">
                        <FaUserTie className="mr-2 text-indigo-400"/>
                        <span className="font-semibold mr-2">Organizer:</span>
                        <span className="truncate">{tournamentData.organizer}</span>
                    </p>
                    <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-purple-400"/>
                        <span className="font-semibold mr-2">Start Date:</span>
                        {new Date(tournamentData.startDate * 1000).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-purple-400"/>
                        <span className="font-semibold mr-2">End Date:</span>
                        {new Date(tournamentData.endDate * 1000).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                        <FaUsers className="mr-2 text-orange-400"/>
                        <span className="font-semibold mr-2">Players Required:</span>
                        {tournamentData.numberOfPlayersRequired}
                    </p>
                    <p className="flex items-center">
                        <FaGift className="mr-2 text-pink-400"/>
                        <span className="font-semibold mr-2">Prize Distribution:</span>
                        {prizeMethodLabels[tournamentData.prizeDistributionMethod]}
                    </p>
                    <p className="flex items-center">
                        <FaFlagCheckered className="mr-2 text-cyan-400"/>
                        <span className="font-semibold mr-2">Status:</span>
                        <span
                            className={`px-2 py-1 rounded ${
                                tournamentData.status === 0
                                    ? "bg-green-500/20 text-green-400"
                                    : tournamentData.status === 1
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-red-500/20 text-red-400"
                            }`}
                        >
              {statusLabels[tournamentData.status]}
            </span>
                    </p>
                </div>
            </div>

            {/* Match Results Table */}
            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <FaChessBoard className="mr-2 text-fuchsia-400"/> Match Results
                </h4>
                {submissions.length > 0 ? (
                    <Table className="bg-black">
                        <TableCaption className="text-white">Match submissions and results</TableCaption>
                        <TableHeader>
                            <TableRow className="border-b botext-theme-crimson">
                                <TableHead className="text-white text-[16px] font-semibold">Match ID</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Player</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Submitted Winner</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Submitted By</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Status</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Winner</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Tx Hash</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((submission, index) => (
                                <TableRow
                                    key={index}
                                    className="border-b botext-theme-crimson hover:bg-gray-800"
                                >
                                    <TableCell className="text-white">{submission.matchId}</TableCell>
                                    <TableCell className="text-white truncate max-w-xs">{submission.player}</TableCell>
                                    <TableCell
                                        className="text-white truncate max-w-xs">{submission.submission}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`${etherscanBaseUrl}/address/${submission.submittedBy}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-theme-crimson hover:text-white transition-colors truncate max-w-xs block"
                                        >
                                            {submission.submittedBy.slice(0, 6)}...{submission.submittedBy.slice(-4)}
                                        </a>
                                    </TableCell>
                                    <TableCell
                                        className={`${
                                            submission.status === "Pending"
                                                ? "text-yellow-400"
                                                : submission.status === "Completed"
                                                    ? "text-green-400"
                                                    : submission.status === "Disputed"
                                                        ? "text-red-400"
                                                        : "text-blue-400"
                                        }`}
                                    >
                                        {submission.status}
                                    </TableCell>
                                    <TableCell className="text-white truncate max-w-xs">
                                        {submission.winner || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={`${etherscanBaseUrl}/tx/${submission.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-theme-crimson hover:text-white transition-colors truncate max-w-xs block"
                                        >
                                            {submission.transactionHash.slice(0, 6)}...{submission.transactionHash.slice(-4)}
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-gray-400">No match results found.</p>
                )}
            </div>

            {/* Entry Fee Transactions Table */}
            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <FaEthereum className="mr-2 text-blue-400"/> Entry Fee Transactions
                </h4>
                {transactions.length > 0 ? (
                    <Table className="bg-black">
                        <TableCaption className="text-white">Entry fee transactions</TableCaption>
                        <TableHeader>
                            <TableRow className="border-b botext-theme-crimson">
                                <TableHead className="text-white text-[16px] font-semibold">Player</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Amount (ETH)</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Transaction Hash</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Block Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx, index) => (
                                <TableRow
                                    key={index}
                                    className="border-b botext-theme-crimson hover:bg-gray-800"
                                >
                                    <TableCell className="text-white truncate max-w-xs">{tx.player}</TableCell>
                                    <TableCell className="text-white">{tx.amount}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`${etherscanBaseUrl}/tx/${tx.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-theme-crimson hover:text-white transition-colors truncate max-w-xs block"
                                        >
                                            {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-white">{tx.blockNumber}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-gray-400">No entry fee transactions found.</p>
                )}
            </div>

            {/* Prize Claimed Transactions Table */}
            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-yellow-400"/> Prize Claimed Transactions
                </h4>
                {prizeClaimedTransactions.length > 0 ? (
                    <Table className="bg-black">
                        <TableCaption className="text-white">Prize claimed transactions</TableCaption>
                        <TableHeader>
                            <TableRow className="border-b botext-theme-crimson">
                                <TableHead className="text-white text-[16px] font-semibold">Winner</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Amount (ETH)</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Transaction Hash</TableHead>
                                <TableHead className="text-white text-[16px] font-semibold">Block Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prizeClaimedTransactions.map((tx, index) => (
                                <TableRow
                                    key={index}
                                    className="border-b botext-theme-crimson hover:bg-gray-800"
                                >
                                    <TableCell className="text-white truncate max-w-xs">{tx.winner}</TableCell>
                                    <TableCell className="text-white">{tx.amount}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`${etherscanBaseUrl}/tx/${tx.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-theme-crimson hover:text-white transition-colors truncate max-w-xs block"
                                        >
                                            {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-white">{tx.blockNumber}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-gray-400">No prize claimed transactions found.</p>
                )}
            </div>

            <p className="text-sm text-gray-400 mt-6 italic text-center">
                Data fetched directly from the blockchain for maximum transparency.
            </p>
        </div>
    );
}