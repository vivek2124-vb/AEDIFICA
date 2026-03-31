import { body, validationResult } from "express-validator";

// Validation rules for contact form
export const validateContact = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("message")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];
