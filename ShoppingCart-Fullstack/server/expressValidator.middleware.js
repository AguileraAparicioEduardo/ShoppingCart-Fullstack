const { body, param, validationResult } = require("express-validator");

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validate ID param
const validateIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

// Validate product body on create
const validateCreateProduct = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
    .trim(),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),

  body("availability")
    .optional()
    .isBoolean().withMessage("Availability must be a boolean"),

  handleValidationErrors,
];

// Validate product body on update (partial allowed)
const validateUpdateProduct = [
  body("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
    .trim(),

  body("price")
    .optional()
    .isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),

  body("availability")
    .optional()
    .isBoolean().withMessage("Availability must be a boolean"),

  handleValidationErrors,
];

// Validate availability patch
const validatePatchAvailability = [
  body("availability")
    .notEmpty().withMessage("availability is required")
    .isBoolean().withMessage("availability must be true or false"),

  handleValidationErrors,
];

module.exports = {
  validateIdParam,
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchAvailability,
  handleValidationErrors,
};
