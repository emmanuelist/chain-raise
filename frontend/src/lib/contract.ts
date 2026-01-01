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
    const [
      isInitialized,
      isCancelled,
      isPaused,
      beneficiary,
      campaignStart,
      campaignGoal,
      campaignDuration,
      totalStx,
      totalSbtc,
      donationCount,
      isWithdrawn,
      title,
      description,
      category,
      minDonationStx,
      maxDonationStx,
      beneficiaryCount,
      milestoneCount,
    ] = await Promise.all([
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'is-campaign-initialized',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'is-campaign-cancelled',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'is-paused',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-beneficiary',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-start',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-goal',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-duration',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-stx',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-sbtc',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-donation-count',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'is-campaign-withdrawn',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-title',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-description',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-campaign-category',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-min-donation-stx',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-max-donation-stx',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-beneficiary-count',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
      fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-milestone-count',
        functionArgs: [],
        network: getNetwork(network),
        senderAddress: CONTRACT_ADDRESS,
      }),
    ]);

    return {
      isInitialized: cvToJSON(isInitialized).value as boolean,
      isCancelled: cvToJSON(isCancelled).value as boolean,
      isPaused: cvToJSON(isPaused).value as boolean,
      beneficiary: cvToJSON(beneficiary).value as string,
      campaignStart: Number(cvToJSON(campaignStart).value),
      campaignGoal: Number(cvToJSON(campaignGoal).value),
      campaignDuration: Number(cvToJSON(campaignDuration).value),
      totalStx: Number(cvToJSON(totalStx).value),
      totalSbtc: Number(cvToJSON(totalSbtc).value),
      donationCount: Number(cvToJSON(donationCount).value),
      isWithdrawn: cvToJSON(isWithdrawn).value as boolean,
      title: cvToJSON(title).value as string,
      description: cvToJSON(description).value as string,
      category: cvToJSON(category).value as string,
      minDonationStx: Number(cvToJSON(minDonationStx).value),
      maxDonationStx: Number(cvToJSON(maxDonationStx).value),
      beneficiaryCount: Number(cvToJSON(beneficiaryCount).value),
      milestoneCount: Number(cvToJSON(milestoneCount).value),
    };
  } catch (error) {
    console.error('Error fetching campaign info:', error);
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
