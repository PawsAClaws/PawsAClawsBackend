import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { getUserByToken } from "../helpers/getUserByToken";
import dotenv from "dotenv";
import Conversation from "../models/conversationModel";
import { Op } from "sequelize";
import Message from "../models/messagesModel";
import { sendNotification } from "../helpers/sendNotification";

dotenv.config();

export const app = express();

export const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ process.env.FRONTEND_URL as string , "http://localhost:5173"],
        methods: ["GET", "POST","PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});

const onlineUsers = new Set();

io.on("connection", async(socket) => {
    const token =  socket.handshake.auth.token.split(" ")[1];
    // console.log(socket.handshake.auth)
    const user = await getUserByToken(token as string);
    // console.log(user)
    socket.join(user.id)
    onlineUsers.add(user.id);
    console.log("connect user => "+ user.id);
    // online users
    io.emit("onlineUsers",Array.from(onlineUsers));

    socket.on("newMessage",async(data)=>{
        try {
            let conversation = await Conversation.findOne({
                where:{
                    senderId:{
                        [Op.or]:[data.senderId,data.receiverId]
                    },
                    receiverId:{
                        [Op.or]:[data.senderId,data.receiverId]
                    }
                }
            })
            if(!conversation){
                conversation = await Conversation.create({
                    senderId:data.senderId,
                    receiverId:data.receiverId
                })
                await conversation.save();
            }
            const message = await Message.create({
                message:data.message,
                media:data.media || null,
                sendBy:data.senderId,
                conversationId:conversation.id
            })
            await message.save();
            io.to(data.senderId).emit("newMessage",message);
            io.to(data.receiverId).emit("newMessage",message);
            const notification = `${user.name} sent you a message`;
            await sendNotification(notification,data.receiverId);
        } catch (error: any) {
            console.log(error.message);
        }
    })

    socket.on("seen",async(data)=>{
        const conversation = await Conversation.findOne({
            where:{
                senderId:{
                    [Op.or]:[user.id,data.receiverId]
                },
                receiverId:{
                    [Op.or]:[user.id,data.receiverId]
                }
            }
        })
        if(conversation){
            await Message.update({seen:true},{
                where:{
                    conversationId:conversation.id,
                    sendBy:data.receiverId
                }
            })
            io.to(data.receiverId).emit("seen");
        }
    })

    socket.on("typing",(data)=>{
        io.to(data.receiverId).emit("typing",data.receiverId);
    })

    socket.on("stopTyping",(data)=>{
        io.to(data.receiverId).emit("stopTyping",data.receiverId);
    })

    socket.on("disconnect", () => {
        onlineUsers.delete(user.id);
        io.emit("onlineUsers",Array.from(onlineUsers));
        console.log("disconnect user => "+ user.id);
    });
})
