import { handlerPath } from '@libs/handler-resolver';


export const getProfile = {
    handler: `${handlerPath(__dirname)}/handler.getProfile`,
    events: [
        {
            http: {
                method: 'get',
                path: 'profile/{id}',
            },
        },
    ],
};



export const createUser = {
    handler: `${handlerPath(__dirname)}/handler.createUser`,
    events: [
        {
            http: {
                method: 'post',
                path: 'create-user/',
            },
        },
    ],
};

export const updateSettings = {
    handler: `${handlerPath(__dirname)}/handler.updateSettings`,
    events: [
        {
            http: {
                method: 'post',
                path: 'update-settings/',
            },
        },
    ],
};


export const updateStatus = {
    handler: `${handlerPath(__dirname)}/handler.updateStatus`,
    events: [
        {
            http: {
                method: 'post',
                path: 'update-status/',
            },
        },
    ],
};

