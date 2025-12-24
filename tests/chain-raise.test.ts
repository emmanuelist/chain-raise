
import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Chain Raise Smart Contract Tests", () => {
  
  beforeEach(() => {
    simnet.setEpoch("3.0");
  });

  describe("Campaign Initialization", () => {
    it("allows owner to initialize campaign with metadata", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(1000000), // goal
          Cl.uint(4320),    // duration
          Cl.stringAscii("Save the Whales"), // title
          Cl.stringUtf8("Help us protect endangered whales"), // description
          Cl.stringAscii("Environment") // category
        ],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify campaign info is readable
      const info = simnet.callReadOnlyFn(
        "chain-raise",
        "get-campaign-info",
        [],
        deployer
      );
      expect(info.result).toBeDefined();
    });

    it("prevents non-owner from initializing campaign", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(1000000),
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(100)); // err-not-authorized
    });

    it("prevents double initialization", () => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(1000000),
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(2000000),
          Cl.uint(4320),
          Cl.stringAscii("Test2"),
          Cl.stringUtf8("Test2"),
          Cl.stringAscii("Test2")
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(106)); // err-already-initialized
    });

    it("rejects zero goal", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(0), // zero goal
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(100)); // err-not-authorized
    });
  });

  describe("Emergency Pause Mechanism", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(1000000),
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("allows owner to pause campaign", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "pause-campaign",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents donations when paused", () => {
      simnet.callPublicFn("chain-raise", "pause-campaign", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(108)); // err-paused
    });

    it("allows donations after unpause", () => {
      simnet.callPublicFn("chain-raise", "pause-campaign", [], deployer);
      simnet.callPublicFn("chain-raise", "unpause-campaign", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents non-owner from pausing", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "pause-campaign",
        [],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(100)); // err-not-authorized
    });
  });

  describe("Donation Limits", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(1000000),
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("enforces minimum donation limit", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(500000)], // Less than 1 STX minimum
        wallet1
      );
      expect(result).toBeErr(Cl.uint(109)); // err-donation-too-small
    });

    it("enforces maximum donation limit", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(200000000000)], // More than 100,000 STX
        wallet1
      );
      expect(result).toBeErr(Cl.uint(110)); // err-donation-too-large
    });

    it("accepts valid donation amount", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)], // 5 STX
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows owner to update donation limits", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "set-donation-limits",
        [
          Cl.uint(2000000), // 2 STX min
          Cl.uint(50000000000), // 50,000 STX max
          Cl.uint(20000), // sBTC min
          Cl.uint(500000000) // sBTC max
        ],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify limits were updated
      const limits = simnet.callReadOnlyFn(
        "chain-raise",
        "get-donation-limits",
        [],
        deployer
      );
      expect(limits.result).toBeOk(
        Cl.tuple({
          "min-stx": Cl.uint(2000000),
          "max-stx": Cl.uint(50000000000),
          "min-sbtc": Cl.uint(20000),
          "max-sbtc": Cl.uint(500000000)
        })
      );
    });

    it("rejects invalid limit ranges", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "set-donation-limits",
        [
          Cl.uint(5000000), // min > max
          Cl.uint(1000000),
          Cl.uint(10000),
          Cl.uint(500000000)
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(113)); // err-invalid-percentage
    });
  });

  describe("Donations", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(50000000), // 50 STX goal
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("accepts STX donations", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(10000000)], // 10 STX
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check donation recorded
      const donation = simnet.callReadOnlyFn(
        "chain-raise",
        "get-stx-donation",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(donation.result).toBeOk(Cl.uint(10000000));
    });

    it("accumulates multiple donations from same donor", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)],
        wallet1
      );
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(3000000)],
        wallet1
      );

      const donation = simnet.callReadOnlyFn(
        "chain-raise",
        "get-stx-donation",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(donation.result).toBeOk(Cl.uint(8000000));
    });

    it("prevents donations after campaign ends", () => {
      simnet.mineEmptyBlocks(4321);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(101)); // err-campaign-ended
    });

    it("prevents donations to cancelled campaign", () => {
      simnet.callPublicFn("chain-raise", "cancel-campaign", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(5000000)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(105)); // err-campaign-cancelled
    });
  });

  describe("Milestones", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(100000000), // 100 STX goal
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("allows owner to add milestones", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "add-milestone",
        [
          Cl.uint(25000000), // 25 STX
          Cl.stringUtf8("First milestone")
        ],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0)); // Returns milestone ID

      // Verify milestone
      const milestone = simnet.callReadOnlyFn(
        "chain-raise",
        "get-milestone",
        [Cl.uint(0)],
        deployer
      );
      expect(milestone.result).toBeOk(
        Cl.some(
          Cl.tuple({
            amount: Cl.uint(25000000),
            description: Cl.stringUtf8("First milestone"),
            withdrawn: Cl.bool(false)
          })
        )
      );
    });

    it("allows withdrawal when milestone reached", () => {
      // Add milestone
      simnet.callPublicFn(
        "chain-raise",
        "add-milestone",
        [Cl.uint(25000000), Cl.stringUtf8("First milestone")],
        deployer
      );

      // Donate to reach milestone
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(30000000)], // 30 STX
        wallet1
      );

      // Withdraw milestone
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw-milestone",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents withdrawal when milestone not reached", () => {
      simnet.callPublicFn(
        "chain-raise",
        "add-milestone",
        [Cl.uint(25000000), Cl.stringUtf8("First milestone")],
        deployer
      );

      // Donate less than milestone
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(10000000)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw-milestone",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(114)); // err-goal-not-met
    });

    it("prevents double withdrawal of same milestone", () => {
      simnet.callPublicFn(
        "chain-raise",
        "add-milestone",
        [Cl.uint(25000000), Cl.stringUtf8("First milestone")],
        deployer
      );
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(30000000)],
        wallet1
      );
      simnet.callPublicFn(
        "chain-raise",
        "withdraw-milestone",
        [Cl.uint(0)],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw-milestone",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(112)); // err-milestone-already-withdrawn
    });
  });

  describe("Beneficiary Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(50000000),
          Cl.uint(4320),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("allows owner to update beneficiary", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "update-beneficiary",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents beneficiary update after withdrawal", () => {
      // Donate and wait for campaign to end
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );
      simnet.mineEmptyBlocks(4321);
      simnet.callPublicFn("chain-raise", "withdraw", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "update-beneficiary",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(107)); // err-already-withdrawn
    });

    it("allows adding multiple beneficiaries", () => {
      const result1 = simnet.callPublicFn(
        "chain-raise",
        "add-beneficiary",
        [Cl.principal(wallet1), Cl.uint(5000)], // 50%
        deployer
      );
      expect(result1.result).toBeOk(Cl.uint(0));

      const result2 = simnet.callPublicFn(
        "chain-raise",
        "add-beneficiary",
        [Cl.principal(wallet2), Cl.uint(5000)], // 50%
        deployer
      );
      expect(result2.result).toBeOk(Cl.uint(1));

      // Verify beneficiaries
      const ben1 = simnet.callReadOnlyFn(
        "chain-raise",
        "get-beneficiary",
        [Cl.uint(0)],
        deployer
      );
      expect(ben1.result).toBeOk(
        Cl.some(
          Cl.tuple({
            address: Cl.principal(wallet1),
            percentage: Cl.uint(5000)
          })
        )
      );
    });

    it("validates percentage range", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "add-beneficiary",
        [Cl.principal(wallet1), Cl.uint(15000)], // > 100%
        deployer
      );
      expect(result).toBeErr(Cl.uint(113)); // err-invalid-percentage
    });
  });

  describe("Time-Based Refunds", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(100000000), // 100 STX goal
          Cl.uint(100), // Short duration for testing
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("allows refund when goal not met and campaign ended", () => {
      // Donate less than goal
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)], // 50 STX (less than 100 STX goal)
        wallet1
      );

      // Wait for campaign to end
      simnet.mineEmptyBlocks(101);

      // Refund should work
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "refund",
        [],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows refund when campaign cancelled", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );

      simnet.callPublicFn("chain-raise", "cancel-campaign", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "refund",
        [],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents refund when campaign active", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "refund",
        [],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(103)); // err-not-cancelled
    });
  });

  describe("Campaign Cancellation and Withdrawal", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "chain-raise",
        "initialize-campaign",
        [
          Cl.uint(50000000),
          Cl.uint(100),
          Cl.stringAscii("Test"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("Test")
        ],
        deployer
      );
    });

    it("allows owner to cancel campaign", () => {
      const { result } = simnet.callPublicFn(
        "chain-raise",
        "cancel-campaign",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows withdrawal when campaign ended", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );
      simnet.mineEmptyBlocks(101);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents withdrawal before campaign ends", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw",
        [],
        deployer
      );
      expect(result).toBeErr(Cl.uint(104)); // err-campaign-not-ended
    });

    it("prevents double withdrawal", () => {
      simnet.callPublicFn(
        "chain-raise",
        "donate-stx",
        [Cl.uint(50000000)],
        wallet1
      );
      simnet.mineEmptyBlocks(101);
      simnet.callPublicFn("chain-raise", "withdraw", [], deployer);

      const { result } = simnet.callPublicFn(
        "chain-raise",
        "withdraw",
        [],
        deployer
      );
      expect(result).toBeErr(Cl.uint(107)); // err-already-withdrawn
    });
  });
});
