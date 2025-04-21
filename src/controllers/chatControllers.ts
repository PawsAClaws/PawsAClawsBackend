import { Request, Response } from "express";
import User from "../models/usersModel";
import { Op } from "sequelize";
import Conversation from "../models/conversationModel";
import Message from "../models/messagesModel";

export const getConversations = async(req: Request, res: Response) =>{
    try {
        const userId = (req as any).user.id;
        const conversations = await Conversation.findAll({
            where:{
                [Op.or]:[
                    {senderId:userId},
                    {receiverId:userId}
                ]
            },
            include:[
                {
                    model:User,
                    as:"sender",
                    attributes:{
                        exclude:["password"]
                    }
                },
                {
                    model:User,
                    as:"receiver",
                    attributes:{
                        exclude:["password"]
                    }
                }
            ]
        })
        res.status(200).json({status:"success",data:conversations})
    } catch (error:any) {
        res.status(404).json({status:"error",message:error.message})
    }
}

export const getMessages = async(req: Request, res: Response) =>{
    try {
        const conversationId = req.params.id;
        const messages = await Message.findAll({
            where:{
                conversationId:conversationId
            },
            include:[
                {
                    model:User,
                    as:"send",
                    attributes:{
                        exclude:["password"]
                    }
                }
            ]
        })
        res.status(200).json({status:"success",data:messages})
    } catch (error:any) {
        res.status(404).json({status:"error",message:error.message})
    }
}

export const updateMessage = async(req: Request, res: Response) =>{
    try {
        const userId = (req as any).user.id;
        const messageId = req.params.id;
        const message = await Message.findOne({
            where:{
                id:messageId,
                sendBy:userId
            }
        })
        if(!message){
            res.status(404).json({status:"error",message:"message not found"})
        }
        else{
            await message.update(req.body)
            await message.save();
            res.status(200).json({status:"success",data:message})
        }
    } catch (error:any) {
        res.status(404).json({status:"error",message:error.message})
    }
}

export const deleteMessage = async(req: Request, res: Response) =>{
    try {
        const userId = (req as any).user.id;
        const messageId = req.params.id;
        const message = await Message.findOne({
            where:{
                id:messageId,
                sendBy:userId
            }
        })
        if(!message){
            res.status(404).json({status:"error",message:"message not found"})
        }
        else{
            await message.destroy();
            await message.save();
            res.status(200).json({status:"success",message:"message deleted"})
        }
    } catch (error:any) {
        res.status(404).json({status:"error",message:error.message})
    }
}