const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin");

router.get("/add-product", adminCtrl.getAddProduct);

router.get("/products", adminCtrl.getProducts);

router.post("/add-product", adminCtrl.postAddProduct);

module.exports = router;
