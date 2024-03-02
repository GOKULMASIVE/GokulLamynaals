const dao = require('../dao/policyPeriodDao')

module.exports.postPolicyPeriod = (clientId,data, next, callback) => {
    dao.postPolicyPeriod(clientId,data, next, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, { error: false, data: result, message: "Saved Successfully" })
        }
    });
}

module.exports.getPolicyPeriod = (clientId,data, next, callback) => {
    dao.getPolicyPeriod(clientId,{},next, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, { error: false, data: result, message: null });
        }
    });
};

module.exports.putPolicyPeriod = (id, data, next, callback) => {
    dao.putPolicyPeriod(id, data, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
}

module.exports.deletePolicyPeriod = (id, next, callback) => {
    dao.deletePolicyPeriod(id, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
}

module.exports.filterPolicyPeriod = (clientId,data, next, callback) => {
    dao.filterPolicyPeriod(clientId,data, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}