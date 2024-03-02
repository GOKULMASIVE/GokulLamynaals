var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  payoutCycle: {
    type: String,
    trim: true,
    uppercase: true,
    //    unique:true
  },
  remarks: {
    type: String,
    trim: true,
    uppercase: true,
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
  clientId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

tableschema.index({ payoutCycle: 1, clientId: 1 }, { unique: true });

var accessTable = mongoose.model("payoutCycle", tableschema, "payoutCycle");
module.exports = accessTable;
