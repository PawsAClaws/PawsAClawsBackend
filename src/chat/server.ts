import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { getUserByToken } from "../helpers/getUserByToken";
import dotenv from "dotenv";

dotenv.config();

export const app = express();

export const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT", "DELETE"],
        credentials: true,
    },
});

const onlineUsers = new Set();

io.on("connection", async(socket) => {
    const token =  socket.handshake.headers.authorization?.split(" ")[1];
    const user = await getUserByToken(token as string);
    onlineUsers.add(user.id);
    console.log("connect user => "+ user.id);
    // online users
    io.emit("onlineUsers",Array.from(onlineUsers));

    socket.on("typing",(id)=>{
        io.to(id).emit("typing",id);
    })

    socket.on("stopTyping",(id)=>{
        io.to(id).emit("stopTyping",id);
    })

    socket.on("disconnect", () => {
        onlineUsers.delete(user.id);
        io.emit("onlineUsers",Array.from(onlineUsers));
        console.log("disconnect user => "+ user.id);
    });
})
