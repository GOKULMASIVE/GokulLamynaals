const dao = require("../dao/fuelTypeDao");

module.exports.postFuelType = (clientId, data, next,callback) => {
  dao.postFuelType(clientId, data, next,function (err, result) {
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

module.exports.getFuelType = (clientId, data, next,callback) => {
  dao.getFuelType(clientId, {}, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putFuelType = (id, data, next,callback) => {
  dao.putFuelType(id, data, next,function (err, result) {
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

module.exports.filterFuelType = (clientId, data, next,callback) => {
  dao.filterFuelType(clientId, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};
