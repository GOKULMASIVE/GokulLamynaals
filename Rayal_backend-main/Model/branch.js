const mongoose = require("mongoose");
const { Schema } = mongoose;

var tableschema = new Schema({
  branchName: {
    type: String,
    trim: true,
    uppercase: true,
    // unique:true
  },
  address: {
    type: String,
    trim: true,
    uppercase: true,
  },
  remarks: {
    type: String,
    trim: true,
    uppercase: true,
  },
  city: {
    type: String,
    trim: true,
    uppercase: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  UserId: {
    type: String,
    trim: true,
  },
});

tableschema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

tableschema.index({ branchName: 1, clientId: 1 }, { unique: true });

var accessTable = mongoose.model("branch", tableschema, "branch");
module.exports = accessTable;
