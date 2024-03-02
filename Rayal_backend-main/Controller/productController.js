const service = require("../service/productService");

module.exports.postProduct = (req, res, next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  if (!requestData.product) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Product Name" });
  }
  service.postProduct(clientId, requestData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Already Product Name exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.createSubProduct = (req, res, next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];

  if (!requestData.productID) {
    return res
      .status(200)
      .send({ error: true, message: "Please Select Product" });
  }
  if (!requestData.subProduct) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Sub Product Name" });
  }

  service.createSubProduct(clientId, requestData, next, function (error, data) {
    // if (error) {
    //   res.status(500).send(error);
    // } else {
    //   res.status(200).send(data);
    // }
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Already SubProduct Name exist" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getProduct = (req, res, next) => {
  var clientId = req.headers["clientid"];
  const isAscending=req.headers["isascending"];
  service.getProduct(clientId, isAscending, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.getSubProduct = (req, res, next) => {
  var clientId = req.headers["clientid"];
  const isAscending=req.headers["isascending"];
  service.getSubProduct(clientId,isAscending, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
// Changes by Arun
module.exports.getActiveProduct = (req, res, next) => {
  service.getActiveProduct(next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putProduct = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  service.putProduct(id, requestData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Product Already Exists" });
      } else {
        //console.log("Err :"+error.message);
        res.status(500).send({ error: true, message: error.message });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.putSubProduct = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  // if (!requestData.productID) {
  //   return res
  //     .status(200)
  //     .send({ error: true, message: "Please Select Product" });
  // }
  // if (!requestData.subProduct) {
  //   return res
  //     .status(200)
  //     .send({ error: true, message: "Please Provide Sub Product Name" });
  // }

  service.putSubProduct(id, requestData, next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Sub Product Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteProduct = (req, res, next) => {
  var id = req.params.id;
  service.deleteProduct(id, next, function (error, data) {
    if (error) {
      res.status(500).send({ error: true, message: error.message });
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.deleteSubProduct = (req, res, next) => {
  var id = req.params.id;
  service.deleteSubProduct(id,  next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterProduct = (req, res, next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterProduct(clientId, requestData, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// changes by somesh

module.exports.filterSubProduct = (req, res, next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterSubProduct(clientId, requestData, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
