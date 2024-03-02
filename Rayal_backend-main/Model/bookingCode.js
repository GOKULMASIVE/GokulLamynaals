const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableschema = new Schema({
  bookingCode: {
    type: String,
    trim: true,
    uppercase: true,
    // unique: true
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

// added by somesh

const subBookingCodeTableSchema = new Schema({
  subBookingCode: {
    type: String,
    trim: true,
    uppercase: true,
    // unique: true
  },
  bookingCodeId: {
    type: String,
    trim: true,
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
  cc: {
    type: String,
    trim: true,
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
  // Added by gokul...
  email: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
});
tableschema.index({ email: 1, clientId: 1, bookingCode: 1 }, { unique: true });
subBookingCodeTableSchema.index(
  {
    bookingCodeId: 1,
    subBookingCode: 1,
    clientId: 1,
  },
  { unique: true }
);
subBookingCodeTableSchema.cr;
const bookingCode = mongoose.model("bookingCode", tableschema, "bookingCode");
const SubBookingCode = mongoose.model(
  "subBookingCode",
  subBookingCodeTableSchema,
  "subBookingCode"
);
module.exports = { bookingCode, SubBookingCode };
