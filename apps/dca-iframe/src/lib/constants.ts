const beepMainnet = {
  nftDropAddress: '0x9cAc72EFe455ADb4f413A8592eD98f962B7bE293',
  factoryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
  implementation: '0xB9A74fea948e8d5699Df97DC114938Bee97813a8',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  UNISWAP_V2_ROUTER: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'
};

const beepGoerli = {
  nftDropAddress: '0x117E22Df83B49b105F87430601614eB263D688F4',
  implementation: '0x794f050559314Aecf62Cecb2f7ca321F7817a298',
  factoryAddress: '0x284be69BaC8C983a749956D7320729EB24bc75f9',
  salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
  USDC: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  WETH: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
};

// const setUpBeepUrl = "https://tbkiosk.xyz/mint/beep/settings" TODO: update for prod
const setUpBeepUrl = "https://kiosk-git-dev-tbkiosk.vercel.app/mint/beep/settings"

export { beepMainnet, beepGoerli, setUpBeepUrl };