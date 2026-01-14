const { signup, login } = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");

const router = require("express").Router();

// login router API
router.post("/login", loginValidation, login);
// signup router API
router.post("/signup", signupValidation, signup);

module.exports = router;
