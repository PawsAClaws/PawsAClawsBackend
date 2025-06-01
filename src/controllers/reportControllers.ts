import { Request, Response } from "express";
import Reports from "../models/reportsModel";
import { pagination } from "../middlewares/pagination";
import User from "../models/usersModel";
import Conversation from "../models/conversationModel";
import { Op } from "sequelize";
import Message from "../models/messagesModel";
import { sendNotification } from "../helpers/sendNotification";

export const getReports = async(req:Request,res:Response)=>{
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const offset = (page - 1) * limit;
        const reports = await Reports.findAndCountAll({
            include: [
                {model: User,attributes:{exclude:["password"]},as:"reported"},
                {model: User,attributes:{exclude:["password"]},as:"reporter"}
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });
        const pagin = pagination(+limit,+page,reports.count);
        res.status(200).json({
            status: "success",
            data: {
                reports: reports.rows,
                pagination: pagin
            }
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}

export const getReport = async(req:Request,res:Response)=>{
    try {
        const report = await Reports.findByPk(req.params.id,{
            include:[
                {model: User,attributes:{exclude:["password"]},as:"reported"},
                {model: User,attributes:{exclude:["password"]},as:"reporter"}
            ]
        });
        if(!report){
            res.status(404).json({
                status: "error",
                message: "Report not found",
            });
        }
        else{
            res.status(200).json({
                status: "success",
                data: report,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}

export const createReport = async(req:Request,res:Response)=>{
    try {
        const report = await Reports.create({
            reason: req.body.reason,
            description: req.body.description,
            reporterId: (req as any).user.id,
            reportedId: req.body.reportedId,
        });
        await report.save();
        res.status(201).json({
            status: "success",
            data: report,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}

export const updateReport = async(req:Request,res:Response)=>{
    try {
        const report = await Reports.findByPk(req.params.id);
        if(!report){
            res.status(404).json({
                status: "error",
                message: "Report not found",
            });
        }
        else{
            await report.update(req.body);
            await report.save();
            res.status(200).json({
                status: "success",
                data: report,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}

export const deleteReport = async(req:Request,res:Response)=>{
    try {
        const report = await Reports.findByPk(req.params.id);
        if(!report){
            res.status(404).json({
                status: "error",
                message: "Report not found",
            });
        }
        else{
            await report.destroy();
            await report.save();
            res.status(200).json({
                status: "success",
                message: "Report deleted successfully",
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}

export const sendMessageReport = async(req:Request,res:Response)=>{
    try {
        const report = await Reports.findByPk(req.params.id);
        if(!report){
            res.status(404).json({
                status: "error",
                message: "Report not found",
            });
        }
        else{
            let conversation = await Conversation.findOne({
                where:{
                    senderId:{
                        [Op.or]:[report.reportedId,(req as any).user.id]
                    },
                    receiverId:{
                        [Op.or]:[report.reportedId,(req as any).user.id]
                    }
                }
            })
            if(!conversation){
                conversation = await Conversation.create({
                    senderId: (req as any).user.id,
                    receiverId: report.reportedId,
                });
                await conversation.save();
            }
            const message = await Message.create({
                message: req.body.message,
                conversationId: conversation.id,
                sendBy: (req as any).user.id,
            });
            await message.save();
            await sendNotification("You have a new message from System admin",report.reportedId);
            res.status(200).json({
                status: "success",
                message: "Message sent successfully",
                data: message,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
}