import {ethers} from "hardhat";

async function main() {
    const Tournament = await ethers.getContractFactory("Tournament");
    const entryFee = ethers.parseEther("0.01");
    const numberOfPlayersRequired = 4;
    const startDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const endDate = startDate + 86400; // 1 day after start
    const prizeDistributionMethod = 0; // WinnerTakesAll

    const tournament = await Tournament.deploy(
        entryFee,
        numberOfPlayersRequired,
        startDate,
        endDate,
        prizeDistributionMethod
    );

    await tournament.waitForDeployment();
    console.log("Tournament deployed to:", await tournament.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});