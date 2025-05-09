import jwt from "jsonwebtoken";
import User from "../models/usersModel";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user: User,expire: any) => {
    const token = jwt.sign({id: user.id, email: user.email, name:`${user.firstName} ${user.lastName}`, role:user.role, location:user.location, verify:user.verify}, process.env.JWT_SECRET as string, {expiresIn: expire});
    return token;
};