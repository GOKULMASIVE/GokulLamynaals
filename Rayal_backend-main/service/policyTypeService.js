const dao = require('../dao/policyType')

module.exports.postPolicyType = (clientId,data, next, callback) => {
    dao.postPolicytype(clientId,data, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
}

module.exports.getPolicyType = (clientId, isAscending, data, next, callback) => {
  dao.getPolicyType(clientId, isAscending, {}, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putPolicyType = (id, data, next, callback) => {
    dao.putPolicyType(id, data, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, { error: false, data: result, message: "Updated Successfully" })
        }
    })
}


module.exports.deletePolicytype = (id, next, callback) => {
    dao.deletePolicyType(id, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
}

module.exports.filterPolicyType = (clientId,data, next, callback) => {
    dao.filterPolicyType(clientId,data, next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}