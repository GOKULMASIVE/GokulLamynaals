const { Types } = require("aws-sdk/clients/acm");
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tableschema = new Schema({
  vehicle: {
    type: String,
  },
  formId: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: new Date().setHours(0, 0, 0, 0),
  },
  quoteId: {
    type: String,
  },
  isWebUser: {
    type: Boolean,
    default: false,
  },
});

var userTable = mongoose.model(
  "QuoteQueryRecords",
  tableschema,
  "QuoteQueryRecords"
);
module.exports = userTable;
