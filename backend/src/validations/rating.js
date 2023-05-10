import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateRatingInput = [
    check('rating')
        .isInt({ min: 0, max: 5})
        .withMessage("Provide a rating between 0 to 5"),
    handleValidationErrors
];

export default validateRatingInput