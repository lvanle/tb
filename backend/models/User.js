const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 实例化数据模板
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String
  }
});

module.exports = User = mongoose.model("users", UserSchema); // 数据库中的 collection 名字
