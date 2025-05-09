import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { activeDoctor, createDoctor, deleteDoctor, getAllDoctors, getDoctorById, getDoctorUser, updateDoctor } from '../controllers/doctorControllers';
import { errorValidation } from '../utils/validators/errorValidation';
import { doctorValidation } from '../utils/validators/doctorValidation';
import { upload, uploadFile } from '../middlewares/uploadFile';
import { allowToProcess } from '../middlewares/allowToProcess';
import { verifyUser } from '../middlewares/verifyUser';

export const doctorRouter = express.Router();

doctorRouter.route('/')
.get(getAllDoctors)
.post(verifyToken,
    verifyUser,
    upload.single('card'),
    uploadFile,
    doctorValidation,
    errorValidation,
createDoctor);

doctorRouter.route('/mine')
.get(verifyToken,verifyUser,getDoctorUser);

doctorRouter.post('/active/:id',verifyToken,verifyUser,allowToProcess('admin'),activeDoctor)

doctorRouter.route('/:id')
.get(verifyToken,verifyUser,getDoctorById)
.put(verifyToken,verifyUser,updateDoctor)
.delete(verifyToken,verifyUser,deleteDoctor);