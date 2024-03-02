const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  policyType: {
    type: String,
    trim: true,
    uppercase: true,
    //  unique:true
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

tableSchema.index({ policyType: 1, clientId: 1 }, { unique: true });

var accessTable = mongoose.model("policyType", tableSchema, "policyType");
module.exports = accessTable;
