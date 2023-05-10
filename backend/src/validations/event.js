import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateEventInput = [
    check('title')
        .isLength({ min: 10, max: 50})
        .withMessage("Provide a minimum length of 10 characters title for your event."),
    check('body')
        .isLength({ min: 15, max: 500 })
        .withMessage("Provide a minimum length of 15 characters body for your event."),
    check('date')
        .exists({ checkFalsy: true })
        .isISO8601().toDate()
        .withMessage("Please provide a date for your event."),
    handleValidationErrors
];

export default validateEventInput;