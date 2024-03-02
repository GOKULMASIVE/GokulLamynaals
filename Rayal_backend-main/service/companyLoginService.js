const dao = require("../dao/companyLoginDao");

module.exports.postCompanyLogin = (clientId, data, next,callback) => {
  dao.postCompanyLogin(clientId, data, next,function (err, result) {
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

module.exports.verifyLoginId = (clientId, data, next,callback) => {
  dao.verifyLoginId(clientId, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: "",
      });
    }
  });
};

module.exports.getCompanyLogin = (clientId, next,callback) => {
  dao.getCompanyLogin(clientId, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putCompanyLogin = (id, data,next, callback) => {
  dao.putCompanyLogin(id, data, next,function (err, result) {
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

module.exports.deleteCompanyLogin = (data, next,callback) => {
  dao.deleteCompanyLogin(data,next, function (err, result) {
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

module.exports.searchCompanyLogin = (clientId, data, next,callback) => {
  var sendData = {};
  if (data.userId) {
    sendData.userId = data.userId;
  }
  if (data.companyId) {
    sendData.companyId = data.companyId;
  }
  if (data.bookingCodeId) {
    sendData.bookingCodeId = data.bookingCodeId;
  }

  // added by gokul..
  if (data.subBookingCodeId) {
    sendData.subBookingCodeId = data.subBookingCodeId;
  }

  // Changes by Arun
  if (data.requestType) {
    sendData.requestType = data.requestType;
  }

  dao.searchCompanyLogin(clientId, sendData, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};
