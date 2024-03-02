const policyPeriod = require('../Model/policyPeriod')

module.exports.postPolicyPeriod = (clientId,receivedData, next, callback) => {
    try{
        let data = new policyPeriod(receivedData);
        data["clientId"] = clientId
        data.save(function (err, response) {
        if (err) {
            callback(err);
        } else {
            callback(null, response);
        }
    });
    }catch(err){
        next(err);
    }
    
}



module.exports.getPolicyPeriod = (clientId,receivedData, next, callback) => {
    try{
        policyPeriod.find({clientId:clientId}).exec(function (err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, data);
        }
    });
    }catch(err){
        next(err);
    }
    
};

module.exports.putPolicyPeriod = (id, receivedData, next, callback) => {
    try{
        policyPeriod.findByIdAndUpdate(id, receivedData, function (err, response) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.deletePolicyPeriod = (id, next, callback) => {
    try{
        policyPeriod.findByIdAndDelete(id, function (err, response) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.filterPolicyPeriod = (clientId,data, next, callback) => {
    try{
        policyPeriod.find({$and:[{clientId:clientId},data]}).exec(function (err, response) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}