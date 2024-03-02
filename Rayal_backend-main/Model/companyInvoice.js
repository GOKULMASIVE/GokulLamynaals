const mongoose = require('mongoose')
const { Schema } = mongoose

const tableSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId, ref: 'company'
    },
    bookingCodeId: {
        type: Schema.Types.ObjectId, ref: 'bookingCode'
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

const accessTable = mongoose.model('companyInvoice', tableSchema, 'companyInvoice')
module.exports = accessTable