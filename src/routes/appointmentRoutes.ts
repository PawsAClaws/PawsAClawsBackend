import { getAppointmentDoctor, getAppointmentUser } from './../controllers/appointmentControllers';
import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { appointmentValidation, updateAppointmentValidation } from "../utils/validators/appointmentValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createAppointment, updateAppointment } from "../controllers/appointmentControllers";
import { verifyUser } from '../middlewares/verifyUser';

export const appointmentRouter = express.Router();

appointmentRouter.route("/")
.post(verifyToken,verifyUser,appointmentValidation,errorValidation,createAppointment)

appointmentRouter.route("/:id")
.put(verifyToken,verifyUser,updateAppointmentValidation,errorValidation,updateAppointment)

appointmentRouter.get("/user",verifyToken,verifyUser,getAppointmentUser)
appointmentRouter.get("/doctor/:id",verifyToken,verifyUser,getAppointmentDoctor)