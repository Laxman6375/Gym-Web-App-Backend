const express = require("express");
const { signUp, verifyEmail, login, updateProfile } = require("../controllers/Auth");
const router = express.Router();

//Auth routes
router.post("/signup",signUp);
router.post("/verify-email",verifyEmail);
router.post("/login",login)
router.post("/update-profile",updateProfile)

module.exports = router;