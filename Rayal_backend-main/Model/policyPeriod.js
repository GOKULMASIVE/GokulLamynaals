var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  policyPeriod: {
    type: String,
    trim: true,
    // unique:true
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

tableschema.index({ policyPeriod: 1, clientId: 1 }, { unique: true });

var accessTable = mongoose.model("policyPeriod", tableschema, "policyPeriod");
module.exports = accessTable;
