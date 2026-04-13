const Product = require("../models/product");
const { validationResult } = require("express-validator");

function getAddProduct(req, res, next) {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    validationErrors: [],
    product: {},
    errorMessage: null,
  });
}

function getEditProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: product.title,
        docTitle: product.title,
        path: "/admin/edit-product",
        product: product,
        validationErrors: [],
        errorMessage: null,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

function postAddProduct(req, res, next) {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const user = req.session.user;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      errorMessage: "Please enter valid data.",
      product: {
        title,
        price,
        imageUrl,
        description,
      },
      validationErrors: errors.array(),
    });
  }

  const newProd = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: user,
  });

  newProd
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

function postEditProduct(req, res, next) {
  const { productId, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      errorMessage: "Please enter valid data.",
      product: {
        _id: productId,
        title,
        imageUrl,
        price,
        description,
      },
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        req.flash("error", "You are not the owner of this product.");
        res.redirect("/");
        return Promise.reject();
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

function postDeleteProduct(req, res, next) {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((response) => {
      if (response.deletedCount === 0) {
        req.flash("error", "You are not the owner of this product.");
        res.redirect("/");
        return Promise.reject();
      }

      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
}

function getProducts(req, res, next) {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getAddProduct = getAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.postAddProduct = postAddProduct;
exports.postDeleteProduct = postDeleteProduct;
exports.getProducts = getProducts;
