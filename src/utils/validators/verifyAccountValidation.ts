import { body } from "express-validator";

export const verifyAccountValidation = [
    body("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["male", "female"])
        .withMessage("Invalid gender format (male or female)"),
    body("birthday")
        .notEmpty()
        .withMessage("Birthday is required")
        .isDate()
        .withMessage("Invalid birthday format"),
    body("phone")
        .notEmpty()
        .withMessage("Phone is required"),
    body("location")
        .notEmpty()
        .withMessage("Location is required"),
];