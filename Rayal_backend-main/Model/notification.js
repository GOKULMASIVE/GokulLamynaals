const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  notification: {
    type: String,
    trim: true,
    uppercase: true,
    unique: true,
  },
});

const accessTable = mongoose.model("notification", tableSchema, "notification");
module.exports = accessTable;
