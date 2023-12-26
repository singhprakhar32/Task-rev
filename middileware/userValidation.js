import { body } from "express-validator";
const validationMiddleware = [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("passwordConfirmation")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ];
  export default validationMiddleware;