const service = require("../service/companyService");

module.exports.postCompany = (req, res,next) => {
  if (!req.body.companyName) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide companyName" });
  }
  if (!req.body.shortName) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Short Name" });
  }
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.postCompany(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        return res
          .status(200)
          .send({ error: true, message: "company name already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getCompany = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  const isAscending=req.headers["isascending"]
  service.getCompany(clientId,isAscending, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getRTO = (req, res,next) => {
  service.getRTO(next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.saveCompanyRTO = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  if (!requestData.companyId) {
    return res
      .status(200)
      .send({ error: true, message: "Please Select Company" });
  }
  if (!requestData.location) {
    return res
      .status(200)
      .send({ error: true, message: "Please provide location" });
  }
  if (!requestData.RTOCode) {
    return res
      .status(200)
      .send({ error: true, message: "Please Select RTO Code" });
  }
  service.saveCompanyRTO(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: " Company and Location Already exist",
        });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.updateCompanyRTO = (req, res,next) => {
  var requestData = req.body;
  var id = req.params.id;
  service.updateCompanyRTO(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: " Company and Location Already exist",
        });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getCompanyRTOByID = (req, res,next) => {
  var clientId = req.headers["clientid"];
  const companyRTOID = req.params.companyRTOID;
  service.getCompanyRTOByID(clientId, companyRTOID, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getRTOLocationByCompanyID = (req, res,next) => {
  const companyId = req.params.companyId;
  service.getRTOLocationByCompanyID(companyId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getCompanyRTO = (req, res,next) => {
  var clientId = req.headers["clientid"];
  var requestType = req.headers["requesttype"];

  service.getCompanyRTO(clientId, requestType, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.updateCompany = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.updateCompany(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Company Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteCompany = (req, res,next) => {
  var id = req.params.id;
  service.deleteCompany(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterCompany = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterCompany(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteRTO = (req, res,next) => {
  var id = req.params.id;
  service.deleteRTO(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
