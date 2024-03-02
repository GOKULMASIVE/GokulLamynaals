const { bookingCode, SubBookingCode } = require("../Model/bookingCode");

module.exports.postBooking = (clientId, receivedData,next, callback) => {
  try{
      let data = new bookingCode(receivedData);
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

module.exports.getBooking = (clientId, isAscending, receivedData, next,callback) => {
  try{
       bookingCode
         .find({ clientId: clientId }, function (err, data) {
           if (err) {
             callback(err);
           } else {
             callback(null, data);
           }
         })
         .sort(isAscending ? { bookingCode: 1 } : {});
  }catch(err){
      next(err);
  }
 
};

module.exports.putBooking = async (id, receivedData,next, callback) => {
  try {
    if (receivedData.isEnabled === false) {
      const subBookingCode = await SubBookingCode.find({ bookingCodeId: id });
      const allSubBookingCode = subBookingCode.every(
        (subBookingCode) => !subBookingCode.isEnabled
      );
      if (allSubBookingCode) {
        const response = await bookingCode.findByIdAndUpdate(
          { _id: id },
          receivedData
        );
        console.log("BookingCode updated successfully");
        callback(null, response);
      } else {
        console.log("Not all BookingCode are disabled");
        callback(new Error("Need to disable All Sub Booking Code"));
      }
    } else {
      bookingCode.findByIdAndUpdate(
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
    }
  } catch (error) {
    // console.error("Error updating bookingCode : ", error);
    next(error);
  }
};

module.exports.deleteBooking = async (id,next, callback) => {
  try{
    const checkSubBookingCode = await SubBookingCode.find({
      bookingCodeId: id,
    });
    // console.log(checkSubBookingCode);
    if (checkSubBookingCode.length === 0) {
      bookingCode.findByIdAndDelete({ _id: id }, function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
    } else {
      console.log("Check All the SubBookingCode are deleted");
      callback(new Error("Check All the SubBookingCode are deleted"));
    }
  }catch(err){
    next(err);
  }
  
};

module.exports.filterBookingCode = (clientId, data,next, callback) => {
  //console.log("Filter booking Code",data,clientId);
  try{
    bookingCode
      .find({ $and: [{ clientId: clientId }, data] })
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

// Changes by Somesh
module.exports.createSubBookingCode = (clientId, receivedData, next,callback) => {
  try{
    let data = new SubBookingCode(receivedData);
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

module.exports.getSubBookingCode = (clientId, isAscending, next,callback) => {

  try{
    let sortData = {};
    if (isAscending === "combineData") {
      sortData = { bookingCode: isAscending ? 1 : 0 };
    } else {
      sortData = { subBookingCode: isAscending ? 1 : 0 };
    }
    SubBookingCode.aggregate([
      {
        $match: {
          clientId: clientId,
        },
      },
      {
        $lookup: {
          from: "bookingCode",
          let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$bookingCodeId"] } } },
            {
              $project: {
                _id: 0,
                bookingCode: 1,
              },
            },
          ],
          as: "BookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$BookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          subBookingCode: { $first: "$subBookingCode" },
          bookingCodeId: { $first: "$bookingCodeId" },
          remarks: { $first: "$remarks" },
          isEnabled: { $first: "$isEnabled" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          bookingCode: { $first: "$BookingCodeData.bookingCode" },
          cc: { $first: "$cc" },
          // Added by gokul
          email: { $first: "$email" },
          mobile: { $first: "$mobile" },
          password: { $first: "$password" },
        },
      },
      {
        $project: {
          _id: 1,
          subBookingCode: 1,
          bookingCodeId: 1,
          bookingCode: 1,
          remarks: 1,
          isEnabled: 1,
          createdAt: 1,
          updatedAt: 1,
          cc: 1,
          //   Added by gokul
          email: 1,
          mobile: 1,
          password: 1,
        },
      },
    ])
      .sort(sortData)
      .exec(function (err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null, response);
        }
      }); //sort added by gokul...
  }catch(err){
      next(err);
  }
  
};

module.exports.getActiveBookingCode = (next,callback) => {
  try{
       bookingCode.find(
         { isEnabled: true },
         "_id bookingCode",
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
module.exports.putSubBookingCode = (id, receivedData, next,callback) => {
  try{
       SubBookingCode.findByIdAndUpdate(
         { _id: id },
         { $set: receivedData },
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
module.exports.deleteSubBookingCode = (id,next, callback) => {
  try{
      SubBookingCode.findByIdAndDelete(id, function (err, response) {
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

module.exports.filterSubBookingCode = (clientId, data, next,callback) => {
  try{
    const isEnabled = data.isEnabled === "true" ? true : false;
    SubBookingCode.aggregate(
      [
        {
          $match: {
            clientId: clientId,
            isEnabled: isEnabled,
          },
        },
        {
          $lookup: {
            from: "bookingCode",
            let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$bookingCodeId"] } } },
              { $project: { _id: 0, bookingCode: 1 } },
            ],
            as: "BookingCodeData",
          },
        },
        {
          $unwind: {
            path: "$BookingCodeData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            subBookingCode: { $first: "$subBookingCode" },
            bookingCodeId: { $first: "$bookingCodeId" },
            remarks: { $first: "$remarks" },
            isEnabled: { $first: "$isEnabled" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            bookingCode: { $first: "$BookingCodeData.bookingCode" },
          },
        },
        {
          $project: {
            _id: 1,
            subBookingCode: 1,
            bookingCodeId: 1,
            bookingCode: 1,
            remarks: 1,
            isEnabled: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
      function (err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null, response);
        }
      }
    );
    // SubBookingCode.find({$and:[{clientId:clientId},data]}).exec(function (err, data) {
    //     if (err) {
    //         callback(err)
    //     }
    //     else {
    //         callback(null, data)
    //     }
    // })
  }catch(err){
      next(err);
  }
 };
