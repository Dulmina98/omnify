"use client";

import {useEffect, useState} from "react";
import {fetchEntryFeeTransactions, fetchTournamentData} from "@/lib/contract";
import {FaCalendarAlt, FaEthereum, FaExternalLinkAlt, FaTrophy, FaUsers} from "react-icons/fa";
import {MdOutlinePending} from "react-icons/md";

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

export default function TournamentDetails({contractAddress}: TournamentDetailsProps) {
    const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch tournament data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [contractAddress]);

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

    return (
        <div
            className="bg-black/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-white shadow-lg mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaTrophy className="mr-2 text-yellow-400"/> Tournament Details (On-Chain)
            </h3>

            {/* Tournament Info Card */}
            <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="flex items-center">
                        <span className="font-semibold mr-2">Contract Address:</span>
                        <span className="truncate">{contractAddress}</span>
                    </p>
                    <p>
                        <a
                            href={`${etherscanBaseUrl}/address/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <FaExternalLinkAlt className="mr-1"/> View on Etherscan
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
                        <span
                            className="font-semibold mr-2">Start Date:</span> {new Date(tournamentData.startDate * 1000).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-purple-400"/>
                        <span
                            className="font-semibold mr-2">End Date:</span> {new Date(tournamentData.endDate * 1000).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                        <FaUsers className="mr-2 text-orange-400"/>
                        <span
                            className="font-semibold mr-2">Players Required:</span> {tournamentData.numberOfPlayersRequired}
                    </p>
                    <p className="flex items-center">
                        <span
                            className="font-semibold mr-2">Prize Distribution:</span> {prizeMethodLabels[tournamentData.prizeDistributionMethod]}
                    </p>
                    <p className="flex items-center">
                        <span className="font-semibold mr-2">Status:</span>
                        <span
                            className={`px-2 py-1 rounded ${tournamentData.status === 0 ? "bg-green-500/20 text-green-400" : tournamentData.status === 1 ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`}
                        >
                            {statusLabels[tournamentData.status]}
                        </span>
                    </p>
                </div>
            </div>

            {/* Transactions Section */}
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
                                <tr key={index}
                                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
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