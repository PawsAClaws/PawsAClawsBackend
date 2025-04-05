import { body } from "express-validator";

export const registerValidation = [
    body("firstName")
    .notEmpty()
    .withMessage("First name is required"),
    body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 16 characters"),
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
    .withMessage("Phone is required")
]