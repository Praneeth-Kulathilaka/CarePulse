
import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";


export const createUser = async (user: CreateUserParams) => {
    try {

        console.log("Function Called", user);

        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.name,
            undefined,
            user.phone
        );

        return parseStringify(newuser);
    } catch (error:any) {
        if(error && error?.code == 409){
            const existingUser = await users.list([
                Query.equal("email",[user.email])
            ]);
            return existingUser.users[0];
        }
        console.log("An error occurred while creating a new user:", error);
        
    }
}