import { body } from "express-validator";

const time12HourRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;

export const doctorValidation = [
    body('bio').notEmpty().withMessage('bio is required'),
    body('address').notEmpty().withMessage('address is required'),
    body('price')
        .notEmpty().withMessage('price is required')
        .isFloat({ min: 0 }).withMessage('price must be a positive number'),
    body('experience')
        .notEmpty().withMessage('experience is required')
        .isFloat({ min: 0 }).withMessage('experience must be a positive number'),
    body('speciality').notEmpty().withMessage('speciality is required'),
    body('numOfReservat')
        .notEmpty().withMessage('numOfReservat is required')
        .isInt({ min: 0 }).withMessage('numOfReservat must be a positive number'),
    body('daysWork')
        .notEmpty().withMessage('daysWork is required')
        .isArray({ min: 1 }).withMessage('daysWork must be an array')
        .custom(value => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            value.forEach(day => {
                if (!days.includes(day)) {
                    throw new Error('Invalid day of the week');
                }
            });
            return true;
        }),
    body('startTimeWork')
        .notEmpty().withMessage('startTimeWork is required')
        .matches(time12HourRegex).withMessage('startTimeWork must be a valid 12-hour time (e.g. 8:00 PM)'),
    body('endTimeWork')
        .notEmpty().withMessage('endTimeWork is required')
        .matches(time12HourRegex).withMessage('startTimeWork must be a valid 12-hour time (e.g. 8:00 PM)'),
];