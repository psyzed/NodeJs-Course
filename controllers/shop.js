const Product = require("../models/product");

function getProducts(req, res, next) {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
}

function getIndex(req, res, next) {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  });
}

function getCart(req, res, next) {
  res.render("shop/cart", {
    path: "/cart",
    docTitle: "Your Cart",
  });
}

function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
}

function getOrders(req, res, next) {
  res.render("shop/orders", {
    path: "/orders",
    docTitle: "Your Orders",
  });
}

exports.getProducts = getProducts;
exports.getIndex = getIndex;
exports.getCart = getCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
