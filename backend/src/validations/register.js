const { check } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors');

const validateRegisterInput = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Please provide a username with at least 3 characters.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Please provide a password with at least 6 characters.'),
    handleValidationErrors
]

module.exports = validateRegisterInput;