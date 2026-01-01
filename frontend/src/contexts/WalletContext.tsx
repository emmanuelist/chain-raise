import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connect, disconnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  network: 'mainnet' | 'testnet';
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: 'mainnet' | 'testnet') => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet');
  const [isLoading, setIsLoading] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('stacks-address');
    const storedNetwork = localStorage.getItem('stacks-network') as 'mainnet' | 'testnet' | null;
    
    if (storedAddress) {
      setAddress(storedAddress);
      setIsConnected(true);
    }
    
    if (storedNetwork) {
      setNetwork(storedNetwork);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const response = await connect({
        appDetails: {
          name: 'Chain Raise',
          icon: window.location.origin + '/logo.png',
        },
        network: network === 'mainnet' ? new StacksMainnet() : new StacksTestnet(),
        onFinish: (data) => {
          const userAddress = data.addresses[network];
          setAddress(userAddress);
          setIsConnected(true);
          
          // Persist connection state
          localStorage.setItem('stacks-address', userAddress);
          localStorage.setItem('stacks-network', network);
        },
        onCancel: () => {
          console.log('User cancelled wallet connection');
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setAddress(null);
    setIsConnected(false);
    
    // Clear persisted state
    localStorage.removeItem('stacks-address');
  };

  const switchNetwork = (newNetwork: 'mainnet' | 'testnet') => {
    setNetwork(newNetwork);
    localStorage.setItem('stacks-network', newNetwork);
    
    // If wallet is connected, disconnect and prompt reconnection
    if (isConnected) {
      disconnectWallet();
    }
  };

  const value: WalletContextType = {
    isConnected,
    address,
    network,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
