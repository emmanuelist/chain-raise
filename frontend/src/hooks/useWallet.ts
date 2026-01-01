import { useWalletContext } from '@/contexts/WalletContext';

/**
 * Custom hook for accessing wallet functionality
 * @returns Wallet state and methods
 */
export const useWallet = () => {
  const {
    isConnected,
    address,
    network,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWalletContext();

  /**
   * Get truncated address for display
   * @param addr - Full Stacks address
   * @returns Truncated address (e.g., "SP1AB...XYZ9")
   */
  const getTruncatedAddress = (addr: string | null): string => {
    if (!addr) return '';
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  /**
   * Check if current address matches a specific address
   * @param targetAddress - Address to compare
   * @returns True if addresses match
   */
  const isAddressMatch = (targetAddress: string): boolean => {
    return address?.toLowerCase() === targetAddress.toLowerCase();
  };

  return {
    isConnected,
    address,
    network,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    truncatedAddress: getTruncatedAddress(address),
    isAddressMatch,
  };
};
