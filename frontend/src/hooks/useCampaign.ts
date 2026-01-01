import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import {
  getCampaignInfo,
  getDonorContribution,
  getMilestone,
  CampaignData,
  donateStx,
  refundDonation,
  calculateDaysLeft,
  formatStx,
} from '@/lib/contract';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  donorCount: number;
  daysLeft: number;
  imageUrl?: string;
  creator: string;
  isActive: boolean;
  milestoneCount: number;
  isPaused?: boolean;
  isCancelled?: boolean;
}

export function useCampaign() {
  const { network } = useWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCampaignInfo(network);
      
      if (!data || !data.isInitialized) {
        setCampaign(null);
        return;
      }

      const daysLeft = calculateDaysLeft(data.campaignStart, data.campaignDuration);
      
      setCampaign({
        id: '1', // Single campaign contract
        title: data.title || 'Untitled Campaign',
        description: data.description || 'No description provided',
        category: data.category || 'Other',
        goal: data.campaignGoal,
        raised: data.totalStx,
        donorCount: data.donationCount,
        daysLeft,
        creator: data.beneficiary,
        isActive: !data.isCancelled && !data.isWithdrawn && daysLeft > 0,
        milestoneCount: data.milestoneCount,
        isPaused: data.isPaused,
        isCancelled: data.isCancelled,
      });
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [network]);

  return {
    campaign,
    loading,
    error,
    refetch: fetchCampaign,
  };
}

export function useDonorContribution(address?: string) {
  const { network } = useWallet();
  const [contribution, setContribution] = useState<{ stx: number; sbtc: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchContribution = async () => {
      setLoading(true);
      try {
        const data = await getDonorContribution(address, network);
        setContribution(data);
      } catch (error) {
        console.error('Error fetching donor contribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContribution();
  }, [address, network]);

  return { contribution, loading };
}

export function useMilestones(count: number) {
  const { network } = useWallet();
  const [milestones, setMilestones] = useState<Array<{
    id: number;
    amount: number;
    description: string;
    withdrawn: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (count === 0) return;

    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const promises = Array.from({ length: count }, (_, i) =>
          getMilestone(i + 1, network)
        );
        const results = await Promise.all(promises);
        const validMilestones = results
          .map((m, i) => (m ? { ...m, id: i + 1 } : null))
          .filter((m): m is NonNullable<typeof m> => m !== null);
        setMilestones(validMilestones);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [count, network]);

  return { milestones, loading };
}

export function useDonate() {
  const { network } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const donate = async (amountStx: number) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert STX to microSTX
      const microStx = Math.floor(amountStx * 1_000_000);

      await donateStx(
        microStx,
        network,
        (data) => {
          console.log('Donation successful:', data);
          setIsSubmitting(false);
        },
        () => {
          console.log('Donation cancelled');
          setIsSubmitting(false);
        }
      );
    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation');
      setIsSubmitting(false);
    }
  };

  return {
    donate,
    isSubmitting,
    error,
  };
}

export function useRefund() {
  const { network } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRefund = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await refundDonation(
        network,
        (data) => {
          console.log('Refund successful:', data);
          setIsSubmitting(false);
        },
        () => {
          console.log('Refund cancelled');
          setIsSubmitting(false);
        }
      );
    } catch (err: any) {
      console.error('Refund error:', err);
      setError(err.message || 'Failed to process refund');
      setIsSubmitting(false);
    }
  };

  return {
    requestRefund,
    isSubmitting,
    error,
  };
}
