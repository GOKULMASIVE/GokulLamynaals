const companyContact = require("../Model/companyContact");
const companySchema = require("../Model/company");
const { bookingCode, SubBookingCode } = require("../Model/bookingCode");
const userSchema=require("../Model/user");
const mongoose=require("mongoose")

module.exports.postCompanyContact = (clientId, receivedData, next,callback) => {
  try{
    let data = new companyContact(receivedData);
    data["clientId"] = clientId;
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
  
};

module.exports.getCompanyContact = (clientId, next,callback) => {
  try{
    companyContact
      .find({ clientId: clientId })
      .populate([
        { path: "companyId", model: companySchema },
        { path: "bookingCodeId", model: bookingCode },
        { path: "subBookingCodeId", model: SubBookingCode },
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

module.exports.putCompanyContact = (id, data, next,callback) => {
  try{
    companyContact.findByIdAndUpdate(id, data, function (error, response) {
      if (error) {
        callback(error);
      } else {
        callback(null, response);
      }
    });
  }catch(err){
    next(err)
  }
  
};

module.exports.deleteCompanyContact = (id, next,callback) => {
  try{
     companyContact.findByIdAndDelete(id, function (error, response) {
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

module.exports.searchCompanyContact = (clientId,receivedData, next,callback) => {
  // companyContact
  //   .find(data)
  //   .populate([
  //     { path: "companyId", model: companySchema },
  //     { path: "bookingCodeId", model: bookingCode },
  //   ])
  //   .exec(function (error, response) {
  //     if (error) {
  //       callback(error);
  //     } else {
  //       callback(null, response);
  //     }
  //   });
try{
  // changes by gokul...
  const matchData = {};

  if (receivedData.companyId) {
    matchData["companyId"] = mongoose.Types.ObjectId(receivedData.companyId);
  }

  if (receivedData.bookingCodeId) {
    matchData["bookingCodeId"] = mongoose.Types.ObjectId(
      receivedData.bookingCodeId
    );
  }
  if (receivedData.subBookingCodeId) {
    matchData["subBookingCodeId"] = mongoose.Types.ObjectId(
      receivedData.subBookingCodeId
    );
  }

  companyContact
    .aggregate([
      {
        $match: {
          clientId: clientId,
          ...matchData,
        },
      },
      {
        $lookup: {
          from: "bookingCode",
          let: { bookingCodeId: "$bookingCodeId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$bookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
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
        $lookup: {
          from: "subBookingCode",
          let: { subBookingCodeId: "$subBookingCodeId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$subBookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                subBookingCode: 1,
              },
            },
          ],
          as: "SubBookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$SubBookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: "$companyId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$companyId"] },
              },
            },
            {
              $project: {
                _id: 1,
                shortName: 1,
              },
            },
          ],
          as: "CompanyData",
        },
      },
      {
        $unwind: {
          path: "$CompanyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          let: {
            userId: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$userId", "All"] },
                    {
                      $eq: ["$userId", "Admin"],
                    },
                  ],
                },
                "$userId",
                { $toObjectId: "$userId" },
              ],
            },
            // { $toObjectId: "$userId" }
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$UserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          bookingCodeId: "$BookingCodeData",
          subBookingCodeId: "$SubBookingCodeData",
          branch: 1,
          Desigination: 1,
          email: 1,
          mobileNumber: 1,
          // remarks: 1,
          // companyId: 1,

          companyId: "$CompanyData",

          userId: "$UserData",
        },
      },
    ])
    .exec(function (err, response) {
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
