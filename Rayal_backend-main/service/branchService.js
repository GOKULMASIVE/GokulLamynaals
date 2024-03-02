const dao = require("../dao/branchDao");

module.exports.postBranch = (clientId,data,next, callback) => {
  dao.postBranch(clientId,data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Saved Succuesfully" });
    }
  });
};

module.exports.getAllBranch = (clientId,data, next,callback) => {
  dao.getBranch(clientId,{},next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.updateBranch = (id, data, next,callback) => {
  dao.updateBranch(id, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Updated Successfully" });
    }
  });
};

module.exports.deleteBranch = (data, next,callback) => {
  dao.deleteBranch(data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: "Deleted Successfully" });
    }
  });
};

module.exports.filterBranch = (clientId,data,next, callback) => {
  dao.filterBranch(clientId,data,next, function (err, result) {
    if (err) {
      callback(err)
    }
    else {
      callback(null, ({ error: null, data: result, message: null }))
    }
  })
}