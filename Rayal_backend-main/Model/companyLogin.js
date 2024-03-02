const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },
  bookingCodeId: {
    type: Schema.Types.ObjectId,
    ref: "bookingCode",
  },
  subBookingCodeId: {
    type: Schema.Types.ObjectId,
    ref: "subBookingCode",
  },
  url: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
  },
  userIdNumber: {
    type: String,
    trim: true,
    // unique : true
  },
  password: {
    type: String,
    trim: true,
  },
  branch: {
    type: String,
    trim: true,
    uppercase: true,
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
  clientId: {
    type: String,
    required: true,
  },
});

tableSchema.index(
  { userIdNumber: 1, clientId: 1, companyId: 1 },
  { unique: true }
);

const accessTable = mongoose.model("companyLogin", tableSchema, "companyLogin");
module.exports = accessTable;
