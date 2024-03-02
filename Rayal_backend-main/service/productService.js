const dao = require("../dao/productDao");

module.exports.postProduct = (clientId,data, next, callback) => {
  dao.postProduct(clientId,data, next, function (err, result) {
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
module.exports.createSubProduct = (clientId,data, next, callback) => {
  dao.createSubProduct(clientId,data, next, function (err, result) {
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

module.exports.getProduct = (clientId, isAscending, next, callback) => {
  dao.getProduct(clientId, isAscending, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getSubProduct = (clientId,isAscending, next, callback) => {
  dao.getSubProduct(clientId,isAscending,next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getActiveProduct = (clientId, next, callback) => {
  dao.getActiveProduct(clientId,next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putProduct = (id, data, next, callback) => {
  dao.putProduct(id, data, next, function (err, result) {
    console.log("Err :"+err,result);
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
module.exports.putSubProduct = (id, data, next, callback) => {
  dao.putSubProduct(id, data, next, function (err, result) {
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

module.exports.deleteProduct = (id, next, callback) => {
  dao.deleteProduct(id, next, function (err, result) {
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

// Changes by Arun
module.exports.deleteSubProduct = (id, next, callback) => {
  dao.deleteSubProduct(id, next, function (err, result) {
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

module.exports.filterProduct = (clientId,data, next, callback) => {
  dao.filterProduct(clientId,data, next, function (err, result) {
    if (err) {
      callback(null);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// changes by somesh
module.exports.filterSubProduct = (clientId,data, next, callback) => {
  dao.filterSubProduct(clientId,data, next, function (err, result) {
    if (err) {
      callback(null);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

