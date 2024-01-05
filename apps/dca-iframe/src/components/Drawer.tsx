import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { DrawerProps } from '../lib/types'
import { IoIosArrowDown } from 'react-icons/io'
import { setUpBeepUrl } from '@/lib/constants'

const slide = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      stiffness: 60,
      restDelta: 2,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  balances,
  tokenId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('PLAN')

  const activeTabStyle =
    'py-2 border-b-[0.2rem] border-white text-white cursor-pointer'
  const inactiveTabStyle = 'py-2 text-white opacity-20 cursor-pointer'

  const formatDate = (dateTimestamp: number) => {
    return new Date(dateTimestamp * 1000).toLocaleDateString('en-UK', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
  }

  const formatNumberToScientific = (value: unknown): string => {
    const num = Number(value)
    if (!isNaN(num)) {
      return num.toExponential(5)
    } else {
      return value as string
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slide}
          className="
          absolute bottom-0 w-full h-full p-6 pb-4 md:p-14
          rounded-lg bg-[#1A1A1A] shadow-md md:text-2xl"
        >
          <main className="flex flex-col h-full">
            {/* 1. HEADER SECTION */}
            <div className="flex justify-between pb-2">
              <div className="text-2xl xs:text-3xl md:text-5xl font-[pixel] leading-[0.8]">
                <p>BEEP DCA</p>
                <p>#{tokenId}</p>
              </div>
              <div className="w-1/6">
                <Image
                  src="/jiqiren.gif"
                  alt="Beep Boop"
                  width={200}
                  height={200}
                  priority
                />
              </div>
            </div>

            {/* 2. INFO SECTION */}
            <div className="flex-grow justify-between">
              {/* ...2.1 TABS */}
              <div
                className="font-[pixel] text-sm xs:text-xl md:text-3xl 
                            border-b border-white border-opacity-20"
              >
                <div className="flex justify-between w-4/5">
                  <button
                    className={
                      activeTab === 'PLAN' ? activeTabStyle : inactiveTabStyle
                    }
                    onClick={() => setActiveTab('PLAN')}
                  >
                    PLAN
                  </button>
                  <button
                    className={
                      activeTab === 'ASSETS' ? activeTabStyle : inactiveTabStyle
                    }
                    onClick={() => setActiveTab('ASSETS')}
                  >
                    ASSETS
                  </button>
                  <button
                    className={
                      activeTab === 'COLLECTIBLES'
                        ? activeTabStyle
                        : inactiveTabStyle
                    }
                    onClick={() => setActiveTab('COLLECTIBLES')}
                  >
                    COLLECTIBLES
                  </button>
                </div>
              </div>

              {/* ...2.2 CONTENT */}
              <div>
                {/* ...2.2.1 PLAN */}
                {activeTab === 'PLAN' && (
                  <div
                    className="bg-[#2B2B2B] rounded-md p-3 xs:p-6 md:p-8 mt-5 xs:mt-5 md:mt-10 
                  text-[8px] xs:text-xs md:text-base font-[cera-light] flex-col justify-between"
                  >
                    {/* row 1 */}
                    <div className="flex justify-between">
                      <div className="pb-1 xs:pb-3 md:pb-4">
                        <p className="font-[cera] text-xs xs:text-lg md:text-3xl">
                          {/* USDC – WETH DCA */}
                          {balances ? balances?.activeOut.symbol : '...'} –{' '}
                          {balances ? balances?.activeIn.symbol : '...'} DCA
                        </p>
                        <p className="text-[#A6A9AE]">
                          {/* Invest 100 USDC every X days */}
                          {/* Invest {beepInfo ? beepInfo?.AMOUNT : "..."} {balances?.activeOut.symbol} every {beepInfo ? beepInfo?.FREQUENCY : "..."} days */}
                        </p>
                      </div>
                      <div className="w-12 xs:w-16 md:w-24 pb-2">
                        <Image
                          // src={beepInfo?.IS_ACTIVE ? '/on.png' : '/off.png'}
                          src={
                            balances?.activeIn.balance > 0
                              ? '/on.png'
                              : '/off.png'
                          }
                          alt="Beep Boop"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>

                    <hr className="border-[1] opacity-10" />

                    {/* row 2 */}
                    <div className="flex justify-between items-center">
                      <div className="py-3 md:py-8">
                        <p className="text-[#A6A9AE]">Balance</p>
                        {/* <p className="text-[#A6A9AE]">Total Invested</p> */}
                        <p className="font-[cera] text-xs xs:text-lg md:text-2xl">
                          {/* 1234{} USDC{}*/}
                          {/* TODO: get total expenditure from all txns with Uniswap */}
                          {balances?.activeOut.balance}{' '}
                          {balances?.activeOut.symbol}
                        </p>
                      </div>
                      <div className="py-2 md:py-6 text-right">
                        <p className="text-[#A6A9AE]">Total Acquired</p>
                        <p className="font-[cera] text-xs xs:text-lg md:text-2xl">
                          {/* 0.01234{} WETH{} */}
                          {formatNumberToScientific(
                            balances?.activeIn.balance
                          )}{' '}
                          {balances?.activeIn.symbol}
                        </p>
                      </div>
                    </div>

                    {/* row 3 */}
                    <div className="flex justify-between">
                      <div>
                        {/* <p className='text-[#A6A9AE]'>Next Auto-Invest Date</p> */}
                        <p className="font-[cera] xs:text-base md:text-xl">
                          {/* 12 Oct 23 */}
                          {/* {beepInfo?.NEXT_UPDATE ? formatDate(beepInfo.NEXT_UPDATE) : "..."} */}
                        </p>
                      </div>
                      {/* <div className='text-right'>
                      <p className='text-[#A6A9AE]'>Unrealised PnL</p>
                      <p className='font-[cera] xs:text-base md:text-xl'>223{} USDC{}</p>
                    </div> */}
                    </div>
                  </div>
                )}
                {/* ...2.2.2 ASSETS */}
                {activeTab === 'ASSETS' && (
                  <div className="overflow-y-auto mt-5 md:mt-10">
                    <ul>
                      {/* VALIDATE BALANCES */}
                      {balances?.allBalances?.map((token, index) => (
                        <li key={index}>
                          <div
                            className="flex justify-between items-center
                        bg-white bg-opacity-10 my-[0.3rem] md:my-2 md:p-1 px-2 md:px-4 rounded-full"
                          >
                            <div className="flex items-center gap-2 md:gap-4 xs:text-xl md:text-3xl">
                              <div className="w-4 md:w-8">
                                <Image
                                  src={
                                    token.logo ? token.logo : '/beepCoin.svg'
                                  }
                                  alt="token icon"
                                  width={32}
                                  height={32}
                                />
                              </div>
                              <div className="font-[pixel]">{token.symbol}</div>
                            </div>

                            <div className="font-[cera] text-sm xs:text-lg md:text-2xl">
                              {balances && token.symbol === 'WETH'
                                ? formatNumberToScientific(
                                    balances.allBalances[index].balance
                                  )
                                : balances
                                ? balances.allBalances[index].balance
                                : '...'}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* ...2.2.3 NFTS */}
                {activeTab === 'COLLECTIBLES' && (
                  <div className="overflow-y-auto mt-5 md:mt-10">
                    <div
                      className="flex justify-between items-center text-sm xs:text-lg md:text-2xl
                    bg-white bg-opacity-10 my-[0.3rem] p-2 px-2 xs:px-4 rounded-full"
                    >
                      <p className="font-[pixel]">
                        Beep Collectibles coming soon...
                      </p>
                    </div>
                    <div
                      className="flex justify-between items-center text-sm xs:text-lg md:text-2xl
                    bg-white bg-opacity-10 my-[0.3rem] p-2 px-2 xs:px-4 rounded-full"
                    >
                      <p className="font-[pixel]">Beep boop...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. BOTTOM BAR */}
            <div className="flex justify-between text-right">
              <div className="w-1/3" />
              <button
                onClick={onClose}
                className="text-xl xs:text-2xl md:text-4xl opacity-20 hover:translate-y-2 transition-transform"
              >
                <IoIosArrowDown />
              </button>
              <div className="text-[8px] xs:text-sm md:text-lg w-1/3">
                <a
                  href={setUpBeepUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="font-[cera-light]">Set up your Beep</p>
                  <p className="font-[cera]">tbkiosk.xyz</p>
                </a>
              </div>
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Drawer
