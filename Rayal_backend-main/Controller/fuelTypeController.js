const service = require("../service/fuelTypeService");

module.exports.postFuelType = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.postFuelType(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Fuel Type already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getFuelType = (req, res,next) => {
  let requestData = req.data;
  var clientId = req.headers["clientid"];
  service.getFuelType(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putFuelType = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.putFuelType(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Fuel Type already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterFuelType = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterFuelType(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
