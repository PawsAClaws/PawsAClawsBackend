import { body } from "express-validator";

export const categoryValidation = [
    body("name")
        .notEmpty()
        .withMessage("name is required"),
    body("description")
        .notEmpty()
        .withMessage("description is required"),
    body("photo")
        .notEmpty()
        .withMessage("photo is required"),
]