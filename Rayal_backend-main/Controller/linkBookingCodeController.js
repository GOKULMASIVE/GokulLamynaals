const service = require("../service/linkBookingCodeService");

module.exports.postLinkBookingCode = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  if (!requestData.companyId) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Company" });
  }
  if (!requestData.bookingCodeId) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Booking Code" });
  }
  service.postLinkBookingCode(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: " Link Booking Code Already exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getLinkBookingCode = (req, res,next) => {
  var clientId = req.headers["clientid"];
  service.getLinkBookingCode(clientId,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putLinkBookingCode = (req, res,next) => {
  var id = req.params.id;
  var receivedData = req.body;
  service.putLinkBookingCode(id, receivedData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({ error: true, message: " Link Already Exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteLinkBookingCode = (req, res,next) => {
  var id = req.params.id;
  service.deleteLinkBookingCode(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterLinkBookingCode = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterLinkBookingCode(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
