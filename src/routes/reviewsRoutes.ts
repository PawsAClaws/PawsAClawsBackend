import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { reviewValidation } from '../utils/validators/reviewValidation';
import { errorValidation } from '../utils/validators/errorValidation';
import { addReview, deleteReview, getReviews, updateReview } from '../controllers/reviewControllers';

export const reviewsRouter = express.Router();

reviewsRouter.route('/doctor/:id')
.get(verifyToken,getReviews)
.post(verifyToken,reviewValidation,errorValidation,addReview)

reviewsRouter.route('/:id')
.put(verifyToken,updateReview)
.delete(verifyToken,deleteReview)