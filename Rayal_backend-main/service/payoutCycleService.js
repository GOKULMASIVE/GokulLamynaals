const dao = require("../dao/payoutCycleDao");

module.exports.postPayoutCycle = (clientId, data, next,callback) => {
  dao.postPayoutCycle(clientId, data, next,function (err, result) {
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

module.exports.getPayoutCycle = (clientId, data, next,callback) => {
  dao.getPayoutCycle(clientId, {}, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putPayoutCycle = (id, data, next,callback) => {
  dao.putPayoutCycle(id, data, next,function (err, result) {
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

module.exports.filterPayoutCycle = (clientId, data, next,callback) => {
  dao.filterPayoutCycle(clientId, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};
