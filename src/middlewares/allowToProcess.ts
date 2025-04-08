import { NextFunction, Request, Response } from "express";

export const allowToProcess = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
            res.status(403).json({
                status: "forbidden",
                message: "you are not allowed to perform this action",
            });
        }
        else{
            next();
        }
    };
};