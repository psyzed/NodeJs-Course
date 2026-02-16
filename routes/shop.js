const express = require("express");
const router = express.Router();
const shoCtrl = require("../controllers/shop");

router.get("/", shoCtrl.getIndex);

router.get("/products", shoCtrl.getProducts);

router.get("/cart", shoCtrl.getCart);

router.get("/checkout", shoCtrl.getCheckout);

router.get("/orders", shoCtrl.getOrders);

module.exports = router;
