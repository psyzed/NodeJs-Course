const path = require("path");
const fs = require("fs");

const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "cart.json");

const getCartItems = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }

    if (!fileContent || fileContent.length === 0) {
      return cb([]);
    }

    try {
      cb(JSON.parse(fileContent));
    } catch (parseError) {
      console.log("Invalid JSON. Returning empty array.");
      cb([]);
    }
  });
};

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        console.log(updatedProduct);
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteById(id, price) {
    getCartItems((cart) => {
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((p) => p.id === id);

      if (!product) {
        return;
      }

      const qty = product.qty;

      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * qty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
}

module.exports = Cart;
