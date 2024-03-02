const dao = require('../dao/companyInvoiceDao')

module.exports.postCompanyInvoice = (data, next,callback) => {
    dao.postCompanyInvoice(data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
}

module.exports.getCompanyInvoice = (next,callback) => {
    dao.getCompanyInvoice(next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}

module.exports.putCompanyInvoice = (id, data, next,callback) => {
    dao.putCompanyInvoice(id, data, next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
}

module.exports.deleteCompanyInvoice = (id, next,callback) => {
    dao.deleteCompanyInvoice(id, next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Succcessfully" }))
        }
    })
}