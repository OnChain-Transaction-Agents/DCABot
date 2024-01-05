import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "../model/User";


export default class UserServerice {

    private Tablename: string = "UserTable";

    constructor(private docClient: DocumentClient) { }


    async getUser(ID: string): Promise<any> {

        const user = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                ID: ID
            }
        }).promise()
        if (!user.Item) {
            throw new Error("ID does not exit");
        }
        return user.Item as User;

    }

    //optimize 
    async getLatestUser(): Promise<any> {
        const currentDate = new Date()
        const currentTime = Math.round((currentDate.getTime() / 1000))
        console.log('currentTime', currentTime)
        const params = {
            TableName: this.Tablename,
            FilterExpression:'NEXT_UPDATE < :currentTime',
            ExpressionAttributeValues: {
                ':currentTime': currentTime
            }
          };
        
          try {
            const result = await this.docClient.scan(params).promise();
            console.log('result', result)
            if (result.Items && result.Items.length > 0) {
              const oldestTimestamp = result.Items[0];
              return oldestTimestamp as User; 
            }
        
            return undefined; 
          } catch (error) {
            console.log('Error retrieving oldest timestamp:', error);
            throw error;
          }

    }
    
    //optimize 
    async updateUserQueue(ID: string, user: Partial<User>): Promise<User> {
        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { ID: ID },
                UpdateExpression:
                    "set #nextUpdate = :nextUpdate, #updatedAt = :updatedAt",
                ExpressionAttributeNames: {
                    "#nextUpdate": "NEXT_UPDATE",
                    "#updatedAt": "UPDATED_AT"
                },
                ExpressionAttributeValues: {
                    ":nextUpdate": user.NEXT_UPDATE, 
                    ":updatedAt": user.UPDATED_AT 
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as User;
    }


    async updateUserSettings(ID: string, user: Partial<User>): Promise<User> {
        const freqTimestamp = user.FREQUENCY * 86400
        const currentDate = new Date()
        const nextUpdate = Math.round((currentDate.getTime() / 1000) + freqTimestamp)

        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { ID: ID },
                UpdateExpression:
                    "set #frequency = :frequency, #nextUpdate = :nextUpdate, #updatedAt = :updatedAt, #amount = :amount, #end_date = :end_date",
                ExpressionAttributeNames: {
                    "#frequency": "FREQUENCY",
                    "#nextUpdate": "NEXT_UPDATE",
                    "#updatedAt": "UPDATED_AT",
                    "#amount": "AMOUNT", 
                    "#end_date": "END_DATE"
                },
                ExpressionAttributeValues: {
                    ":frequency": user.FREQUENCY,
                    ":nextUpdate": nextUpdate,
                    ":updatedAt": currentDate.toISOString(),
                    ":amount": user.AMOUNT, 
                    ":end_date": user.END_DATE
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as User;
    }
    
    async updateUserStatus(ID: string, user: Partial<User>): Promise<User> {
        const currentDate = new Date()
        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { ID: ID },
                UpdateExpression:
                    "set #is_active = :is_active and #updatedAt = :updatedAt",
                ExpressionAttributeNames: {
                    "#is_active": "IS_ACTIVE",
                    "#updatedAt": "UPDATED_AT"
                },
                ExpressionAttributeValues: {
                    ":is_active": user.IS_ACTIVE,
                    ":updatedAt": currentDate.toISOString()
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as User;
    }


    async createUser(user: User): Promise<User> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: user
        }).promise()
        return user as User;

    }
}
