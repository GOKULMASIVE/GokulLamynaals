var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  userName: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  otp: {
    type: Number,
  },
  UID: {
    type: Number,
    default: 1001,
  },
  lastCounter: {
    type: Number,
    default: 1001,
  },
  otpSentAt: {
    type: Date,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isUserActive: {
    type: Boolean,
    default: true,
  },
});

var userTable = mongoose.model("motorUsers", tableschema, "motorUsers");
module.exports = userTable;
