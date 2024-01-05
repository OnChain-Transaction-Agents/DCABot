export const abi_factoryV2 = [
  {
    inputs: [
      { internalType: "address", name: "implementation", type: "address" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "tokenContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "salt", type: "uint256" },
    ],
    name: "account",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const abi_factoryV030 = [
  {
    inputs: [
      { internalType: "address", name: "implementation", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "tokenContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "account", 
    outputs: [{ internalType: "address", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  },
] as const

// export const abi_factoryV031 = []