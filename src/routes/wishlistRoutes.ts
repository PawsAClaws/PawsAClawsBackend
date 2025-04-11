import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getWishlist, toggleWishlist } from "../controllers/wishlistControllers";

export const wishlistRouter = express.Router();

wishlistRouter.get("/",verifyToken,getWishlist)

wishlistRouter.post("/:id",verifyToken,toggleWishlist)

