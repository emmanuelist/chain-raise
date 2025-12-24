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