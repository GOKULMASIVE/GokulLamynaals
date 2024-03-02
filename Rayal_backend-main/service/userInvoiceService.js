const dao = require('../dao/userInvoiceDao')

module.exports.postUserInvoice = (receivedData, next, callBack) => {
    dao.postUserInvoice(receivedData, next, function (err, result) {
        if (err) {
            callBack(err)
        }
        else {
            callBack(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
}

module.exports.getUserInvoice = (next,callBack) => {
    dao.getUserInvoice(next,function (err, result) {
        if (err) {
            callBack(err)
        }
        else {
            callBack(null, ({ error: false, data: result, message: null }))
        }
    })
}

module.exports.putUserInvoice = (id, receivedData, next, callBack) => {
    dao.putUserInvoice(id, receivedData, next, function (err, result) {
        if (err) {
            callBack(err)
        }
        else {
            callBack(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
}

module.exports.deleteUserInvoice = (id, next, callBack) => {
    dao.deleteUserInvoice(id, next, function (err, result) {
        if (err) {
            callBack(err)
        }
        else {
            callBack(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
}