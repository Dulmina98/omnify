import {ethers} from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const TournamentPayment = await ethers.getContractFactory("TournamentPayment");
    const contract = await TournamentPayment.deploy();

    console.log("Contract deployed to:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });