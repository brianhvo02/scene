const { check } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors');


const validateLogin = [
    oneOf([
        check('email')
            .exists({ checkFalsy: true })
            .isEmail()
            .withMessage('Please provide a valid email.'),
        check('username')
            .exists({ checkFalsy: true })
            .isUsername()
            .withMessage('Please provide a username.'),
    ]),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Please provide a password with at least 6 characters.'),
    handleValidationErrors
]

module.exports = validateLogin;