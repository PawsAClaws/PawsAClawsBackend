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