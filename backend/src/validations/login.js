import { check, oneOf} from 'express-validator';
import handleValidationErrors from './handleValidationErrors';

const validateLoginInput = [
    oneOf([
        check('email')
            .exists({ checkFalsy: true })
            .isEmail()
            .withMessage('Please provide a valid email.'),
        check('username')
            .exists({ checkFalsy: true })
            .isLength({ min: 3 })
            .withMessage('Please provide a username.'),
    ]),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Please provide a password with at least 6 characters.'),
    handleValidationErrors
]

export default validateLoginInput;