import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getUserByToken = async(token:string)=>{
    try {
        const user = jwt.verify(token,process.env.JWT_SECRET as string);
        return user as any;
    } catch (error:any) {
        console.log(error.message);
    }
}