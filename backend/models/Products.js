const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  id: {
    type: String
  },
  nickname: {
    type: String
  },
  userImageUrl: {
    type: String
  },
  comments: {
    type: String
  },
  rate: {
    type: String
  },
  referenceTime: {
    type: String
  },
  timePick: {
    type: Date
  }
});
module.exports = Products = mongoose.model("products", ProductSchema); // collection: products
