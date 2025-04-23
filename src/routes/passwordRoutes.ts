import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { forgotPasswordValidation, resetPasswordValidation, updatePasswordValidation } from "../utils/validators/passwordValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { forgotPassword, resetPassword, updatePassword } from "../controllers/passwordControllers";

export const passwordRouter = express.Router();

passwordRouter.put("/update",verifyToken,updatePasswordValidation,errorValidation,updatePassword)

passwordRouter.post("/forgot",forgotPasswordValidation,errorValidation,forgotPassword)

passwordRouter.post("/reset",verifyToken,resetPasswordValidation,errorValidation,resetPassword)