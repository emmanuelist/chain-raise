import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  ClarityValue,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract deployment details
export const CONTRACT_ADDRESS = 'STHB047A30W99178TR7KE0784C2GV2206H98PPY';
export const CONTRACT_NAME = 'chain-raise';

// Network configuration
export const getNetwork = (network: 'mainnet' | 'testnet' = 'testnet') => {
  return network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
};

// Campaign data interface matching contract structure
export interface CampaignData {
  isInitialized: boolean;
  isCancelled: boolean;
  isPaused: boolean;
  beneficiary: string;
  campaignStart: number;
  campaignGoal: number;
  campaignDuration: number;
  totalStx: number;
  totalSbtc: number;
  donationCount: number;
  isWithdrawn: boolean;
  title: string;
  description: string;
  category: string;
  minDonationStx: number;
  maxDonationStx: number;
  beneficiaryCount: number;
  milestoneCount: number;
}

// Read-only functions
export async function getCampaignInfo(
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<CampaignData | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-campaign-info',
      functionArgs: [],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const data = cvToJSON(result).value;
    
    if (!data) return null;

    return {
      isInitialized: true, // If we got data, it's initialized
      isCancelled: data.isCancelled?.value || false,
      isPaused: data.isPaused?.value || false,
      beneficiary: data.beneficiary?.value || CONTRACT_ADDRESS,
      campaignStart: Number(data.start?.value || 0),
      campaignGoal: Number(data.goal?.value || 0),
      campaignDuration: Number(data.end?.value || 0) - Number(data.start?.value || 0),
      totalStx: Number(data.totalStx?.value || 0),
      totalSbtc: Number(data.totalSbtc?.value || 0),
      donationCount: Number(data.donationCount?.value || 0),
      isWithdrawn: data.isWithdrawn?.value || false,
      title: data.title?.value || '',
      description: data.description?.value || '',
      category: data.category?.value || '',
      minDonationStx: 1000000, // Default 1 STX
      maxDonationStx: 100000000000, // Default 100k STX
      beneficiaryCount: Number(data.beneficiaryCount?.value || 0),
      milestoneCount: Number(data.milestoneCount?.value || 0),
    };
  } catch (err) {
    console.error('Error fetching campaign info:', err);
    return null;
  }
}

export async function getDonorContribution(
  donor: string,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<{ stx: number; sbtc: number } | null> {
  try {
    const [stxDonation, sbtcDonation] = await Promise.all([
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-stx-donation',
        functionArgs: [standardPrincipalCV(donor)],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-sbtc-donation',
        functionArgs: [standardPrincipalCV(donor)],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
    ]);

    return {
      stx: Number(cvToJSON(stxDonation).value),
      sbtc: Number(cvToJSON(sbtcDonation).value),
    };
  } catch (error) {
    console.error('Error fetching donor contribution:', error);
    return null;
  }
}

export async function getMilestone(
  milestoneId: number,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<{
  amount: number;
  description: string;
  withdrawn: boolean;
} | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone',
      functionArgs: [uintCV(milestoneId)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    if (jsonResult.value) {
      const milestone = jsonResult.value as any;
      return {
        amount: Number(milestone.amount.value),
        description: milestone.description.value as string,
        withdrawn: milestone.withdrawn.value as boolean,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    return null;
  }
}

// Write functions (requires wallet signature)
export async function initializeCampaign(
  goal: number,
  duration: number,
  title: string,
  description: string,
  category: string,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'initialize-campaign',
    functionArgs: [
      uintCV(goal),
      uintCV(duration),
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(category),
    ],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function donateStx(
  amount: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'donate-stx',
    functionArgs: [uintCV(amount)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function cancelCampaign(
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'cancel-campaign',
    functionArgs: [],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function withdrawFunds(
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw',
    functionArgs: [],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function refundDonation(
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'refund',
    functionArgs: [],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function addMilestone(
  amount: number,
  description: string,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-milestone',
    functionArgs: [uintCV(amount), stringUtf8CV(description)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

export async function withdrawMilestone(
  milestoneId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw-milestone',
    functionArgs: [uintCV(milestoneId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

// Utility functions
export function calculateDaysLeft(startBlock: number, duration: number): number {
  const currentBlock = 0; // You'll need to get this from a Stacks API
  const blocksLeft = startBlock + duration - currentBlock;
  // Assuming ~10 minute block times
  const minutesLeft = blocksLeft * 10;
  const daysLeft = Math.floor(minutesLeft / (60 * 24));
  return Math.max(0, daysLeft);
}

export function calculateProgress(raised: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(100, (raised / goal) * 100);
}

export function formatStx(microStx: number): string {
  return (microStx / 1_000_000).toFixed(2);
}

export function formatSbtc(satoshis: number): string {
  return (satoshis / 100_000_000).toFixed(8);
}
