import { validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        console.log(validationErrors)
        const errorFormatter = ({ msg }) => msg;
        const errors = validationErrors.formatWith(errorFormatter).mapped();

        const err = Error("Validation Error");
        err.errors = errors;
        err.title = "Validation Error";
        err.status = 400;
        next(err);
    }
    next();
}

export default handleValidationErrors;