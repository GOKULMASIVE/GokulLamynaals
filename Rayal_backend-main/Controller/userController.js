const service = require("../service/userService");

const server_constant = require("../configuration/constants");
var AWS = require("../shared/aws-s3-config");
const CommonUtil = require("../shared/common-util");
const s3 = new AWS.S3();
// const AWS_REGION = "ap-south-1";
// const AWS_ACCESS_KEY_ID = "AKIAUTOWISXA6WWZRV5G";
// const AWS_SECRET_ACCESS_KEY = "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";
// const BUCKET = "srktechnology";

const { S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");
const {
  AWS_INVOICE_DIRECTORY_NAME,
  AWS_BUCKET_NAME,
} = require("../configuration/constants");

module.exports.postUser = (req, res, next) => {
  var requestData = req.body;
  var files = req.files;
  var clientId = req.headers["clientid"];
  service.postUser(clientId, requestData, files, next, function (error, data) {
    if (error) {
      if (error.message.includes("email")) {
        res.status(200).send({ error: true, message: "Email already exists" });
      } else if (error.message.includes("mobileNumber")) {
        res
          .status(200)
          .send({ error: true, message: "Mobile Number already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.login = (req, res, next) => {
  var requestData = req.body;
  service.login(requestData, next, function (error, data) {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(200).send(data);
    }
  });
};


module.exports.getlogin = (req, res , next) => {
  console.log("getlogin",req.headers)
  var userId = req.headers['userid']
  var userType = req.headers['usertype']
  service.getlogin(userId,userType, next, function (error, data) {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
module.exports.register = (req, res, next) => {
  var requestData = req.body;
  service.register(requestData, next, function (error, data) {
    if (error) {
      if (error.message.includes("email")) {
        res.status(500).send({ error: true, message: "Email already exists" });
      } else if (error.message.includes("mobileNumber")) {
        res
          .status(500)
          .send({ error: true, message: "Mobile Number already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getUser = (req, res, next) => {
  var clientId = req.headers["clientid"];
  var requestType = req.headers["requesttype"];
  const isAscending=req.headers["isascending"];
  // Changes by Arun
  const userId = req.headers["userid"];
  const userType = req.headers["usertype"];
  service.getUser(
    clientId,isAscending,
    requestType,
    userId,
    userType,
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
module.exports.getFileFromAWSS3BucketByKey = (req, res, next) => {
  var fileKey = req.headers["key"];
  service.getFileFromAWSS3BucketByKey(fileKey, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getUserById = (req, res, next) => {
  var id = req.params.id;
  service.getUserById(id, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getBankDetailsByUserId = (req, res, next) => {
  var id = req.params.id;
  service.getBankDetailsByUserId(id, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putUser = (req, res, next) => {
  var id = req.params.id;
  var requestData = req.body;
  var files = req.files;
  service.putUser(id, requestData, files, next, function (error, data) {
    if (error) {
      if (error.message.includes("email")) {
        res.status(200).send({ error: true, message: "Email already exists" });
      } else if (error.message.includes("mobileNumber")) {
        res
          .status(200)
          .send({ error: true, message: "Mobile Number already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteUser = (req, res, next) => {
  var id = req.params.id;
  service.deleteUser(id, next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// Changes by Arun
exports.uploadMultipleFile = async function (req, res, next) {
  try{
      // test api
  let files = req.files;
  console.log("files", files);
  let awsS3PromiseResponse = [];
  await Promise.all(
    files?.map(async (file) => {
      console.log("file ", file);
      awsS3PromiseResponse.push(
        await CommonUtil.uploadFileToAWSS3(file, AWS_INVOICE_DIRECTORY_NAME)
      );
    })
  );
  await Promise.all(awsS3PromiseResponse).then(
    async (values) => {
      console.log("valuse ", values);
      res.status(200).send(awsS3PromiseResponse);
    },
    (error) => {
      throw Error(error);
    }
  );
  }catch(err){
    next(err);
  }
  
};

// written by gokul..
module.exports.verifyMobileNumber = (req, res, next) => {
  var { mobileNum } = req.params;
  service.verifyMobileNumber(mobileNum, next, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.verifyEmailAddress = (req, res, next) => {
  let { email } = req.params;
  service.verifyEmailAddress(email, next, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};
