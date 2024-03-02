const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableschema = new Schema({
  branchManagerId: {
    type: String,
    trim: true,
  },
  subProductId: {
    type: String,
    trim: true,
  },
  subBookingCodeId: {
    type: String,
    trim: true,
  },
  productId: {
    type: String,
    trim: true,
  },
  PACover: {
    type: String,
    trim: true,
    uppercase: true,
  },
  policyTypeId: {
    type: String,
    trim: true,
  },
  companyId: {
    type: String,
    trim: true,
  },
  locationId: {
    type: Array,
    default: [],
  },
  bookingCodeId: {
    type: String,
    trim: true,
  },
  TP: {
    type: String,
    trim: true,
  },
  OD: {
    type: String,
    trim: true,
  },
  Net: {
    type: String,
    trim: true,
  },
  GVW: {
    type: String,
    trim: true,
    uppercase: true,
  },
  CC: {
    type: String,
    trim: true,
    uppercase: true,
  },
  make: {
    type: String,
    trim: true,
    uppercase: true,
  },
  year: {
    type: String,
    trim: true,
    uppercase: true,
  },
  activeDate: {
    type: Date,
    default: Date.now,
  },
  disableDate: {
    type: Date,
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
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

const branchConfig = mongoose.model(
  "branchConfig",
  tableschema,
  "branchConfig"
);

module.exports = branchConfig;
