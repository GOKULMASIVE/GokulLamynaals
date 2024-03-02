const companyLogin = require("../Model/companyLogin");
const companySchema = require("../Model/company");
const userSchema = require("../Model/user");
const { bookingCode, SubBookingCode } = require("../Model/bookingCode");
const { default: mongoose } = require("mongoose");

module.exports.postCompanyLogin = (clientId, receivedData, next,callback) => {
  try{
    let data = new companyLogin(receivedData);
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

module.exports.verifyLoginId = async (clientId, receivedData, next,callback) => {
  try{
    receivedData["clientId"] = clientId;
    let data = await companyLogin.findOne(receivedData);
    if (data) {
      let error = new Error();
      error.message = "Login id already exist";
      error.name = "CustomError";
      callback(error);
    } else {
      callback(null, {});
    }
  }catch(err){
    next(err);
  }
  
};

module.exports.getCompanyLogin = (clientId, next,callback) => {
  //   companyLogin
  //     .find({ clientId: clientId })
  //     .populate([
  //       { path: "companyId", model: companySchema },
  //       { path: "userId", model: userSchema },
  //       { path: "bookingCodeId", model: bookingCode },
  //       { path: "subBookingCodeId", model: SubBookingCode },
  //     ])
  try{
    //   Changes by Arun
    let matchQuery = { clientId: clientId };
    companyLogin
      .aggregate([
        {
          $match: matchQuery,
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
            companyId: 1,
            isEnabled: 1,
            password: 1,
            url: 1,
            userIdNumber: "$userIdNumber",
            companyId: "$CompanyData",
            userId: { $ifNull: ["$UserData", { name: "$userId" }] },
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

module.exports.putCompanyLogin = (id, receivedData, next,callback) => {
  try{
    companyLogin.findByIdAndUpdate(id, receivedData, function (err, response) {
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

module.exports.deleteCompanyLogin = (id, next,callback) => {
  try{
    companyLogin.findByIdAndDelete(id, function (err, response) {
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

module.exports.searchCompanyLogin = (clientId, receivedData, next,callback) => {
  //   companyLogin
  //     .find({ $and: [{ clientId: clientId }, receivedData] })
  //     .populate([
  //       { path: "companyId", model: companySchema },
  //       { path: "userId", model: userSchema },
  //       { path: "bookingCodeId", model: bookingCode },
  //       { path: "subBookingCodeId", model: SubBookingCode },
  //     ])

  try{
    //   Changes by Arun
    // matchData added by gokul...
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

    if (receivedData.userId) {
      matchData["userId"] = receivedData.userId;
    }

    // Changes by Arun
    if (receivedData.requestType == "ALL") {
      matchData["userId"] = "All";
    }
    if (receivedData.requestType == "ADMIN") {
      matchData["userId"] = "Admin";
    }
    if (receivedData.requestType == "ALL_USER_ID") {
      matchData["$and"] = [
        { userId: { $ne: "Admin" } },
        { userId: { $ne: "All" } },
      ];
    }
    if (receivedData.requestType == "USER_ID") {
      matchData["userId"] = receivedData.userId;
    }
    if (receivedData.requestType == "OTHER_ID") {
      matchData["userId"] = { $ne: receivedData.userId };
    }
    console.log("matchData ", matchData);

    companyLogin
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
            remarks: 1,
            // companyId: 1,
            isEnabled: 1,
            password: 1,
            url: 1,
            userIdNumber: 1,
            companyId: "$CompanyData",

            userId: { $ifNull: ["$UserData", { name: "$userId" }] },
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
