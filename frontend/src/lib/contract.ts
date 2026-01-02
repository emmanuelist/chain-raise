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
export const CONTRACT_NAME = 'chain-raise-v2';

// For V2: We'll default to campaign ID 1 (or latest) for compatibility
export const DEFAULT_CAMPAIGN_ID = 1;

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

/**
 * Get campaign count from V2 contract
 */
async function getCampaignCount(network: 'mainnet' | 'testnet' = 'testnet'): Promise<number> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-campaign-count',
      functionArgs: [],
      network: getNetwork(network),
      senderAddress: CONTRACT_ADDRESS,
    });
    return Number(cvToJSON(result).value?.value || 0);
  } catch (err) {
    console.error('Error fetching campaign count:', err);
    return 0;
  }
}

/**
 * Get campaign info - V2 bridge (gets latest campaign or campaign #1)
 */
export async function getCampaignInfo(
  network: 'mainnet' | 'testnet' = 'testnet'
): Promise<CampaignData | null> {
  try {
    // Get campaign count to find latest, or default to campaign #1
    const count = await getCampaignCount(network);
    const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

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

    // Transform V2 response to match V1 CampaignData interface
    return {
    // Get campaign count to find latest campaign
    const count = await getCampaignCount(network);
    const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

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
    return { stx: 0, sbtc: 0
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
    // Get latest campaign
    const count = await getCampaignCount(network);
    const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone',
      functionArgs: [uintCV(campaignId), work(network),
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

/**
 * V2 Note: initializeCampaign is now createCampaign in V2
 * This function is for backward compatibility
 */
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
  // V2 uses create-campaign function
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-campaign',
    functionArgs: [
      stringAsciiCV(title.substring(0, 100)),
      stringUtf8CV(description.substring(0, 500)),
      stringAsciiCV(category.substring(0, 50)),
      stringAsciiCV('https://images.unsplash.com/photo-1639762681485-074b7f938ba0'), // Default image
      uintCV(goal),
      uintCV(duration),
      uintCV(1000000), // 1 STX min
      uintCV(100000000000), // 100k STX max
      uintCV(duration),
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(category),
  // V2 requires campaign ID - use latest campaign
  const count = await getCampaignCount(network);
  const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'donate-stx',
    functionArgs: [uintCV(campaignId), 
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
  // V2 requires campaign ID
  const count = await getCampaignCount(network);
  const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'cancel-campaign',
    functionArgs: [uintCV(campaignId)
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
  // V2 requires campaign ID and uses 'withdraw-funds' function
  const count = await getCampaignCount(network);
  const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw-funds',
    functionArgs: [uintCV(campaignId)' | 'testnet' = 'testnet',
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'withdraw',
  // V2 requires campaign ID and uses 'request-refund' function
  const count = await getCampaignCount(network);
  const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'request-refund',
    functionArgs: [uintCV(campaignId)
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
  // V2 requires campaign ID
  const count = await getCampaignCount(network);
  const campaignId = count > 0 ? count : DEFAULT_CAMPAIGN_ID;

  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-milestone',
    functionArgs: [uintCV(campaignId), 
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
