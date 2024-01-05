import Web3 from 'web3'

import { beepGoerli, beepMainnet } from './constants'
import { ERC20Params, GetAccount, GetBeepInfo } from './types'
import { abi_factoryV2, abi_factoryV030 } from './abi_factory'
import { Network, Alchemy } from 'alchemy-sdk'
import axios from 'axios'

const web3js = new Web3(
  new Web3.providers.HttpProvider(
    'https://mainnet.infura.io/v3/9970c637fb9a4ee996298c5ee06bf38b'
  )
)

export function getAlchemyProvider(_chainId: string) {
  try {
    let settings
    if (_chainId == '1') {
      settings = {
        apiKey: 'mkWadI2ogZ3dw2tsjF3o7hN3h3hlZXaU',
        network: Network.ETH_MAINNET,
      }
      //  } else if(_chainId == '5') { TODO: check for future chains
    } else {
      settings = {
        apiKey: 'mkWadI2ogZ3dw2tsjF3o7hN3h3hlZXaU',
        network: Network.ETH_GOERLI,
      }
    }
    const alchemy = new Alchemy(settings)
    return alchemy
  } catch (error) {
    console.error(error)
    return null
  }
}

export function getRouterAddress(chainId: string) {
  if (chainId == '1') {
    return beepMainnet.UNISWAP_V2_ROUTER
    // } else if (chainId == '5') { TODO: check for future chains
  } else {
    return beepGoerli.UNISWAP_V3_ROUTER
  }
}

export function getDefaultERC20Params() {
  return { address: '', balance: '', symbol: '', decimals: '', logo: '' }
}

export const createERC20Params = (
  token: any,
  metadata: any,
  _balance: any
): ERC20Params => {
  try {
    return {
      address: token.contractAddress,
      balance: _balance,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
      logo: metadata.logo,
    }
  } catch (error) {
    console.error(error)
    return getDefaultERC20Params()
  }
}

export const formatNumberToScientific = (value: unknown): string => {
  const num = Number(value)
  if (!isNaN(num)) {
    return num.toExponential(5)
  } else {
    return value as string
  }
}

export async function getAccount(
  tokenId: number,
  contractAddress: string,
  chainId: number
): Promise<GetAccount> {
  try {
    let smartWalletAddress

    if (chainId == 1) {
      const contractWeb3 = new web3js.eth.Contract(
        abi_factoryV2,
        beepMainnet.factoryAddress
      )

      smartWalletAddress = await contractWeb3.methods
        .account(
          beepMainnet.implementation,
          chainId,
          contractAddress,
          tokenId,
          0
        )
        .call()
    } else if (chainId == 5) {
      const contractWeb3 = new web3js.eth.Contract(
        abi_factoryV030,
        beepGoerli.factoryAddress
      )
      smartWalletAddress = await contractWeb3.methods
        .account(
          beepGoerli.implementation,
          beepGoerli.salt,
          chainId,
          contractAddress,
          tokenId
        )
        .call()
    }

    return { data: smartWalletAddress }
  } catch (err) {
    console.error(err)
    return { error: `failed getting account for token id: ${tokenId}` }
  }
}

export async function getBeepInfo(account: string): Promise<GetBeepInfo> {
  const API_URL = 'https://tbkiosk.xyz/api/beep/profile/'
  try {
    if (!account) {
      return { error: `failed getting status for TBA: ${account}` }
    }

    const response = await axios.get(`${API_URL}${account}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.data
    return data
  } catch (err) {
    console.error(err)
    return { error: `failed getting status for TBA: ${account}` }
  }
}
