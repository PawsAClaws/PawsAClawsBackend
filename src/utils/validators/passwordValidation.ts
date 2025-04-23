import { body } from "express-validator";

export const updatePasswordValidation = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6, max: 20 })
        .withMessage("New password must be between 6 and 20 characters"),
]

export const forgotPasswordValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
]

export const resetPasswordValidation = [
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6, max: 20 })
        .withMessage("New password must be between 6 and 20 characters"),
]