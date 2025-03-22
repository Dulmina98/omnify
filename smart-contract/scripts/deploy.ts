import {ethers} from "hardhat";

async function main() {
    const entryFee = ethers.parseEther("0.1"); // 0.1 ETH
    const TournamentFactory = await ethers.getContractFactory("Tournament");
    const tournament = await TournamentFactory.deploy(entryFee);
    await tournament.waitForDeployment();
    console.log("Tournament deployed to:", tournament.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});