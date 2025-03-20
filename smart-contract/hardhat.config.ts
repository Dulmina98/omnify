import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        hardhat: {}, // Local testing network
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/REj0VEfo53aT6nTF5Tiz-9CPEH1L6k7M",
            accounts: ["0c78c8adeed6a7d63af0dfce13f4e1b4a1a57f5a5e0d5354d306b930018ae068"]
        }
    }
};

export default config;