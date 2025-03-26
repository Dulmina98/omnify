"use client";

import {useCurrentUser} from "@/services/user-service";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Link from "next/link";
import {useEffect, useState} from "react";
import {fetchPrizeClaimedTransactions} from "@/lib/contract";

interface PrizeClaimedTransaction {
    winner: string;
    amount: string;
    transactionHash: string;
    blockNumber: number;
    contractAddress?: string;
}

export function Transactions() {
    const {user} = useCurrentUser();
    const [prizeClaimedTransactions, setPrizeClaimedTransactions] = useState<PrizeClaimedTransaction[]>([]);

    const convexTransactions = useQuery(
        api.transactions.listTransactionsByUser,
        user?.userId ? {userId: user.userId} : "skip"
    ) || [];

    const walletId = useQuery(
        api.players.getPlayerWalletId,
        user?.userId ? {userId: user.userId} : "skip"
    );

    const userTournaments = useQuery(
        api.tournaments.getUserTournaments,
        user?.userId ? {userId: user.userId} : "skip"
    ) || [];

    const etherscanBaseUrl = "https://sepolia.etherscan.io";

    useEffect(() => {
        const loadPrizeTransactions = async () => {
            if (!user || !walletId || !userTournaments.length) return;

            try {
                const contractAddresses = userTournaments.map((t) => t.contractAddress);

                const allPrizeTxs = await Promise.all(
                    contractAddresses.map(async (contractAddress) => {
                        const txs = await fetchPrizeClaimedTransactions(contractAddress);
                        return txs
                            .filter((tx) => tx.winner.toLowerCase() === walletId.toLowerCase())
                            .map((tx) => ({...tx, contractAddress}));
                    })
                );

                const uniquePrizeTxs = Array.from(
                    new Map(allPrizeTxs.flat().map((tx) => [tx.transactionHash, tx])).values()
                );

                setPrizeClaimedTransactions(uniquePrizeTxs);
            } catch (error) {
                console.error("Failed to fetch prize transactions:", error);
            }
        };

        loadPrizeTransactions();
    }, [user, walletId, userTournaments]);

    if (!user) {
        return <div className="text-white">Loading user data...</div>;
    }

    const allTransactions = [
        ...convexTransactions.map((tx) => ({
            type: "Convex",
            transactionHash: tx.transactionHash,
            tournamentId: tx.tournamentId,
            tournamentName: tx.tournament?.tournamentName || "Unnamed Tournament",
            status: tx.status,
            paymentType: tx.paymentType,
            amount: tx.amount.toString(),
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            blockNumber: tx.blockNumber || "Pending",
        })),
        ...prizeClaimedTransactions.map((tx) => {
            const tournament = userTournaments.find((t) =>
                t.contractAddress.toLowerCase() === tx.contractAddress?.toLowerCase()
            );
            return {
                type: "Prize Claimed",
                transactionHash: tx.transactionHash,
                tournamentId: tournament?._id || null,
                tournamentName: tournament?.tournamentName || "Unknown Tournament",
                status: "Confirmed",
                paymentType: "Prize Claim",
                amount: tx.amount,
                fromAddress: tx.contractAddress,
                toAddress: tx.winner,
                blockNumber: tx.blockNumber,
            };
        }),
    ];

    return (
        <div className="container mx-auto py-10">
            <Table className="bg-black">
                <TableCaption className="text-white">Your recent transactions</TableCaption>
                <TableHeader>
                    <TableRow className="border-b botext-theme-crimson">
                        <TableHead className="text-white font-semibold text-[16px]">Transaction Hash</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">Tournament</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">Status</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">Type</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">Amount</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">From</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">To</TableHead>
                        <TableHead className="text-white font-semibold text-[16px]">Block</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allTransactions.map((tx, index) => (
                        <TableRow key={index} className="border-b botext-theme-crimson hover:bg-gray-800">
                            <TableCell>
                                <a
                                    href={`${etherscanBaseUrl}/tx/${tx.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-theme-crimson hover:text-white transition-colors"
                                >
                                    {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                                </a>
                            </TableCell>
                            <TableCell>
                                {tx.tournamentId && tx.tournamentName !== "Unnamed Tournament" && tx.tournamentName !== "Unknown Tournament" ? (
                                    <Link
                                        href={`/view-tournaments/${tx.tournamentId}`}
                                        className="text-theme-crimson hover:text-white transition-colors"
                                    >
                                        {tx.tournamentName}
                                    </Link>
                                ) : (
                                    <span className="text-white">{tx.tournamentName}</span>
                                )}
                            </TableCell>
                            <TableCell className="text-white capitalize">{tx.status}</TableCell>
                            <TableCell className="text-white capitalize">{tx.paymentType}</TableCell>
                            <TableCell className="text-white">{tx.amount}</TableCell>
                            <TableCell>
                                <a
                                    href={`${etherscanBaseUrl}/address/${tx.fromAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-theme-crimson hover:text-white transition-colors"
                                >
                                    {`${tx.fromAddress?.slice(0, 6)}...${tx.fromAddress?.slice(-4)}`}
                                </a>
                            </TableCell>
                            <TableCell>
                                <a
                                    href={`${etherscanBaseUrl}/address/${tx.toAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-theme-crimson hover:text-white transition-colors"
                                >
                                    {tx.toAddress.slice(0, 6)}...{tx.toAddress.slice(-4)}
                                </a>
                            </TableCell>
                            <TableCell className="text-white">{tx.blockNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Transactions;