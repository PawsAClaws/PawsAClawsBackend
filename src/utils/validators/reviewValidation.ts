import { body } from "express-validator";

export const reviewValidation = [
    body("rating")
        .notEmpty()
        .withMessage("rating is required")
        .isInt({min:1,max:5})
        .withMessage("rating must be between 1 and 5"),
    body("comment")
        .notEmpty()
        .withMessage("comment is required"),
]