const Product = require("../models/product");

function getAddProduct(req, res, next) {
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
}

function getProducts(req, res, next) {
  Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
}

function postAddProduct(req, res, next) {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
}

exports.getAddProduct = getAddProduct;
exports.getProducts = getProducts;
exports.postAddProduct = postAddProduct;
