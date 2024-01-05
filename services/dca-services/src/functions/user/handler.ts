import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { userService } from '../../services'
import { TOKEN_OUT, MAINNET_USDC } from '../../consts/constants';
const ethers = require('ethers');


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


export const getProfile = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event)
    const id = event.pathParameters.id;
    if (!id) {
        return formatJSONResponse({
            status: 400,
            message: "USER_ID_REQUIRED"
        });
    }

    try {
        const user = await userService.getUser(id)
        try {
            if (user.FREQUENCY == 0 && user.AMOUNT == 0) {
                user.SETTINGS_COMPLETE = false
            }
            else {
                user.SETTINGS_COMPLETE = true
            }
        } catch {
            console.log('error')
        }
            
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({'user': user}),
        };
        return response;
    }
    catch (e) {
        return formatJSONResponse({
            status: 400,
            message: "USER_NOT_FOUND"
        });
    }
})

export const updateSettings = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event)
    const userBody = JSON.parse(event.body);
    console.log(userBody.SIGNATURE, userBody.OWNER_ADDRESS)
    try {
        const user = await userService.updateUserSettings(userBody.ID, { FREQUENCY: userBody.FREQUENCY, AMOUNT: userBody.AMOUNT, END_DATE: userBody.END_DATE })
        return formatJSONResponse({
            user
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const updateStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userBody = JSON.parse(event.body);
    console.log(userBody)
    console.log(userBody.SIGNATURE, userBody.OWNER_ADDRESS)
    try {
        const user = await userService.updateUserStatus(userBody.ID, { IS_ACTIVE: userBody.IS_ACTIVE })
        if (userBody.IS_ACTIVE == true) {
            try {
                const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.ALCH_URL);

                const signer = new ethers.Wallet(process.env.PRIVATE_KEY, alchemyProvider);
                const beepContract = new ethers.Contract(user.ID, abi, signer);
                //
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
            } catch (error) {
                console.error('Error making payment:', error);
            }
        }
        return formatJSONResponse({
            user
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const createUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userBody = JSON.parse(event.body);
    const currentDate = new Date()
    try {

        const data = {
            ID: userBody.ID,
            AMOUNT: 0,
            NEXT_UPDATE: 0,
            CREATED_AT: currentDate.toISOString(),
            FREQUENCY: 0,
            UPDATED_AT: currentDate.toISOString(),
            IS_ACTIVE: false,
            END_DATE: null
        }

        const user = await userService.createUser(data)
        return formatJSONResponse({
            user
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})




