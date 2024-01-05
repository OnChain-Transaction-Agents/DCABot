import { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { userService } from '../../services';

const ethers = require('ethers');
const { Alchemy, Network } = require('alchemy-sdk');
import axios from "axios";
import { TOKEN_OUT, MAINNET_USDC } from '../../consts/constants';
const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gasFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "beepFee",
                "type": "uint256"
            }
        ],
        "name": "swapExactInputSingle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


export const processTransactionNode = middyfy(async (): Promise<APIGatewayProxyResult>=> {

    const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.ALCH_URL);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, alchemyProvider);
    
    const user = await userService.getLatestUser()

    if (!user) {
        return formatJSONResponse({
            status: 400,
            message: "USER_NOT_FOUND"
        });
    }
    const currentDate = new Date()

    if (user.IS_ACTIVE != true) {
        const freq = (parseInt(user.FREQUENCY) != 0) ? parseInt(user.FREQUENCY) : 1
        const freqTimestamp = freq * 86400
        const currentDate = new Date()
        const nextUpdate = Math.round((currentDate.getTime() / 1000) + freqTimestamp)
        await userService.updateUserQueue(user.ID, { NEXT_UPDATE: nextUpdate, UPDATED_AT: currentDate.toISOString() })
        return formatJSONResponse({
            status: 400,
            message: "IS NOT ACTIVE"
        });
    }

    console.log(currentDate.getTime() / 1000 > parseInt(user.END_DATE))
    if (currentDate.getTime() / 1000 > parseInt(user.END_DATE)) {
        await userService.updateUserStatus(user.ID, { IS_ACTIVE: false })
        return formatJSONResponse({
            status: 400,
            message: "END DATE PASSED"
        });
    }
    const usdcBalance = await alchemyProvider.getTokenBalances(user.ID,[MAINNET_USDC])
    if (usdcBalance < user.AMOUNT) {
        await userService.updateUserStatus(user.ID, { IS_ACTIVE: false })
        return formatJSONResponse({
            status: 400,
            message: "INSUFFICIENT_FUNDS"
        });
    }

    if (currentDate.getTime() / 1000 > parseInt(user.NEXT_UPDATE)) {
        try {
            console.log('user.ID', user.ID)
            const beepContract = new ethers.Contract(user.ID, abi, signer);
            console.log('beepContract', beepContract)
            //const gasPrice = await alchemyProvider.getGasPrice()
            const gasPrice = await alchemyProvider.getGasPrice()
            console.log('gasPrice', gasPrice)
            const tx = await beepContract.swapExactInputSingle(
                TOKEN_OUT, //tokenOut
                user.AMOUNT,
                4000000, //gasFee
                1000000, //beepFee
                {
                gasPrice: gasPrice, 
                gasLimit: 500000      
                }
            )
            console.log('Payment successful:', tx, user.ID);
            const freq = (parseInt(user.FREQUENCY) == 0) ? parseInt(user.FREQUENCY) : 1
            console.log('freq', freq)
            const freqTimestamp = freq * 86400
            const currentDate = new Date()
            const nextUpdate = Math.round((currentDate.getTime() / 1000) + freqTimestamp)
            await userService.updateUserQueue(user.ID, { NEXT_UPDATE: nextUpdate, UPDATED_AT: currentDate.toISOString() })
          } catch (error) {
            console.error('Error making payment:', error);
            throw error;
          }
          return formatJSONResponse({
            status: 200,
        });
    } 
    

    return formatJSONResponse({
        status: 500,
        message: "failure"
    });


})

//retired
export const processTransaction = middyfy(async (): Promise<APIGatewayProxyResult>=> {
        console.log('retired')
        

        return formatJSONResponse({
            status: 500,
            message: "failure"
        });
   

})

