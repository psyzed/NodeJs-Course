const express = require("express");
const router = express.Router();
const shopCtrl = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopCtrl.getIndex);

router.get("/products", shopCtrl.getProducts);

router.get("/products/:productId", shopCtrl.getProduct);

router.get("/cart", isAuth, shopCtrl.getCart);

router.post("/cart", isAuth, shopCtrl.postCart);

router.post("/cart-delete-item", isAuth, shopCtrl.postDeleteCartItem);

router.get("/orders", isAuth, shopCtrl.getOrders);

router.post("/create-order", isAuth, shopCtrl.postOrder);

router.get("/orders/:orderId", isAuth, shopCtrl.getInvoice);

module.exports = router;
