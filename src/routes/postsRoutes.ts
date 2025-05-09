import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { upload, uploadFile } from "../middlewares/uploadFile";
import { postValidation } from "../utils/validators/postValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createPost, deletePost, getMyPosts, getPost, getPosts, updatePost } from "../controllers/postControllers";
import { checkSightengine } from "../middlewares/checkSightengine";
import { verifyUser } from "../middlewares/verifyUser";

export const postsRouter = express.Router();

postsRouter.route("/")
.get(getPosts)
.post(verifyToken,
    verifyUser,
    upload.single("photo"),
    checkSightengine,
    uploadFile,
    postValidation,
    errorValidation,
    createPost
)

postsRouter.get("/mine",verifyToken,verifyUser,getMyPosts)

postsRouter.route("/:id")
.get(verifyToken,verifyUser,getPost)
.put(verifyToken,verifyUser,upload.single("photo"),uploadFile,updatePost)
.delete(verifyToken,deletePost)

postsRouter.post("/upload",
    upload.single("photo"),
    checkSightengine,
    (req,res)=>{
        res.status(200).json({status:"ok"})
    })