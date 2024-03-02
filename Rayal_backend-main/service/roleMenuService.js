const dao = require("../dao/roleMenuDao");

// Changes by Arun
module.exports.createMenu = (data, next,callback) => {
  dao.createMenu(data, next, function (err, result) {
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
