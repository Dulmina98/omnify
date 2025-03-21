'use client';

import {useCallback, useState} from 'react';
import {ethers} from 'ethers';

export function useWallet() {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    const connectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({method: 'eth_requestAccounts'});
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setProvider(provider);
                setSigner(signer);
                setAddress(address);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        } else {
            alert('Please install MetaMask to participate in tournaments.');
        }
    }, []);

    return {provider, signer, address, connectWallet};
}