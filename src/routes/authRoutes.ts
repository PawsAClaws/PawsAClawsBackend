import { Router } from "express";
import { login, register } from "../controllers/authControllers";
import { loginValidation } from "../utils/validators/loginValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { registerValidation } from "../utils/validators/registerValidation";

export const authRouter = Router();

authRouter.post("/login",loginValidation, errorValidation, login);

authRouter.post("/register", registerValidation, errorValidation, register);