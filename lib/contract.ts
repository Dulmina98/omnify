import {ethers} from "ethers";

const contractAddress = "0x6B14eBb26F6e9E63C2Dd92868b943B431BBC3466";
const abi = [
    "function payEntryFee() external payable",
    "function contribute() external payable",
    "function getPrizePool() external view returns (uint256)",
    "function distributePrizes(address[] calldata winners, uint256[] calldata amounts) external",
    "function organizer() external view returns (address)",
    "function entryFee() external view returns (uint256)",
    "function cancelTournament() external",
    "function withdrawRemainingFunds() external",
    "function status() external view returns (uint8)",
    "function paidPlayers(address) external view returns (bool)"
];


export async function getContract(contractAddress: string) {
    // If MetaMask is not installed, window.ethereum will be undefined
    if (!window.ethereum) {
        throw new Error("MetaMask not found. Please install MetaMask and refresh.");
    }

    // Request account access if needed
    await window.ethereum.request({method: "eth_requestAccounts"});

    // Create an Ethers provider (v6 syntax with `ethers.BrowserProvider`)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Return a contract instance connected to the signer
    return new ethers.Contract(contractAddress, abi, signer);
}

