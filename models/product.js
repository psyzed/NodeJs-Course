const path = require("path");
const fs = require("fs");
const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
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

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(
        path.join(rootDir, "data", "products.json"),
        JSON.stringify(products),
        (err) => {
          console.log(err);
        },
      );
    });
    fs.readFile(p, (err, fileContent) => {});
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}

module.exports = Product;
