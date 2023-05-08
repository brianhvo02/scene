const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errorFormatter = ({ msg }) => msg;
        const errors = validationErrors.formatWith(errorFormatter).mapped();

        const err = Error("Validation Error")
        err.errors = errors;
        err.title = "Validation Error";
        err.status = 400;
        next(err);
    }
    next();
}

module.exports = handleValidationErrors;