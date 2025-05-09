import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { reviewValidation } from '../utils/validators/reviewValidation';
import { errorValidation } from '../utils/validators/errorValidation';
import { addReview, deleteReview, getReviews, updateReview } from '../controllers/reviewControllers';
import { verifyUser } from '../middlewares/verifyUser';

export const reviewsRouter = express.Router();

reviewsRouter.route('/doctor/:id')
.get(verifyToken,verifyUser,getReviews)
.post(verifyToken,verifyUser,reviewValidation,errorValidation,addReview)

reviewsRouter.route('/:id')
.put(verifyToken,verifyUser,updateReview)
.delete(verifyToken,verifyUser,deleteReview)