import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { deleteUser, getUser, getUserById, updateUser, verifyMyUser } from "../controllers/userControllers";
import { upload, uploadFile } from "../middlewares/uploadFile";
import { verifyUser } from "../middlewares/verifyUser";
import { verifyAccountValidation } from "../utils/validators/verifyAccountValidation";
import { errorValidation } from "../utils/validators/errorValidation";

export const userRouter = express.Router();

userRouter.route('/')
.get(verifyToken,getUser)
.post(verifyToken,verifyAccountValidation,errorValidation,verifyMyUser)
.put(verifyToken,upload.single('photo'),uploadFile,updateUser)
.delete(verifyToken,deleteUser)

userRouter.get('/:id',verifyToken,verifyUser,getUserById)