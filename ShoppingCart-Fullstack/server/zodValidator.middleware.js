const { ZodError } = require("zod");

/**
 * Middleware factory that validates req.body against a Zod schema.
 * Usage: router.post("/", zodValidate(createProductSchema), controller)
 */
const zodValidateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

/**
 * Middleware factory that validates req.params against a Zod schema.
 */
const zodValidateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = { zodValidateBody, zodValidateParams };
