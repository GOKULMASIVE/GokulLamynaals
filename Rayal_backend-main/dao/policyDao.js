const policy = require("../Model/policy");
const companySchema = require("../Model/company");
const userSchema = require("../Model/user");
const { Product, SubProduct } = require("../Model/product");
const policyTypeSchema = require("../Model/policyType");
const { bookingCode, SubBookingCode } = require("../Model/bookingCode");
const CommonUtil = require("../shared/common-util");
const CommisionReceivableTransaction = require("../Model/commisionReceivableTransaction");
const UserConfig = require("../Model/userConfig");
const BranchConfig = require("../Model/branchConfig");
const companyLogin = require("../Model/companyLogin");
const ReceivableConfig = require("../Model/receivableConfig");
const FuelType = require("../Model/fuelType");
const mongoose = require("mongoose");
var path = require("path");
const vehicleMake = require("../Model/vehicleMake");

const {
  AWS_POLICY_FILE_DIRECTORY_NAME,
  AWS_OTHER_FILE_DIRECTORY_NAME,
  DOCUMENT_TYPE,
  PAYMENT_MODE,
  USER_TYPE,
} = require("../configuration/constants");
const { exit } = require("process");
const commonUtil = require("../shared/common-util");

module.exports.postPolicy = async (clientId, receivedData, files, next,callback) => {
  try{
     console.log(receivedData);
  let loginId = receivedData.loginId;
  if (loginId) {
    receivedData.loginId = JSON.parse(loginId);
  }
  // console.log("LoginId:",receivedData.loginId);
  let policyFile = files.find((file) => {
    return file.fieldname == AWS_POLICY_FILE_DIRECTORY_NAME;
  });
  let otherFile = files.find((file) => {
    return file.fieldname == AWS_OTHER_FILE_DIRECTORY_NAME;
  });
  let policyFileObj = {};
  let otherFileObj = {};

  if (policyFile) {
    const extenstion = path.extname(policyFile.originalname);
    policyFile.originalname = CommonUtil.getFileName(
      AWS_POLICY_FILE_DIRECTORY_NAME,
      extenstion
    );
    let filename = policyFile.originalname || "";
    await CommonUtil.uploadFileToAWSS3(
      policyFile,
      AWS_POLICY_FILE_DIRECTORY_NAME
    )
      .then((response) => {
        // console.log("response ", response);
        policyFileObj["fileName"] = filename;
        policyFileObj["key"] = response.key;
        policyFileObj["location"] = response.Location;
        receivedData["policyFile"] = policyFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }
  if (otherFile) {
    const extenstion = path.extname(otherFile.originalname);
    otherFile.originalname = CommonUtil.getFileName(
      AWS_OTHER_FILE_DIRECTORY_NAME,
      extenstion
    );
    let filename = otherFile.originalname || "";
    await CommonUtil.uploadFileToAWSS3(otherFile, AWS_OTHER_FILE_DIRECTORY_NAME)
      .then((response) => {
        // console.log("response ", response);
        otherFileObj["fileName"] = filename;
        otherFileObj["key"] = response.key;
        otherFileObj["location"] = response.Location;
        receivedData["otherFile"] = otherFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }

  let data = new policy(receivedData);
  data["clientId"] = clientId;
  await data.save(function (error, response) {
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

// getLoginPortal added by gokul...

module.exports.getLoginPortal = (clientId, userId, companyId, next, callback) => {
  try{
    const matchQuery = {
    clientId: clientId,
  };

  if (companyId) {
    matchQuery["companyId"] = mongoose.Types.ObjectId(companyId);
  }
  companyLogin
    .aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "user",
          let: {
            userId: {
              $cond: [
                {
                  $or: [
                    {
                      $eq: ["$userId", "All"],
                    },
                    {
                      $eq: ["$userId", "Admin"],
                    },
                  ],
                },
                "$userId",
                {
                  $toObjectId: "$userId",
                },
              ],
            },
          },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$userId"] } },
            },
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
          _id: 1,
          loginId: "$userIdNumber",
          companyId: 1,
          userId: 1,
          userName: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ["$userId", "All"],
                  },
                  {
                    $eq: ["$userId", "Admin"],
                  },
                ],
              },
              "$userId",
              "$UserData.name",
            ],
          },
          loginPortal: {
            $concat: [
              "$userIdNumber",
              "-",
              {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$userId", "All"],
                      },
                      {
                        $eq: ["$userId", "Admin"],
                      },
                    ],
                  },
                  "$userId",
                  "$UserData.name",
                ],
              },
            ],
          },
        },
      },
    ])
    .sort({ loginId: 1 }) //sort is added by gokul..
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

// Changes by Arun
module.exports.createPolicyMapping = async (receivedData, files, next, callback) => {
  try{
    let policyNumber = receivedData.policyNumber;
  let policyDoc = await policy.findOne({ policyNumber: policyNumber });
  let policyTableMapping = {
    userId: policyDoc.userId,
    issueDate: policyDoc.issueDate,
    companyId: policyDoc.companyId,
    policyNumber: policyDoc.policyNumber,
    totalPremium: policyDoc.totalPremium,
    paymentMode: policyDoc.paymentMode,
    chequeNumber: policyDoc.chequeNumber,
    bankName: policyDoc.bankName,
    chequeDate: policyDoc.chequeDate,
  };
  let policyFile =
    files &&
    files.find((file) => {
      return file.fieldname == AWS_POLICY_FILE_DIRECTORY_NAME;
    });
  let otherFile =
    files &&
    files.find((file) => {
      return file.fieldname == AWS_OTHER_FILE_DIRECTORY_NAME;
    });
  let policyFileObj = {};
  let otherFileObj = {};
  let updateObj = {
    policyMapping: receivedData,
    policyTableMapping: policyTableMapping,
    policyMappingStatus: "Mapping",
  };
  if (policyFile) {
    const extenstion = path.extname(policyFile.originalname);
    policyFile.originalname = CommonUtil.getFileName(
      AWS_POLICY_FILE_DIRECTORY_NAME,
      extenstion
    );
    let filename = policyFile.originalname || "";
    await CommonUtil.uploadFileToAWSS3(
      policyFile,
      AWS_POLICY_FILE_DIRECTORY_NAME
    )
      .then((response) => {
        // console.log("response ", response);
        policyFileObj["fileName"] = filename;
        policyFileObj["key"] = response.key;
        policyFileObj["location"] = response.Location;
        updateObj["policyMappingFile"] = policyFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }
  if (otherFile) {
    const extenstion = path.extname(otherFile.originalname);
    otherFile.originalname = CommonUtil.getFileName(
      AWS_OTHER_FILE_DIRECTORY_NAME,
      extenstion
    );
    let filename = otherFile.originalname || "";
    await CommonUtil.uploadFileToAWSS3(otherFile, AWS_OTHER_FILE_DIRECTORY_NAME)
      .then((response) => {
        // console.log("response ", response);
        otherFileObj["fileName"] = filename;
        otherFileObj["key"] = response.key;
        otherFileObj["location"] = response.Location;
        updateObj["policyMappingOtherFile"] = otherFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }

  policy.findOneAndUpdate(
    { policyNumber: policyNumber },
    { $set: updateObj },
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
  
};

// Changes by Arun
module.exports.updatePolicyMapping = async (requestData,next,callback) => {
  try{
      let action = requestData.action;
  let policyId = requestData.policyId;
  let remark = requestData.remark;
  if (action == "Mapping Done") {
    let findDoc = await policy.findById(policyId);
    let policyMappingObj = findDoc.policyMapping;
    let updateSetDoc = {};
    updateSetDoc["userId"] = policyMappingObj.userId;
    updateSetDoc["issueDate"] = policyMappingObj.issueDate;
    updateSetDoc["companyId"] = policyMappingObj.companyId;
    updateSetDoc["totalPremium"] = policyMappingObj.totalPremium;
    updateSetDoc["paymentMode"] = policyMappingObj.paymentMode;
    updateSetDoc["chequeNumber"] = policyMappingObj.chequeNumber;
    updateSetDoc["bankName"] = policyMappingObj.bankName;
    updateSetDoc["chequeDate"] = policyMappingObj.chequeDate;
    updateSetDoc["policyMappingStatus"] = "Mapping Done";
    updateSetDoc["status"] = "approvePending";
    updateSetDoc["policyMapping.remark"] = remark;
    policy.findByIdAndUpdate(
      policyId,
      { $set: updateSetDoc, $unset: { userPayable: 1 } },
      function (error, response) {
        if (error) {
          callback(error);
        } else {
          callback(null, response);
        }
      }
    );
  } else {
    policy.findByIdAndUpdate(
      policyId,
      {
        $set: {
          "policyMapping.remark": remark,
          policyMappingStatus: "Rejected",
        },
      },
      function (error, response) {
        if (error) {
          callback(error);
        } else {
          callback(null, response);
        }
      }
    );
  }

  }catch(err){
    next(err);
  }
  };

// Changes by Arun
module.exports.saveWallet = (receivedData,next,callback) => {
  try{
      receivedData.userPayable = {};
  receivedData["documentType"] = DOCUMENT_TYPE.WALLET;
  receivedData["userPayable"]["Total"] = receivedData.amount;
  receivedData["userPayable"]["createdBy"] = receivedData.createdBy;
  receivedData["userPayable"]["createdAt"] = new Date();
  receivedData["userPayable"]["updatedAt"] = new Date();
  receivedData["issueDate"] = receivedData.transactionDate;
  delete receivedData.createdBy;
  delete receivedData.Total;
  let data = new policy(receivedData);
  // console.log("data ", data);

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

// Changes by Arun
module.exports.saveUserConfig = async (receivedData,next,callback) => {
  try{
    let docs = [];
  console.log("UserLog:", receivedData);
  const userIdData = receivedData.userId;
  const productData = receivedData.product;
  const bookingCodeData = receivedData.bookingCode;
  const policyTypeIdData = receivedData.policyTypeId;
  const objSummary = [
    { key: "product", size: productData.length, value: productData },
    {
      key: "bookingCode",
      size: bookingCodeData.length,
      value: bookingCodeData,
    },
    {
      key: "policyType",
      size: policyTypeIdData.length,
      value: policyTypeIdData,
    },
  ];
  objSummary.sort((a, b) => a.size - b.size);
  await Promise.all(
    userIdData.map(async (userId) => {
      let firstSortObj = objSummary[0];
      let secondSortObj = objSummary[1];
      let thirdSortObj = objSummary[2];
      await Promise.all(
        firstSortObj.value.map(async (firstObjData) => {
          await Promise.all(
            secondSortObj.value.map(async (secondObjData) => {
              await Promise.all(
                thirdSortObj.value.map(async (thirdObjData) => {
                  let tempObj = { ...receivedData };
                  tempObj.userId = userId;
                  await commonUtil
                    .reframeConfigDocument(firstSortObj, firstObjData, tempObj)
                    .then(async (firstObjRes) => {
                      return firstObjRes;
                    })
                    .then(async (firstObjRes) => {
                      return await commonUtil.reframeConfigDocument(
                        secondSortObj,
                        secondObjData,
                        firstObjRes
                      );
                    })
                    .then((secondObjRes) => {
                      return commonUtil.reframeConfigDocument(
                        thirdSortObj,
                        thirdObjData,
                        secondObjRes
                      );
                    })
                    .then((thirdObjRes) => {
                      docs.push(new UserConfig(thirdObjRes));
                    });
                })
              );
            })
          );
        })
      );
    })
  );
  console.log("length ", docs.length);
  UserConfig.insertMany(docs, function (error, response) {
    if (error) {
      callback(error);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    // console.log(err);
    // callback(err);
    next(err);
  }
  
};

// Changes by Arun
module.exports.updateUserConfig = async (receivedData,next,callback) => {

  try{
    // console.log("receivedData ", receivedData);
  let id = receivedData?.filterId;
  UserConfig.findByIdAndUpdate(id, receivedData, function (error, response) {
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

// Changes by Arun
module.exports.updateBranchConfig = async (receivedData,next,callback) => {
  try{
      // console.log("receivedData ", receivedData);
  let id = receivedData?.filterId;
  BranchConfig.findByIdAndUpdate(id, receivedData, function (error, response) {
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

// Changes by Arun
module.exports.updateReceivableConfig = async (receivedData,next,callback) => {
  try{
     // console.log("receivedData ", receivedData);
  let id = receivedData?.filterId;
  ReceivableConfig.findByIdAndUpdate(
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
 
};

// Changes by Arun
module.exports.saveBranchConfig = async (receivedData,next,callback) => {
  try{
        let docs = [];
  const branchManagerIdData = receivedData.branchManagerId;
  // console.log("branchManagerIdData ", branchManagerIdData);
  const productData = receivedData.product;
  // console.log("productData ", productData);
  const bookingCodeData = receivedData.bookingCode;
  // console.log("bookingCodeData ", bookingCodeData);
  const policyTypeIdData = receivedData.policyTypeId;
  // console.log("policyTypeIdData ", policyTypeIdData);
  // console.log("data ", data);
  const objSummary = [
    { key: "product", size: productData.length, value: productData },
    {
      key: "bookingCode",
      size: bookingCodeData.length,
      value: bookingCodeData,
    },
    {
      key: "policyType",
      size: policyTypeIdData.length,
      value: policyTypeIdData,
    },
  ];
  objSummary.sort((a, b) => a.size - b.size);

  await Promise.all(
    branchManagerIdData.map(async (branchManagerId) => {
      let firstSortObj = objSummary[0];
      let secondSortObj = objSummary[1];
      let thirdSortObj = objSummary[2];
      await Promise.all(
        firstSortObj.value.map(async (firstObjData) => {
          await Promise.all(
            secondSortObj.value.map(async (secondObjData) => {
              await Promise.all(
                thirdSortObj.value.map(async (thirdObjData) => {
                  let tempObj = { ...receivedData };
                  tempObj.branchManagerId = branchManagerId;
                  await commonUtil
                    .reframeConfigDocument(firstSortObj, firstObjData, tempObj)
                    .then(async (firstObjRes) => {
                      return firstObjRes;
                    })
                    .then(async (firstObjRes) => {
                      return await commonUtil.reframeConfigDocument(
                        secondSortObj,
                        secondObjData,
                        firstObjRes
                      );
                    })
                    .then((secondObjRes) => {
                      return commonUtil.reframeConfigDocument(
                        thirdSortObj,
                        thirdObjData,
                        secondObjRes
                      );
                    })
                    .then((thirdObjRes) => {
                      docs.push(new BranchConfig(thirdObjRes));
                    });
                })
              );
            })
          );
        })
      );
    })
  );
  console.log("length ", docs.length);
  BranchConfig.insertMany(docs, function (error, response) {
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

// Changes by Arun
module.exports.saveReceivableConfig = async (receivedData,next,callback) => {
  try{
      let docs = [];
  const productData = receivedData.product;
  // console.log("productData ", productData);
  const bookingCodeData = receivedData.bookingCode;
  // console.log("bookingCodeData ", bookingCodeData);
  const policyTypeIdData = receivedData.policyTypeId;
  // console.log("policyTypeIdData ", policyTypeIdData);
  const objSummary = [
    { key: "product", size: productData.length, value: productData },
    {
      key: "bookingCode",
      size: bookingCodeData.length,
      value: bookingCodeData,
    },
    {
      key: "policyType",
      size: policyTypeIdData.length,
      value: policyTypeIdData,
    },
  ];
  objSummary.sort((a, b) => a.size - b.size);
  let firstSortObj = objSummary[0];
  let secondSortObj = objSummary[1];
  let thirdSortObj = objSummary[2];
  await Promise.all(
    firstSortObj.value.map(async (firstObjData) => {
      await Promise.all(
        secondSortObj.value.map(async (secondObjData) => {
          await Promise.all(
            thirdSortObj.value.map(async (thirdObjData) => {
              let tempObj = { ...receivedData };
              await commonUtil
                .reframeConfigDocument(firstSortObj, firstObjData, tempObj)
                .then(async (firstObjRes) => {
                  return firstObjRes;
                })
                .then(async (firstObjRes) => {
                  return await commonUtil.reframeConfigDocument(
                    secondSortObj,
                    secondObjData,
                    firstObjRes
                  );
                })
                .then((secondObjRes) => {
                  return commonUtil.reframeConfigDocument(
                    thirdSortObj,
                    thirdObjData,
                    secondObjRes
                  );
                })
                .then((thirdObjRes) => {
                  docs.push(new ReceivableConfig(thirdObjRes));
                });
            })
          );
        })
      );
    })
  );
  ReceivableConfig.insertMany(docs, function (error, response) {
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

// Changes by Arun
module.exports.disableUserConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {
  try{
      let setQuery = { isEnabled: false, disableDate: new Date(disableDate) };
  if (requestType && requestType == "false") {
    setQuery = { isEnabled: true, enableDate: new Date() };
  }
  UserConfig.findByIdAndUpdate(id, {
    $set: setQuery,
  }).exec(function (error, response) {
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

// Changes by Arun
module.exports.disableBranchConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {

  try{
      let setQuery = { isEnabled: false, disableDate: new Date(disableDate) };
  if (requestType && requestType == "false") {
    setQuery = { isEnabled: true, enableDate: new Date() };
  }
  BranchConfig.findByIdAndUpdate(id, {
    $set: setQuery,
  }).exec(function (error, response) {
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

// Changes by Arun
module.exports.disableReceivableConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {
  try{
       let setQuery = { isEnabled: false, disableDate: new Date(disableDate) };
  if (requestType && requestType == "false") {
    setQuery = { isEnabled: true, enableDate: new Date() };
  }
  ReceivableConfig.findByIdAndUpdate(id, {
    $set: setQuery,
  }).exec(function (error, response) {
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

// Changes by Arun
module.exports.getBranchConfigById = (id,next,callback) => {
  try{
      const branchConfigObjectId = mongoose.Types.ObjectId(id);
  BranchConfig.aggregate([
    {
      $match: { _id: branchConfigObjectId },
    },
    {
      $lookup: {
        from: "user",
        let: { userId: { $toObjectId: "$branchManagerId" } },
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
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: { id: "$UserData._id", value: "$UserData.name" } },
        product: {
          $first: { id: "$ProductData._id", value: "$ProductData.product" },
        },
        subProduct: {
          $first: {
            id: "$SubProductData._id",
            value: "$SubProductData.subProduct",
          },
        },
        bookingCode: {
          $first: {
            id: "$BookingCodeData._id",
            value: "$BookingCodeData.bookingCode",
          },
        },
        subBookingCode: {
          $first: {
            id: "$SubBookingCodeData._id",
            value: "$SubBookingCodeData.subBookingCode",
          },
        },
        policyType: {
          $first: {
            id: "$PolicyTypeData._id",
            value: "$PolicyTypeData.policyType",
          },
        },
        company: {
          $first: { id: "$CompanyData._id", value: "$CompanyData.shortName" },
        },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        CC: { $first: "$CC" },
        make: { $first: "$make" },
        year: { $first: "$year" },
        PACover: { $first: "$PACover" },
        locationId: {
          $push: "$CompanyRTOData._id",
        },
      },
    },
  ]).exec(function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data[0]);
    }
  });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getBranchConfigByBranchManagerId = (
  id,
  requestType,
  next,
  callback
) => {
  try{
      let matchDoc = {};
  if (requestType == "ACTIVE") {
    matchDoc["isEnabled"] = true;
  } else {
    matchDoc["isEnabled"] = false;
  }

  if (id != "undefined") {
    matchDoc["branchManagerId"] = id;
  }

  BranchConfig.aggregate([
    {
      $match: matchDoc,
    },
    {
      $lookup: {
        from: "user",
        let: { userId: { $toObjectId: "$branchManagerId" } },
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
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$UserData.name" },
        product: { $first: "$ProductData.product" },
        subProduct: { $first: "$SubProductData.subProduct" },
        bookingCode: { $first: "$BookingCodeData.bookingCode" },
        subBookingCode: { $first: "$SubBookingCodeData.subBookingCode" },
        policyType: { $first: "$PolicyTypeData.policyType" },
        company: { $first: "$CompanyData.shortName" },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        CC: { $first: "$CC" },
        PACover: { $first: "$PACover" },
        isEnabled: { $first: "$isEnabled" },
        activeDate: { $first: "$activeDate" },
        disableDate: { $first: "$disableDate" },
        location: { $push: "$CompanyRTOData.location" },
      },
    },
  ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.getReceivableConfigById = (id,next,callback) => {
  try{
      const receivableConfigObjectId = mongoose.Types.ObjectId(id);

  ReceivableConfig.aggregate([
    {
      $match: { _id: receivableConfigObjectId },
    },
    {
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        product: {
          $first: { id: "$ProductData._id", value: "$ProductData.product" },
        },
        subProduct: {
          $first: {
            id: "$SubProductData._id",
            value: "$SubProductData.subProduct",
          },
        },
        bookingCode: {
          $first: {
            id: "$BookingCodeData._id",
            value: "$BookingCodeData.bookingCode",
          },
        },
        subBookingCode: {
          $first: {
            id: "$SubBookingCodeData._id",
            value: "$SubBookingCodeData.subBookingCode",
          },
        },
        policyType: {
          $first: {
            id: "$PolicyTypeData._id",
            value: "$PolicyTypeData.policyType",
          },
        },
        company: {
          $first: { id: "$CompanyData._id", value: "$CompanyData.shortName" },
        },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        CC: { $first: "$CC" },
        make: { $first: "$make" },
        year: { $first: "$year" },
        PACover: { $first: "$PACover" },
        locationId: {
          $push: "$CompanyRTOData._id",
        },
      },
    },
  ]).exec(function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data[0]);
    }
  });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getReceivableConfigByCompanyId = (
  id,
  bookingCodeId,
  subBookingCodeId,
  requestType,
  next,
  callback
) => {
  try{
    let matchDoc = {};
  if (requestType == "ACTIVE") {
    matchDoc["isEnabled"] = true;
  } else {
    matchDoc["isEnabled"] = false;
  }

  if (id != "undefined") {
    matchDoc["companyId"] = id;
  }

  // added by gokul...
  if (bookingCodeId) {
    matchDoc["bookingCodeId"] = bookingCodeId;
  }

  if (subBookingCodeId) {
    matchDoc["subBookingCodeId"] = subBookingCodeId;
  }

  ReceivableConfig.aggregate([
    {
      $match: matchDoc,
    },
    {
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        product: { $first: "$ProductData.product" },
        subProduct: { $first: "$SubProductData.subProduct" },
        bookingCode: { $first: "$BookingCodeData.bookingCode" },
        subBookingCode: { $first: "$SubBookingCodeData.subBookingCode" },
        policyType: { $first: "$PolicyTypeData.policyType" },
        company: { $first: "$CompanyData.shortName" },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        CC: { $first: "$CC" },
        PACover: { $first: "$PACover" },
        isEnabled: { $first: "$isEnabled" },
        activeDate: { $first: "$activeDate" },
        disableDate: { $first: "$disableDate" },
        location: { $push: "$CompanyRTOData.location" },
      },
    },
  ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.deleteUserConfigById = (id,next,callback) => {
  try{
    UserConfig.findByIdAndDelete(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, {});
    }
  });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.deleteBranchConfigById = (id,next,callback) => {
  try{
     BranchConfig.findByIdAndDelete(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, {});
    }
  });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.deleteReceivableConfigById = (id,next,callback) => {
  try{
       ReceivableConfig.findByIdAndDelete(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, {});
    }
  });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.getUserConfigById = (id,next,callback) => {
  try{
     const userConfigObjectId = mongoose.Types.ObjectId(id);
  UserConfig.aggregate([
    {
      $match: {
        _id: userConfigObjectId,
      },
    },
    {
      $lookup: {
        from: "user",
        let: { userId: { $toObjectId: "$userId" } },
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
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              _id: 1,
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: { id: "$UserData._id", value: "$UserData.name" } },
        product: {
          $first: { id: "$ProductData._id", value: "$ProductData.product" },
        },
        subProduct: {
          $first: {
            id: "$SubProductData._id",
            value: "$SubProductData.subProduct",
          },
        },
        bookingCode: {
          $first: {
            id: "$BookingCodeData._id",
            value: "$BookingCodeData.bookingCode",
          },
        },
        subBookingCode: {
          $first: {
            id: "$SubBookingCodeData._id",
            value: "$SubBookingCodeData.subBookingCode",
          },
        },
        policyType: {
          $first: {
            id: "$PolicyTypeData._id",
            value: "$PolicyTypeData.policyType",
          },
        },
        company: {
          $first: { id: "$CompanyData._id", value: "$CompanyData.shortName" },
        },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        year: { $first: "$year" },
        make: { $first: "$make" },
        CC: { $first: "$CC" },
        PACover: { $first: "$PACover" },
        locationId: {
          $push: "$CompanyRTOData._id",
        },
      },
    },
    // {
    //   $project: {
    //     user: "$UserData.name",
    //     product: "$ProductData.product",
    //     subProduct: "$SubProductData.subProduct",
    //     bookingCode: "$BookingCodeData.bookingCode",
    //     subBookingCode: "$SubBookingCodeData.subBookingCode",
    //     policyType: "$PolicyTypeData.policyType",
    //     company: "$CompanyData.shortName",
    //     TP: 1,
    //     OD: 1,
    //     Net: 1,
    //     GVW: 1,
    //     CC: 1,
    //     PACover: 1,
    //     location: "$CompanyRTOData.location",
    //   },
    // },
  ]).exec(function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data[0]);
    }
  });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.getUserConfigByUserId = (
  id,
  companyId,
  bookingCodeId,
  subBookingCodeId,
  requestType,
  loginUserId,
  userType,
  next,
  callback
) => {
  try{
      console.log(requestType);
  let matchDoc = {};
  if (requestType == "ACTIVE") {
    matchDoc["isEnabled"] = true;
  } else {
    matchDoc["isEnabled"] = false;
  }
  if (id != "undefined") {
    matchDoc["userId"] = id;
  }
  // added by gokul....
  if (companyId) {
    matchDoc["companyId"] = companyId;
  }

  if (bookingCodeId) {
    matchDoc["bookingCodeId"] = bookingCodeId;
  }

  if (subBookingCodeId) {
    matchDoc["subBookingCodeId"] = subBookingCodeId;
  }

  let userMatchQuery = [
    {
      $unwind: {
        path: "$UserData",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (userType == USER_TYPE.BRANCH_MANAGER) {
    userMatchQuery.push({ $match: { "UserData.branchManager": loginUserId } });
    // userMatchQuery["$match"] = { "UserData.branchManager": loginUserId };
  }
  // console.log("userMatchQuery ", userMatchQuery);
  UserConfig.aggregate([
    {
      $match: matchDoc,
    },
    {
      $lookup: {
        from: "user",
        let: { userId: { $toObjectId: "$userId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              branchManager: 1,
            },
          },
        ],
        as: "UserData",
      },
    },
    // {
    //   $unwind: {
    //     path: "$UserData",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    ...userMatchQuery.map((obj) => Object.assign({}, obj)),
    // userMatchQuery,
    {
      $lookup: {
        from: "product",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
          {
            $project: {
              _id: 1,
              product: 1,
            },
          },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "subProduct",
        let: { subProductId: { $toObjectId: "$subProductId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
          {
            $project: {
              _id: 1,
              subProduct: 1,
            },
          },
        ],
        as: "SubProductData",
      },
    },
    {
      $unwind: {
        path: "$SubProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
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
        from: "policyType",
        let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$policyTypeId"] },
            },
          },
          {
            $project: {
              _id: 1,
              policyType: 1,
            },
          },
        ],
        as: "PolicyTypeData",
      },
    },
    {
      $unwind: {
        path: "$PolicyTypeData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$companyId" } },
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
      $unwind: {
        path: "$locationId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companyRTO",
        let: { locationId: { $toObjectId: "$locationId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$locationId"] },
            },
          },
          {
            $project: {
              location: 1,
            },
          },
        ],
        as: "CompanyRTOData",
      },
    },
    {
      $unwind: {
        path: "$CompanyRTOData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$UserData.name" },
        product: { $first: "$ProductData.product" },
        subProduct: { $first: "$SubProductData.subProduct" },
        bookingCode: { $first: "$BookingCodeData.bookingCode" },
        subBookingCode: { $first: "$SubBookingCodeData.subBookingCode" },
        policyType: { $first: "$PolicyTypeData.policyType" },
        company: { $first: "$CompanyData.shortName" },
        TP: { $first: "$TP" },
        OD: { $first: "$OD" },
        Net: { $first: "$Net" },
        GVW: { $first: "$GVW" },
        CC: { $first: "$CC" },
        PACover: { $first: "$PACover" },
        isEnabled: { $first: "$isEnabled" },
        activeDate: { $first: "$activeDate" },
        disableDate: { $first: "$disableDate" },
        location: { $push: "$CompanyRTOData.location" },
      },
    },
  ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.saveCompanyWallet = (receivedData,next,callback) => {
  try{
      receivedData.commisionRecievable = {};
  receivedData["documentType"] = DOCUMENT_TYPE.COMPANY_WALLET;
  receivedData["paymentMode"] = PAYMENT_MODE.COMPANY_RECEIVED;
  receivedData["commisionRecievable"]["Total"] = receivedData.amount;
  receivedData["commisionRecievable"]["createdBy"] = receivedData.createdBy;
  receivedData["commisionRecievable"]["createdAt"] = new Date();
  receivedData["commisionRecievable"]["updatedAt"] = new Date();
  receivedData["issueDate"] = receivedData.transactionDate;
  delete receivedData.createdBy;
  delete receivedData.Total;
  let data = new policy(receivedData);

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

module.exports.getComissionReceivableAmount = (id,next,callback) => {
  try{
      CommisionReceivableTransaction.aggregate([
    {
      $match: {
        policyId: id,
      },
    },
    {
      $lookup: {
        from: "policy",
        let: { policyId: { $toObjectId: "$policyId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$policyId"] } } },
          { $project: { _id: 0, policyNumber: 1 } },
        ],
        as: "PolicyData",
      },
    },
    {
      $unwind: {
        path: "$PolicyData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        receivedAmount: 1,
        bankName: 1,
        entryDate: 1,
        remarks: 1,
        policyNumber: "$PolicyData.policyNumber",
      },
    },
  ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.getPolicyById = (id,next,callback) => {
  try{
      policy
    .findById(id)
    .populate([
      { path: "companyId", model: companySchema },
      { path: "userId", model: userSchema },
      { path: "productId", model: Product },
      { path: "subProductId", model: SubProduct },
      { path: "policyTypeId", model: policyTypeSchema },
      { path: "bookingCodeId", model: bookingCode },
      { path: "subBookingCodeId", model: SubBookingCode },
      { path: "fuelType", model: FuelType },
      { path: "make", model: vehicleMake },
    ])
    .exec(async function (error, data) {
      if (error) {
        callback(error);
      } else {
        callback(null, data);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getPolicyFileById = (id,next,callback) => {
  try{
      policy
    .findById(id, "policyFile otherFile")
    .exec(async function (error, data) {
      if (error) {
        callback(error);
      } else {
        // console.log("data ", data);

        if (data?.policyFile && Object.keys(data.policyFile).length > 0) {
          let policyFileObj = data.policyFile;
          let key = policyFileObj.key;
          await CommonUtil.downloadFileFromAWSS3ByKey(key)
            .then((downloadURL) => {
              // console.log("downloadURL ", downloadURL);
              policyFileObj["downloadURL"] = downloadURL;
            })
            .catch((error) => {
              console.error("downloadFileFromAWSS3ByKey error from ", error);
            });
        }
        if (data?.otherFile && Object.keys(data.otherFile).length > 0) {
          let otherFileObj = data.otherFile;
          let key = otherFileObj.key;
          await CommonUtil.downloadFileFromAWSS3ByKey(key)
            .then((downloadURL) => {
              // console.log("downloadURL ", downloadURL);
              otherFileObj["downloadURL"] = downloadURL;
            })
            .catch((error) => {
              console.error("downloadFileFromAWSS3ByKey error ", error);
            });
        }

        callback(null, data);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.verifyPolicyNumber = async (policyNumber,next,callback) => {
  try{
      let data = await policy
    .findOne({ policyNumber: policyNumber })
    .populate("userId", "name");
  if (data) {
    let error = new Error();
    error.message = "Policy Number already exist in " + data.userId?.name;
    error.name = "CustomError";
    callback(error);
  } else {
    callback(null, {});
  }

  }catch(err){
    next(err);
  }
};

// Changes by Arun
module.exports.readPolicyFileByPolicyId = async (policyId,next,callback) => {
  try{
     let data = await policy.findById(policyId, "policyFile.key");
  if (data) {
    let error = new Error();
    error.message = "Policy Number already exist in " + data;
    error.name = "CustomError";
    const key = data?.policyFile?.key || "";
    await CommonUtil.downloadBufferFormatFromAWSS3ByKey(key)
      .then(async (bufferData) => {
        // console.log("bufferData ", bufferData);
        let response = await CommonUtil.readPolicyPDFFileBuffer(bufferData);
        callback(null, response);
      })
      .catch((error) => {
        console.error("downloadFileFromAWSS3ByKey error from ", error);
      });
    // callback(error);
    // let response = await CommonUtil.readPolicyPDFFile(files[0].path);
    // callback(null, response);
  } else {
    callback(null, {});
  }
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.getBranchpayablePercentage = async (policyId,next,callback) => {
  try{
      const policyIdObjectId = mongoose.Types.ObjectId(policyId);
  policy
    .aggregate([
      {
        $match: {
          _id: policyIdObjectId,
        },
      },
      {
        $lookup: {
          from: "companyRTO",
          let: { companyId: { $toString: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$companyId", "$$companyId"] } } },
            { $unwind: { path: "$RTOCode" } },
            { $group: { _id: "$companyId", RTOCode: { $push: "$RTOCode" } } },
          ],
          as: "CompanyRTOData",
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData.RTOCode",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "RTOList",
          let: { id: { $toObjectId: "$CompanyRTOData.RTOCode" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { RTOCode: 1 } },
          ],
          as: "RTOData",
        },
      },
      {
        $unwind: {
          path: "$RTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                branchManagerId: "$branchManager",
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
        $group: {
          _id: "$_id",
          // OD: { $first: "$UserConfigData.OD" },
          // TP: { $first: "$UserConfigData.TP" },
          // Net: { $first: "$UserConfigData.Net" },
          issueDate: { $first: "$issueDate" },
          userId: { $first: "$userId" },
          branchManagerId: { $first: "$UserData.branchManagerId" },
          subProductId: { $first: "$subProductId" },
          subBookingCodeId: { $first: "$subBookingCodeId" },
          productId: { $first: "$productId" },
          companyId: { $first: "$companyId" },
          gvw: { $first: "$gvw" },
          cc: { $first: "$cc" },
          bookingCodeId: { $first: "$bookingCodeId" },
          policyTypeId: { $first: "$policyTypeId" },
          registrationNumber: { $first: "$registrationNumber" },
          paCover: { $first: "$paCover" },
          RTOList: { $addToSet: "$RTOData.RTOCode" },
        },
      },
      {
        $addFields: {
          RTOList: "$RTOList",
          regNoFirstFourCharacters: { $substr: ["$registrationNumber", 0, 4] },
        },
      },
      {
        $lookup: {
          from: "branchConfig",
          let: {
            // userId: { $toString: "$userId" },
            branchManagerId: { $toString: "$branchManagerId" },
            subProductId: { $toString: "$subProductId" },
            subBookingCodeId: { $toString: "$subBookingCodeId" },
            productId: { $toString: "$productId" },
            companyId: { $toString: "$companyId" },
            bookingCodeId: { $toString: "$bookingCodeId" },
            policyTypeId: { $toString: "$policyTypeId" },
            // PACover: "$paCover",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$branchManagerId", "$$branchManagerId"] },
                    { $eq: ["$subProductId", "$$subProductId"] },
                    { $eq: ["$subBookingCodeId", "$$subBookingCodeId"] },
                    { $eq: ["$productId", "$$productId"] },
                    { $eq: ["$bookingCodeId", "$$bookingCodeId"] },
                    { $eq: ["$companyId", "$$companyId"] },
                    { $eq: ["$policyTypeId", "$$policyTypeId"] },
                    // { $in: ["$RTOList", "$$regNoFirstFourCharacters"] },
                    // { $eq: ["$isCommisionRecievable", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                OD: 1,
                TP: 1,
                Net: 1,
                GVW: 1,
                CC: 1,
                PACover: 1,
                activeDate: 1,
                disableDate: 1,
              },
            },
          ],
          as: "BranchConfigData",
        },
      },
      {
        $unwind: {
          path: "$BranchConfigData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          OD: { $first: "$BranchConfigData.OD" },
          TP: { $first: "$BranchConfigData.TP" },
          Net: { $first: "$BranchConfigData.Net" },
          GVW: { $first: "$BranchConfigData.GVW" },
          CC: { $first: "$BranchConfigData.CC" },
          branchManagerId: { $first: { $toString: "$branchManagerId" } },
          policyGVW: { $first: { $toDouble: "$gvw" } },
          policyCC: { $first: { $toDouble: "$cc" } },
          RTOList: { $first: "$RTOList" },
          regNoFirstFourCharacters: { $first: "$regNoFirstFourCharacters" },
          PACover: { $first: "$BranchConfigData.PACover" },
          activeDate: { $first: "$BranchConfigData.activeDate" },
          disableDate: { $first: "$BranchConfigData.disableDate" },
          policyPACover: { $first: "$paCover" },
          issueDate: { $first: "$issueDate" },
        },
      },
    ])
    .exec(async function (err, data) {
      if (err) {
        callback(err);
      } else {
        let result = data[0];
        let response = {};
        console.log("result ", result);
        let validationObj;
        if (result && result.activeDate) {
          validationObj = await CommonUtil.configurationValidation(result);
        }
        console.log("Branch validationObj ", validationObj);
        if (
          validationObj &&
          validationObj.rtoCode &&
          validationObj.pacover &&
          validationObj.issuedate &&
          validationObj.GVW &&
          validationObj.CC
        ) {
          response["OD"] = result.OD;
          response["TP"] = result.TP;
          response["Net"] = result.Net;
        }
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getReceivablePercentage = async (policyId,next,callback) => {
  try{
       const policyIdObjectId = mongoose.Types.ObjectId(policyId);
  policy
    .aggregate([
      {
        $match: {
          _id: policyIdObjectId,
        },
      },
      {
        $lookup: {
          from: "companyRTO",
          let: { companyId: { $toString: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$companyId", "$$companyId"] } } },
            { $unwind: { path: "$RTOCode" } },
            { $group: { _id: "$companyId", RTOCode: { $push: "$RTOCode" } } },
          ],
          as: "CompanyRTOData",
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData.RTOCode",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "RTOList",
          let: { id: { $toObjectId: "$CompanyRTOData.RTOCode" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { RTOCode: 1 } },
          ],
          as: "RTOData",
        },
      },
      {
        $unwind: {
          path: "$RTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          // OD: { $first: "$UserConfigData.OD" },
          // TP: { $first: "$UserConfigData.TP" },
          // Net: { $first: "$UserConfigData.Net" },
          issueDate: { $first: "$issueDate" },
          subProductId: { $first: "$subProductId" },
          subBookingCodeId: { $first: "$subBookingCodeId" },
          productId: { $first: "$productId" },
          companyId: { $first: "$companyId" },
          gvw: { $first: "$gvw" },
          cc: { $first: "$cc" },
          bookingCodeId: { $first: "$bookingCodeId" },
          policyTypeId: { $first: "$policyTypeId" },
          registrationNumber: { $first: "$registrationNumber" },
          paCover: { $first: "$paCover" },
          RTOList: { $addToSet: "$RTOData.RTOCode" },
        },
      },
      {
        $addFields: {
          RTOList: "$RTOList",
          regNoFirstFourCharacters: { $substr: ["$registrationNumber", 0, 4] },
        },
      },
      {
        $lookup: {
          from: "receivableConfig",
          let: {
            subProductId: { $toString: "$subProductId" },
            subBookingCodeId: { $toString: "$subBookingCodeId" },
            productId: { $toString: "$productId" },
            companyId: { $toString: "$companyId" },
            bookingCodeId: { $toString: "$bookingCodeId" },
            policyTypeId: { $toString: "$policyTypeId" },
            // PACover: "$paCover",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$subProductId", "$$subProductId"] },
                    { $eq: ["$subBookingCodeId", "$$subBookingCodeId"] },
                    { $eq: ["$productId", "$$productId"] },
                    { $eq: ["$bookingCodeId", "$$bookingCodeId"] },
                    { $eq: ["$companyId", "$$companyId"] },
                    { $eq: ["$policyTypeId", "$$policyTypeId"] },
                    // { $in: ["$RTOList", "$$regNoFirstFourCharacters"] },
                    // { $eq: ["$isCommisionRecievable", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                OD: 1,
                TP: 1,
                Net: 1,
                GVW: 1,
                CC: 1,
                PACover: 1,
                activeDate: 1,
                disableDate: 1,
              },
            },
          ],
          as: "ReceivableConfigData",
        },
      },
      {
        $unwind: {
          path: "$ReceivableConfigData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          OD: { $first: "$ReceivableConfigData.OD" },
          TP: { $first: "$ReceivableConfigData.TP" },
          Net: { $first: "$ReceivableConfigData.Net" },
          GVW: { $first: "$ReceivableConfigData.GVW" },
          CC: { $first: "$ReceivableConfigData.CC" },
          branchManagerId: { $first: { $toString: "$branchManagerId" } },
          policyGVW: { $first: { $toDouble: "$gvw" } },
          policyCC: { $first: { $toDouble: "$cc" } },
          RTOList: { $first: "$RTOList" },
          regNoFirstFourCharacters: { $first: "$regNoFirstFourCharacters" },
          PACover: { $first: "$ReceivableConfigData.PACover" },
          activeDate: { $first: "$ReceivableConfigData.activeDate" },
          disableDate: { $first: "$ReceivableConfigData.disableDate" },
          policyPACover: { $first: "$paCover" },
          issueDate: { $first: "$issueDate" },
        },
      },
    ])
    .exec(async function (err, data) {
      if (err) {
        callback(err);
      } else {
        let result = data[0];
        let response = {};
        console.log("result ", result);
        let validationObj;
        if (result && result.activeDate) {
          validationObj = await CommonUtil.configurationValidation(result);
        }
        console.log("Receivable validationObj ", validationObj);
        if (
          validationObj &&
          validationObj.rtoCode &&
          validationObj.pacover &&
          validationObj.issuedate &&
          validationObj.GVW &&
          validationObj.CC
        ) {
          response["OD"] = result.OD;
          response["TP"] = result.TP;
          response["Net"] = result.Net;
        }
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.ticketAlreadyExist = async (policyId, createdBy,next,callback) => {
  try{
      let setupdateObj = {
    isCommisionRecievable: false,
    isUserPayable: false,
    isBranchPayable: false,
    status: "verifyPending",
    ticketStatus: "Already Exist",
    ticketCreatedBy: createdBy,
    ticketCreatedDate: new Date(),
  };
  let unsetupdateObj = {
    commisionRecievable: 1,
    userPayable: 1,
    branchPayable: 1,
  };
  policy.findByIdAndUpdate(
    policyId,
    { $set: setupdateObj, $unset: unsetupdateObj },
    function (error, response) {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        callback(null, response);
      }
    }
  );
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getPolicyMapping = async (userId, requestType,next,callback) => {
  try{
     let matchQuery = {};

  if (requestType == "Pending") {
    matchQuery = {
      policyMappingStatus: "Mapping",
    };
  } else {
    matchQuery = {
      $or: [
        { policyMappingStatus: "Mapping Done" },
        { policyMappingStatus: "Rejected" },
      ],
    };
  }

  if (userId) {
    matchQuery["policyMapping.userId"] = userId;
  }

  policy
    .aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "user",
          let: { userId: { $toObjectId: "$policyMapping.userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                userName: {
                  $concat: ["$name", " - ", "$email"],
                },
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
        $lookup: {
          from: "user",
          let: { userId: { $toObjectId: "$userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                userName: {
                  $concat: ["$name", " - ", "$email"],
                },
              },
            },
          ],
          as: "PolicyUserData",
        },
      },
      {
        $unwind: {
          path: "$PolicyUserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$policyMapping.companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
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
        $project: {
          _id: 1,
          policyDate: "$policyMapping.issueDate",
          creatingUser: "$UserData.userName",
          policyTableUser: "$PolicyUserData.userName",
          company: "$CompanyData.companyName",
          policyNumber: 1,
          totalPremium: "$policyMapping.totalPremium",
          policyMappingStatus: 1,
        },
      },
    ])
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.getPolicyMappingByPolicyID = async (policyId,next,callback) => {
  try{
        const policyIdObjectId = mongoose.Types.ObjectId(policyId);
  policy
    .aggregate([
      {
        $match: { _id: policyIdObjectId },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: { $toObjectId: "$policyMapping.userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                userName: {
                  $concat: ["$name", " - ", "$email"],
                },
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
        $lookup: {
          from: "user",
          let: { userId: { $toObjectId: "$policyTableMapping.userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                userName: {
                  $concat: ["$name", " - ", "$email"],
                },
              },
            },
          ],
          as: "PolicyUserData",
        },
      },
      {
        $unwind: {
          path: "$PolicyUserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$policyMapping.companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
              },
            },
          ],
          as: "MissingCompanyData",
        },
      },
      {
        $unwind: {
          path: "$MissingCompanyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
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
        $project: {
          _id: 1,
          missingPolicy: {
            issueDate: "$policyMapping.issueDate",
            userName: "$UserData.userName",
            company: "$MissingCompanyData.companyName",
            policyNumber: "$policyNumber",
            totalPremium: "$policyMapping.totalPremium",
            paymentMode: "$policyMapping.paymentMode",
            policyMappingFile: "$policyMappingFile",
          },
          policyTable: {
            issueDate: "$issueDate",
            userName: "$PolicyUserData.userName",
            company: "$CompanyData.companyName",
            policyNumber: "$policyNumber",
            totalPremium: "$totalPremium",
            paymentMode: "$paymentMode",
            policyFile: "$policyFile",
            policyStatus: "$status",
            ccEntryStatus: "$ticketNumber",
          },
          policyMappingStatus: 1,
        },
      },
    ])
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, data[0]);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getUserpayablePercentage = async (policyId,next,callback) => {
  try{
        const policyIdObjectId = mongoose.Types.ObjectId(policyId);
  policy
    .aggregate([
      {
        $match: {
          _id: policyIdObjectId,
        },
      },
      {
        $lookup: {
          from: "companyRTO",
          let: { companyId: { $toString: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$companyId", "$$companyId"] } } },
            { $unwind: { path: "$RTOCode" } },
            { $group: { _id: "$companyId", RTOCode: { $push: "$RTOCode" } } },
          ],
          as: "CompanyRTOData",
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$CompanyRTOData.RTOCode",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "RTOList",
          let: { id: { $toObjectId: "$CompanyRTOData.RTOCode" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { RTOCode: 1 } },
          ],
          as: "RTOData",
        },
      },
      {
        $unwind: {
          path: "$RTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          // OD: { $first: "$UserConfigData.OD" },
          // TP: { $first: "$UserConfigData.TP" },
          // Net: { $first: "$UserConfigData.Net" },
          issueDate: { $first: "$issueDate" },
          userId: { $first: "$userId" },
          subProductId: { $first: "$subProductId" },
          subBookingCodeId: { $first: "$subBookingCodeId" },
          productId: { $first: "$productId" },
          companyId: { $first: "$companyId" },
          gvw: { $first: "$gvw" },
          cc: { $first: "$cc" },
          bookingCodeId: { $first: "$bookingCodeId" },
          policyTypeId: { $first: "$policyTypeId" },
          registrationNumber: { $first: "$registrationNumber" },
          paCover: { $first: "$paCover" },
          RTOList: { $addToSet: "$RTOData.RTOCode" },
        },
      },
      {
        $addFields: {
          RTOList: "$RTOList",
          regNoFirstFourCharacters: { $substr: ["$registrationNumber", 0, 4] },
        },
      },
      {
        $lookup: {
          from: "userConfig",
          let: {
            userId: { $toString: "$userId" },
            subProductId: { $toString: "$subProductId" },
            subBookingCodeId: { $toString: "$subBookingCodeId" },
            productId: { $toString: "$productId" },
            companyId: { $toString: "$companyId" },
            bookingCodeId: { $toString: "$bookingCodeId" },
            policyTypeId: { $toString: "$policyTypeId" },
            // PACover: "$paCover",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$subProductId", "$$subProductId"] },
                    { $eq: ["$subBookingCodeId", "$$subBookingCodeId"] },
                    { $eq: ["$productId", "$$productId"] },
                    { $eq: ["$bookingCodeId", "$$bookingCodeId"] },
                    { $eq: ["$companyId", "$$companyId"] },
                    { $eq: ["$policyTypeId", "$$policyTypeId"] },
                    // { $in: ["$RTOList", "$$regNoFirstFourCharacters"] },
                    // { $eq: ["$isCommisionRecievable", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                OD: 1,
                TP: 1,
                Net: 1,
                GVW: 1,
                CC: 1,
                PACover: 1,
                activeDate: 1,
                disableDate: 1,
              },
            },
          ],
          as: "UserConfigData",
        },
      },
      {
        $unwind: {
          path: "$UserConfigData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          OD: { $first: "$UserConfigData.OD" },
          TP: { $first: "$UserConfigData.TP" },
          Net: { $first: "$UserConfigData.Net" },
          GVW: { $first: "$UserConfigData.GVW" },
          CC: { $first: "$UserConfigData.CC" },
          policyGVW: { $first: { $toDouble: "$gvw" } },
          policyCC: { $first: { $toDouble: "$cc" } },
          RTOList: { $first: "$RTOList" },
          regNoFirstFourCharacters: { $first: "$regNoFirstFourCharacters" },
          PACover: { $first: "$UserConfigData.PACover" },
          activeDate: { $first: "$UserConfigData.activeDate" },
          disableDate: { $first: "$UserConfigData.disableDate" },
          policyPACover: { $first: "$paCover" },
          issueDate: { $first: "$issueDate" },
        },
      },
    ])
    .exec(async function (err, data) {
      if (err) {
        callback(err);
      } else {
        let result = data[0];
        let response = {};
        console.log("result ", result);
        let validationObj;
        if (result && result.activeDate) {
          validationObj = await CommonUtil.configurationValidation(result);
        }
        console.log("User validationObj ", validationObj);
        if (
          validationObj &&
          validationObj.rtoCode &&
          validationObj.pacover &&
          validationObj.issuedate &&
          validationObj.GVW &&
          validationObj.CC
        ) {
          response["OD"] = result.OD;
          response["TP"] = result.TP;
          response["Net"] = result.Net;
        }
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getUserWallet = async (
  clientId,
  userId,
  startDate,
  endDate,
  walletType,
  headerUserId,
  userType,
  next,
  callback
) => {
  try{
      let userMatch = { "UserData.userType": "user" };
  let userIdMatch = {
    isUserPayable: true,
    clientId: clientId,
    $and: [{ paymentMode: { $ne: "cheque" } }, { paymentMode: { $ne: "DD" } }],
  };

  if (walletType !== "null" && walletType != "All") {
    userMatch["UserData.payoutCycle"] = walletType;
  }
  if (userId) {
    userIdMatch.userId = mongoose.Types.ObjectId(userId);
  }

  // Changes by Arun
  if (userType == USER_TYPE.USER) {
    userIdMatch.userId = mongoose.Types.ObjectId(headerUserId);
  }

  if (userType == USER_TYPE.BRANCH_MANAGER) {
    userMatch["UserData.branchManager"] = headerUserId;
  }

  const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);

  selectedEndDate.setDate(selectedEndDate.getDate() + 1);

  if (startDate && endDate) {
    userIdMatch.updatedAt = {
      $gte: selectedStartDate,
      $lte: selectedEndDate,
    };
  }

  policy
    .aggregate([
      {
        $match: userIdMatch,
      },
      {
        $addFields: {
          // userPayableAmount: { $toDouble: "$userPayable.Total" },
          userPayableAmount: {
            $cond: {
              if: { $eq: ["$paymentMode", "Cash"] },
              then: {
                $subtract: [
                  { $toDouble: "$totalPremium" },
                  { $toDouble: "$userPayable.Total" },
                ],
              },
              else: { $toDouble: "$userPayable.Total" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: { $toObjectId: "$userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                userName: {
                  $concat: ["$name", " - ", "$mobileNumber", " - ", "$email"],
                },
                branchManager: 1,
                payoutCycle: 1,
                userType: 1,
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
      { $match: userMatch },
      {
        $lookup: {
          from: "user",
          let: { branchManager: { $toObjectId: "$UserData.branchManager" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchManager"] } } },
            {
              $project: {
                _id: 0,
                name: 1,
                mobileNumber: 1,
                branchId: 1,
              },
            },
          ],
          as: "BranchManagerData",
        },
      },
      {
        $unwind: {
          path: "$BranchManagerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branch",
          let: { branchId: { $toObjectId: "$BranchManagerData.branchId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchId"] } } },
            { $project: { _id: 0, branchName: 1 } },
          ],
          as: "BranchData",
        },
      },
      {
        $unwind: {
          path: "$BranchData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$UserData._id",
          userName: { $first: "$UserData.userName" },
          userId: { $first: "$UserData._id" },
          // balance: {
          //   $sum:
          //     "$userPayableAmount",
          // },
          sumCash: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$paymentMode", "Cash"] },
                    { $eq: ["$paymentMode", PAYMENT_MODE.USER_PAID] },
                  ],
                  //  $eq: ["$paymentMode", "Cash"]
                },
                then: "$userPayableAmount",
                else: 0,
              },
            },
          },
          sumOnline: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$paymentMode", "Online"] },
                    { $eq: ["$paymentMode", PAYMENT_MODE.USER_RECEIVED] },
                  ],
                  // $eq: ["$paymentMode", "Online"]
                },
                then: "$userPayableAmount",
                else: 0,
              },
            },
          },
          branch: {
            $first: {
              $concat: [
                "$BranchData.branchName",
                " - ",
                "$BranchManagerData.name",
                " - ",
                "$BranchManagerData.mobileNumber",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          userName: 1,
          sumCash: 1,
          sumOnline: 1,
          branch: 1,
          walletBalance: { $subtract: ["$sumOnline", "$sumCash"] },
        },
      },
    ])
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.getCompanyWallet = async (
  clientId,
  bookingCodeId,
  subBookingCodeId,
  startDate,
  endDate,
  next,
  callback
) => {
  try{
      let bookingCodeMatch = { clientId: clientId };
  const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);
  let policyMatch = {
    $expr: {
      $and: [
        { $eq: ["$subBookingCodeId", "$$subBookingCodeId"] },
        { $eq: ["$bookingCodeId", "$$bookingCodeId"] },
        // { $eq: ["$documentType", DOCUMENT_TYPE.POLICY] },
        { $eq: ["$isCommisionRecievable", true] },
      ],
    },
  };

  if (bookingCodeId) {
    bookingCodeMatch.bookingCodeId = bookingCodeId;
  }

  if (subBookingCodeId) {
    bookingCodeMatch.subBookingCode = subBookingCodeId;
  }

  selectedEndDate.setDate(selectedEndDate.getDate() + 1); //added by gokul..
  if (startDate && endDate) {
    policyMatch["commisionRecievable.updatedAt"] = {
      $gte: selectedStartDate,
      $lte: selectedEndDate,
    };
  }

  SubBookingCode.aggregate([
    {
      $match: bookingCodeMatch,
    },
    {
      $lookup: {
        from: "bookingCode",
        let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
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
        from: "policy",
        let: {
          subBookingCodeId: "$_id",
          bookingCodeId: "$BookingCodeData._id",
        },
        pipeline: [
          {
            $match: policyMatch,
          },
          {
            $project: {
              _id: 1,
              commisionRecievable: { $toDouble: "$commisionRecievable.Total" },
              paymentMode: 1,
              updatedAt: "$commisionRecievable.updatedAt",
            },
          },
        ],
        as: "PolicyData",
      },
    },
    {
      $unwind: {
        path: "$PolicyData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        bookingCodeId: { $first: "$bookingCodeId" },
        subBookingCodeId: { $first: "$_id" },
        bookingCode: { $first: "$BookingCodeData.bookingCode" },
        subBookingCode: { $first: "$subBookingCode" },
        // user: { $addToSet: "$UserData" },
        updatedAt: { $first: "$PolicyData.updatedAt" },
        sumCash: {
          $sum: {
            $cond: {
              if: {
                $or: [
                  // { $eq: ["$PolicyData.paymentMode", "Cash"] },
                  {
                    $eq: [
                      "$PolicyData.paymentMode",
                      PAYMENT_MODE.COMPANY_RECEIVED,
                    ],
                  },
                ],
                //  $eq: ["$paymentMode", "Cash"]
              },
              then: "$PolicyData.commisionRecievable",
              else: 0,
            },
          },
        },
        sumOnline: {
          $sum: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$PolicyData.paymentMode", "Online"] },
                  { $eq: ["$PolicyData.paymentMode", "Cash"] },
                  // {
                  //   $eq: [
                  //     "$PolicyData.paymentMode",
                  //     PAYMENT_MODE.COMPANY_RECEIVED,
                  //   ],
                  // },
                ],
                // $eq: ["$paymentMode", "Online"]
              },
              then: "$PolicyData.commisionRecievable",
              else: 0,
            },
          },
        },
        // commisionRecievable: { $addToSet: "$PolicyData.commisionRecievable" },
      },
    },
    {
      $project: {
        bookingCodeId: 1,
        subBookingCodeId: 1,
        bookingCode: 1,
        subBookingCode: 1,
        sumCash: 1,
        sumOnline: 1,
        updatedAt: 1,
        // totalCommisionPayable: {
        //   $sum: {
        //     $map: {
        //       input: "$commisionRecievable",
        //       as: "commisionRec",
        //       in: { $multiply: ["$$commisionRec"] },
        //     },
        //   },
        // },
      },
    },
    {
      $project: {
        bookingCodeId: 1,
        subBookingCodeId: 1,
        bookingCode: 1,
        subBookingCode: 1,
        sumCash: 1,
        sumOnline: 1,
        totalCommisionPayable: { $subtract: ["$sumOnline", "$sumCash"] },
        updatedAt: 1,
      },
    },
  ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.getCompanyWalletBySubBookingCodeId = async (
  subBookingCodeId,
  startDate,
  endDate,
  next,
  callback
) => {
  try{
         const subBookingCodeObjectId = mongoose.Types.ObjectId(subBookingCodeId);
  const subBookingCodeMatch = {
    _id: subBookingCodeObjectId,
  };
  const policyMatch = {
    $expr: {
      $and: [
        { $eq: ["$subBookingCodeId", subBookingCodeObjectId] },
        { $eq: ["$isCommisionRecievable", true] },
        { $ne: ["$paymentMode", "Cheque"] },
        { $ne: ["$paymentMode", "DD"] },
      ],
    },
  };

  const seletedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);

  selectedEndDate.setDate(selectedEndDate.getDate() + 1); //added by gokul...

  if (startDate && endDate) {
    policyMatch["commisionRecievable.updatedAt"] = {
      $gte: seletedStartDate,
      $lte: selectedEndDate,
    };
  }
  SubBookingCode.aggregate([
    {
      $match: {
        _id: subBookingCodeObjectId,
      },
    },
    {
      $lookup: {
        from: "policy",
        let: { userId: { $toObjectId: "$UserData._id" } },
        pipeline: [
          {
            $match: policyMatch,
          },
          {
            $project: {
              _id: 1,
              policyDate: "$issueDate",
              userId: 1,
              policyNumber: { $concat: ["'", "$policyNumber"] },
              customerName: 1,
              paymentMode: 1,
              netPremium: 1,
              totalPremium: 1,
              companyId: 1,
              commisionRecievable: 1,
              createdAt: 1,
            },
          },
        ],
        as: "PolicyData",
      },
    },
    {
      $unwind: {
        path: "$PolicyData",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        commisionRecievable: {
          $toDouble: "$PolicyData.commisionRecievable.Total",
        },
        approvedDate: "$PolicyData.commisionRecievable.updatedAt",
      },
    },
    {
      $lookup: {
        from: "user",
        let: { userId: "$PolicyData.userId" },
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
      $lookup: {
        from: "company",
        let: { companyId: { $toObjectId: "$PolicyData.companyId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
          {
            $project: {
              _id: 1,
              companyName: "$shortName",
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
      $addFields: {
        cumulativeCalculateAmount: {
          $cond: {
            if: {
              $or: [
                // { $eq: ["$PolicyData.paymentMode", "Cash"] },
                {
                  $eq: [
                    "$PolicyData.paymentMode",
                    PAYMENT_MODE.COMPANY_RECEIVED,
                  ],
                },
              ],
            }, // Condition to check
            then: { $multiply: ["$commisionRecievable", -1] }, // Multiply by -1 if condition is true
            else: "$commisionRecievable", // Keep the original value if condition is false
          },
        },
        policyBalance: {
          $cond: {
            if: {
              $or: [
                // { $eq: ["$PolicyData.paymentMode", "Cash"] },
                {
                  $eq: [
                    "$PolicyData.paymentMode",
                    PAYMENT_MODE.COMPANY_RECEIVED,
                  ],
                },
              ],
            }, // Condition to check
            then: { $multiply: ["$commisionRecievable", -1] }, // Multiply by -1 if condition is true
            else: "$commisionRecievable", // Keep the original value if condition is false
          },
        },
      },
    },
    {
      $sort: {
        approvedDate: 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        userName: { $first: "$UserData.name" },
        approvedDate: { $push: "$approvedDate" },
        policyDate: { $push: "$PolicyData.policyDate" },
        companyName: { $push: "$CompanyData.companyName" },
        policyId: { $push: "$PolicyData._id" },
        policyNumber: { $push: "$PolicyData.policyNumber" },
        customerName: { $push: "$PolicyData.customerName" },
        paymentMode: { $push: "$PolicyData.paymentMode" },
        netPremium: { $push: "$PolicyData.netPremium" },
        totalPremium: { $push: "$PolicyData.totalPremium" },
        commisionRecievableAmount: { $push: "$commisionRecievable" },
        policyBalance: { $push: "$policyBalance" },
        cumulativeCalculateAmount: { $push: "$cumulativeCalculateAmount" },
        data: { $push: "$$ROOT" },
      },
    },
    {
      $addFields: {
        result: {
          $map: {
            input: { $range: [0, { $size: "$cumulativeCalculateAmount" }] },
            as: "index",
            in: {
              $sum: {
                $slice: [
                  "$cumulativeCalculateAmount",
                  0,
                  { $add: ["$$index", 1] },
                ],
              },
            },
          },
        },
      },
    },
    {
      $unwind: "$data", // Unwind the array to restore individual documents
    },
    {
      $project: {
        userId: "$data.userId",
        userName: "$userName",
        approvedDate: "$data.approvedDate",
        policyDate: "$data.PolicyData.policyDate",
        companyName: "$data.CompanyData.companyName",
        policyId: "$data.PolicyData._id",
        policyNumber: {
          $cond: {
            if: {
              $and: [
                {
                  $ne: [
                    "$data.PolicyData.paymentMode",
                    PAYMENT_MODE.COMPANY_RECEIVED,
                  ],
                },
              ],
            },
            then: "$data.PolicyData.policyNumber",
            else: "",
          },
        },
        customerName: "$data.PolicyData.customerName",
        paymentMode: "$data.PolicyData.paymentMode",
        netPremium: "$data.PolicyData.netPremium",
        totalPremium: "$data.PolicyData.totalPremium",
        commisionRecievable: "$data.commisionRecievable",
        policyBalance: "$data.policyBalance",
        // data: 1,
        // cumulativeCalculateAmount: "$data.cumulativeCalculateAmount",
        result: 1,
      },
    },
  ]).exec(async function (err, data) {
    if (err) {
      callback(err);
    } else {
      await Promise.all(
        data.map((element, index) => {
          let result = element.result;
          element.walletBalance = result[index];
        })
      );
      let reverseArray = [...data].reverse();
      callback(null, reverseArray);
    }
  });
  }catch(err){
    next(err);
  }
 
};
// Changes by Arun //
module.exports.getBranchWallet = async (
  clientId,
  userId,
  userType,
  startDate,
  endDate,
  next,
  callback
) => {
  try{
       let matchQuery = { clientId: clientId, userType: "branchManager" };
  if (userType == USER_TYPE.BRANCH_MANAGER) {
    matchQuery["_id"] = mongoose.Types.ObjectId(userId);
  }
  
  const seletedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);

  selectedEndDate.setDate(selectedEndDate.getDate() + 1); //added by gokul...

  if(startDate && endDate){
    matchQuery["createdAt"]={
       $gte: seletedStartDate,
      $lte: selectedEndDate,
    }
  }
  userSchema
    .aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "branch",
          let: { branchId: "$branchId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$branchId"] },
              },
            },
            {
              $project: {
                _id: 1,
                branchName: 1,
              },
            },
          ],
          as: "BranchData",
        },
      },
      {
        $unwind: {
          path: "$BranchData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { branchManagerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$branchManager", "$$branchManagerId"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                branchManager: 1,
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
        $lookup: {
          from: "policy",
          let: { userId: { $toObjectId: "$UserData._id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  // $eq: ["$userId", "$$userId"]
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$documentType", DOCUMENT_TYPE.POLICY] },
                    { $eq: ["$status", "approvedPolicy"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                branchPayable: {
                  $toDouble: {
                    $ifNull: ["$branchPayable.Total", 0],
                    //   $cond: [
                    //     { $eq: ["$isBranchPayable", false] },
                    //     0,
                    //     "$$branchPayable.Total",
                    //   ],
                  },
                  // "$branchPayable.Total",
                },
                userPayable: { $toDouble: "$userPayable.Total" },
              },
            },
          ],
          as: "PolicyData",
        },
      },
      {
        $unwind: {
          path: "$PolicyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          branchManager: { $first: "$name" },
          branch: { $first: "$BranchData.branchName" },
          // user: { $addToSet: "$UserData" },
          branchPayable: { $addToSet: "$PolicyData.branchPayable" },
          userPayable: { $addToSet: "$PolicyData.userPayable" },
        },
      },
      {
        $project: {
          branchManager: 1,
          branch: 1,
          totalBranchPayable: {
            $sum: {
              $map: {
                input: "$branchPayable",
                as: "branchPay",
                in: { $multiply: ["$$branchPay"] },
              },
            },
          },
          totalUserPayable: {
            $sum: {
              $map: {
                input: "$userPayable",
                as: "userPay",
                in: { $multiply: ["$$userPay"] },
              },
            },
          },
        },
      },
      {
        $project: {
          branchManager: 1,
          branch: 1,
          branchPayable: "$totalBranchPayable",
          commisionPayable: "$totalUserPayable",
          pendingBalance: {
            $subtract: ["$totalBranchPayable", "$totalUserPayable"],
          },
        },
      },
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

// Changes by Arun
module.exports.getBranchWalletByUserId = async (userId,next,callback) => {
  try{
      const userObjectId = mongoose.Types.ObjectId(userId);
  userSchema
    .aggregate([
      {
        $match: {
          _id: userObjectId,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { branchManagerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$branchManager", "$$branchManagerId"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                branchManager: 1,
                companyId: 1,
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
        $lookup: {
          from: "policy",
          let: { userId: { $toObjectId: "$UserData._id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  // $eq: ["$userId", "$$userId"]
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$documentType", DOCUMENT_TYPE.POLICY] },
                    { $eq: ["$status", "approvedPolicy"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                policyDate: "$issueDate",
                userId: 1,
                policyNumber: { $concat: ["'", "$policyNumber"] },
                customerName: 1,
                paymentMode: 1,
                netPremium: 1,
                totalPremium: 1,
                companyId: 1,
                branchAmount: { $toDouble: "$branchPayable.Total" },
                userAmount: { $toDouble: "$userPayable.Total" },
                createdAt: 1,
              },
            },
          ],
          as: "PolicyData",
        },
      },
      {
        $unwind: {
          path: "$PolicyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$PolicyData.companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
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
          let: { userId: "$PolicyData.userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                _id: 1,
                email: 1,
              },
            },
          ],
          as: "UserEmailData",
        },
      },
      {
        $unwind: {
          path: "$UserEmailData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$PolicyData._id",
          policyDate: { $first: "$PolicyData.policyDate" },
          branchManager: { $first: "$name" },
          companyName: { $first: "$CompanyData.companyName" },
          userEmail: { $first: "$UserEmailData.email" },
          policyNumber: { $first: "$PolicyData.policyNumber" },
          customerName: { $first: "$PolicyData.customerName" },
          paymentMode: { $first: "$PolicyData.paymentMode" },
          netPremium: { $first: "$PolicyData.netPremium" },
          totalPremium: { $first: "$PolicyData.totalPremium" },
          branchAmount: { $first: "$PolicyData.branchAmount" },
          userAmount: { $first: "$PolicyData.userAmount" },
          createdAt: { $first: "$PolicyData.createdAt" },
        },
      },
      {
        $project: {
          branchManager: 1,
          policyDate: 1,
          companyName: 1,
          userEmail: 1,
          policyNumber: 1,
          customerName: 1,
          paymentMode: 1,
          netPremium: 1,
          totalPremium: 1,
          branchAmount: { $ifNull: ["$branchAmount", 0] },
          userAmount: { $ifNull: ["$userAmount", 0] },
          createdAt: 1,
        },
      },
      {
        $project: {
          branchManager: 1,
          policyDate: 1,
          companyName: 1,
          userEmail: 1,
          policyNumber: "$policyNumber",
          customerName: 1,
          paymentMode: 1,
          netPremium: 1,
          totalPremium: 1,
          branchAmount: 1,
          userAmount: 1,
          pendingBalance: { $subtract: ["$branchAmount", "$userAmount"] },
          createdAt: 1,
        },
      },
      {
        $sort: {
          policyDate: -1,
        },
      },
      // {
      //   $project: {
      //     branchManager: 1,
      //     branch: 1,
      //     totalBranchPayable: {
      //       $sum: {
      //         $map: {
      //           input: "$branchPayable",
      //           as: "branchPay",
      //           in: { $multiply: ["$$branchPay"] },
      //         },
      //       },
      //     },
      //     totalUserPayable: {
      //       $sum: {
      //         $map: {
      //           input: "$userPayable",
      //           as: "userPay",
      //           in: { $multiply: ["$$userPay"] },
      //         },
      //       },
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     branchManager: 1,
      //     branch: 1,
      //     branchPayable: "$totalBranchPayable",
      //     commisionPayable: "$totalUserPayable",
      //     pendingBalance: {
      //       $subtract: ["$totalBranchPayable", "$totalUserPayable"],
      //     },
      //   },
      // },
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
// Changes by Arun
module.exports.getUserWalletByUserId = async (
  userId,
  startDate,
  endDate,
  next,
  callback
) => {
  try{
      const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);
  const userObjectId = mongoose.Types.ObjectId(userId);
  const policyMatch = {
    userId: userObjectId,
    isUserPayable: true,
    $and: [{ paymentMode: { $ne: "Cheque" } }, { paymentMode: { $ne: "DD" } }],
  };

  selectedEndDate.setDate(selectedEndDate.getDate() + 1); //added by gokul
  if (startDate && endDate) {
    policyMatch.updatedAt = {
      $gte: selectedStartDate,
      $lte: selectedEndDate,
    };
  }

  policy
    .aggregate([
      {
        $match: policyMatch,
      },
      {
        $addFields: {
          // premiumAmount: { $toDouble: "$totalPremium" },
          payableAmount: { $toDouble: "$userPayable.Total" },
          approvedDate: "$userPayable.updatedAt",
          userPayableAmount: {
            $cond: {
              if: { $eq: ["$paymentMode", "Cash"] },
              then: {
                $subtract: [
                  { $toDouble: "$totalPremium" },
                  { $toDouble: "$userPayable.Total" },
                ],
              },
              else: { $toDouble: "$userPayable.Total" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
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
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
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
        $addFields: {
          cumulativeCalculateAmount: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$paymentMode", "Cash"] },
                  { $eq: ["$paymentMode", PAYMENT_MODE.USER_PAID] },
                ],
              }, // Condition to check
              then: { $multiply: ["$userPayableAmount", -1] }, // Multiply by -1 if condition is true
              else: "$userPayableAmount", // Keep the original value if condition is false
            },
          },
          policyBalance: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$paymentMode", "Cash"] },
                  { $eq: ["$paymentMode", PAYMENT_MODE.USER_PAID] },
                ],
              }, // Condition to check
              then: { $multiply: ["$userPayableAmount", -1] }, // Multiply by -1 if condition is true
              else: 0, // Keep the original value if condition is false
            },
          },
        },
      },
      {
        $sort: {
          approvedDate: 1,
        },
      },
      {
        $group: {
          _id: "$userId",
          userId: { $first: "$userId" },
          userName: { $first: "$UserData.name" },
          approvedDate: { $push: "$approvedDate" },
          policyDate: { $push: "$issueDate" },
          policyId: { $push: "$_id" },
          companyName: { $push: "$CompanyData.companyName" },
          policyNumber: { $push: "$policyNumber" },
          customerName: { $push: "$customerName" },
          paymentMode: { $push: "$paymentMode" },
          netPremium: { $push: "$netPremium" },
          totalPremium: { $push: "$totalPremium" },
          payableAmount: { $push: "$payableAmount" },
          policyBalance: { $push: "$policyBalance" },
          cumulativeCalculateAmount: { $push: "$cumulativeCalculateAmount" },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          result: {
            $map: {
              input: { $range: [0, { $size: "$cumulativeCalculateAmount" }] },
              as: "index",
              in: {
                $sum: {
                  $slice: [
                    "$cumulativeCalculateAmount",
                    0,
                    { $add: ["$$index", 1] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $unwind: "$data", // Unwind the array to restore individual documents
      },
      {
        $project: {
          userId: "$data.userId",
          userName: "$userName",
          approvedDate: "$data.approvedDate",
          policyDate: "$data.issueDate",
          policyId: "$data._id",
          companyName: "$data.CompanyData.companyName",
          policyNumber: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$data.paymentMode", PAYMENT_MODE.USER_PAID] }, // Check if isActive is true
                  { $ne: ["$data.paymentMode", PAYMENT_MODE.USER_RECEIVED] }, // Check if age is greater than or equal to 25
                ],
              },
              then: { $concat: ["'", "$data.policyNumber"] },
              else: "",
            },
          },
          customerName: "$data.customerName",
          paymentMode: "$data.paymentMode",
          netPremium: "$data.netPremium",
          totalPremium: "$data.totalPremium",
          payableAmount: "$data.payableAmount",
          policyBalance: "$data.policyBalance",
          // cumulativeCalculateAmount: "$data.cumulativeCalculateAmount",
          result: 1,
        },
      },
      // {
      //   $sort: {
      //     approvedDate: -1,
      //   },
      // },
    ])
    .exec(async function (err, data) {
      if (err) {
        callback(err);
      } else {
        await Promise.all(
          data.map((element, index) => {
            let result = element.result;
            element.walletBalance = result[index];
          })
        );
        let reverseArray = [...data].reverse();
        callback(null, reverseArray);
      }
    });
  }catch(err){
    next(err);
  }
  
};

module.exports.getPolicy = async (clientId, userId, userType,next,callback) => {
  try{
        let match = {
          clientId: clientId,
          documentType: DOCUMENT_TYPE.POLICY,
          status: "verifyPending",
        };

  // Changes by Arun
  if (userType == USER_TYPE.USER) {
    match.userId = mongoose.Types.ObjectId(userId);
  }

  if (userType == USER_TYPE.BRANCH_MANAGER) {
    let userList = await userSchema.find({ branchManager: userId }, { _id: 1 });
    let userIdList = [];
    await Promise.all(
      userList.map((element) => {
        userIdList.push(element._id);
      })
    );
    console.log("userIdList ", userIdList);
    match.userId = { $in: userIdList };
  }
  policy
    .find(match)
    .populate([
      {
        path: "companyId",
        model: companySchema,
        select: "companyName shortName",
      },
      { path: "userId", model: userSchema, select: "name email" },
      { path: "productId", model: Product, select: "product" },
      {
        path: "subProductId",
        model: SubProduct,
        select: "subProduct productID",
      },
      { path: "policyTypeId", model: policyTypeSchema, select: "policyType" },
      { path: "bookingCodeId", model: bookingCode, select: "bookingCode" },
      {
        path: "subBookingCodeId",
        model: SubBookingCode,
        select: "subBookingCode bookingCodeId",
      },
    ])
    .exec(async function (error, response) {
      if (error) {
        callback(error);
      } else {
        Promise.all(
          response.map((data) => {
            //policyNumber with single quote removed by gokul...
            let mobileNumber = data?.mobileNumber || "";
            if (mobileNumber) {
              data.mobileNumber = "'" + mobileNumber + "'";
            }
          })
        );
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

module.exports.deletePolicy = (id,next,callback) => {
  try{
      policy.findByIdAndDelete(id, function (error, response) {
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

module.exports.searchPolicy = (
  clientId,
  userId,
  userType,
  receivedData,
  next,
  callback
) => {
  try{
    // Changes by Arun
  if (userType == USER_TYPE.USER) {
    receivedData.userId = mongoose.Types.ObjectId(userId);
  }
  policy
    .find({
      $and: [
        { clientId: clientId },
        { documentType: DOCUMENT_TYPE.POLICY },
        receivedData,
      ],
    })
    .populate([
      { path: "companyId", model: companySchema },
      { path: "userId", model: userSchema },
      { path: "productId", model: Product },
      { path: "subProductId", model: SubProduct },
      { path: "policyTypeId", model: policyTypeSchema },
      { path: "bookingCodeId", model: bookingCode },
    ])
    .sort({ totalPremium: 1 })
    .exec(async function (error, response) {
      if (error) {
        callback(error);
      } else {
        Promise.all(
          response.map((data) => {
            let policyNumber = data?.policyNumber;
            data.policyNumber = "'" + policyNumber;
            let mobileNumber = data?.mobileNumber || "";
            if (mobileNumber) {
              data.mobileNumber = "'" + mobileNumber + "'";
            }
          })
        );
        // await Promise.all(
        //   response.map(async (data) => {
        //     if (data.policyFile) {
        //       let policyFileObj = data.policyFile;
        //       let key = policyFileObj.key;
        //       await CommonUtil.downloadFileFromAWSS3ByKey(key)
        //         .then((downloadURL) => {
        //           // console.log("downloadURL ", downloadURL);
        //           policyFileObj["downloadURL"] = downloadURL;
        //         })
        //         .catch((error) => {
        //           console.error(
        //             "downloadFileFromAWSS3ByKey error from ",
        //             error
        //           );
        //         });
        //     }

        //     if (data.otherFile) {
        //       let otherFileObj = data.otherFile;
        //       let key = otherFileObj.key;
        //       await CommonUtil.downloadFileFromAWSS3ByKey(key)
        //         .then((downloadURL) => {
        //           // console.log("downloadURL ", downloadURL);
        //           otherFileObj["downloadURL"] = downloadURL;
        //         })
        //         .catch((error) => {
        //           console.error("downloadFileFromAWSS3ByKey error ", error);
        //         });
        //     }
        //   })
        // );
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

module.exports.putPolicy = async (id, receivedData, files,next,callback) => {
  try{
    let policyFile =
    files &&
    files.find((file) => {
      return file.fieldname == AWS_POLICY_FILE_DIRECTORY_NAME;
    });
  let policyFileObj = {};
  if (policyFile) {
    const extenstion = path.extname(policyFile.originalname);
    policyFile.originalname = CommonUtil.getFileName(
      AWS_POLICY_FILE_DIRECTORY_NAME,
      extenstion
    );

    let filename = policyFile.originalname || "";

    await CommonUtil.uploadFileToAWSS3(
      policyFile,
      AWS_POLICY_FILE_DIRECTORY_NAME
    )
      .then((response) => {
        policyFileObj["fileName"] = filename;
        policyFileObj["key"] = response.key;
        policyFileObj["location"] = response.Location;
        receivedData["policyFile"] = policyFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }
  let otherFile =
    files &&
    files.find((file) => {
      return file.fieldname == AWS_OTHER_FILE_DIRECTORY_NAME;
    });
  let otherFileObj = {};
  if (otherFile) {
    const extenstion = path.extname(otherFile.originalname);
    otherFile.originalname = CommonUtil.getFileName(
      AWS_OTHER_FILE_DIRECTORY_NAME,
      extenstion
    );
    let filename = otherFile.originalname || "";
    await CommonUtil.uploadFileToAWSS3(otherFile, AWS_OTHER_FILE_DIRECTORY_NAME)
      .then((response) => {
        otherFileObj["fileName"] = filename;
        otherFileObj["key"] = response.key;
        otherFileObj["location"] = response.Location;
        receivedData["otherFile"] = otherFileObj;
      })
      .catch((error) => {
        console.error("Upload file error ", error);
      });
  }
  let update = {};
  if (receivedData.ticketNumber) {
    update = {
      $set: {
        ...receivedData,
        ticketStatus: "Entry Done",
        ticketCreatedDate: new Date(),
      },
    };
  } else {
    update = {
      $set: receivedData,
    };
  }

  policy.findByIdAndUpdate({ _id: id }, update, function (error, response) {
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

module.exports.filterPolicyList = (
  clientId,
  receivedData,
  bodyParams,
  next,
  callback
) => {
  try{
      policy
    .find({
      $and: [
        { clientId: clientId },
        { documentType: DOCUMENT_TYPE.POLICY },
        receivedData,
      ],
    })
    .populate([
      { path: "companyId", model: companySchema ,select:{shortName:1}},
      { path: "userId", model: userSchema ,select:{email:1}},
      { path: "productId", model: Product ,select:{product:1}},
      { path: "subProductId", model: SubProduct ,select:{subProduct:1}},
      { path: "policyTypeId", model: policyTypeSchema ,select:{policyType:1}},
      { path: "bookingCodeId", model: bookingCode,select:{bookingCode:1} },
    ])
    .sort({ totalPremium: -1 })
    .exec(function (error, response) {
      if (error) {
        callback(error);
      } else {
        Promise.all(
          response.map((data) => {
            let policyNumber = data?.policyNumber;
            data.policyNumber = "'" + policyNumber;
            let mobileNumber = data?.mobileNumber || "";
            if (mobileNumber) {
              data.mobileNumber = "'" + mobileNumber + "'";
            }
            data.filterType = bodyParams.type;
            // console.log("filterType ", data.filterType);
          })
        );
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.renewalList = (clientId, receivedData,next,callback) => {
  try{
       policy
    .find({ $and: [{ clientId: clientId }, receivedData] })
    .populate([
      { path: "companyId", model: companySchema },
      { path: "userId", model: userSchema },
      { path: "productId", model: Product },
      { path: "subProductId", model: SubProduct },
      { path: "policyTypeId", model: policyTypeSchema },
      { path: "bookingCodeId", model: bookingCode },
    ])
    .exec(async function (error, response) {
      if (error) {
        callback(error);
      } else {
        await Promise.all(
          response.map((data) => {
            let policyNumber = data?.policyNumber;
            data.policyNumber = "'" + policyNumber;
            let mobileNumber = data?.mobileNumber || "";
            if (mobileNumber) {
              data.mobileNumber = "'" + mobileNumber + "'";
            }
          })
        );
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
 
};

// Changes by Arun
module.exports.verifyPolicy = async (files,next,callback) => {
  try{
      let response = await CommonUtil.readPolicyPDFFile(files[0].path);
    callback(null, response);
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.saveComissionReceivableAmount = async (
  id,
  receivedData,
  next,
  callback
) => {
  try {
    policy.findById(id, "commisionRecievable").exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        let commisionRecievableObj = response.commisionRecievable;
        let receivedAmount = Number(receivedData.receivedAmount);
        let oldReceivedAmount = Number(commisionRecievableObj.ReceivedAmount);
        let pendingAmount = Number(commisionRecievableObj.PendingAmount);
        let currentPendingAmount = pendingAmount - receivedAmount;
        let currentReceivedAmount = oldReceivedAmount + receivedAmount;
        commisionRecievableObj.PendingAmount = currentPendingAmount;
        commisionRecievableObj.ReceivedAmount = currentReceivedAmount;
        policy
          .findByIdAndUpdate(id, {
            $set: { commisionRecievable: commisionRecievableObj },
          })
          .exec(async function (updateerr, updateRes) {
            if (updateerr) {
              callback(updateerr);
            } else {
              let saveData = new CommisionReceivableTransaction(receivedData);
              await saveData.save();
              callback(null, { message: "Amount received" });
            }
          });
      }
    });
  } catch (error) {
    console.error("Error updating Comission Receivable Amount : ", error);
    next(error);
  }
};

// Changes by Somesh
module.exports.filterCCEntry = async (receivedData,next,callback) => {
  try{
      const query = {
    documentType: "POLICY",
    $or: [{ status: "approvePending" }, { status: "approvedPolicy" }],
  };

  if (receivedData.companyId)
    query.companyId = mongoose.Types.ObjectId(receivedData.companyId);
  if (receivedData.bookingCodeId)
    query.bookingCodeId = mongoose.Types.ObjectId(receivedData.bookingCodeId);
  if (receivedData.subBookingCodeId)
    query.subBookingCodeId = mongoose.Types.ObjectId(
      receivedData.subBookingCodeId
    );
  if (receivedData.startDate && receivedData.endDate) {
    query.issueDate = {
      $gte: receivedData.startDate,
      $lte: receivedData.endDate,
    };
  }
  if (receivedData.status === "entryDone") {
    query.ticketStatus = "Entry Done";
  }
  if (receivedData.status === "alreadyExist") {
    query.ticketStatus = "Already Exist";
    delete query["$or"];
  }

  try {
    const response = await policy.find(query).populate([
      { path: "companyId", model: companySchema },
      { path: "userId", model: userSchema },
      { path: "productId", model: Product },
      { path: "subProductId", model: SubProduct },
      { path: "policyTypeId", model: policyTypeSchema },
      { path: "bookingCodeId", model: bookingCode },
      { path: "subBookingCodeId", model: SubBookingCode },
    ]);

    let filteredResponse = response;
    // if (receivedData.status === "entryDone") {
    //   filteredResponse = response.filter((data) => {
    //     return data.ticketNumber && data?.subBookingCodeId?.cc === "Yes";
    //   });
    // }
    if (receivedData.status === "approvePending") {
      filteredResponse = response.filter((data) => {
        if (!data.ticketNumber && data?.subBookingCodeId?.cc === "Yes") {
          return true;
        }
      });
      // } else if (receivedData.status === "alreadyExsists") {
      //   filteredResponse = response.filter((data) => {
      //     if (!data.ticketNumber && data?.subBookingCodeId?.cc === "Yes") {
      //       return true;
      //     }
      //   });
    }

    callback(null, filteredResponse);
  } catch (err) {
    callback(err);
  }
  }catch(err){
    next(err);
  }
  
};

// Changes by Somesh
module.exports.filterCCEntryAll = async (next,callback) => {
  try {
    const response = await policy
      .find({
        documentType: "POLICY",
        $or: [{ status: "approvePending" }, { status: "approvedPolicy" }],
      })
      .populate([
        { path: "companyId", model: companySchema },
        { path: "userId", model: userSchema },
        { path: "productId", model: Product },
        { path: "subProductId", model: SubProduct },
        { path: "policyTypeId", model: policyTypeSchema },
        { path: "bookingCodeId", model: bookingCode },
        { path: "subBookingCodeId", model: SubBookingCode },
      ]);
    const filteredResponse = response.filter((data) => {
      return data?.subBookingCodeId?.cc === "Yes";
    });
    callback(null, filteredResponse);
  } catch (err) {
    // callback(err);
    next(err);
  }
};

// Changes by Somesh
module.exports.unlinkTicketNumber = async (id, receivedData,next,callback) => {
  try{
       let updateData = {};

  if (id && receivedData) {
    updateData = {
      $set: { ...receivedData, ticketStatus: "", ticketCreatedBy: "" },
      $unset: { ticketNumber: "", ticketCreatedDate: "" },
    };
  } else if (id) {
    updateData = {
      $set: { ticketStatus: "", ticketCreatedBy: "" },
      $unset: { ticketNumber: "", ticketCreatedDate: "" },
    };
  }

  policy.findByIdAndUpdate(id, updateData, function (error, response) {
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
