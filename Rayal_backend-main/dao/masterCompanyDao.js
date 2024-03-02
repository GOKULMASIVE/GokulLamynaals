const masterCompany = require('../Model/masterCompany')

module.exports.postMasterCompany = (clientId,receivedData,next, callback) => {
    try{
        let data = new masterCompany(receivedData);
        data["clientId"] = clientId;

        // Set the createdAt field to the current date and time in IST
        const options = {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // Use 12-hour format with AM/PM
        };
        console.log(
          "createdAt : ",
          data.createdAt.toLocaleString("en-IN", options)
        );
        // Log the createdAt field
        // console.log('createdAt:', data.createdAt);

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

module.exports.getMasterCompany = (clientId,next,callback) => {
    try{
        masterCompany
          .find({ clientId: clientId })
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

module.exports.putMasterCompany = (id, receivedData, next,callback) => {
    try{
        masterCompany.findByIdAndUpdate(
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

module.exports.deleteMasterCompany = (id, next,callback) => {
    try{
         masterCompany.findByIdAndDelete(id, function (error, response) {
           if (error) {
             callback(error);
           } else {
             callback(null, response);
           }
         });
    }catch(err){
        next(err);
    }
   
};

module.exports.filterMasterCompany = (clientId,data, next,callback) => {
    try{
        masterCompany
          .find({ $and: [{ clientId: clientId }, data] })
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
    
};