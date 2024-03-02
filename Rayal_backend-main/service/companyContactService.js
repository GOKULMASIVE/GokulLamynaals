const dao = require('../dao/companyContactDao')

module.exports.postCompanyContact = (clientId,data, next,callback) => {
    dao.postCompanyContact(clientId,data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
}

module.exports.getCompanyContact = (clientId,next,callback) => {
    dao.getCompanyContact(clientId,next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}

module.exports.putCompanyContact = (id, data, next,callback) => {
    dao.putCompanyContact(id, data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
}

module.exports.deleteCompanyContact = (id, next,callback) => {
    dao.deleteCompanyContact(id, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
}

module.exports.searchCompanyContact = (clientId,data, next,callback) => {
    dao.searchCompanyContact(clientId,data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}