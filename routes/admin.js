const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin");

router.get("/add-product", adminCtrl.getAddProduct);

router.get("/edit-product/:productId", adminCtrl.getEditProduct);

router.post("/edit-product", adminCtrl.postEditProduct);

router.get("/products", adminCtrl.getProducts);

router.post("/add-product", adminCtrl.postAddProduct);

router.post("/delete-product", adminCtrl.postDeleteProduct);

module.exports = router;
