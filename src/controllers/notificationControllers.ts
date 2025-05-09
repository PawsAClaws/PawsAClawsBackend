import { Request, Response } from "express";
import Notification from "../models/notificationModel";
import { Op } from "sequelize";

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

export const deleteOldNotifications = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
        const deletedCount = await Notification.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneWeekAgo,
                },
            },
        });
    
        console.log(`${deletedCount} notification(s) deleted.`);
    } catch (error: any) {
        console.error('Error deleting old notifications:', error.message);
    }
};