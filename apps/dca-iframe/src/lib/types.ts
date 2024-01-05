interface TokenParams {
  params: {
    tokenId: string;
    contractAddress: string;
    chainId: string;
  };
  searchParams: {
    disableloading: string;
    logo: string;
  };
}

interface ERC20Params {
  address: string;
  balance: any;
  symbol: string;
  decimals: string;
  logo: string;
}

interface WalletBalances {
  activeOut: ERC20Params;
  activeIn: ERC20Params;
  allBalances: ERC20Params[];
}

interface BeepInfo {
  NEXT_UPDATE: number;
  CREATED_AT: string;
  AMOUNT: number;
  UPDATED_AT: string;
  IS_ACTIVE: boolean;
  END_DATE: number;
  ID: string;
  FREQUENCY: number;
  SETTINGS_COMPLETE: boolean;
}

interface DrawerProps {
  isOpen: boolean;
  balances: WalletBalances | undefined;
  // beepInfo: BeepInfo | undefined; // todo: add back after testing
  tokenId: string;
  onClose: () => void;
}

interface GetAccount {
  data?: string;
  error?: string;
}
interface GetBeepInfo {
  data?: string;
  error?: string;
}

export type { TokenParams, ERC20Params, WalletBalances, BeepInfo, DrawerProps, GetAccount, GetBeepInfo };