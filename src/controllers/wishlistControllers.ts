import { Request, Response } from "express";
import Post from "../models/postsModel";
import Wishlist from "../models/wishlistModel";

export const getWishlist = async(req:Request, res:Response) => {
    try {
        const userId = (req as any).user.id;
        const wishlist = await Wishlist.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: Post,
                    as: "post",
                },
            ],
        });
        res.status(200).json({
            status: "success",
            data: wishlist
        });
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const toggleWishlist = async(req:Request, res:Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            res.status(404).json({
                status: "error",
                message: "post not found",
            });
        } else {
            const wishlist = await Wishlist.findOne({
                where: {
                    userId: userId,
                    postId: +id
                }
            });
            if (wishlist) {
                await wishlist.destroy();
                await wishlist.save();
                const allWishlist = await Wishlist.findAll({
                    where: {
                        userId: userId
                    },
                    include: [
                        {
                            model: Post,
                            as: "post",
                        },
                    ],
                });
                res.status(200).json({
                    status: "success",
                    message: "post removed from wishlist",
                    data: allWishlist
                });
            }
            else {
                const wishlist = await Wishlist.create({
                    userId: userId,
                    postId: +id
                });
                await wishlist.save();
                const allWishlist = await Wishlist.findAll({
                    where: {
                        userId: userId
                    },
                    include: [
                        {
                            model: Post,
                            as: "post",
                        },
                    ],
                });
                res.status(201).json({
                    status: "success",
                    message: "post added to wishlist",
                    data: allWishlist
                });
            }
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};