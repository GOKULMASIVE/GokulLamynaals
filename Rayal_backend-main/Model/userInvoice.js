const mongoose = require('mongoose');
const { Schema } = mongoose

const tableSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: "user"
    },
    companyId: {
        type: Schema.Types.ObjectId, ref: "companyName"
    },
    panNumber: {
        type: String,
        trim: true
    },
    gstNumber: {
        type: String,
        trim: true
    },
    billAmount: {
        type: Number
    },
    tdsAmount: {
        type: Number
    },
    tdsPercentage: {
        type: Number
    },
    gstAmount: {
        type: Number
    },
    gstPercentage: {
        type: Number
    },
    totalAmount: {
        type: Number
    }
});

const accessTable = mongoose.model('userInvoice', tableSchema, 'userInvoice')
module.exports = accessTable