import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { blockUser, deleteAccount, deleteUser, getUser, getUserById, updateUser, verifyMyUser } from "../controllers/userControllers";
import { upload, uploadFile } from "../middlewares/uploadFile";
import { verifyUser } from "../middlewares/verifyUser";
import { blockUserValidation, verifyAccountValidation } from "../utils/validators/verifyAccountValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { allowToProcess } from "../middlewares/allowToProcess";

export const userRouter = express.Router();

userRouter.route('/')
.get(verifyToken,getUser)
.post(verifyToken,verifyAccountValidation,errorValidation,verifyMyUser)
.put(verifyToken,upload.single('photo'),uploadFile,updateUser)
.delete(verifyToken,deleteUser)

userRouter.get('/:id',verifyToken,verifyUser,getUserById)

userRouter.post('/block/:id',
    verifyToken,
    verifyUser,
    allowToProcess('admin'),
    blockUserValidation,
    errorValidation,
    blockUser
)

userRouter.delete('/delete/:id',verifyToken,verifyUser,allowToProcess('admin'),deleteAccount)