import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateCommentInput = [
    check('body')
        .isLength({ min: 2, max: 500 })
        .withMessage("Provide a comment between 2 characters and 500 characters."),
    handleValidationErrors
]

export default validateCommentInput;
