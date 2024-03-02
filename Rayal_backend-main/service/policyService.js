const { USER_TYPE } = require("../configuration/constants");
const UserSchema = require("../Model/user");
const mongoose = require("mongoose");
const dao = require("../dao/policyDao");

module.exports.postPolicy = (clientId, data, files, next, callback) => {
  dao.postPolicy(clientId, data, files, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

// getLoginPortal added by gokul...

module.exports.getLoginPortal = (
  clientId,
  userId,
  companyId,
  next,
  callback
) => {
  dao.getLoginPortal(
    clientId,
    userId,
    companyId,
    next,
    function (error, result) {
      if (error) {
        callback(error);
      } else {
        callback(null, {
          error: false,
          data: result,
          message: null,
        });
      }
    }
  );
};

// Changes by Arun
module.exports.createPolicyMapping = (data, files, next, callback) => {
  dao.createPolicyMapping(data, files, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Mapping Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.updatePolicyMapping = (requestData, next, callback) => {
  dao.updatePolicyMapping(requestData, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Mapping Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveCompanyWallet = (data, next, callback) => {
  dao.saveCompanyWallet(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveWallet = (data, next, callback) => {
  dao.saveWallet(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveUserConfig = (data, next, callback) => {
  dao.saveUserConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.updateUserConfig = (data, next, callback) => {
  dao.updateUserConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Update Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.updateBranchConfig = (data, next, callback) => {
  dao.updateBranchConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Update Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.updateReceivableConfig = (data, next, callback) => {
  dao.updateReceivableConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Update Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveBranchConfig = (data, next, callback) => {
  dao.saveBranchConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveReceivableConfig = (data, next, callback) => {
  dao.saveReceivableConfig(data, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "saved Successfully",
      });
    }
  });
};

module.exports.getPolicy = (clientId, userId, userType, next, callback) => {
  dao.getPolicy(clientId, userId, userType, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getPolicyById = (id, next, callback) => {
  dao.getPolicyById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.ticketAlreadyExist = (id, createdBy, next, callback) => {
  dao.ticketAlreadyExist(id, createdBy, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getPolicyFileById = (id, next, callback) => {
  dao.getPolicyFileById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.verifyPolicyNumber = (policyNumber, next, callback) => {
  dao.verifyPolicyNumber(policyNumber, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.readPolicyFileByPolicyId = (policyId, next, callback) => {
  dao.readPolicyFileByPolicyId(policyId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getUserpayablePercentage = (policyId, next, callback) => {
  dao.getUserpayablePercentage(policyId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getBranchpayablePercentage = (policyId, next, callback) => {
  dao.getBranchpayablePercentage(policyId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getReceivablePercentage = (policyId, next, callback) => {
  dao.getReceivablePercentage(policyId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getCompanyWallet = (
  clientId,
  bookingCodeId,
  subBookingCodeId,
  startDate,
  endDate,
  next,
  callback
) => {
  dao.getCompanyWallet(
    clientId,
    bookingCodeId,
    subBookingCodeId,
    startDate,
    endDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getPolicyMapping = (userId, requestType, next, callback) => {
  dao.getPolicyMapping(userId, requestType, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getPolicyMappingByPolicyID = (policyId, next, callback) => {
  dao.getPolicyMappingByPolicyID(policyId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getUserWallet = (
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
  dao.getUserWallet(
    clientId,
    userId,
    startDate,
    endDate,
    walletType,
    headerUserId,
    userType,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getBranchWallet = (
  clientId,
  userId,
  userType,
  startDate,
  endDate,
  next,
  callback
) => {
  dao.getBranchWallet(
    clientId,
    userId,
    userType,
    startDate,
    endDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getBranchWalletByUserId = (userId, next, callback) => {
  dao.getBranchWalletByUserId(userId, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getCompanyWalletBySubBookingCodeId = (
  subBookingCodeId,
  startDate,
  endDate,
  next,
  callback
) => {
  dao.getCompanyWalletBySubBookingCodeId(
    subBookingCodeId,
    startDate,
    endDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.deleteUserConfigById = (id, next, callback) => {
  dao.deleteUserConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Delete Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.deleteBranchConfigById = (id, next, callback) => {
  dao.deleteBranchConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Delete Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.deleteReceivableConfigById = (id, next, callback) => {
  dao.deleteReceivableConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Delete Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.getUserConfigById = (id, next, callback) => {
  dao.getUserConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getUserConfigByUserId = (
  userId,
  companyId,
  bookingCodeId,
  subBookingCodeId,
  requestType,
  loginUserId,
  userType,
  next,
  callback
) => {
  dao.getUserConfigByUserId(
    userId,
    companyId,
    bookingCodeId,
    subBookingCodeId,
    requestType,
    loginUserId,
    userType,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getBranchConfigById = (id, next, callback) => {
  dao.getBranchConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getBranchConfigByBranchManagerId = (
  id,
  requestType,
  next,
  callback
) => {
  dao.getBranchConfigByBranchManagerId(
    id,
    requestType,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getReceivableConfigById = (id, next, callback) => {
  dao.getReceivableConfigById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
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
  dao.getReceivableConfigByCompanyId(
    id,
    bookingCodeId,
    subBookingCodeId,
    requestType,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.disableUserConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {
  dao.disableUserConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          error: false,
          data: result,
          message:
            requestType && requestType == "true"
              ? "Disabled Successfully"
              : "Enabled Successfully",
        });
      }
    }
  );
};

// Changes by Arun
module.exports.disableBranchConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {
  dao.disableBranchConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          error: false,
          data: result,
          message: "Disabled Successfully",
          // requestType && requestType == "true"
          //   ? "Disabled Successfully"
          //   : "Enabled Successfully",
        });
      }
    }
  );
};

// Changes by Arun
module.exports.disableReceivableConfigById = (
  id,
  requestType,
  disableDate,
  next,
  callback
) => {
  dao.disableReceivableConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          error: false,
          data: result,
          message: "Disabled Successfully",
          // requestType && requestType == "true"
          //   ? "Disabled Successfully"
          //   : "Enabled Successfully",
        });
      }
    }
  );
};

// Changes by Arun
module.exports.getUserWalletByUserId = (
  userId,
  startDate,
  endDate,
  next,
  callback
) => {
  dao.getUserWalletByUserId(
    userId,
    startDate,
    endDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

module.exports.getComissionReceivableAmount = (id, next, callback) => {
  dao.getComissionReceivableAmount(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.deletePolicy = (id, next, callback) => {
  dao.deletePolicy(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Deleted Successfully",
      });
    }
  });
};

module.exports.searchPolicy = (
  clientId,
  userId,
  userType,
  receivedData,
  next,
  callback
) => {
  dao.searchPolicy(
    clientId,
    userId,
    userType,
    receivedData,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

module.exports.putPolicy = (id, receivedData, files, next, callback) => {
  dao.putPolicy(id, receivedData, files, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Updated Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.renewalList = (
  clientId,
  userId,
  userType,
  receivedData,
  next,
  callback
) => {
  var sendData = {};
  // Changes by Arun
  if (userType == USER_TYPE.USER) {
    sendData.userId = mongoose.Types.ObjectId(userId);
  }

  if (receivedData.startDate && receivedData.endDate) {
    sendData.odPolicyEndDate = {
      $gte: new Date(receivedData.startDate),
      $lte: new Date(receivedData.endDate),
    };
    // sendData.tpPolicyEndDate = {
    //   $gte: new Date(receivedData.startDate),
    //   $lte: new Date(receivedData.endDate),
    // };
  }

  dao.renewalList(clientId, sendData, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.filterPolicyList = async (
  clientId,
  userId,
  userType,
  receivedData,
  next,
  callback
) => {
  var sendData = {};
  // Changes by Arun
  if (userType == USER_TYPE.USER) {
    sendData.userId = mongoose.Types.ObjectId(userId);
  }

  if (userType == USER_TYPE.BRANCH_MANAGER) {
    let userList = await UserSchema.find({ branchManager: userId }, { _id: 1 });
    let userIdList = [];
    await Promise.all(
      userList.map((element) => {
        userIdList.push(element._id);
      })
    );
    console.log("userIdList ", userIdList);
    sendData.userId = { $in: userIdList };
  }

  if (receivedData.status) {
    if (receivedData.status != "allPolicy") {
      sendData.status = receivedData.status;
    }
  }
  if (receivedData.companyId) {
    sendData.companyId = receivedData.companyId;
  }
  if (receivedData.productId) {
    sendData.productId = receivedData.productId;
  }
  if (receivedData.bookingCodeId) {
    sendData.bookingCodeId = receivedData.bookingCodeId;
  }
  if (receivedData.FilterType === "Old_Policy") {
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (receivedData.startDate && receivedData.endDate) {
      sendData.issueDate = {
        $gte: new Date(receivedData.startDate),
        $lte: new Date(receivedData.endDate),
      };
    } else {
      sendData.issueDate = {
        $lte: oneYearAgo,
      };
    }
  } else if (receivedData.FilterType === "PENDING_POLICY") {
    sendData["$or"] = [
      {
        status: "approvePending",
      },
      {
        status: "entryPending",
      },
      {
        status: "verifyPending",
      },
    ];
  } else if (receivedData.FilterType === "UTILITES_SCREEN") {
    // Changes by Arun
    if (receivedData.screen === "USER_PAYABLE") {
      if (receivedData.type === "PENDING") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isUserPayable = false;
        sendData.status = "approvePending";
      } else if (receivedData.type === "ISSUE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isUserPayable = true;
      } else if (receivedData.type === "APPROVE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          // sendData.userPayable = {};
          // if (sendData.userPayable) {
          sendData["userPayable.createdAt"] = {
            // createdAt: {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
            // },
          };
          // }
        }
        sendData.isUserPayable = true;
      } else {
        console.error("Invalid Filter on User payable screen");
      }
    }
    if (receivedData.screen === "COMMISION_RECIVABLE") {
      if (receivedData.type === "PENDING") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isUserPayable = true;
        sendData.isCommisionRecievable = false;
      } else if (receivedData.type === "ISSUE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isCommisionRecievable = true;
      } else if (receivedData.type === "APPROVE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData["commisionRecievable.createdAt"] = {
            // createdAt: {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
            // },
          };
        }
        sendData.isCommisionRecievable = true;
      } else {
        console.error("Invalid Filter on User payable screen");
      }
    }
    if (receivedData.screen === "BRANCH_PAYABLE") {
      if (receivedData.type === "PENDING") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isUserPayable = true;
        sendData.isBranchPayable = false;
      } else if (receivedData.type === "ISSUE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData.issueDate = {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
          };
        }
        sendData.isBranchPayable = true;
      } else if (receivedData.type === "APPROVE_DATE") {
        if (receivedData.startDate && receivedData.endDate) {
          sendData["branchPayable.createdAt"] = {
            // createdAt: {
            $gte: new Date(receivedData.startDate),
            $lte: new Date(receivedData.endDate),
            // },
          };
        }
        sendData.isBranchPayable = true;
      } else {
        console.error("Invalid Filter on User payable screen");
      }
    }
  } else {
    if (receivedData.startDate && receivedData.endDate) {
      sendData.issueDate = {
        $gte: new Date(receivedData.startDate),
        $lte: new Date(receivedData.endDate),
      };
    }
  }

  dao.filterPolicyList(
    clientId,
    sendData,
    receivedData,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.verifyPolicy = (files, next, callback) => {
  dao.verifyPolicy(files, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Saved Successfully",
      });
    }
  });
};

// Changes by Arun
module.exports.saveComissionReceivableAmount = (
  id,
  receivedData,
  next,
  callback
) => {
  dao.saveComissionReceivableAmount(
    id,
    receivedData,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          error: false,
          data: result,
          message: "Updated Successfully",
        });
      }
    }
  );
};

module.exports.filterCCEntry = (receivedData, next, callback) => {
  dao.filterCCEntry(receivedData, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Updated Successfully",
      });
    }
  });
};
module.exports.filterCCEntryAll = (next, callback) => {
  dao.filterCCEntryAll(next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Updated Successfully",
      });
    }
  });
};
module.exports.unlinkTicketNumber = (id, receivedData, next, callback) => {
  dao.unlinkTicketNumber(id, receivedData, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Updated Successfully",
      });
    }
  });
};
