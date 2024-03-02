const dao = require("../dao/clientDao");

module.exports.postClient = (data, next,callback) => {
  dao.postClient(data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Saved Succuesfully" });
    }
  });
};

module.exports.getAllClient = (data, next,callback) => {
  dao.getClient({},next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.updateClient = (id, data, next,callback) => {
  dao.updateClient(id, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Updated Successfully" });
    }
  });
};

module.exports.deleteClient = (data, next,callback) => {
  dao.deleteClient(data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Deleted Successfully" });
    }
  });
};

