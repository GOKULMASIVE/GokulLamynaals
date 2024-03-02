const dao = require("../dao/userDao");

module.exports.postUser = (clientId, data, files, next, callback) => {
  dao.postUser(clientId, data, files, next, function (err, result) {
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
module.exports.login = (data, next, callback) => {
  dao.login(data, next, function (err, result) {
    if (err) {
      console.log("err ", err);
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Login Successfully",
      });
    }
  });
};

module.exports.getlogin = (userId, userType, next, callback) => {
  dao.getlogin(userId, userType, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

// Changes by Arun
module.exports.register = (data, next, callback) => {
  dao.register(data, next, function (err, result) {
    if (err) {
      console.log("err ", err);
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: {},
        message: "Registered Successfully",
      });
    }
  });
};

module.exports.getUser = (
  clientId,
  isAscending,
  requestType,
  userId,
  userType,
  next,
  callback
) => {
  dao.getUser(
    clientId,
    isAscending,
    requestType,
    userId,
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

module.exports.getUserById = (id, next, callback) => {
  dao.getUserById(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.getBankDetailsByUserId = (id, next, callback) => {
  dao.getBankDetailsByUserId(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getFileFromAWSS3BucketByKey = (fileKey, next, callback) => {
  dao.getFileFromAWSS3BucketByKey(fileKey, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putUser = (id, data, files, next, callback) => {
  dao.putUser(id, data, files, next, function (err, result) {
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

module.exports.deleteUser = (id, next, callback) => {
  dao.deleteUser(id, next, function (err, result) {
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

// written by gokul..

module.exports.verifyMobileNumber = (mobileNum, next, callback) => {
  dao.verifyMobileNumber(mobileNum, next, function (err, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: res, message: null });
    }
  });
};

module.exports.verifyEmailAddress = (email, next, callback) => {
  dao.verifyEmailAddress(email, next, function (err, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: res, message: null });
    }
  });
};
