var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  companyName: {
    type: String,
    trim: true,
    uppercase: true,
    // unique: true
  },
  shortName: {
    type: String,
    trim: true,
    uppercase: true,
    require: true,
    // unique: true
  },
  remarks: {
    type: String,
    uppercase: true,
    trim: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

tableschema.index({ companyName: 1, clientId: 1 }, { unique: true });

var accessTable = mongoose.model("company", tableschema, "company");
module.exports = accessTable;
