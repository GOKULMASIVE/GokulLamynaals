const service = require("../service/reportService");

// Changes by Arun
module.exports.getMasterReport = (req, res, next) => {
  const requestType = req.headers["requesttype"];
  const clientId = req.headers["clientid"];
  const body = req.body;
  service.getMasterReport(
    clientId,
    requestType,
    body,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getMasterReportExcelFormat = (req, res, next) => {
  const body = req.body;
  const clientId = req.headers["clientid"];
  service.getMasterReportExcelFormat(
    clientId,
    body,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getPolicyChequeReport = (req, res, next) => {
  const body = req.body;
  const clientId = req.headers["clientid"];
  service.getPolicyChequeReport(clientId, body, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getBookingReport = (req, res, next) => {
  const body = req.body;
  const clientId = req.headers["clientid"];
  service.getBookingReport(clientId, body, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getDashboard = (req, res, next) => {
  const clientId = req.headers["clientid"];
  const startDate = req.headers["startdate"];
  const endDate = req.headers["enddate"];
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];

  service.getDashboard(
    clientId,
    userId,
    userType,
    startDate,
    endDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getPaidReceivedReport = (req, res, next) => {
  const requestType = req.headers["requesttype"];
  const clientId = req.headers["clientid"];
  const body = req.body;
  console.log("body ", clientId);
  service.getPaidReceivedReport(
    clientId,
    requestType,
    body,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Changes by Arun
module.exports.getTDSReport = (req, res, next) => {
  const clientId = req.headers["clientid"];
  const requestType = req.headers["requesttype"];
  const selectedDate = req.headers["selecteddate"];
  service.getTDSReport(
    clientId,
    requestType,
    selectedDate,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

// Change by gokul

module.exports.deletePaidRecievedReport = (req, res, next) => {
  const { id } = req.params;
  service.deletePaidRecievedReport(id, next, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};

//change by gokul
module.exports.updatePaidRecievedReport = (req, res, next) => {
  const { id } = req.params;
  const requestedData = req.body;
  service.updatePaidRecievedReport(
    id,
    requestedData,
    next,
    function (err, data) {
      if (err) {
        if (err.code === 11000) {
          res
            .status(200)
            .send({ error: true, message: "This is already exists" });
        } else {
          res.status(500).send(err);
        }
      } else {
        res.status(200).send(data);
      }
    }
  );
};
