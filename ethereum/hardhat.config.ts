import {HardhatUserConfig, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY!]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    typechain: {
        outDir: "../types",
        target: "ethers-v6",
        alwaysGenerateOverloads: true,
    }
};

task("typechain", "Generate TypeScript types and ABI", async (args, hre) => {
    await hre.run("compile");
    const {generateAbi} = await import("./scripts/generateAbi");
    generateAbi();
    await hre.run("typechain"); // Add this to generate types
});

export default config;