import { check } from 'express-validator';
import handleValidationErrors from './handleValidationErrors';

const validateRegisterInput = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .isLength({ min: 3 })
        .withMessage('Please provide a username with at least 3 characters.'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Please provide a password with at least 6 characters.'),
    handleValidationErrors
]

export default validateRegisterInput;