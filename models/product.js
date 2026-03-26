// const getDb = require("../utils/database").getDb;
// const { ObjectId } = require("mongodb");

// class Product {
//   constructor(title, price, description, imageUrl, _id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = _id;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     if (this._id) {
//       return db.collection("products").updateOne(
//         { _id: new ObjectId(this._id) },
//         {
//           $set: this,
//         },
//       );
//     } else {
//       return db.collection("products").insertOne(this);
//     }
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection("products").find().toArray();
//   }

//   static findById(prodId) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(prodId) })
//       .next();
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection("products").deleteOne({ _id: new ObjectId(prodId) });
//   }
// }

// module.exports = Product;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
