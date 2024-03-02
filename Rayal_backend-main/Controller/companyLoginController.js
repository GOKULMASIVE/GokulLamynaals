const service = require("../service/companyLoginService");

module.exports.postCompanyLogin = (req, res,next) => {
  if (!req.body) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide All Details" });
  }
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.postCompanyLogin(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        return res
          .status(200)
          .send({ error: true, message: "Login id already Exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.verifyLoginId = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.verifyLoginId(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getCompanyLogin = (req, res,next) => {
  var clientId = req.headers["clientid"];
  service.getCompanyLogin(clientId, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putCompanyLogin = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.putCompanyLogin(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({ error: true, message: " Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteCompanyLogin = (req, res,next) => {
  var id = req.params.id;
  service.deleteCompanyLogin(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.searchCompanyLogin = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.searchCompanyLogin(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
