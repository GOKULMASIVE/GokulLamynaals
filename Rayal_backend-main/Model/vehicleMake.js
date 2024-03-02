var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableSchema = new Schema({
  productID: {
    type: String,
    trim: true,
  },
  product: {
    type: String,
    trim: true,
  },
  vehicleMake: {
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
  createdAt: {
    type: Date,
    default: Date.now(),
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

tableSchema.index({
    productID:1,
    clientId:1,
    vehicleMake:1,
    unique:true
})

var vehicleMakeTable = mongoose.model(
  "vehicleMake",
  tableSchema,
  "vehicleMake"
);

module.exports = vehicleMakeTable;
