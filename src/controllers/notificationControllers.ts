import { Request, Response } from "express";
import Notification from "../models/notificationModel";

export const  getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.findAll({
            where: {
                userId: (req as any).user.id,
            },
        });
        res.status(200).json({
            status: "success",
            data: notifications,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const readNotifction = async (req: Request, res: Response) => {
    try {
        await Notification.update({isReead:true},{where:{userId:(req as any).user.id}});
        res.status(200).json({
            status: "success",
            message: "notifications read successfully"
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};