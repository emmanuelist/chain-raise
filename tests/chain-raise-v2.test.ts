import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

describe("ChainRaise V2 - Multi-Campaign Tests", () => {
  
  describe("Campaign Creation", () => {
    it("allows any user to create a campaign", () => {
      const result = simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Save the Rainforest"),
          Cl.stringUtf8("Help us preserve the Amazon rainforest"),
          Cl.stringAscii("Environment"),
          Cl.stringAscii("https://example.com/image.jpg"),
          Cl.uint(10000000000), // 10,000 STX goal
          Cl.uint(4320), // 30 days
          Cl.uint(1000000), // 1 STX min
          Cl.uint(100000000000), // 100,000 STX max
        ],
        alice
      );
      
      expect(result.result).toBeOk(Cl.uint(1));
    });

    it("allows multiple users to create campaigns", () => {
      // Alice creates campaign
      const aliceResult = simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Tech Startup"),
          Cl.stringUtf8("Revolutionary blockchain product"),
          Cl.stringAscii("Technology"),
          Cl.stringAscii("https://example.com/tech.jpg"),
          Cl.uint(50000000000), // 50,000 STX
          Cl.uint(8640), // 60 days
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      // Bob creates campaign
      const bobResult = simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Community Garden"),
          Cl.stringUtf8("Build a community garden"),
          Cl.stringAscii("Community"),
          Cl.stringAscii("https://example.com/garden.jpg"),
          Cl.uint(5000000000), // 5,000 STX
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        bob
      );
      
      expect(aliceResult.result).toBeOk(Cl.uint(1));
      expect(bobResult.result).toBeOk(Cl.uint(2));
    });

    it("validates campaign parameters", () => {
      // Invalid goal (0)
      const invalidGoal = simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test"),
          Cl.stringAscii("https://test.com"),
          Cl.uint(0), // Invalid goal
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      expect(invalidGoal.result).toBeErr(Cl.uint(115)); // err-invalid-goal
    });
  });

  describe("Donations", () => {
    it("allows users to donate to any campaign", () => {
      // Alice creates campaign
      simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Health Initiative"),
          Cl.stringUtf8("Medical equipment for hospitals"),
          Cl.stringAscii("Health"),
          Cl.stringAscii("https://example.com/health.jpg"),
          Cl.uint(20000000000), // 20,000 STX
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      // Bob donates to Alice's campaign
      const donationResult = simnet.callPublicFn(
        "chain-raise-v2",
        "donate-stx",
        [
          Cl.uint(1), // campaign-id
          Cl.uint(5000000000), // 5,000 STX
        ],
        bob
      );
      
      expect(donationResult.result).toBeOk(Cl.bool(true));
      
      // Verify campaign totals updated
      const campaign = simnet.callReadOnlyFn(
        "chain-raise-v2",
        "get-campaign",
        [Cl.uint(1)],
        alice
      );
      
      expect(campaign.result).toBeSome();
    });

    it("tracks multiple donors per campaign", () => {
      // Create campaign
      simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Education Project"),
          Cl.stringUtf8("Build schools"),
          Cl.stringAscii("Education"),
          Cl.stringAscii("https://example.com/edu.jpg"),
          Cl.uint(30000000000),
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      // Multiple donors
      simnet.callPublicFn("chain-raise-v2", "donate-stx", [Cl.uint(1), Cl.uint(2000000000)], bob);
      simnet.callPublicFn("chain-raise-v2", "donate-stx", [Cl.uint(1), Cl.uint(3000000000)], deployer);
      
      // Check bob's contribution
      const bobContribution = simnet.callReadOnlyFn(
        "chain-raise-v2",
        "get-donor-contribution",
        [Cl.uint(1), Cl.standardPrincipal(bob)],
        alice
      );
      
      expect(bobContribution.result).toBeOk(
        Cl.tuple({
          stx: Cl.uint(2000000000),
          sbtc: Cl.uint(0)
        })
      );
    });
  });

  describe("Campaign Management", () => {
    it("allows creator to pause their campaign", () => {
      // Alice creates campaign
      simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Art Project"),
          Cl.stringUtf8("Public art installation"),
          Cl.stringAscii("Art"),
          Cl.stringAscii("https://example.com/art.jpg"),
          Cl.uint(15000000000),
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      // Alice pauses her campaign
      const pauseResult = simnet.callPublicFn(
        "chain-raise-v2",
        "pause-campaign",
        [Cl.uint(1)],
        alice
      );
      
      expect(pauseResult.result).toBeOk(Cl.bool(true));
      
      // Bob tries to donate - should fail
      const donationResult = simnet.callPublicFn(
        "chain-raise-v2",
        "donate-stx",
        [Cl.uint(1), Cl.uint(1000000000)],
        bob
      );
      
      expect(donationResult.result).toBeErr(Cl.uint(101)); // err-campaign-ended (paused)
    });

    it("prevents non-creator from pausing campaign", () => {
      // Alice creates campaign
      simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Test Campaign"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test"),
          Cl.stringAscii("https://test.com"),
          Cl.uint(10000000000),
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      // Bob tries to pause Alice's campaign
      const pauseResult = simnet.callPublicFn(
        "chain-raise-v2",
        "pause-campaign",
        [Cl.uint(1)],
        bob
      );
      
      expect(pauseResult.result).toBeErr(Cl.uint(100)); // err-not-authorized
    });
  });

  describe("Refunds", () => {
    it("allows refunds when campaign is cancelled", () => {
      // Alice creates and Bob donates
      simnet.callPublicFn(
        "chain-raise-v2",
        "create-campaign",
        [
          Cl.stringAscii("Failed Project"),
          Cl.stringUtf8("This will be cancelled"),
          Cl.stringAscii("Other"),
          Cl.stringAscii("https://example.com/fail.jpg"),
          Cl.uint(10000000000),
          Cl.uint(4320),
          Cl.uint(1000000),
          Cl.uint(100000000000),
        ],
        alice
      );
      
      simnet.callPublicFn("chain-raise-v2", "donate-stx", [Cl.uint(1), Cl.uint(2000000000)], bob);
      
      // Alice cancels campaign
      simnet.callPublicFn("chain-raise-v2", "cancel-campaign", [Cl.uint(1)], alice);
      
      // Bob requests refund
      const refundResult = simnet.callPublicFn(
        "chain-raise-v2",
        "request-refund",
        [Cl.uint(1)],
        bob
      );
      
      expect(refundResult.result).toBeOk(Cl.uint(2000000000));
    });
  });

  describe("Read Functions", () => {
    it("returns campaign count", () => {
      // Create a few campaigns
      simnet.callPublicFn("chain-raise-v2", "create-campaign",
        [Cl.stringAscii("1"), Cl.stringUtf8("1"), Cl.stringAscii("Tech"), 
         Cl.stringAscii("url"), Cl.uint(10000000000), Cl.uint(4320), 
         Cl.uint(1000000), Cl.uint(100000000000)], alice);
      
      simnet.callPublicFn("chain-raise-v2", "create-campaign",
        [Cl.stringAscii("2"), Cl.stringUtf8("2"), Cl.stringAscii("Tech"), 
         Cl.stringAscii("url"), Cl.uint(10000000000), Cl.uint(4320), 
         Cl.uint(1000000), Cl.uint(100000000000)], bob);
      
      const count = simnet.callReadOnlyFn("chain-raise-v2", "get-campaign-count", [], alice);
      
      expect(count.result).toBeOk(Cl.uint(2));
    });
  });
});
