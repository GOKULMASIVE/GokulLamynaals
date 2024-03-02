var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    uppercase: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  roleId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

var accessTable = mongoose.model("client", tableschema, "client");
module.exports = accessTable;
