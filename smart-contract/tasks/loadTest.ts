import {task} from "hardhat/config";
import {ethers} from "ethers";
import {time} from "@nomicfoundation/hardhat-network-helpers";

task("loadTest", "Simulate multiple players paying entry fee").setAction(
    async (taskArgs, hre) => {
        const Tournament = await hre.ethers.getContractFactory("Tournament");
        const [organizer, ...existingPlayers] = await hre.ethers.getSigners();
        const numPlayers = 100; // Target number of players

        let players = [...existingPlayers];

        // Generate additional players if necessary
        while (players.length < numPlayers) {
            const wallet = ethers.Wallet.createRandom().connect(hre.ethers.provider);
            await organizer.sendTransaction({
                to: wallet.address,
                value: ethers.parseEther("1"), // Fund new player with ETH
            });
            players.push(wallet);
        }

        console.log(`Generated ${players.length - existingPlayers.length} additional players.`);

        // Deploy tournament
        const currentTime = BigInt(await time.latest());
        const tournament = await Tournament.deploy(
            ethers.parseEther("0.1"), // entryFee
            numPlayers, // maxPlayers
            currentTime, // startDate
            currentTime + BigInt(7 * 24 * 60 * 60), // endDate (7 days later)
            ethers.parseEther("10.0"), // prizePool
            0 // tournamentType
        );
        await tournament.waitForDeployment();

        console.log(`Tournament deployed with max ${numPlayers} players.`);

        // Simulating entry fees
        const start = Date.now();
        for (let i = 0; i < numPlayers; i++) {
            await tournament.connect(players[i]).payEntryFee({value: ethers.parseEther("0.1")});
        }
        console.log(`Time taken for ${numPlayers} players: ${Date.now() - start}ms`);
    }
);

export default task;
