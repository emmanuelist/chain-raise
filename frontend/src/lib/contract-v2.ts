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

// Contract deployment details - V2 Multi-Campaign
export const CONTRACT_ADDRESS = 'STHB047A30W99178TR7KE0784C2GV2206H98PPY';
export const CONTRACT_NAME = 'chain-raise-v2';

// Network configuration
export const getNetwork = (network: 'mainnet' | 'testnet' = 'testnet') => {
  return network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
};

// Campaign data interface matching V2 contract structure
export interface CampaignDataV2 {
  creator: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  goal: number;
  startBlock: number;
  duration: number;
  totalStx: number;
  totalSbtc: number;
  donorCount: number;
  isCancelled: boolean;
  isPaused: boolean;
  isWithdrawn: boolean;
  minDonationStx: number;
  maxDonationStx: number;
  minDonationSbtc: number;
  maxDonationSbtc: number;
}

// Read-only functions

/**
 * Get total number of campaigns created
 */
export async function getCampaignCount(
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<number> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-campaign-count',
      functionArgs: [],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    return Number(jsonResult.value?.value || 0);
  } catch (err) {
    console.error('Error fetching campaign count:', err);
    return 0;
  }
}

/**
 * Get campaign details by ID
 */
export async function getCampaign(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<CampaignDataV2 | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-campaign',
      functionArgs: [uintCV(campaignId)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    const data = jsonResult.value;
    
    if (!data) return null;

    return {
      creator: data.creator?.value || '',
      title: data.title?.value || '',
      description: data.description?.value || '',
      category: data.category?.value || '',
      imageUrl: data['image-url']?.value || '',
      goal: Number(data.goal?.value || 0),
      startBlock: Number(data['start-block']?.value || 0),
      duration: Number(data.duration?.value || 0),
      totalStx: Number(data['total-stx']?.value || 0),
      totalSbtc: Number(data['total-sbtc']?.value || 0),
      donorCount: Number(data['donor-count']?.value || 0),
      isCancelled: data['is-cancelled']?.value || false,
      isPaused: data['is-paused']?.value || false,
      isWithdrawn: data['is-withdrawn']?.value || false,
      minDonationStx: Number(data['min-donation-stx']?.value || 1000000),
      maxDonationStx: Number(data['max-donation-stx']?.value || 100000000000),
      minDonationSbtc: Number(data['min-donation-sbtc']?.value || 10000),
      maxDonationSbtc: Number(data['max-donation-sbtc']?.value || 1000000000),
    };
  } catch (err) {
    console.error(`Error fetching campaign ${campaignId}:`, err);
    return null;
  }
}

/**
 * Get all campaigns (paginated)
 */
export async function getAllCampaigns(
  network: 'mainnet' | 'testnet' = 'testnet',
  startId: number = 1,
  limit: number = 10
): Promise<Array<CampaignDataV2 & { id: number }>> {
  try {
    const totalCount = await getCampaignCount(network);
    const endId = Math.min(startId + limit - 1, totalCount);
    
    if (startId > totalCount) return [];

    const campaignPromises = [];
    for (let id = startId; id <= endId; id++) {
      campaignPromises.push(
        getCampaign(id, network).then(campaign => 
          campaign ? { ...campaign, id } : null
        )
      );
    }

    const campaigns = await Promise.all(campaignPromises);
    return campaigns.filter((c): c is CampaignDataV2 & { id: number } => c !== null);
  } catch (err) {
    console.error('Error fetching all campaigns:', err);
    return [];
  }
}

/**
 * Get donor's contribution to a specific campaign
 */
export async function getDonorContribution(
  campaignId: number,
  donor: string,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<{ stx: number; sbtc: number } | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-donor-contribution',
      functionArgs: [uintCV(campaignId), standardPrincipalCV(donor)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    if (jsonResult.value?.value) {
      const data = jsonResult.value.value;
      return {
        stx: Number(data.stx?.value || 0),
        sbtc: Number(data.sbtc?.value || 0),
      };
    }
    return { stx: 0, sbtc: 0 };
  } catch (error) {
    console.error('Error fetching donor contribution:', error);
    return null;
  }
}

/**
 * Get milestone details
 */
export async function getMilestone(
  campaignId: number,
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
      functionArgs: [uintCV(campaignId), uintCV(milestoneId)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    if (jsonResult.value) {
      const milestone = jsonResult.value as any;
      return {
        amount: Number(milestone.amount?.value || 0),
        description: milestone.description?.value as string,
        withdrawn: milestone.withdrawn?.value as boolean,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    return null;
  }
}

/**
 * Get campaign counts (milestones and beneficiaries)
 */
export async function getCampaignCounts(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<{ milestones: number; beneficiaries: number } | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-campaign-counts',
      functionArgs: [uintCV(campaignId)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    if (jsonResult.value?.value) {
      const data = jsonResult.value.value;
      return {
        milestones: Number(data.milestones?.value || 0),
        beneficiaries: Number(data.beneficiaries?.value || 0),
      };
    }
    return { milestones: 0, beneficiaries: 0 };
  } catch (error) {
    console.error('Error fetching campaign counts:', error);
    return null;
  }
}

/**
 * Check if campaign is active
 */
export async function isCampaignActive(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<boolean> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'is-campaign-active',
      functionArgs: [uintCV(campaignId)],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToJSON(result).value === true;
  } catch (error) {
    console.error('Error checking campaign active status:', error);
    return false;
  }
}

// Write functions (requires wallet signature)

/**
 * Create a new campaign
 */
export async function createCampaign(
  params: {
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    goal: number;
    duration: number;
    minDonationStx: number;
    maxDonationStx: number;
  },
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-campaign',
    functionArgs: [
      stringAsciiCV(params.title.substring(0, 100)),
      stringUtf8CV(params.description.substring(0, 500)),
      stringAsciiCV(params.category.substring(0, 50)),
      stringAsciiCV(params.imageUrl.substring(0, 200)),
      uintCV(params.goal),
      uintCV(params.duration),
      uintCV(params.minDonationStx),
      uintCV(params.maxDonationStx),
    ],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Donate STX to a campaign
 */
export async function donateStx(
  campaignId: number,
  amount: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'donate-stx',
    functionArgs: [uintCV(campaignId), uintCV(amount)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Pause campaign (creator only)
 */
export async function pauseCampaign(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'pause-campaign',
    functionArgs: [uintCV(campaignId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Unpause campaign (creator only)
 */
export async function unpauseCampaign(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'unpause-campaign',
    functionArgs: [uintCV(campaignId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Cancel campaign (creator only)
 */
export async function cancelCampaign(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'cancel-campaign',
    functionArgs: [uintCV(campaignId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Withdraw funds (creator only, after campaign ends and goal met)
 */
export async function withdrawFunds(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw-funds',
    functionArgs: [uintCV(campaignId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Request refund (donor only, if campaign cancelled)
 */
export async function requestRefund(
  campaignId: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'request-refund',
    functionArgs: [uintCV(campaignId)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Add milestone to campaign (creator only, before donations start)
 */
export async function addMilestone(
  campaignId: number,
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
    functionArgs: [uintCV(campaignId), uintCV(amount), stringUtf8CV(description)],
    network: getNetwork(network),
    onFinish,
    onCancel,
  });
}

/**
 * Add beneficiary to campaign (creator only, before donations start)
 */
export async function addBeneficiary(
  campaignId: number,
  beneficiaryAddress: string,
  percentage: number,
  network: 'mainnet' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-beneficiary',
    functionArgs: [
      uintCV(campaignId),
      standardPrincipalCV(beneficiaryAddress),
      uintCV(percentage),
    ],
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

export function isGoalMet(raised: number, goal: number): boolean {
  return raised >= goal;
}

export function isCampaignEnded(startBlock: number, duration: number, currentBlock: number): boolean {
  return currentBlock >= (startBlock + duration);
}
