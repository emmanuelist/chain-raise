import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';

interface ConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  variant = 'default',
  size = 'default',
}) => {
  const {
    isConnected,
    address,
    network,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    truncatedAddress,
  } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleNetworkSwitch = () => {
    const newNetwork = network === 'mainnet' ? 'testnet' : 'mainnet';
    switchNetwork(newNetwork);
  };

  // Loading state
  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // Connected state
  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size}>
            <Wallet className="mr-2 h-4 w-4" />
            {truncatedAddress}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            <p className="text-sm font-mono break-all">{address}</p>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Network</span>
            <Badge variant={network === 'mainnet' ? 'default' : 'secondary'}>
              {network === 'mainnet' ? 'Mainnet' : 'Testnet'}
            </Badge>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleNetworkSwitch}>
            Switch to {network === 'mainnet' ? 'Testnet' : 'Mainnet'}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Disconnected state
  return (
    <Button variant={variant} size={size} onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
};
