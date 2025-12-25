import { z } from "zod";

// Stacks address validation pattern
const stacksAddressRegex = /^ST[A-Z0-9]{39}$/;

export const campaignDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Please select a category"),
  goal: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
      message: "Goal must be at least 100 STX",
    })
    .refine((val) => Number(val) <= 10000000, {
      message: "Goal cannot exceed 10,000,000 STX",
    }),
  duration: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 7, {
      message: "Duration must be at least 7 days",
    })
    .refine((val) => Number(val) <= 365, {
      message: "Duration cannot exceed 365 days",
    }),
  minDonation: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Minimum donation must be at least 1 STX",
    }),
  maxDonation: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Maximum donation must be at least 1 STX",
    }),
  imageUrl: z.string().optional(),
});

export const milestoneSchema = z.object({
  title: z.string().trim().min(3, "Milestone title is required").max(100, "Title too long"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

export const beneficiarySchema = z.object({
  address: z
    .string()
    .trim()
    .refine((val) => stacksAddressRegex.test(val), {
      message: "Invalid Stacks address format (must start with ST followed by 39 characters)",
    }),
  percentage: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 100, {
      message: "Percentage must be between 1 and 100",
    }),
});

export const donationSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid donation amount",
    }),
});

export type CampaignDetailsFormData = z.infer<typeof campaignDetailsSchema>;
export type MilestoneFormData = z.infer<typeof milestoneSchema>;
export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;
export type DonationFormData = z.infer<typeof donationSchema>;

// Helper function to validate milestones array
export const validateMilestones = (milestones: Array<{ title: string; amount: string; description: string }>) => {
  const errors: Array<{ index: number; field: string; message: string }> = [];
  
  milestones.forEach((milestone, index) => {
    const result = milestoneSchema.safeParse(milestone);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        errors.push({
          index,
          field: err.path[0] as string,
          message: err.message,
        });
      });
    }
  });
  
  return errors;
};

// Helper function to validate beneficiaries array
export const validateBeneficiaries = (beneficiaries: Array<{ address: string; percentage: string }>) => {
  const errors: Array<{ index: number; field: string; message: string }> = [];
  
  beneficiaries.forEach((beneficiary, index) => {
    const result = beneficiarySchema.safeParse(beneficiary);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        errors.push({
          index,
          field: err.path[0] as string,
          message: err.message,
        });
      });
    }
  });
  
  // Check total percentage
  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
  if (totalPercentage > 100) {
    errors.push({
      index: -1,
      field: "total",
      message: "Total beneficiary percentage cannot exceed 100%",
    });
  }
  
  return errors;
};
