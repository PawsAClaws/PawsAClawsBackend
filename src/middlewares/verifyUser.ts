import { NextFunction, Request, Response } from "express";

export const verifyUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const verify = (req as any).user.verify
        if(!verify){
            res.status(403).json({
                status: "forbidden",
                message: "you are not verified, please verify your account"
            })
        }
        else{
            next()
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}