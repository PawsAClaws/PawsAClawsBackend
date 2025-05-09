import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { allowToProcess } from '../middlewares/allowToProcess';
import { upload, uploadFile } from '../middlewares/uploadFile';
import { categoryValidation } from '../utils/validators/categoryValidation';
import { errorValidation } from '../utils/validators/errorValidation';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryControllers';
import { verifyUser } from '../middlewares/verifyUser';

export const categoryRouter = express.Router();

categoryRouter.route('/')
.get(verifyToken,getAllCategories)
.post(
    verifyToken,
    verifyUser,
    allowToProcess('admin'),
    upload.single("photo"),
    uploadFile,
    categoryValidation,
    errorValidation,
    createCategory
);

categoryRouter.route('/:id')
.get(verifyToken,getCategoryById)
.put(
    verifyToken,
    verifyUser,
    allowToProcess('admin'),
    upload.single("photo"),
    uploadFile,
    updateCategory
)
.delete(verifyToken,verifyUser,allowToProcess('admin'),deleteCategory);