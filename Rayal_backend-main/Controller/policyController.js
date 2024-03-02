const service = require("../service/policyService");

module.exports.postPolicy = (req, res,next) => {
  if (!req.body.policyNumber) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Policy Number" });
  }
  var requestData = req.body;
  var files = req.files;
  var clientId = req.headers["clientid"];
  service.postPolicy(clientId, requestData, files, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Policy Number Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// getLoginPortal added by gokul...

module.exports.getLoginPortal = (req, res,next) => {
  const clientId = req.headers["clientid"];
  const userId = req.headers["companyuserid"];
  const companyId = req.headers["companyid"];

  service.getLoginPortal(clientId, userId, companyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.createPolicyMapping = (req, res,next) => {
  var requestData = req.body;
  var files = req.files;
  service.createPolicyMapping(requestData, files, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.updatePolicyMapping = (req, res,next) => {
  var requestData = req.body;
  service.updatePolicyMapping(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveCompanyWallet = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  requestData["clientId"] = clientId;
  service.saveCompanyWallet(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveWallet = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  requestData["clientId"] = clientId;
  service.saveWallet(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveUserConfig = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  requestData["clientId"] = clientId;
  service.saveUserConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.updateUserConfig = (req, res,next) => {
  var requestData = req.body;
  service.updateUserConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.updateBranchConfig = (req, res,next) => {
  var requestData = req.body;
  service.updateBranchConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.updateReceivableConfig = (req, res,next) => {
  var requestData = req.body;
  service.updateReceivableConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveBranchConfig = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  requestData["clientId"] = clientId;
  service.saveBranchConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveReceivableConfig = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  requestData["clientId"] = clientId;
  service.saveReceivableConfig(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getPolicy = (req, res,next) => {
  var clientId = req.headers["clientid"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.getPolicy(clientId, userId, userType, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getPolicyById = (req, res,next) => {
  var id = req.params.id;

  service.getPolicyById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getPolicyFileById = (req, res,next) => {
  var id = req.params.id;

  service.getPolicyFileById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.verifyPolicyNumber = (req, res,next) => {
  var policyNumber = req.params.policyNumber.split(",").join("/");

  service.verifyPolicyNumber(policyNumber, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.readPolicyFileByPolicyId = (req, res,next) => {
  var policyId = req.params.policyId;

  service.readPolicyFileByPolicyId(policyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.ticketAlreadyExist = (req, res,next) => {
  var policyId = req.params.policyId;
  var createdBy = req.body.createdBy;
  service.ticketAlreadyExist(policyId, createdBy, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getUserpayablePercentage = (req, res,next) => {
  var policyId = req.params.policyId;

  service.getUserpayablePercentage(policyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getBranchpayablePercentage = (req, res,next) => {
  var policyId = req.params.policyId;

  service.getBranchpayablePercentage(policyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getReceivablePercentage = (req, res,next) => {
  var policyId = req.params.policyId;

  service.getReceivablePercentage(policyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getPolicyMapping = (req, res,next) => {
  const userId = req.headers["mappinguserid"];
  const requestType = req.headers["requesttype"];
  service.getPolicyMapping(userId, requestType, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getPolicyMappingByPolicyID = (req, res,next) => {
  const policyId = req.params.policyId;
  service.getPolicyMappingByPolicyID(policyId,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getUserWallet = (req, res, next) => {
  const walletType = req.params.walletType;
  const clientId = req.headers["clientid"];
  const userId = req.headers["userref"];
  const startDate = req.headers["startdate"];
  const endDate = req.headers["enddate"];
  // Changes by Arun
  const headerUserId = req.headers["userid"];
  const userType = req.headers["usertype"];

  service.getUserWallet(
    clientId,
    userId,
    startDate,
    endDate,
    walletType,
    headerUserId,
    userType,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getCompanyWallet = (req, res, next) => {
  const clientId = req.headers["clientid"];
  const bookingCodeId = req.headers["bookingcodeid"];
  const subBookingCodeId = req.headers["subbookingcodeid"];
  const startDate = req.headers["startdate"];
  const endDate = req.headers["enddate"];

  service.getCompanyWallet(
    clientId,
    bookingCodeId,
    subBookingCodeId,
    startDate,
    endDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getBranchWallet = (req, res, next) => {
  const clientId = req.headers["clientid"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  // changes by gokul..
  const startDate=req.headers["startdate"];
  const endDate=req.headers["enddate"];
  service.getBranchWallet(clientId, userId, userType,startDate,endDate,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getBranchWalletByUserId = (req, res, next) => {
  const userId = req.params.userId;
  service.getBranchWalletByUserId(userId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getCompanyWalletBySubBookingCodeId = (req, res, next) => {
  const subBookingCodeId = req.params.subBookingCodeId;
  const startDate = req.headers["startdate"];
  const endDate = req.headers["enddate"];

  service.getCompanyWalletBySubBookingCodeId(
    subBookingCodeId,
    startDate,
    endDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getUserWalletByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const startDate = req.headers["startdate"];
  const endDate = req.headers["enddate"];
  service.getUserWalletByUserId(
    userId,
    startDate,
    endDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.deleteUserConfigById = (req, res, next) => {
  const id = req.params.id;
  service.deleteUserConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.deleteBranchConfigById = (req, res, next) => {
  const id = req.params.id;
  service.deleteBranchConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.deleteReceivableConfigById = (req, res, next) => {
  const id = req.params.id;
  service.deleteReceivableConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getUserConfigById = (req, res, next) => {
  const id = req.params.id;
  service.getUserConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getUserConfigByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const requestType = req.headers["requesttype"];
  // added by gokul...
  const companyId = req.headers["companyid"];
  const bookingCodeId = req.headers["bookingcodeid"];
  const subBookingCodeId = req.headers["subbookingcodeid"];
  // Changes by Arun
  const loginUserId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.getUserConfigByUserId(
    userId,
    companyId,
    bookingCodeId,
    subBookingCodeId,
    requestType,
    loginUserId,
    userType,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getBranchConfigById = (req, res, next) => {
  const id = req.params.id;
  service.getBranchConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getBranchConfigByBranchManagerId = (req, res, next) => {
  const id = req.params.id;
  const requestType = req.headers["requesttype"];
  service.getBranchConfigByBranchManagerId(
    id,
    requestType,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getReceivableConfigById = (req, res, next) => {
  const id = req.params.id;
  service.getReceivableConfigById(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getReceivableConfigByCompanyId = (req, res, next) => {
  const id = req.params.id;
  const requestType = req.headers["requesttype"];
  const bookingCodeId = req.headers["bookingcodeid"];
  const subBookingCodeId = req.headers["subbookingcodeid"];
  service.getReceivableConfigByCompanyId(
    id,
    bookingCodeId,
    subBookingCodeId,
    requestType,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.disableUserConfigById = (req, res, next) => {
  const id = req.params.id;
  const requestType = req.headers["requesttype"];
  const disableDate = req.headers["disabledate"];
  service.disableUserConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.disableBranchConfigById = (req, res, next) => {
  const id = req.params.id;
  const requestType = req.headers["requesttype"];
  const disableDate = req.headers["disabledate"];
  service.disableBranchConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.disableReceivableConfigById = (req, res, next) => {
  const id = req.params.id;
  const requestType = req.headers["requesttype"];
  const disableDate = req.headers["disabledate"];
  service.disableReceivableConfigById(
    id,
    requestType,
    disableDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

module.exports.getComissionReceivableAmount = (req, res, next) => {
  var id = req.params.id;

  service.getComissionReceivableAmount(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deletePolicy = (req, res, next) => {
  let id = req.params.id;
  service.deletePolicy(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.searchPolicy = (req, res, next) => {
  var requestData = req.body;
  const clientId = req.headers["clientid"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.searchPolicy(
    clientId,
    userId,
    userType,
    requestData,
    next,
    function (err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

module.exports.putPolicy = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  var files = req.files;
  service.putPolicy(id, requestData, files, next,function (error, data) {
    if (error) {
      // console.error("policy error ", error);
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Policy Number Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterPolicyList = (req, res, next) => {
  var requestData = req.body;
  const clientId = req.headers["clientid"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.filterPolicyList(
    clientId,
    userId,
    userType,
    requestData,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.renewalList = (req, res, next) => {
  var requestData = req.body;
  const clientId = req.headers["clientid"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.renewalList(
    clientId,
    userId,
    userType,
    requestData,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.verifyPolicy = (req, res, next) => {
  var files = req.files;
  service.verifyPolicy(files, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveComissionReceivableAmount = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.saveComissionReceivableAmount(
    id,
    requestData,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

module.exports.filterCCEntry = (req, res, next) => {
  var requestData = req.body;
  service.filterCCEntry(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterCCEntryAll = (req, res, next) => {
  service.filterCCEntryAll(next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.unlinkTicketNumber = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.unlinkTicketNumber(id, requestData,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
