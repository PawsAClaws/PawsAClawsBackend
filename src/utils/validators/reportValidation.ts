import { body } from "express-validator";

export const reportValidation = [
    body("reportedId")
        .notEmpty()
        .withMessage("reportedId is required")
        .isNumeric()
        .withMessage("reportedId must be a number"),
    body("reason")
        .notEmpty()
        .withMessage("reason is required"),
    body("description")
        .notEmpty()
        .withMessage("description is required"),
]

export const updateReportValidation = [
    body("status")
        .notEmpty()
        .withMessage("status is required")
        .isIn(["resolved", "rejected"])
        .withMessage("status must be resolved or rejected"),
]