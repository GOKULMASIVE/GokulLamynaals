const service = require("../service/vehicleMakeService");
//added by gokul....
module.exports.postVehicleMake = (req, res, next) => {
  var requestedData = req.body;
  var clientId = req.headers["clientid"];
  service.postVehicleMake(clientId, requestedData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: "VehicleMake is already exists",
        });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getVehicleMake = (req, res, next) => {
  var clientId = req.headers["clientid"];
  const isAscending = req.headers["isascending"];
  service.getVehicleMake(clientId, isAscending, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putVehicleMake = (req, res, next) => {
  var { id } = req.params;
  var requestData = req.body;
  service.putVehicleMake(id, requestData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: "Vehicle is already exists",
        });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteVehicleMake = (req, res, next) => {
  const { id } = req.params;
  service.deleteVehicleMake(id, next, function (error, data) {
    if (error) {
      res.status(500).send({
        error: true,
        message: error.message,
      });
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterVehicleMake = (req, res, next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterVehicleMake(clientId, requestData, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
