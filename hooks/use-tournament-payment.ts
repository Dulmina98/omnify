import {useAccount, useWriteContract} from "wagmi";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useCurrentUser} from "@/services/user-service";
import {contractConfig} from "@/lib/ethereum";
import {Id} from "@/convex/_generated/dataModel";

export const useTournamentPayment = (tournamentId: string, entryFee: number) => {
    const {address} = useAccount();
    const createTransaction = useMutation(api.transactions.createTransaction);
    const updateEntryTransaction = useMutation(api.tournament_entries.updateTransactionId);
    const {user} = useCurrentUser();

    const {writeContractAsync: payEntryFee, isPending: isLoading, isSuccess, error} = useWriteContract();

    if (!user) {
        return {
            payEntryFee: async () => {
            }, isLoading: false, isSuccess: false, error: null, hasPaid: false
        };
    }

    const handlePay = async () => {
        if (!address) {
            console.error('No connected wallet address');
            return;
        }

        try {
            // Execute blockchain payment
            const txHash = await payEntryFee({
                ...contractConfig,
                functionName: 'payEntryFee',
                args: [BigInt(parseInt(tournamentId, 16) || 0)],
                value: BigInt(Math.floor(entryFee * 1e18)),
                chainId: contractConfig.chainId,
            });

            // Create transaction record in Convex
            const transactionId = await createTransaction({
                tournamentId: tournamentId as Id<"tournaments">,
                amount: entryFee,
                fromAddress: address,
                toAddress: contractConfig.address,
                transactionHash: txHash,
                userId: user.userId,
            });

            await updateEntryTransaction({
                tournamentId: tournamentId as Id<"tournaments">,
                userId: user.userId,
                transactionId,
            });

        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    // Optionally, compute or derive the hasPaid value as needed.
    const hasPaid = isSuccess; // for example

    return {payEntryFee: handlePay, isLoading, isSuccess, error, hasPaid};
};