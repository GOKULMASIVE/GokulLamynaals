const dao = require("../dao/companyDao");

module.exports.postCompany = (clientId, data, next,callback) => {
  dao.postCompany(clientId, data, next,function (err, result) {
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

module.exports.getCompany = (clientId,isAscending, data, next,callback) => {
  dao.getCompany(clientId, isAscending, {},next, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getRTO = (next,callback) => {
  dao.getRTO(next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.saveCompanyRTO = (clientId, data, next,callback) => {
  dao.saveCompanyRTO(clientId, data, next,function (err, result) {
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

// Changes by Arun
module.exports.updateCompanyRTO = (id, data, next,callback) => {
  dao.updateCompanyRTO(id, data, next,function (err, result) {
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

// Changes by Arun
module.exports.getCompanyRTO = (clientId,requestType, next,callback) => {
  dao.getCompanyRTO(clientId,requestType, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getCompanyRTOByID = (clientId, companyRTOID, next,callback) => {
  dao.getCompanyRTOByID(clientId, companyRTOID, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

// Changes by Arun
module.exports.getRTOLocationByCompanyID = (companyId, next,callback) => {
  dao.getRTOLocationByCompanyID(companyId, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.updateCompany = (id, data, next,callback) => {
  dao.updateCompany(id, data, next,function (err, result) {
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

module.exports.deleteCompany = (data, next,callback) => {
  dao.deleteCompany(data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Deleted Successfully",
      });
    }
  });
};

module.exports.filterCompany = (clientId, data, next,callback) => {
  dao.filterCompany(clientId, data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.deleteRTO = (data,next, callback) => {
  dao.deleteRTO(data, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        error: false,
        data: result,
        message: "Deleted Successfully",
      });
    }
  });
};

