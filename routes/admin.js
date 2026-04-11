const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

router.get("/add-product", isAuth, adminCtrl.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminCtrl.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
    body("imageUrl").isURL(),
  ],
  isAuth,
  adminCtrl.postEditProduct,
);

router.get("/products", isAuth, adminCtrl.getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
    body("imageUrl").isURL(),
  ],
  isAuth,
  adminCtrl.postAddProduct,
);

router.post("/delete-product", isAuth, adminCtrl.postDeleteProduct);

module.exports = router;
