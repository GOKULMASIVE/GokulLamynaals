const PayoutCycle = require("../Model/payoutCycle");

module.exports.postPayoutCycle = (clientId, receivedData, next,callback) => {
  try{
    let data = new PayoutCycle(receivedData);
    data["clientId"] = clientId;
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
  
};

module.exports.getPayoutCycle = (clientId, receivedData, next,callback) => {
  try{
    PayoutCycle.find({ clientId: clientId }).exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

module.exports.putPayoutCycle = (id, receivedData, next,callback) => {
  try {
       PayoutCycle.findByIdAndUpdate(
         { _id: id },
         receivedData,
         function (err, data) {
           if (err) {
             callback(err);
           } else {
             callback(null, data);
           }
         }
       );
  } catch (err) {
    next(err);
  }
 
};

module.exports.filterPayoutCycle = (clientId, data,next, callback) => {
  try {
    PayoutCycle.find({ $and: [{ clientId: clientId }, data] }).exec(function (
      err,
      response
    ) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  } catch (err) {
    next(err);
  }
  
};
