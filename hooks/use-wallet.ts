'use client';

import {useCallback, useEffect, useState} from 'react';
import {BrowserProvider, Signer} from 'ethers';
import {useAccount, useConnect, useDisconnect} from 'wagmi';

export const useWallet = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const {address, isConnected} = useAccount();
    const {connect, connectors} = useConnect();
    const {disconnect} = useDisconnect();

    // Connect wallet function
    const connectWallet = useCallback(async () => {
        if (connectors.length > 0 && window.ethereum) {
            try {
                await connect({connector: connectors[0]});
                const web3Provider = new BrowserProvider(window.ethereum);
                const signer = await web3Provider.getSigner();
                setProvider(web3Provider);
                setSigner(signer);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        } else {
            alert('Please install MetaMask or configure wallet connectors.');
        }
    }, [connectors]);

    // Disconnect wallet function
    const disconnectWallet = useCallback(() => {
        disconnect();
        setProvider(null);
        setSigner(null);
        // Note: Address and isConnected are managed by wagmi
    }, [disconnect]);

    // Effect to handle connection state and account changes
    useEffect(() => {
        if (isConnected && window.ethereum) {
            const web3Provider = new BrowserProvider(window.ethereum);
            setProvider(web3Provider);

            web3Provider.getSigner().then(
                (signer: Signer) => setSigner(signer),
                (error) => {
                    console.error('Failed to get signer:', error);
                    setSigner(null);
                }
            );

            // Listen for account changes
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                }
                // Address is automatically updated via wagmi's useAccount
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            // Cleanup listener on unmount
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        } else {
            setProvider(null);
            setSigner(null);
        }
    }, [isConnected, disconnectWallet]);

    return {
        provider,
        signer,
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
    };
};