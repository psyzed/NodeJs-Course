const Product = require("../models/product");

function getAddProduct(req, res, next) {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
  });
}

function getEditProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: product.title,
        docTitle: product.title,
        path: "/admin/edit-product",
        product: product,
      });
    })
    .catch((err) => console.log(err));
}

function postAddProduct(req, res, next) {
  req.user
    .createProduct({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
}

function postEditProduct(req, res, next) {
  const { productId, title, imageUrl, price, description } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
}

function postDeleteProduct(req, res, next) {
  const productId = req.body.productId;

  Product.destroy({ where: { id: productId } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
}

function getProducts(req, res, next) {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
}

exports.getAddProduct = getAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.postAddProduct = postAddProduct;
exports.postDeleteProduct = postDeleteProduct;
exports.getProducts = getProducts;
