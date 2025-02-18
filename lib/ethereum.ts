import {createPublicClient, createWalletClient, custom, http} from 'viem'
import {sepolia} from 'viem/chains'
import {tournamentPaymentABI} from '@/types/TournamentPaymentABI';

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL)
})

export const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum)
})

export const contractConfig = {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: tournamentPaymentABI,
    chainId: sepolia.id
};