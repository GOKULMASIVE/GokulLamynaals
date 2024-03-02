const service = require("../service/roleMenuService");

// Changes by Arun
module.exports.createMenu = (req, res, next) => {
  var requestData = req.body;
  service.createMenu(requestData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Menu Name already exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};
