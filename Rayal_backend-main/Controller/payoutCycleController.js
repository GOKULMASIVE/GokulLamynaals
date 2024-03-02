const service = require("../service/payoutCycleService");

module.exports.postPayoutCycle = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.postPayoutCycle(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Payout Cycle already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getPayoutCycle = (req, res,next) => {
  let requestData = req.data;
  var clientId = req.headers["clientid"];
  service.getPayoutCycle(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putPayoutCycle = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.putPayoutCycle(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Already Payout Cycle Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterPayoutCycle = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterPayoutCycle(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
