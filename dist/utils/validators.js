import { body, validationResult } from "express-validator";
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
const loginValidators = [
    body("email").notEmpty().trim().isEmail().withMessage("Please enter an email address"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];
const signupValidators = [
    body("name").notEmpty().withMessage("Please enter a name"),
    ...loginValidators,
];
const chatCompletionValidators = [
    body("message").notEmpty().withMessage("Message is required"),
    ...loginValidators,
];
export { signupValidators, validate, loginValidators, chatCompletionValidators };
//# sourceMappingURL=validators.js.map