import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { upload, uploadFile } from "../middlewares/uploadFile";
import { postValidation } from "../utils/validators/postValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createPost, deletePost, getMyPosts, getPost, getPosts, updatePost } from "../controllers/postControllers";
import { checkNSFW } from "../middlewares/checkNSFW";
import { checkSightengine } from "../middlewares/checkSightengine";

export const postsRouter = express.Router();

postsRouter.route("/")
.get(getPosts)
.post(verifyToken,
    upload.single("photo"),
    checkNSFW,
    checkSightengine,
    uploadFile,
    postValidation,
    errorValidation,
    createPost
)

postsRouter.get("/mine",verifyToken,getMyPosts)

postsRouter.route("/:id")
.get(verifyToken,getPost)
.put(verifyToken,upload.single("photo"),uploadFile,updatePost)
.delete(verifyToken,deletePost)

postsRouter.post("/upload",
    upload.single("photo"),
    checkNSFW,
    checkSightengine,
    (req,res)=>{
        res.status(200).json({status:"ok"})
    })