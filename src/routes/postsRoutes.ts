import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { upload, uploadFile } from "../middlewares/uploadFile";
import { postValidation } from "../utils/validators/postValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/postControllers";

export const postsRouter = express.Router();

postsRouter.route("/")
.get(getPosts)
.post(verifyToken,upload.single("photo"),uploadFile,postValidation,errorValidation,createPost)

postsRouter.route("/:id")
.get(verifyToken,getPost)
.put(verifyToken,upload.single("photo"),uploadFile,updatePost)
.delete(verifyToken,deletePost)