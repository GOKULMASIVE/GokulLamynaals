const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  product: {
    type: String,
    trim: true,
    uppercase: true,
    // unique: true,
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

const subProductTableSchema = new Schema({
  subProduct: {
    type: String,
    trim: true,
    // unique: true,
  },
  productID: {
    type: String,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
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

tableSchema.index({ product: 1, clientId: 1 }, { unique: true });
subProductTableSchema.index(
  { productID: 1, subProduct: 1, clientId: 1 },
  { unique: true }
);

const Product = mongoose.model("product", tableSchema, "product");
const SubProduct = mongoose.model(
  "subProduct",
  subProductTableSchema,
  "subProduct"
);
module.exports = { Product, SubProduct };
