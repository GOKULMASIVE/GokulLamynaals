const userInvoice = require('../Model/userInvoice')
const userSchema = require('../Model/user')
const companySchema = require('../Model/company')

module.exports.postUserInvoice = (receivedData, next, callback) => {
    try{
        let data = new userInvoice(receivedData)
    data.save(function (error, response) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.getUserInvoice = (next,callback) => {
    try{
        userInvoice.find().populate([{ path: "userId", model: userSchema }, { path: "companyId", model: companySchema }]).exec(function (error, response) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.putUserInvoice = (id, receivedData, next, callback) => {
    try{
         userInvoice.findByIdAndUpdate(id, receivedData, function (error, response) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
   
}

module.exports.deleteUserInvoice = (id, next, callback) => {
    try{
        userInvoice.findByIdAndDelete(id, function (error, response) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, response)
        }
    })
    }catch(err){
        next(err);
    }
    
}