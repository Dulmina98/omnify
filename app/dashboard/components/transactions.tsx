"use client";

import {useCurrentUser} from "@/services/user-service";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Link from "next/link";

export function Transactions() {
    const {user} = useCurrentUser();

    // Fetch all transactions from Convex for the current user
    const convexTransactions = useQuery(
        api.transactions.listTransactionsByUser,
        user?.userId ? {userId: user.userId} : "skip"
    ) || [];

    const etherscanBaseUrl = "https://sepolia.etherscan.io";

    if (!user) {
        return <div className="text-white">Loading user data...</div>;
    }

    // Map Convex transactions to the display format
    const allTransactions = convexTransactions.map((tx) => ({
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
    }));

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
                                {tx.tournamentId && tx.tournamentName !== "Unnamed Tournament" ? (
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