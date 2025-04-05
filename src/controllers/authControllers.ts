import { Request, Response } from "express";
import User from "../models/usersModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const login = async(req:Request, res:Response) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({where:{email}})
        if(!user){
            res.status(400).json({
                status: "bad request",
                message: "user not found"
            })
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                res.status(400).json({
                    status: "bad request",
                    message: "email or password is not correct"
                })
            }
            else{
                const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET as string, {expiresIn: "1d"})
                res.status(200).json({
                    status: "success",
                    message: "login success",
                    data:{
                        token
                    }
                })
            }
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const register = async(req:Request, res:Response) => {
    try {
        const {firstName, lastName, email, password, gender, birthday, phone} = req.body
        const user = await User.findOne({where:{email}})
        if(user){
            res.status(400).json({
                status: "bad request",
                message: "user already exists"
            })
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                gender,
                birthday,
                phone,
            })
            await newUser.save()
            res.status(201).json({
                status: "success",
                message: "user created successfully",
            })
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}