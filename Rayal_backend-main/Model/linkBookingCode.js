const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  bookingCodeId: {
    type: Schema.Types.ObjectId,
    ref: "bookingCode",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
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

tableSchema.index({ companyId: 1, bookingCodeId: 1 }, { unique: true });

const accessTable = mongoose.model(
  "linkBookingCode",
  tableSchema,
  "linkBookingCode"
);
module.exports = accessTable;
