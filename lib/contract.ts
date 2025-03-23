import {ethers} from "ethers";
import TournamentArtifact from "../smart-contract/artifacts/contracts/Tournament.sol/Tournament.json";

const abi = TournamentArtifact.abi;

/**
 * Get a contract instance for read-only operations using a provider
 * @param contractAddress The deployed contract address
 * @param provider Optional custom provider; defaults to Alchemy Sepolia
 * @returns Ethers Contract instance
 */
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

/**
 * Get a contract instance for read/write operations using MetaMask signer
 * @param contractAddress The deployed contract address
 * @returns Ethers Contract instance connected to signer
 */
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

/**
 * Fetch key tournament data from the contract for verification
 * @param contractAddress The deployed contract address
 * @returns Object with key contract data
 */
export async function fetchTournamentData(contractAddress: string) {
    const contract = getContractReadOnly(contractAddress);

    try {
        const [entryFee, totalPrizePool, numberOfPlayersRequired, startDate, endDate, organizer, status, prizeDistributionMethod] = await Promise.all([
            contract.entryFee(),
            contract.totalPrizePool(),
            contract.numberOfPlayersRequired(),
            contract.startDate(),
            contract.endDate(),
            contract.organizer(),
            contract.status(),
            contract.prizeDistributionMethod(),
        ]);

        return {
            entryFee: ethers.formatEther(entryFee),
            totalPrizePool: ethers.formatEther(totalPrizePool),
            numberOfPlayersRequired: Number(numberOfPlayersRequired),
            startDate: Number(startDate),
            endDate: Number(endDate),
            organizer: organizer.toLowerCase(),
            status: Number(status), // 0: Ongoing, 1: Distributed, 2: Canceled
            prizeDistributionMethod: Number(prizeDistributionMethod), // 0: WinnerTakesAll, 1: Top3
        };
    } catch (error) {
        throw new Error(`Failed to fetch tournament data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Fetch all entry fee payment transactions (PlayerPaid events) for a tournament
 * @param contractAddress The deployed contract address
 * @returns Array of transaction objects with player, amount, transactionHash, and blockNumber
 */
export async function fetchEntryFeeTransactions(contractAddress: string) {
    // Create a read-only contract instance
    const contract = getContractReadOnly(contractAddress);

    // Create a filter for the PlayerPaid event
    const filter = contract.filters.PlayerPaid();

    // Query all PlayerPaid events from the contract
    const logs = await contract.queryFilter(filter);

    // Filter only EventLog instances (those with the 'args' property)
    const eventLogs = logs.filter(log => 'args' in log) as ethers.EventLog[];

    // Map events to a readable format
    return eventLogs.map(event => ({
        player: event.args.player,                  // Access player from args
        amount: ethers.formatEther(event.args.amount), // Convert amount from wei to ETH
        transactionHash: event.transactionHash,     // Transaction hash
        blockNumber: event.blockNumber,             // Block number
    }));
}