import { getAppointmentDoctor, getAppointmentUser } from './../controllers/appointmentControllers';
import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { appointmentValidation, updateAppointmentValidation } from "../utils/validators/appointmentValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createAppointment, updateAppointment } from "../controllers/appointmentControllers";

export const appointmentRouter = express.Router();

appointmentRouter.route("/")
.post(verifyToken,appointmentValidation,errorValidation,createAppointment)

appointmentRouter.route("/:id")
.put(verifyToken,updateAppointmentValidation,errorValidation,updateAppointment)

appointmentRouter.get("/user",verifyToken,getAppointmentUser)
appointmentRouter.get("/doctor/:id",verifyToken,getAppointmentDoctor)