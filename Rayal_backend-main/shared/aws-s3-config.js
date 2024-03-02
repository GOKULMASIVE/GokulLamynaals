const AWS = require("aws-sdk");
const { AWS_S3_CONFIGURATION } = require("../configuration/constants");

AWS.config.update({
  accessKeyId: AWS_S3_CONFIGURATION.accessKeyId,
  secretAccessKey: AWS_S3_CONFIGURATION.secretAccessKey,
  region: AWS_S3_CONFIGURATION.region,
});

module.exports = AWS;
