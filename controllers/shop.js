const Product = require("../models/product");
const Order = require("../models/order");

function getProducts(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
}

function getProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        docTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => console.log(err));
}

function getIndex(req, res, next) {
  const errorMessage = req.flash("error")[0] || null;
  
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        errorMessage,
      });
    })
    .catch((err) => console.log(err));
}

function getCart(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log(err));
}

function postCart(req, res, next) {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
}

function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
    isAuth: req.session.loggedIn,
  });
}

function getOrders(req, res, next) {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
}

function postDeleteCartItem(req, res, next) {
  const productId = req.body.productId;

  req.user
    .removeFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
}

function postOrder(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        qty: i.qty,
        productData: { ...i.productId._doc },
      }));
      console.log(products);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
}

exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getIndex = getIndex;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.postDeleteCartItem = postDeleteCartItem;
exports.postOrder = postOrder;
