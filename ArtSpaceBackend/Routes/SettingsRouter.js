const express = require("express");
const router = express.Router();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  changeUsername,
  changePassoword,
} = require("../Controllers/SettingsController");

//Username change api
router.patch("/username", ensureAuthenticaticated, changeUsername);

//Passoword change api
router.patch("/updatePassword", ensureAuthenticaticated, changePassoword);

module.exports = router;
