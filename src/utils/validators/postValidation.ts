import { body } from "express-validator";

export const postValidation = [
    body("title")
        .notEmpty()
        .withMessage("title is required"),
    body("description")
        .notEmpty()
        .withMessage("description is required"),
    body("price")
        .notEmpty()
        .withMessage("price is required")
        .isFloat()
        .withMessage("price must be a number"),
    body("type")
        .notEmpty()
        .withMessage("type is required")
        .isIn(["sale", "adoption", "shop"])
        .withMessage("type must be sale, adoption or shop"),
    body("gender")
        .notEmpty()
        .withMessage("gender is required")
        .isIn(["male", "female"])
        .withMessage("gender must be male or female"),
    body("age")
        .notEmpty()
        .withMessage("age is required")
        .isNumeric()
        .withMessage("age must be a number"),
    body("weight")
        .notEmpty()
        .withMessage("weight is required")
        .isFloat()
        .withMessage("weight must be a number"),
    body("country")
        .notEmpty()
        .withMessage("country is required"),
    body("city")
        .notEmpty()
        .withMessage("city is required"),
    body("photo")
        .notEmpty()
        .withMessage("photo is required"),
    body("categoryId")
        .notEmpty()
        .withMessage("categoryId is required")
]