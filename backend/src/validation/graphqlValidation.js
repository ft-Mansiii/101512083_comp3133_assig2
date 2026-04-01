// GraphQL body validation (Postman/GraphiQL send payload under: variables.input)
const { body, validationResult } = require("express-validator");

// small helper so messages look consistent
const msg = (m) => m;

const validateGraphQL = [
  // ---------- auth ----------
  body("variables.input.username")
    .optional()
    .isString().withMessage(msg("username must be a string"))
    .notEmpty().withMessage(msg("username is required")),

  body("variables.input.email")
    .optional()
    .isEmail().withMessage(msg("email must be valid")),

  body("variables.input.password")
    .optional()
    .isLength({ min: 6 }).withMessage(msg("password must be at least 6 chars")),

  // ---------- employee ----------
  body("variables.input.first_name")
    .optional()
    .trim()
    .notEmpty().withMessage(msg("first_name is required")),

  body("variables.input.last_name")
    .optional()
    .trim()
    .notEmpty().withMessage(msg("last_name is required")),

  body("variables.input.gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage(msg("gender must be Male/Female/Other")),

  body("variables.input.designation")
    .optional()
    .trim()
    .notEmpty().withMessage(msg("designation is required")),

  body("variables.input.department")
    .optional()
    .trim()
    .notEmpty().withMessage(msg("department is required")),

  body("variables.input.salary")
    .optional()
    .isFloat({ min: 1000 })
    .withMessage(msg("salary must be >= 1000")),

  body("variables.input.date_of_joining")
    .optional()
    .isISO8601()
    .withMessage(msg("date_of_joining must be a valid date (YYYY-MM-DD)")),

  // final validator middleware
  (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.array().map((e) => ({
        field: e.path || e.param, // depends on express-validator version
        message: e.msg,
      })),
    });
  },
];

module.exports = { validateGraphQL };
