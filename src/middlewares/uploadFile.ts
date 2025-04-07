import { NextFunction, Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv"

dotenv.config()

export const upload = multer({storage:multer.memoryStorage()})

export const uploadFile = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            if(req.file){
                const formData = new FormData()
                const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
                formData.append('file', blob, req.file.originalname)
                formData.append('upload_preset', process.env.CLOUDINARY_FILE as string)
                const res = await fetch(process.env.CLOUDINARY_URL as string,{
                    method:"POST",
                    body:formData
                })
                const data = await res.json()
                
                req.body = {
                    ...req.body,
                    [req.file.fieldname]:data.url
                }
                next()
            }
            else{
                next()
            }
        } catch (error:any) {
            res.status(404).json({status:"error",message:error.message})
        }
}