import { Request, Response } from "express";
import User from "../models/usersModel";
import bcrypt from "bcryptjs"
import { generateToken } from "../middlewares/generateToken";
import crypto from "crypto"

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
                const token = generateToken(user, "1d")
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
        const {firstName, lastName, email, password, gender, birthday, phone, location} = req.body
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
                location
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

export const loginGoogle = async(req:Request, res:Response) => {
    try {
        const user = (req as any).user
        const oldUser = await User.findOne({where:{email:user.email}})
        if(oldUser){
            const token = generateToken(oldUser, "1d")
            res.redirect(`${process.env.FRONTEND_URL as string}/login?token=${token}`)
        }
        else{
            const password = crypto.randomBytes(10).toString("hex")
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                firstName: user.displayName,
                lastName: user.displayName,
                email: user.email,
                password: hashedPassword,
                gender: "male",
                birthday: new Date("2000-01-01"),
                phone: "",
                location: "",
                photo:user.picture,
                googleId: user.id
            })
            await newUser.save()
            const token = generateToken(newUser, "1d")
            res.redirect(`${process.env.FRONTEND_URL as string}/login?token=${token}`)
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}