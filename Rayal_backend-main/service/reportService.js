const dao = require("../dao/reportDao");

// Changes by Arun
module.exports.getMasterReport = (
  clientId,
  requestType,
  body,
  next,
  callback
) => {
  dao.getMasterReport(
    clientId,
    requestType,
    body,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getMasterReportExcelFormat = (
  clientId,
  body,
  next,
  callback
) => {
  dao.getMasterReportExcelFormat(clientId, body, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getPolicyChequeReport = (clientId, body, next, callback) => {
  dao.getPolicyChequeReport(clientId, body, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getBookingReport = (clientId, body, next, callback) => {
  dao.getBookingReport(clientId, body, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getDashboard = (
  clientId,
  userId,
  userType,
  startDate,
  endDate,
  next,
  callback
) => {
  dao.getDashboard(
    clientId,
    userId,
    userType,
    startDate,
    endDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getPaidReceivedReport = (
  clientId,
  requestType,
  body,
  next,
  callback
) => {
  dao.getPaidReceivedReport(
    clientId,
    requestType,
    body,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

// Changes by Arun
module.exports.getTDSReport = (
  clientId,
  requestType,
  selectedDate,
  next,
  callback
) => {
  dao.getTDSReport(
    clientId,
    requestType,
    selectedDate,
    next,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, { error: false, data: result, message: null });
      }
    }
  );
};

//change by gokul
module.exports.deletePaidRecievedReport = (id, next, callback) => {
  dao.deletePaidRecievedReport(id, next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Deleted successfully",
      });
    }
  });
};

//change by gokul
module.exports.updatePaidRecievedReport = (
  id,
  receivedData,
  next,
  callback
) => {
  dao.updatePaidRecievedReport(id, receivedData, next, function (err, result) {
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
