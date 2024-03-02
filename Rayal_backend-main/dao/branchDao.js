const Branch = require('../Model/branch')

module.exports.postBranch = (clientId,receivedData, next,callback) => {

    try{
    let data = new Branch(receivedData);
    data["clientId"] = clientId;
    data.save(clientId, function (err, response) {
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

module.exports.getBranch = (clientId,receivedData, next,callback) => {
    try{
             Branch.find({ clientId: clientId }).exec(function (err, data) {
               if (err) {
                 callback(err);
               } else {
                 callback(null, data);
               }
             });
    }catch(err){
        next(err);
    }
   
};

module.exports.updateBranch = (id,receivedData, next,callback) => {

    try{
        Branch.findOneAndUpdate({ _id: id }, { $set: receivedData }).exec(
          function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          }
        );
    }catch(err){
        next(err);
    }
    
};

module.exports.deleteBranch = (id, next,callback) => {
    try{
         Branch.findOneAndRemove({ _id: id }).exec(function (err, data) {
           if (err) {
             callback(err);
           } else {
             callback(null, data);
           }
         });
    }catch(err){
        next(err);
    }
   
};

module.exports.filterBranch = (clientId,data,next,callback) =>{
    try{
        Branch.find({ $and: [{ clientId: clientId }, data] }).exec(function (
          err,
          data
        ) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
}