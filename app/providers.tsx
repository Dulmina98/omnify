"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {reconnect} from "@wagmi/core";
import {type ReactNode, useEffect, useState} from 'react';
import {WagmiProvider} from "wagmi";
import {Web3Config} from "@/config/web3-config";


export default function Providers(props: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    useEffect(() => {
        setTimeout(() => {
            reconnect(Web3Config.wagmiConfig);
        });
    }, []);
    return (
        <WagmiProvider config={Web3Config.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}