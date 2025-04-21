import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { deleteMessage, getConversations, getMessages, updateMessage } from '../controllers/chatControllers';

export const chatRouter = express.Router();

chatRouter.get("/conversations",verifyToken,getConversations)

chatRouter.get("/messages/:id",verifyToken,getMessages)

chatRouter.route("/message/:id")
.put(verifyToken,updateMessage)
.delete(verifyToken,deleteMessage)