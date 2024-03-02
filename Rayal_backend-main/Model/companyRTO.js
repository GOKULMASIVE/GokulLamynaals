const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableschema = new Schema({
  companyId: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    uppercase: true,
  },
  RTOCode: {
    type: Array,
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

tableschema.index({ clientId: 1, companyId: 1, location: 1 }, { unique: true });

const companyRTO = mongoose.model("companyRTO", tableschema, "companyRTO");

module.exports = companyRTO;
