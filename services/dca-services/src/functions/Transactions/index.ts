import { handlerPath } from '@libs/handler-resolver';


export const processTransaction = {
    handler: `${handlerPath(__dirname)}/handler.processTransaction`,
    events: [
        {
            http: {
                method: 'post',
                path: 'process-transaction/',
            },
        },
    ],
};


export const processTransactionNode = {
    handler: `${handlerPath(__dirname)}/handler.processTransactionNode`,
    events: [
        {
            http: {
                method: 'post',
                path: 'process-transaction-node/',
            },
        },
    ],
};