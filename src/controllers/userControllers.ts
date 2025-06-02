import { Request, Response } from "express";
import User from "../models/usersModel";
import Post from "../models/postsModel";
import { Op } from "sequelize";
import { redisClient } from "../config/redisClient";
import { pagination } from "../middlewares/pagination";

export const getAllUsers = async(req: Request, res: Response)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (+page - 1) * +limit;
        const q = (req.query.q)?.toString() || "";
        const key = `${page}:${limit}:${q}`;
        const cache = await redisClient.get(key);
        if (cache) {
            res.status(200).json({
                status: "success",
                data: JSON.parse(cache),
            });
        }
        else{
            const users = await User.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            username: {
                                [Op.like]: `%${q}%`
                            }
                        },
                        {
                            firstName: {
                                [Op.like]: `%${q}%`
                            }
                        },
                        {
                            lastName: {
                                [Op.like]: `%${q}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${q}%`
                            }
                        }
                    ]
                },
                attributes: {exclude: ['password']},
                limit: +limit,
                offset: offset,
            });
            const pagin = pagination(+limit, +page, users.count);
            await redisClient.set(key, JSON.stringify({posts: users.rows, pagination: pagin}), {
                EX: 180,
            });
            res.status(200).json({
                status: "success",
                data: {
                    users: users.rows,
                    pagination: pagin
                }
            })
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

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
        const user = await User.findByPk(req.params.id,{
            attributes: {exclude: ['password']},
            include:{
                model:Post,
                as:'posts',
            }
        });
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