import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateEventInput = [
    check('title')
        .isLength({ min: 10, max: 50})
        .withMessage("Provide a minimum length of 10 characters title for your event."),
    handleValidationErrors
];

export default validateEventInput;