import { InstrumentalContractAddressesPerChains } from "@/submodules/contracts-operations/src/instrumental";

export const tokenContractAddressLength = 42;

export const contractAddresses: InstrumentalContractAddressesPerChains = {
  [1]: {
    curve: "",
    sushiERC20: "",
    sushisLP: "",
    holding: "0xD45bEc79eD08269a6494Df164BDa852A08588Fed",
    config: "0x90868eE1a433C3C24979b19B5Cf2e12787A49b18",
    vault: "0x8B36ed5Dc783E6324aDa2D9BE5FeEE32d356D912",
  },
  [4]: {
    curve: "0xc9003F00877868c88c6f1326C9fCC6d8c270c4FA",
    sushiERC20: "0xbb834f648916635ef43e668de4b72288fd1ec408",
    sushisLP: "0x6F166487A247d66EC4d8ADfCD4C89512B5AA9d6E",
    holding: "0xE6db051d91AD4309AFC1be994972eC57f0e501F8",
    config: "0xF81af9D19A74Fb085efeD7a2070e10A81dEBAd54",
    vault: "0x279A106FB714ad77188465049bE39827fAee9a5E",
  },
  [42]: {
    curve: "",
    sushiERC20: "",
    sushisLP: "",
    holding: "0x7B5231066c459F4eec4884e8B07d2E9c44dfCF19",
    config: "0xD4b72c909f30fCA9C51a441eF9B6ecd8d2002959",
    vault: "0xf8DFfc10Da023c5e65Ca7B59133A7F984eBAb531",
  },
};
