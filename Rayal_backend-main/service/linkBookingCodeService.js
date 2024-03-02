const dao = require("../dao/linkBookingCode");

module.exports.postLinkBookingCode = (clientId, data, next,callback) => {
  dao.postLinkBookingCode(clientId, data, next,function (err, result) {
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

module.exports.getLinkBookingCode = (clientId, next,callback) => {
  dao.getLinkBookingCode(clientId, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putLinkBookingCode = (id, data, next,callback) => {
  dao.putLinkbookingCode(id, data, next,function (err, result) {
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

module.exports.deleteLinkBookingCode = (id, next,callback) => {
  dao.deleteLinkBookingCode(id, next,function (err, result) {
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

module.exports.filterLinkBookingCode = (clientId, data, next,callback) => {
  dao.filterLinkBookingCode(clientId, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};
