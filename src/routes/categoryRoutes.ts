import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { allowToProcess } from '../middlewares/allowToProcess';
import { upload, uploadFile } from '../middlewares/uploadFile';
import { categoryValidation } from '../utils/validators/categoryValidation';
import { errorValidation } from '../utils/validators/errorValidation';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryControllers';

export const categoryRouter = express.Router();

categoryRouter.route('/')
.get(verifyToken,getAllCategories)
.post(
    verifyToken,
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
    allowToProcess('admin'),
    upload.single("photo"),
    uploadFile,
    updateCategory
)
.delete(verifyToken,allowToProcess('admin'),deleteCategory);