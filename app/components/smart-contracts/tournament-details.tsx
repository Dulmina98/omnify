"use client";

import {useEffect, useState} from "react";
import {fetchEntryFeeTransactions, fetchMatchResult, fetchTournamentData} from "@/lib/contract";
import {FaCalendarAlt, FaEthereum, FaExternalLinkAlt, FaTrophy, FaUsers} from "react-icons/fa";
import {MdOutlinePending} from "react-icons/md";
import {ethers} from "ethers";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

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

                    // Player submissions status
                    let playerStatus: "Pending" | "Completed" | "Disputed";
                    if (
                        result.player1Submission !== ethers.ZeroAddress &&
                        result.player2Submission !== ethers.ZeroAddress
                    ) {
                        playerStatus =
                            result.player1Submission === result.player2Submission
                                ? "Completed"
                                : "Disputed";
                    } else {
                        playerStatus = "Pending";
                    }

                    // Player 1 submission
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

                    // Player 2 submission
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

                    // Organizer resolution
                    if (convexResult?.resolutionTransactionHash && convexResult?.resolvedBy) {
                        submissions.push({
                            matchId: result.matchId,
                            player: data.organizer, // Organizer address from tournament data
                            submission: result.winner,
                            transactionHash: convexResult.resolutionTransactionHash,
                            submittedBy: data.organizer, // Use organizer’s address
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
                <FaTrophy className="mr-2 text-yellow-400"/> Tournament Details (On-Chain)
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
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-4"
                        >
                            <FaExternalLinkAlt className="mr-1"/> View on Etherscan
                        </a>
                        <a
                            href={`${sourcifyBaseUrl}/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-2"
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
                        <span className="font-semibold mr-2">Prize Distribution:</span>
                        {prizeMethodLabels[tournamentData.prizeDistributionMethod]}
                    </p>
                    <p className="flex items-center">
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

            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-yellow-400"/> Match Results
                </h4>
                {submissions.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-900/50 rounded-lg p-4">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="bg-gray-800">
                                <th className="px-4 py-2 text-left font-semibold">Match ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Player</th>
                                <th className="px-4 py-2 text-left font-semibold">Submitted Winner</th>
                                <th className="px-4 py-2 text-left font-semibold">Submitted By</th>
                                <th className="px-4 py-2 text-left font-semibold">Status</th>
                                <th className="px-4 py-2 text-left font-semibold">Winner</th>
                                <th className="px-4 py-2 text-left font-semibold">Tx Hash</th>
                            </tr>
                            </thead>
                            <tbody>
                            {submissions.map((submission, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-2">{submission.matchId}</td>
                                    <td className="px-4 py-2 truncate max-w-xs">{submission.player}</td>
                                    <td className="px-4 py-2 truncate max-w-xs">{submission.submission}</td>
                                    <td className="px-4 py-2 truncate max-w-xs">
                                        <a
                                            href={`${etherscanBaseUrl}/address/${submission.submittedBy}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            {submission.submittedBy}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">
                                            <span
                                                className={`${
                                                    submission.status === "Pending"
                                                        ? "text-yellow-400"
                                                        : submission.status === "Completed"
                                                            ? "text-green-400"
                                                            : submission.status === "Disputed"
                                                                ? "text-red-400"
                                                                : "text-blue-400" // Resolved
                                                }`}
                                            >
                                                {submission.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-2 truncate max-w-xs">
                                        {submission.winner || "N/A"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={`${etherscanBaseUrl}/tx/${submission.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 truncate max-w-xs block"
                                        >
                                            {submission.transactionHash.slice(0, 6)}...
                                            {submission.transactionHash.slice(-4)}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400">No match results found.</p>
                )}
            </div>

            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <FaEthereum className="mr-2 text-blue-400"/> Entry Fee Transactions
                </h4>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-900/50 rounded-lg p-4">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="bg-gray-800">
                                <th className="px-4 py-2 text-left font-semibold">Player</th>
                                <th className="px-4 py-2 text-left font-semibold">Amount (ETH)</th>
                                <th className="px-4 py-2 text-left font-semibold">Transaction Hash</th>
                                <th className="px-4 py-2 text-left font-semibold">Block Number</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-2 truncate max-w-xs">{tx.player}</td>
                                    <td className="px-4 py-2">{tx.amount}</td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={`${etherscanBaseUrl}/tx/${tx.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 truncate max-w-xs block"
                                        >
                                            {tx.transactionHash}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{tx.blockNumber}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400">No entry fee transactions found.</p>
                )}
            </div>

            <p className="text-sm text-gray-400 mt-6 italic text-center">
                Data fetched directly from the blockchain for maximum transparency.
            </p>
        </div>
    );
}