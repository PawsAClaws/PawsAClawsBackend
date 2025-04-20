import express from "express";
import { getNotifications, readNotifction } from "../controllers/notificationControllers";
import { verifyToken } from "../middlewares/verifyToken";

export const notificationRouter = express.Router();

notificationRouter.route("/")
.get(verifyToken,getNotifications)
.put(verifyToken,readNotifction)