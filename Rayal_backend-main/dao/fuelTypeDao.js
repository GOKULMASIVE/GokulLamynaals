const FuelType = require("../Model/fuelType");

module.exports.postFuelType = (clientId, receivedData, next,callback) => {
  try{
    let data = new FuelType(receivedData);
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

module.exports.getFuelType = (clientId, receivedData, next,callback) => {
  try{
     FuelType.find({ clientId: clientId }).exec(function (err, response) {
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

module.exports.putFuelType = (id, receivedData, next,callback) => {
  try{
     FuelType.findByIdAndUpdate(
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
  }catch(err){
    next(err);
  }
 
};

module.exports.filterFuelType = (clientId, data, next,callback) => {
  try{
    FuelType.find({ $and: [{ clientId: clientId }, data] }).exec(function (
      err,
      response
    ) {
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
