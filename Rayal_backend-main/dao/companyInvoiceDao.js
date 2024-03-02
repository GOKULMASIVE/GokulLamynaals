const companyInvoice = require('../Model/companyInvoice')
const companySchema = require('../Model/company')
const bookingCodeSchema = require('../Model/bookingCode')

module.exports.postCompanyInvoice = (receivedData, next,callback) => {
    try{
         let data = new companyInvoice(receivedData);
         data.save(function (error, response) {
           if (error) {
             callback(error);
           } else {
             callback(null, response);
           }
         });
    }catch(err){
        next(err);
    }
   
}

module.exports.getCompanyInvoice = (next,callback) => {
    try{
        companyInvoice
          .find()
          .populate([
            { path: "companyId", model: companySchema },
            { path: "bookingCodeId", model: bookingCodeSchema },
          ])
          .exec(function (error, response) {
            if (error) {
              callback(error);
            } else {
              callback(null, response);
            }
          });
    }catch(err){
        next(err);
    }
    
}

module.exports.putCompanyInvoice = (id, receivedData, next,callback) => {
    try{
        companyInvoice.findByIdAndUpdate(
          id,
          receivedData,
          function (error, response) {
            if (error) {
              callback(error);
            } else {
              callback(null, response);
            }
          }
        );
    }catch(err){
        next(err);
    }
    
}
module.exports.deleteCompanyInvoice = (id, next,callback) => {
    try{
        companyInvoice.findByIdAndDelete(id, function (error, response) {
          if (error) {
            callback(error);
          } else {
            callback(null, response);
          }
        });
    }catch(err){
        next(err);
    }
    
}