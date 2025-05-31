import { Request, Response } from "express";
import User from "../models/usersModel";

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user.id;
        const user = await User.findByPk(id,{attributes: {exclude: ['password']}});
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            res.status(200).json({
                status: "success",
                data: user
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id,{attributes: {exclude: ['password']}});
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            res.status(200).json({
                status: "success",
                data: user
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user.id;
        const user = await User.findByPk(id,{attributes: {exclude: ['password']}});
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            await user.update(req.body);
            await user.save();
            res.status(200).json({
                status: "success",
                data: user
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user.id;
        const user = await User.findByPk(id);
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            await user.destroy();
            await user.save();
            res.status(200).json({
                status: "success",
                message: "user deleted successfully"
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const verifyMyUser = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user.id;
        const user = await User.findByPk(id);
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            const {gender,birthday, phone, location} = req.body
            await user.update({gender,birthday, phone, location, verify: true});
            await user.save();
            res.status(200).json({
                status: "success",
                message: "user verified successfully"
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const blockUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { blocked } = req.body
        const user = await User.findByPk(id);
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            await user.update({blocked: blocked});
            await user.save();
            res.status(200).json({
                status: "success",
                message: `user ${blocked ? "blocked" : "unblocked"} successfully`
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if(!user){
            res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        else{
            await user.destroy();
            await user.save();
            res.status(200).json({
                status: "success",
                message: "user deleted successfully"
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}