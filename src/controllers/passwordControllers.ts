import { Request, Response } from "express";
import User from "../models/usersModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail";
import { generateToken } from "../middlewares/generateToken";

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }
        else{
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                res.status(400).json({
                    status: "error",
                    message: "Old password is incorrect"
                });
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await user.update({ password: hashedPassword });
                await user.save();
                res.status(200).json({
                    status: "success",
                    message: "Password updated successfully"
                });
            }
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }
        else {
            const token = generateToken(user, "5m")
            const resetLink = `${process.env.FRONTEND_URL as string}/resetPassword/${token}`;
            const message = `Click on the link below to reset your password: <a href="${resetLink}">Reset Password</a>`;
            await sendEmail(email, message, user.firstName, "Reset Password");
            res.status(200).json({
                status: "success",
                message: "Password reset link sent to your email successfully",
            });
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user.id;
        const { newPassword } = req.body;
        const user = await User.findOne({ where: { id } });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }
        else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashedPassword });
            await user.save();
            res.status(200).json({
                status: "success",
                message: "Password reset successfully"
            });
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}