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

function postAddProduct(req, res, next) {
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price,
  );
  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
}

function postEditProduct(req, res, next) {
  const { productId, title, imageUrl, price, description } = req.body;

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price,
  );

  updatedProduct.save();
  res.redirect("/admin/products");
}

function postDeleteProduct(req, res, next) {
  const productId = req.body.productId;

  Product.deleteById(productId);

  res.redirect("/admin/products");
}

function getProducts(req, res, next) {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
}

exports.getAddProduct = getAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.postAddProduct = postAddProduct;
exports.postDeleteProduct = postDeleteProduct;
exports.getProducts = getProducts;
