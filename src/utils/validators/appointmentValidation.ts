import { body } from "express-validator";

export const appointmentValidation = [
    body("time")
        .notEmpty()
        .withMessage("time is required")
        .isDate()
        .withMessage("time must be a date"),
    body("doctorId")
        .notEmpty()
        .withMessage("doctorId is required"),
    body("description")
        .notEmpty()
        .withMessage("description is required"),
    body("animal")
        .notEmpty()
        .withMessage("animal is required"),
]

export const updateAppointmentValidation = [
    body("status")
        .notEmpty()
        .withMessage("status is required")
        .isIn(["accepted", "cancelled"])
        .withMessage("status must be accepted or cancelled"),
]