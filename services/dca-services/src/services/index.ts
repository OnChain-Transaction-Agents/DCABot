import dynamoDBClient from "../model";
import UserServerice from "./userService"

export const userService = new UserServerice(dynamoDBClient());

