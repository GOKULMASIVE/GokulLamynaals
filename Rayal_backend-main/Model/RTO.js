const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableschema = new Schema({
  RTOCode: {
    type: String,
    trim: true,
  },
  State: {
    type: String,
    trim: true,
  },
});

const RTO = mongoose.model("RTOList", tableschema, "RTOList");

module.exports = RTO;
