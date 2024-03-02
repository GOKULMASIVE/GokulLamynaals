const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  masterCompanyName: {
    type: String,
    trim: true,
    uppercase: true,
    // unique : true
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
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
    default: Date.now,
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
tableSchema.index({ masterCompanyName: 1, clientId: 1 }, { unique: true });
const accessTable = mongoose.model(
  "masterCompany",
  tableSchema,
  "masterCompany"
);
module.exports = accessTable;
