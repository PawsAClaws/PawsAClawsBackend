import { Request, Response, NextFunction } from "express";
import * as tf from "@tensorflow/tfjs-node";
import * as nsfw from "nsfwjs";

let nsfwModel: nsfw.NSFWJS;

(async () => {
    nsfwModel = await nsfw.load();
    console.log("✅ NSFWJS model loaded");
})();

export const checkNSFW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file){
            next();
        }
        else{
            const imageTensor = tf.node.decodeImage(req.file.buffer, 3) as tf.Tensor3D;
            const predictions = await nsfwModel.classify(imageTensor);
            imageTensor.dispose();
    
            const nsfwContent = predictions.find(p =>
                ['Porn', 'Sexy', 'Hentai'].includes(p.className) &&
                p.probability > 0.8
            );
    
            if (nsfwContent) {
                res.status(400).json({
                    status: "bad request",
                    message: "this image contains inappropriate content",
                });
            }
            else{
                next();
            }
        }
    } catch (err:any) {
        res.status(500).json({ status: "error", message: err.message });
    }
};