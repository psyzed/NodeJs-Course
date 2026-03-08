const express = require("express");
const router = express.Router();
const shopCtrl = require("../controllers/shop");

router.get("/", shopCtrl.getIndex);

router.get("/products", shopCtrl.getProducts);

router.get("/products/:productId", shopCtrl.getProduct);

router.get("/cart", shopCtrl.getCart);

router.post("/cart", shopCtrl.postCart);

router.post("/cart-delete-item", shopCtrl.postDeleteCartItem);

router.get("/checkout", shopCtrl.getCheckout);

router.get("/orders", shopCtrl.getOrders);

module.exports = router;
