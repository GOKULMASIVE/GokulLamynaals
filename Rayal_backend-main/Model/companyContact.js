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
    ref: "SubBookingCode",
  },
  Desigination: {
    type: String,
    trim: true,
    uppercase: true,
  },
  branch: {
    type: String,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    trim: true,
    uppercase: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  clientId: {
    type: String,
    required: true,
  },
});

const accessTable = mongoose.model(
  "companyContact",
  tableSchema,
  "companyContact"
);
module.exports = accessTable;
