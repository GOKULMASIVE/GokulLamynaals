const service = require("../service/clientService");

module.exports.postClient = (req, res,next) => {
  var requestData = req.body;
  if (!requestData.client) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Client Name" });
  }
  service.postClient(requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Client name already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getAllClient = (req, res,next) => {
  var requestData = req.body;
  service.getAllClient(requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.updateClient = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.updateClient(id, requestData, next,function (error, data) {
    if (error) {
      if(error.code === 11000){
        res.status(200).send({error : true , message : "Client Already Exist"})
      }
      else {
      res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteClient = (req, res,next) => {
  var id = req.params.id;
  service.deleteClient(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
