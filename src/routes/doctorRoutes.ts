import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { activeDoctor, createDoctor, deleteDoctor, getAllDoctors, getDoctorById, getDoctorUser, updateDoctor } from '../controllers/doctorControllers';
import { errorValidation } from '../utils/validators/errorValidation';
import { doctorValidation } from '../utils/validators/doctorValidation';
import { upload, uploadFile } from '../middlewares/uploadFile';
import { allowToProcess } from '../middlewares/allowToProcess';

export const doctorRouter = express.Router();

doctorRouter.route('/')
.get(getAllDoctors)
.post(verifyToken,
    upload.single('card'),
    uploadFile,
    doctorValidation,
    errorValidation,
createDoctor);

doctorRouter.route('/mine')
.get(verifyToken,getDoctorUser);

doctorRouter.post('/active/:id',verifyToken,allowToProcess('admin'),activeDoctor)

doctorRouter.route('/:id')
.get(verifyToken,getDoctorById)
.put(verifyToken,updateDoctor)
.delete(verifyToken,deleteDoctor);