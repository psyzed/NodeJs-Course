const Product = require("../models/product");
const Cart = require("../models/cart");

function getProducts(req, res, next) {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
}

function getProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        pageTitle: product[0].title,
        docTitle: product[0].title,
        path: "/products",
        product: product[0],
      });
    })
    .catch((err) => console.log(err));
}

function getIndex(req, res, next) {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
}

function getCart(req, res, next) {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (p of products) {
        const cartProductData = cart.products.find((prod) => prod.id === p.id);
        if (cartProductData) {
          cartProducts.push({ productData: p, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
}

function postCart(req, res, next) {
  const productId = req.body.productId;
  Product.findById(productId, (prod) => {
    Cart.addProduct(productId, prod.price);
  });
  res.redirect("/cart");
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

function postDeleteCartItem(req, res, next) {
  const productId = req.body.productId;

  Product.findById(productId, (product) => {
    Cart.deleteById(productId, product.price);

    res.redirect("/cart");
  });
}

exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getIndex = getIndex;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.postDeleteCartItem = postDeleteCartItem;
