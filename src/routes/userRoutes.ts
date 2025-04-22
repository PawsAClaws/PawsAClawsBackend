import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { deleteUser, getUser, getUserById, updateUser } from "../controllers/userControllers";
import { upload, uploadFile } from "../middlewares/uploadFile";

export const userRouter = express.Router();

userRouter.route('/')
.get(verifyToken, getUser)
.put(verifyToken,upload.single('photo'),uploadFile,updateUser)
.delete(verifyToken,deleteUser)

userRouter.get('/:id',verifyToken,getUserById)