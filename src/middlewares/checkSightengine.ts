import { Request, Response, NextFunction } from "express";

export const checkSightengine = async(req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.file){
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const data = new FormData();
            data.append('media', blob);
            data.append('models', 'nudity-2.1,weapon,gore-2.0,violence');
            data.append('api_user', process.env.SIGHT_USER as string);
            data.append('api_secret', process.env.SIGHT_SECRET as string);

            const siRes = await fetch(`https://api.sightengine.com/1.0/check.json`,{
                method:"POST",
                body:data,
            });
            const siData = await siRes.json();

            // console.log(siData);

            if(siData.gore.prob >= 0.8 || siData.violence.prob >= 0.8 
                || siData.weapon.classes.firearm >= 0.8 || siData.weapon.classes.knife >= 0.8
                || siData.nudity.mildly_suggestive >= 0.8
            ){
                res.status(400).json({
                    status: "bad request",
                    message: "this image contains inappropriate content"
                });
            }
            else{
                next()
            }
        }
        else{
            next()
        }
    } catch (err:any) {
        res.status(500).json({ status: "error", message: err.message });
    }
};