const express = require("express");
const router = express.Router();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  changeUsername,
  changePassoword,
  deleteAccount,
} = require("../Controllers/SettingsController");

//Username change API
router.patch("/username", ensureAuthenticaticated, changeUsername);

//Passoword change API
router.patch("/updatePassword", ensureAuthenticaticated, changePassoword);

//delete account
router.delete("/delete-account", ensureAuthenticaticated, deleteAccount);

module.exports = router;
