import { Router } from "express";
import { login, loginGoogle, register } from "../controllers/authControllers";
import { loginValidation } from "../utils/validators/loginValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { registerValidation } from "../utils/validators/registerValidation";
import passport from "passport";

export const authRouter = Router();

authRouter.post("/login",loginValidation, errorValidation, login);

authRouter.post("/register", registerValidation, errorValidation, register);

authRouter.get("/google", passport.authenticate("google", { scope: [ 'email', 'profile' ] }));

authRouter.get('/google/callback',passport.authenticate('google',{
    failureRedirect:`/api/v1/auth/google/failure`,
    successRedirect:`/api/v1/auth/google/success`
}))

authRouter.get('/google/success',loginGoogle)

authRouter.get('/google/failure',(req,res)=>{
    res.redirect(`${process.env.FRONT_END_URL}`)
})