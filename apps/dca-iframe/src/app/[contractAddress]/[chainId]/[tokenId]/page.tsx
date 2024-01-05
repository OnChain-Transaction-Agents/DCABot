'use client'

import { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { IoIosArrowUp, IoLogoBitcoin } from 'react-icons/io'

import { beepGoerli, beepMainnet, setUpBeepUrl } from '@/lib/constants'
import { TokenParams, ERC20Params, WalletBalances, BeepInfo } from '@/lib/types'
import {
  getAccount,
  getBeepInfo,
  getAlchemyProvider,
  getRouterAddress,
  getDefaultERC20Params,
  createERC20Params,
} from '@/lib/utils'
import Drawer from '@/components/Drawer'

export default function Token({ params, searchParams }: TokenParams) {
  const [isOpen, setIsOpen] = useState(false)
  const { tokenId, contractAddress, chainId } = params
  // const { disableloading, logo } = searchParams;

  // Fetch nft's TBA
  const { data: account } = useSWR(
    tokenId ? `/account/${tokenId}` : null,
    async () => {
      const result = await getAccount(
        tokenId as unknown as number,
        contractAddress,
        parseInt(chainId)
      )
      return result.data
    },
    {
      refreshInterval: 5000,
    }
  )

  // fetch TBA's beepInfo
  // const { data: beepInfo } = useSWR<BeepInfo>(
  //   async () => {
  //     const result = await getBeepInfo(
  //       account as string
  //     );
  //     console.log("retrieved beepInfo:", beepInfo)
  //     return result.data;
  //   },
  //   { refreshInterval: 5000 }
  // );
  const beepInfo = {}

  // Fetch wallet balances
  const { data: balances } = useSWR<WalletBalances | undefined>(
    account,
    async () => {
      const alchemy = getAlchemyProvider(chainId)
      const routerAddress = getRouterAddress(chainId)

      if (!account || !alchemy) return

      const lastOutgoing = await alchemy.core.getAssetTransfers({
        fromAddress: account,
        toAddress: routerAddress,
        excludeZeroValue: true,
        maxCount: 1,
        category: ['erc20' as any],
      })
      const lastIncoming = await alchemy.core.getAssetTransfers({
        fromAddress: routerAddress,
        toAddress: account,
        excludeZeroValue: true,
        maxCount: 1,
        category: ['erc20' as any],
      })

      let userActiveOut, userActiveIn

      if (
        lastOutgoing.transfers.length > 0 &&
        lastIncoming.transfers.length > 0
      ) {
        // check for interactions with Uniswap Router
        userActiveOut = lastOutgoing.transfers[0].rawContract.address as string
        userActiveIn = lastIncoming.transfers[0].rawContract.address as string
      } else {
        // apply defaults if no swaps made
        userActiveOut = chainId == '1' ? beepMainnet.USDC : beepGoerli.USDC
        userActiveIn = chainId == '1' ? beepMainnet.WETH : beepGoerli.WETH
      }

      // Get all token balances
      const balances = await alchemy.core.getTokenBalances(account)
      const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== '0'
      })

      let activeIn_: ERC20Params = getDefaultERC20Params()
      let activeOut_: ERC20Params = getDefaultERC20Params()
      let allBalances_: ERC20Params[] = []

      for (let token of nonZeroBalances) {
        let balance: any = token.tokenBalance
        const metadata: any = await alchemy.core.getTokenMetadata(
          token.contractAddress
        )
        balance = balance / Math.pow(10, metadata.decimals)
        metadata.decimals < 18
          ? (balance = balance.toFixed(2))
          : (balance = balance.toFixed(10))
        const tokenParams = createERC20Params(token, metadata, balance)

        if (token.contractAddress === userActiveOut) activeOut_ = tokenParams
        if (token.contractAddress === userActiveIn) activeIn_ = tokenParams

        allBalances_.push(tokenParams)
      }

      return {
        activeOut: activeOut_,
        activeIn: activeIn_,
        allBalances: allBalances_,
      }
    },
    { refreshInterval: 5000 }
  )

  return (
    <div className="h-screen w-screen bg-none">
      <div
        className="relative max-w-screen mx-auto aspect-square max-h-screen 
        overflow-hidden rounded-lg"
      >
        <div className="relative h-full w-full text-white">
          <div className="bg-cover h-full w-full relative bg-[#1A1A1A]">
            <div
              className="h-full w-full flex flex-col justify-between items-center 
              p-2 xs:p-4 sm:p-8 lg:p-16 text-center"
            >
              <div
                className="text-3xl pt-4 font-[pixel] leading-[1]
              sm:text-5xl lg:text-7xl"
              >
                <p>BEEP DCA</p>
                <p>#{tokenId}</p>
              </div>

              <div className="w-36 xs:w-[13rem] sm:w-[15rem] md:w-[20rem] lg:w-[20rem] p-2">
                <Image
                  src="/jiqiren.gif"
                  alt="Beep Boop"
                  width={400}
                  height={400}
                  priority
                />
              </div>

              <div className=" text-[9px] sm:text-sm lg:text-2xl">
                <a
                  href={setUpBeepUrl + '/' + tokenId}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="font-[cera-light]">Set up your Beep</p>
                  <p className="font-[cera] text-sm sm:text-2xl lg:text-4xl">
                    tbkiosk.xyz
                  </p>
                </a>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="mt-6 lg:mt-10 text-xl sm:text-3xl lg:text-4xl hover:-translate-y-2 transition-transform"
                >
                  <IoIosArrowUp />
                </button>
              </div>
            </div>

            <Drawer
              isOpen={isOpen}
              balances={balances}
              // beepInfo={beepInfo} // todo: add to props after testing
              tokenId={tokenId}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
