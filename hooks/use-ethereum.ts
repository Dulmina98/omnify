import {useEffect, useState} from 'react';
import {BrowserProvider, Signer} from 'ethers'; // Updated imports for ethers v6
import {useAccount, useConnect, useDisconnect} from 'wagmi';

export const useEthereum = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null); // Use BrowserProvider instead of Web3Provider
    const [signer, setSigner] = useState<Signer | null>(null);
    const {address, isConnected} = useAccount();
    const {connect, connectors} = useConnect();
    const {disconnect} = useDisconnect();

    useEffect(() => {
        if (isConnected && window.ethereum) {
            const web3Provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
            setProvider(web3Provider);

            // Get the signer
            web3Provider.getSigner().then((signer: Signer) => {
                setSigner(signer);
            });
        } else {
            setProvider(null);
            setSigner(null);
        }
    }, [isConnected]);

    const connectWallet = () => {
        if (connectors.length > 0) {
            connect({connector: connectors[0]});
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    return {
        provider,
        signer,
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
    };
};