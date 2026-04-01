const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminCtrl.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminCtrl.getEditProduct);

router.post("/edit-product", isAuth, adminCtrl.postEditProduct);

router.get("/products", isAuth, adminCtrl.getProducts);

router.post("/add-product", isAuth, adminCtrl.postAddProduct);

router.post("/delete-product", isAuth, adminCtrl.postDeleteProduct);

module.exports = router;
