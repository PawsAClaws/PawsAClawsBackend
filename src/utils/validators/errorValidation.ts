import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const errorValidation = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: "bad request",
                message: errors.array()
            })
        } else {
            next();
        }
    } catch (error:any) {
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}