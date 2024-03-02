const service = require("../service/branchService");

module.exports.postBranch = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"]
  if (!requestData.branchName) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Branch Name" });
  }
  service.postBranch(clientId,requestData,next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Branch name already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getAllBranch = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"]
  service.getAllBranch(clientId,requestData,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.updateBranch = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.updateBranch(id, requestData, next,function (error, data) {
    if (error) {
      if(error.code === 11000){
        res.status(200).send({error : true , message : "Branch Already Exist"})
      }
      else {
      res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteBranch = (req, res,next) => {
  var id = req.params.id;
  service.deleteBranch(id, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterBranch = (req,res,next) =>{
  var requestData = req.body;
  var clientId = req.headers["clientid"]
  service.filterBranch(clientId,requestData,next,function(error,data){
    if(error){
      res.status(500).send(error)
    }
    else {
      res.status(200).send(data)
    }
  })
}