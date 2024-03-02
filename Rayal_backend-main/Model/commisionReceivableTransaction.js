const mongoose = require("mongoose");
const { Schema } = mongoose;

var tableschema = new Schema({
  policyId: {
    type: String,
    trim: true,
    // unique:true
  },
  receivedAmount: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    default: "",
    trim: true,
    uppercase: true,
  },
  entryDate: {
    type: Date,
  },
  remarks: {
    type: String,
    trim: true,
    uppercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  userId: {
    type: String,
    trim: true,
  },
});

var accessTable = mongoose.model(
  "commisionReceivableTransaction",
  tableschema,
  "commisionReceivableTransaction"
);
module.exports = accessTable;
