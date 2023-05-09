import { check, oneOf } from 'express-validator';
import handleValidationErrors from './handleValidationErrors';

const validateLoginInput = [
    oneOf([
        check('credential')
            .isEmail()
            .withMessage('Please provide a valid email.'),
        check('credential')
            .isLength({ min: 3 })
            .withMessage('Please provide a username.'),
    ]),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Please provide a password with at least 6 characters.'),
    handleValidationErrors
]

export default validateLoginInput;