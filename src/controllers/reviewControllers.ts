import { Request, Response } from "express";
import Review from "../models/reviewsModel";
import User from "../models/usersModel";

export const addReview = async (req: Request, res: Response) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.create({
            rating,
            comment,
            userId: (req as any).user.id,
            doctorId: +(req.params.id),
        });
        res.status(201).json({
            status: "success",
            data: review,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.findAll({
            where: {
                doctorId: req.params.id,
            },
            include: [{model: User,attributes:{exclude:["password"]},as:"user"}],
        });
        res.status(200).json({
            status: "success",
            data: reviews,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            res.status(400).json({
                status: "bad request",
                message: "review not found",
            });
        } else {
            await review.update(req.body);
            await review.save();
            res.status(200).json({
                status: "success",
                data: review,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            res.status(400).json({
                status: "bad request",
                message: "review not found",
            });
        } else {
            await review.destroy();
            await review.save();
            res.status(200).json({
                status: "success",
                message:"review deleted successfully",
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};