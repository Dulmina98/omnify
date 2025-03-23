import {mainnet} from 'viem/chains';
import {createConfig, http} from "@wagmi/core";
import {injected} from 'wagmi/connectors';

const connectors = typeof window !== 'undefined' ? [injected()] : [];

export const wagmiConfig = createConfig({
    chains: [mainnet],
    connectors,
    ssr: true,
    transports: {
        [mainnet.id]: http(),
    },
});

declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig;
    }
}

export abstract class Web3Config {
    static readonly wagmiConfig = wagmiConfig;
}