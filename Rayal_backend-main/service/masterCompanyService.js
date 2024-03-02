const dao = require('../dao/masterCompanyDao')

module.exports.postMasterCompany = (clientId,data, next,callback) => {
    dao.postMasterCompany(clientId,data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
};

module.exports.getMasterCompany = (clientId,next,callback) => {
    dao.getMasterCompany(clientId,next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
};

module.exports.putMasterCompany = (id, data, next,callback) => {
    dao.putMasterCompany(id, data, next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
};

module.exports.deleteMasterCompany = (id, next,callback) => {
    dao.deleteMasterCompany(id,next, function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
};

module.exports.filterMasterCompany = (clientId,data, next,callback) => {
    dao.filterMasterCompany(clientId,data, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
};