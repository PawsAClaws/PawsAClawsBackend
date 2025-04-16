import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { createDoctor, deleteDoctor, getAllDoctors, getDoctorById, getDoctorUser, updateDoctor } from '../controllers/doctorControllers';
import { errorValidation } from '../utils/validators/errorValidation';
import { doctorValidation } from '../utils/validators/doctorValidation';

export const doctorRouter = express.Router();

doctorRouter.route('/')
.get(getAllDoctors)
.post(verifyToken,doctorValidation,errorValidation,createDoctor);

doctorRouter.route('/mine')
.get(verifyToken,getDoctorUser);

doctorRouter.route('/:id')
.get(verifyToken,getDoctorById)
.put(verifyToken,updateDoctor)
.delete(verifyToken,deleteDoctor);
