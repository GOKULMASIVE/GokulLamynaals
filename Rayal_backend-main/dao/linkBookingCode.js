const linkBookingCode = require("../Model/linkBookingCode");
const company = require("../Model/company");
const { bookingCode } = require("../Model/bookingCode");

module.exports.postLinkBookingCode = (clientId, receivedData, next,callback) => {
  try{
    let data = new linkBookingCode(receivedData);
    data["clientId"] = clientId;
    console.log("Data ", data);
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

module.exports.getLinkBookingCode = (clientId, next,callback) => {
  try{
    linkBookingCode
      .find({ clientId: clientId })
      .populate([
        { path: "companyId", model: company },
        { path: "bookingCodeId", model: bookingCode },
      ])
      .exec(function (err, data) {
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

module.exports.putLinkbookingCode = (id, receivedData,next, callback) => {
  try{
     linkBookingCode.findByIdAndUpdate(
       id,
       receivedData,
       function (err, response) {
         if (err) {
           callback(err);
         } else {
           callback(null, response);
         }
       }
     );
  }catch(err){
    next(err);
  }
 
};

module.exports.deleteLinkBookingCode = (id,next, callback) => {
  try{
    linkBookingCode.findByIdAndDelete(id, function (err, response) {
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

module.exports.filterLinkBookingCode = (clientId, data, next,callback) => {
  try{
    linkBookingCode
      .find({ $and: [{ clientId: clientId }, data] })
      .populate([
        { path: "companyId", model: company },
        { path: "bookingCodeId", model: bookingCode },
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
  
};
