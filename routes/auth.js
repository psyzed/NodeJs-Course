const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authCtrl.getLoginPage);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
  ],
  authCtrl.postLogin,
);

router.post("/logout", authCtrl.postLogout);

router.get("/signup", authCtrl.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email")
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email is already taken");
          }
        });
      })
      .normalizeEmail(),
    check("password", "Password too short").isLength({ min: 5 }).trim(),
    body("confirmPassword")
      .custom((val, { req }) => {
        if (val !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .trim(),
  ],
  authCtrl.postSignup,
);

router.get("/reset", authCtrl.getReset);

router.post("/reset", authCtrl.postReset);

router.get("/new-password/:token", authCtrl.getNewPassword);

router.post("/new-password/:token", authCtrl.postNewPassword);

module.exports = router;
