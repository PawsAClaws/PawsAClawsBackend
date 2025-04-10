import { Request, Response } from "express";
import Post from "../models/postsModel";
import { pagination } from "../middlewares/pagination";
import User from "../models/usersModel";

export const getPosts = async(req:Request, res:Response) => {
    try {
        const { location } = (req as any).user;
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (+page - 1) * +limit;
        const type = (req.query.type)?.toString() || "sale";
        const {count,rows} = await Post.findAndCountAll({
            where: {
                type: type,
                country: location,
            },
            order: [["createdAt", "DESC"]],
            limit: +limit,
            offset: offset,
        });
        const pagin = pagination(+limit, +page, count);
        res.status(200).json({
            status: "success",
            data: {
                posts: rows,
                pagination: pagin,
            },
        });
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const createPost = async(req:Request, res:Response) => {
    try {
        const userId = (req as any).user.id;
        const post = await Post.create({...req.body, userId});
        res.status(201).json({
            status: "success",
            message: "post created successfully",
            data: post
        });
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getPost = async(req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id,{
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {exclude: ["password"]},
                },
            ],
        });
        if (!post) {
            res.status(404).json({
                status: "error",
                message: "post not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: post
            });
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updatePost = async(req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            res.status(404).json({
                status: "error",
                message: "post not found",
            });
        } else {
            await post.update(req.body);
            await post.save();
            res.status(200).json({
                status: "success",
                message: "post updated successfully",
                data: post
            });
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const deletePost = async(req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            res.status(404).json({
                status: "error",
                message: "post not found",
            });
        } else {
            await post.destroy();
            await post.save();
            res.status(200).json({
                status: "success",
                message: "post deleted successfully",
            });
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};