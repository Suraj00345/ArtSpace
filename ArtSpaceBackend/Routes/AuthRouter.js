const { signup, login } = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");

const router = require("express").Router();

// Login router API
router.post("/login", loginValidation, login);

// Signup router API
router.post("/signup", signupValidation, signup);

module.exports = router;
