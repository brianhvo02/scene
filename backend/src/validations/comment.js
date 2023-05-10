import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateCommentInput = [
    check('body')
        .isLength({ min: 2, max: 500 })
        .withMessage("Provide a minimum length of 2 characters body for your comment."),
    handleValidationErrors
]

export default validateCommentInput;
