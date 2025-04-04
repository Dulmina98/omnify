import {ethers} from "ethers";
import TournamentArtifact from "../smart-contract/artifacts/contracts/Tournament.sol/Tournament.json";

const abi = TournamentArtifact.abi;

export function getContractReadOnly(
    contractAddress: string,
    provider: ethers.Provider = new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    )
) {
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error("Invalid contract address provided.");
    }
    return new ethers.Contract(contractAddress, abi, provider);
}

export async function getContractWithSigner(contractAddress: string) {
    if (!window.ethereum) {
        throw new Error("MetaMask not found. Please install MetaMask and refresh.");
    }

    try {
        await window.ethereum.request({method: "eth_requestAccounts"});
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
            throw new Error("Please switch to the Sepolia testnet in MetaMask.");
        }

        const signer = await provider.getSigner();
        if (!contractAddress || !ethers.isAddress(contractAddress)) {
            throw new Error("Invalid contract address provided.");
        }

        return new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
        throw new Error(`Failed to initialize contract with signer: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function fetchTournamentData(contractAddress: string) {
    const contract = getContractReadOnly(contractAddress);

    try {
        const [
            entryFee,
            totalPrizePool,
            numberOfPlayersRequired,
            startDate,
            endDate,
            organizer,
            status,
            prizeDistributionMethod,
            overallWinner
        ] = await Promise.all([
            contract.entryFee(),
            contract.totalPrizePool(),
            contract.numberOfPlayersRequired(),
            contract.startDate(),
            contract.endDate(),
            contract.organizer(),
            contract.status(),
            contract.prizeDistributionMethod(),
            contract.overallWinner()
        ]);

        return {
            entryFee: ethers.formatEther(entryFee),
            totalPrizePool: ethers.formatEther(totalPrizePool),
            numberOfPlayersRequired: Number(numberOfPlayersRequired),
            startDate: Number(startDate),
            endDate: Number(endDate),
            organizer: organizer.toLowerCase(),
            status: Number(status),
            prizeDistributionMethod: Number(prizeDistributionMethod),
            overallWinner: overallWinner.toLowerCase()
        };
    } catch (error) {
        throw new Error(`Failed to fetch tournament data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function fetchEntryFeeTransactions(contractAddress: string) {
    const contract = getContractReadOnly(contractAddress);
    const filter = contract.filters.PlayerPaid();
    const logs = await contract.queryFilter(filter);
    const eventLogs = logs.filter(log => 'args' in log) as ethers.EventLog[];

    return eventLogs.map(event => ({
        player: event.args.player.toLowerCase(),
        amount: ethers.formatEther(event.args.amount),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
    }));
}

export async function fetchMatchResult(contractAddress: string, matchId: number) {
    const contract = getContractReadOnly(contractAddress);
    try {
        const result = await contract.matchResults(matchId);
        return {
            matchId: Number(result.matchId),
            round: Number(result.round),
            player1: result.player1.toLowerCase(),
            player2: result.player2.toLowerCase(),
            player1Submission: result.player1Submission.toLowerCase(),
            player2Submission: result.player2Submission.toLowerCase(),
            winner: result.winner.toLowerCase(),
            disputed: result.disputed
        };
    } catch (error) {
        throw new Error(`Failed to fetch match result: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function fetchRoundWinners(contractAddress: string, round: number) {
    const contract = getContractReadOnly(contractAddress);
    try {
        const winners = await contract.getRoundWinners(round);
        return winners.map((winner: string) => winner.toLowerCase());
    } catch (error) {
        throw new Error(`Failed to fetch round winners: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function fetchPrizeClaimedTransactions(contractAddress: string) {
    const contract = getContractReadOnly(contractAddress);
    const filter = contract.filters.PrizeClaimed();
    const logs = await contract.queryFilter(filter);
    const eventLogs = logs.filter(log => 'args' in log) as ethers.EventLog[];

    return eventLogs.map(event => ({
        winner: event.args.winner.toLowerCase(),
        amount: ethers.formatEther(event.args.amount),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
    }));
}