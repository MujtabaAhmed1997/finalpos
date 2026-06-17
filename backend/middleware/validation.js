const { body, validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => ({
                field: e.param,
                message: e.msg
            }))
        });
    }
    next();
};

// User validation rules
const validateUserSignup = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .trim()
        .toLowerCase(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters')
        .matches(/^[a-zA-Z][a-zA-Z0-9.'\-\s]*$/)
        .withMessage('Name can only contain letters, spaces, dots and hyphens'),
    handleValidationErrors
];

const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .trim()
        .toLowerCase(),
    body('password')
        .exists()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Product validation rules
const validateProductCreate = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Product name must be at least 2 characters'),
    body('sku')
        .trim()
        .isLength({ min: 2 })
        .withMessage('SKU must be at least 2 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('categoryId')
        .isInt()
        .withMessage('Valid category ID required'),
    handleValidationErrors
];

const validateProductUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Product name must be at least 2 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('categoryId')
        .optional()
        .isInt()
        .withMessage('Valid category ID required'),
    handleValidationErrors
];

// Customer validation rules
const validateCustomerCreate = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Customer name must be at least 2 characters'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format'),
    body('phone')
        .optional()
        .matches(/^[\d\-\+\(\)\s]+$/)
        .withMessage('Invalid phone number format'),
    handleValidationErrors
];

// Sales order validation rules
const validateSalesOrderCreate = [
    body('customerId')
        .isInt()
        .withMessage('Valid customer ID required'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('items.*.productId')
        .isInt()
        .withMessage('Valid product ID required for each item'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    handleValidationErrors
];

// Purchase order validation
const validatePurchaseOrderCreate = [
    body('supplierId')
        .isInt()
        .withMessage('Valid supplier ID required'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('items.*.productId')
        .isInt()
        .withMessage('Valid product ID required'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    handleValidationErrors
];

// Payment validation
const validatePaymentCreate = [
    body('customerId')
        .isInt()
        .withMessage('Valid customer ID required'),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    body('paymentMethod')
        .isIn(['cash', 'card', 'check', 'bank_transfer'])
        .withMessage('Invalid payment method'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserSignup,
    validateUserLogin,
    validateProductCreate,
    validateProductUpdate,
    validateCustomerCreate,
    validateSalesOrderCreate,
    validatePurchaseOrderCreate,
    validatePaymentCreate
};
