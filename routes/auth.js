const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

router.get("/login", authCtrl.getLoginPage);

router.post("/login", authCtrl.postLogin);

router.post("/logout", authCtrl.postLogout);

module.exports = router;
