const Product = require("../models/product");

function getProducts(req, res, next) {
  Product.findAll()
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
  Product.findByPk(prodId)
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
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
}

function getCart(req, res, next) {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((prods) => {
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: prods,
      });
    })
    .catch((err) => console.log(err));
}

function postCart(req, res, next) {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
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
  });
}

function getOrders(req, res, next) {
  req.user
    .getOrders({ include: ["products"] })
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
}

function postOrder(req, res, next) {
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }),
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
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
