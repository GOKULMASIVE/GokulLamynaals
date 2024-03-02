const express = require("express");
const apiRoutes = express.Router();
const multer = require("multer");
var path = require("path");
const server_constant = require("../configuration/constants");
var AWS = require("../shared/aws-s3-config");
const CommonUtil = require("../shared/common-util");

const branchController = require("../Controller/branchController");
const companyController = require("../Controller/companyController");
const bookingCodeController = require("../Controller/bookingCodeController");
const policyTypeController = require("../Controller/policyTypeController");
const fuelTypeController = require("../Controller/fuelTypeController");
const vehicleMakeController = require("../Controller/vehicleMakeController"); //added by gokul..
const payoutCycleController = require("../Controller/payoutCycleController");
const productController = require("../Controller/productController");
const linkBookingCodeController = require("../Controller/linkBookingCodeController");
const policyPeriodController = require("../Controller/policyPeriodController");
const userController = require("../Controller/userController");
const notificationController = require("../Controller/notificationController");
const masterCompanyController = require("../Controller/masterCompanyController");
const policyController = require("../Controller/policyController");
const companyLoginController = require("../Controller/companyLoginController");
const companyContactController = require("../Controller/companyContactController");
const userInvoiceController = require("../Controller/userInvoiceController");
const companyInvoiceController = require("../Controller/companyInvoiceController");
const clientController = require("../Controller/clientController");
const roleMenuController = require("../Controller/roleMenuController");
const reportContoller = require("../Controller/reportContoller");
const {
  AWS_BUCKET_NAME,
  AWS_SIGNED_URL_EXPIRES_SECONDS,
} = require("../configuration/constants");
const s3 = new AWS.S3();

var multerStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// var multerUpload = multer({
//   storage: multerStorage,
// });

var multerUpload = multer({
  storage: multerStorage,
  // dest: "upload",
});

// Branch

apiRoutes.post("/branch", branchController.postBranch);
apiRoutes.get("/branch", branchController.getAllBranch);
apiRoutes.put("/branch/:id", branchController.updateBranch);
apiRoutes.delete("/branch/:id", branchController.deleteBranch);
apiRoutes.post("/branchfilter", branchController.filterBranch);

// Company

apiRoutes.post("/company", companyController.postCompany);
apiRoutes.get("/company", companyController.getCompany);
apiRoutes.put("/company/:id", companyController.updateCompany);
apiRoutes.delete("/company/:id", companyController.deleteCompany);
apiRoutes.post("/companyfilter", companyController.filterCompany);
// Changes by Arun
apiRoutes.get("/RTO", companyController.getRTO);
apiRoutes.get("/getCompanyRTO", companyController.getCompanyRTO);
apiRoutes.get(
  "/getCompanyRTOByID/:companyRTOID",
  companyController.getCompanyRTOByID
);
apiRoutes.get(
  "/getRTOLocationByCompanyID/:companyId",
  companyController.getRTOLocationByCompanyID
);
apiRoutes.post("/saveCompanyRTO", companyController.saveCompanyRTO);
apiRoutes.put("/updateCompanyRTO/:id", companyController.updateCompanyRTO);
apiRoutes.delete("/deleteRTO/:id", companyController.deleteRTO);

// Booking Code

apiRoutes.post("/bookingcode", bookingCodeController.postBooking);
apiRoutes.get("/bookingcode", bookingCodeController.getBooking);
apiRoutes.put("/bookingcode/:id", bookingCodeController.putBooking);
apiRoutes.delete("/bookingcode/:id", bookingCodeController.deleteBooking);
apiRoutes.post("/bookingcodefilter", bookingCodeController.filterBookingCode);

// changes By Somesh

apiRoutes.get(
  "getActiveBookingCode",
  bookingCodeController.getActiveBookingCode
);
apiRoutes.post(
  "/createSubBookingCode",
  bookingCodeController.createSubBookingCode
);
apiRoutes.get("/getSubBookingCode", bookingCodeController.getSubBookingCode);
apiRoutes.put("/subBookingCode/:id", bookingCodeController.putSubBookingCode);
apiRoutes.delete(
  "/subBookingCode/:id",
  bookingCodeController.deleteSubBookingCode
);
apiRoutes.post(
  "/subBookingcodefilter",
  bookingCodeController.filterSubBookingCode
);

// Policy Type

apiRoutes.post("/policytype", policyTypeController.postPolicyType);
apiRoutes.get("/policytype", policyTypeController.getPolicyType);
apiRoutes.put("/policytype/:id", policyTypeController.putPolicyType);
apiRoutes.delete("/policytype/:id", policyTypeController.deletePolicyType);
apiRoutes.post("/policytypefilter", policyTypeController.filterPolicyType);

// Fuel Type
// Changes by Arun
apiRoutes.post("/fuelType", fuelTypeController.postFuelType);
apiRoutes.get("/fuelType", fuelTypeController.getFuelType);
apiRoutes.put("/fuelType/:id", fuelTypeController.putFuelType);
apiRoutes.post("/fueltypefilter", fuelTypeController.filterFuelType);

// Vehicle make added by gokul...
apiRoutes.post("/vehicleMake", vehicleMakeController.postVehicleMake);
apiRoutes.get("/vehicleMake", vehicleMakeController.getVehicleMake);
apiRoutes.put("/vehicleMake/:id", vehicleMakeController.putVehicleMake);
apiRoutes.post("/vehicleMakeFilter", vehicleMakeController.filterVehicleMake);
apiRoutes.delete("/vehicleMake/:id", vehicleMakeController.deleteVehicleMake);

// Payout Cycle
// Changes by Arun
apiRoutes.post("/payoutCycle", payoutCycleController.postPayoutCycle);
apiRoutes.get("/payoutCycle", payoutCycleController.getPayoutCycle);
apiRoutes.put("/payoutCycle/:id", payoutCycleController.putPayoutCycle);
apiRoutes.post("/payoutcyclefilter", payoutCycleController.filterPayoutCycle);

// product

apiRoutes.post("/product", productController.postProduct);
apiRoutes.get("/product", productController.getProduct);
apiRoutes.put("/product/:id", productController.putProduct);
apiRoutes.delete("/product/:id", productController.deleteProduct);
apiRoutes.post("/productfilter", productController.filterProduct);

// Changes by Arun
apiRoutes.get("/getActiveProduct", productController.getActiveProduct);
apiRoutes.post("/createSubProduct", productController.createSubProduct);
apiRoutes.get("/getSubProduct", productController.getSubProduct);
apiRoutes.put("/subProduct/:id", productController.putSubProduct);
apiRoutes.delete("/subProduct/:id", productController.deleteSubProduct);
apiRoutes.post("/subProductfilter", productController.filterSubProduct);
// link BookingCode

apiRoutes.post(
  "/linkbookingcode",
  linkBookingCodeController.postLinkBookingCode
);
apiRoutes.get("/linkbookingcode", linkBookingCodeController.getLinkBookingCode);
apiRoutes.put(
  "/linkbookingcode/:id",
  linkBookingCodeController.putLinkBookingCode
);
apiRoutes.delete(
  "/linkbookingcode/:id",
  linkBookingCodeController.deleteLinkBookingCode
);
apiRoutes.post(
  "/linkbookingcodefilter",
  linkBookingCodeController.filterLinkBookingCode
);

// PolicyPeriod

apiRoutes.post("/policyperiod", policyPeriodController.postPolicyPeriod);
apiRoutes.get("/policyperiod", policyPeriodController.getPolicyPeriod);
apiRoutes.put("/policyperiod/:id", policyPeriodController.putPolicyPeriod);
apiRoutes.delete(
  "/policyperiod/:id",
  policyPeriodController.deletePolicyPeriod
);
apiRoutes.post(
  "/policyperiodfilter",
  policyPeriodController.filterPolicyPeriod
);

// Notification

apiRoutes.post("/notification", notificationController.postNotification);
apiRoutes.get("/notification", notificationController.getNotification);
apiRoutes.put("/notification/:id", notificationController.putNotification);
apiRoutes.delete(
  "/notification/:id",
  notificationController.deleteNotification
);

// master Company

apiRoutes.post("/mastercompany", masterCompanyController.postMasterCompany);
apiRoutes.get("/mastercompany", masterCompanyController.getMasterCompany);
apiRoutes.put("/mastercompany/:id", masterCompanyController.putMasterCompany);
apiRoutes.delete(
  "/mastercompany/:id",
  masterCompanyController.deleteMasterCompany
);
apiRoutes.post(
  "/mastercompanyfilter",
  masterCompanyController.filterMasterCompany
);

// Role and Menu
// Changes by Arun
apiRoutes.post("/createMenu", roleMenuController.createMenu);

// User
// Changes by Arun
apiRoutes.post("/user", multerUpload.any(), userController.postUser);
apiRoutes.post("/login", userController.login);
apiRoutes.get("/getlogin", userController.getlogin);
apiRoutes.post("/register", userController.register);
apiRoutes.get(
  "/getFileFromAWSS3BucketByKey",
  userController.getFileFromAWSS3BucketByKey
);
// End of changes
apiRoutes.get("/user", userController.getUser);
apiRoutes.get("/userById/:id", userController.getUserById);
apiRoutes.get(
  "/getBankDetailsByUserId/:id",
  userController.getBankDetailsByUserId
);
apiRoutes.put("/user/:id", multerUpload.any(), userController.putUser);
apiRoutes.delete("/user/:id", userController.deleteUser);
//written by gokul...
apiRoutes.get(
  "/verifyMobileNumber/:mobileNum",
  userController.verifyMobileNumber
);
apiRoutes.get("/verifyEmailAddress/:email", userController.verifyEmailAddress);
// CompanyLogin

apiRoutes.post("/companyLogin", companyLoginController.postCompanyLogin);
apiRoutes.get("/companyLogin", companyLoginController.getCompanyLogin);
apiRoutes.put("/companyLogin/:id", companyLoginController.putCompanyLogin);
apiRoutes.delete(
  "/companyLogin/:id",
  companyLoginController.deleteCompanyLogin
);
apiRoutes.post(
  "/searchCompanyLogin",
  companyLoginController.searchCompanyLogin
);

// Changes by Arun
apiRoutes.post("/verifyLoginId", companyLoginController.verifyLoginId);

// Company Contact

apiRoutes.post("/companyContact", companyContactController.postCompanyContact);
apiRoutes.get("/companyContact", companyContactController.getCompanyContact);
apiRoutes.put(
  "/companyContact/:id",
  companyContactController.putCompanyContact
);
apiRoutes.delete(
  "/companyContact/:id",
  companyContactController.deleteCompanyContact
);
apiRoutes.post(
  "/searchcompanycontact",
  companyContactController.searchCompanyContact
);

// user Invoice

apiRoutes.post("/userInvoice", userInvoiceController.postUserInvoice);
apiRoutes.get("/userInvoice", userInvoiceController.getUserInvoice);
apiRoutes.put("/userInvoice/:id", userInvoiceController.putUserInvoice);
apiRoutes.delete("/userInvoice/:id", userInvoiceController.deleteUserInvoice);

// Company Invoice

apiRoutes.post("/companyInvoice", companyInvoiceController.postCompanyInvoice);
apiRoutes.get("/companyInvoice", companyInvoiceController.getCompanyInvoice);
apiRoutes.put(
  "/companyInvoice/:id",
  companyInvoiceController.putCompanyInvoice
);
apiRoutes.delete(
  "/companyInvoice/:id",
  companyInvoiceController.deleteCompanyInvoice
);

//Policy

apiRoutes.post(
  "/createpolicy",
  multerUpload.any(),
  policyController.postPolicy
);
apiRoutes.get("/createpolicy", policyController.getPolicy);
apiRoutes.delete("/deletepolicy/:id", policyController.deletePolicy);
apiRoutes.get("/getLoginPortal", policyController.getLoginPortal);

// Changes by Arun
apiRoutes.put(
  "/createPolicyMapping",
  multerUpload.any(),
  policyController.createPolicyMapping
);
apiRoutes.patch("/updatePolicyMapping", policyController.updatePolicyMapping);
apiRoutes.put(
  "/saveComissionReceivableAmount/:id",
  policyController.saveComissionReceivableAmount
);
apiRoutes.get(
  "/getComissionReceivableAmount/:id",
  policyController.getComissionReceivableAmount
);
apiRoutes.get("/getPolicyById/:id", policyController.getPolicyById);
apiRoutes.get("/getPolicyFileById/:id", policyController.getPolicyFileById);
apiRoutes.post("/renewalList", policyController.renewalList);
apiRoutes.get(
  "/verifyPolicyNumber/:policyNumber",
  policyController.verifyPolicyNumber
);
apiRoutes.get(
  "/readPolicyFileByPolicyId/:policyId",
  policyController.readPolicyFileByPolicyId
);
apiRoutes.get(
  "/getUserpayablePercentage/:policyId",
  policyController.getUserpayablePercentage
);
apiRoutes.patch(
  "/ticketAlreadyExist/:policyId",
  policyController.ticketAlreadyExist
);
apiRoutes.get(
  "/getBranchpayablePercentage/:policyId",
  policyController.getBranchpayablePercentage
);
apiRoutes.get(
  "/getReceivablePercentage/:policyId",
  policyController.getReceivablePercentage
);

apiRoutes.get("/getCompanyWallet/", policyController.getCompanyWallet);
apiRoutes.get("/getUserWallet/:walletType", policyController.getUserWallet);
apiRoutes.get(
  "/getPolicyMappingByPolicyID/:policyId",
  policyController.getPolicyMappingByPolicyID
);
apiRoutes.get("/getPolicyMapping", policyController.getPolicyMapping);
apiRoutes.get("/getBranchWallet/", policyController.getBranchWallet);
apiRoutes.get(
  "/getBranchWalletByUserId/:userId",
  policyController.getBranchWalletByUserId
);
apiRoutes.get(
  "/getUserWalletByUserId/:userId",
  policyController.getUserWalletByUserId
);
apiRoutes.get(
  "/getUserConfigByUserId/:userId",
  policyController.getUserConfigByUserId
);
apiRoutes.delete(
  "/deleteUserConfigById/:id",
  policyController.deleteUserConfigById
);
apiRoutes.delete(
  "/deleteBranchConfigById/:id",
  policyController.deleteBranchConfigById
);
apiRoutes.delete(
  "/deleteReceivableConfigById/:id",
  policyController.deleteReceivableConfigById
);
apiRoutes.get("/getUserConfigById/:id", policyController.getUserConfigById);
apiRoutes.get(
  "/getBranchConfigByBranchManagerId/:id",
  policyController.getBranchConfigByBranchManagerId
);
apiRoutes.get("/getBranchConfigById/:id", policyController.getBranchConfigById);
apiRoutes.get(
  "/getReceivableConfigById/:id",
  policyController.getReceivableConfigById
);
apiRoutes.get(
  "/getReceivableConfigByCompanyId/:id",
  policyController.getReceivableConfigByCompanyId
);
apiRoutes.patch(
  "/disableUserConfigById/:id",
  policyController.disableUserConfigById
);
apiRoutes.patch(
  "/disableBranchConfigById/:id",
  policyController.disableBranchConfigById
);
apiRoutes.patch(
  "/disableReceivableConfigById/:id",
  policyController.disableReceivableConfigById
);
apiRoutes.get(
  "/getCompanyWalletBySubBookingCodeId/:subBookingCodeId",
  policyController.getCompanyWalletBySubBookingCodeId
);

apiRoutes.post("/filterCCEntry", policyController.filterCCEntry);
apiRoutes.post("/unlinkTicketNumber/:id", policyController.unlinkTicketNumber);
apiRoutes.get("/filterCCEntryAll", policyController.filterCCEntryAll);

apiRoutes.post("/saveWallet", policyController.saveWallet);
apiRoutes.post("/saveUserConfig", policyController.saveUserConfig);
apiRoutes.patch("/updateUserConfig", policyController.updateUserConfig);
apiRoutes.patch("/updateBranchConfig", policyController.updateBranchConfig);
apiRoutes.patch(
  "/updateReceivableConfig",
  policyController.updateReceivableConfig
);
apiRoutes.post("/saveBranchConfig", policyController.saveBranchConfig);
apiRoutes.post("/saveReceivableConfig", policyController.saveReceivableConfig);
apiRoutes.post("/saveCompanyWallet", policyController.saveCompanyWallet);
/// Update Policy

apiRoutes.put(
  "/updatepolicy/:id",
  multerUpload.any(),
  policyController.putPolicy
);

// Search Policy

apiRoutes.post("/searchpolicy", policyController.searchPolicy);
apiRoutes.post("/filterPolicyList", policyController.filterPolicyList);

// Changes by Arun
apiRoutes.post(
  "/verifypolicy",
  multerUpload.any(),
  policyController.verifyPolicy
);
//client
apiRoutes.post("/client", clientController.postClient);
apiRoutes.get("/client", clientController.getAllClient);
apiRoutes.put("/client/:id", clientController.updateClient);
apiRoutes.delete("/client/:id", clientController.deleteClient);

// user photo file upload
// Changes By Arun
apiRoutes.post(
  "/upload",
  multerUpload.any(),
  userController.uploadMultipleFile
);
apiRoutes.post("/getPaidReceivedReport", reportContoller.getPaidReceivedReport);
apiRoutes.post("/getMasterReport", reportContoller.getMasterReport);
apiRoutes.post(
  "/getMasterReportExcelFormat",
  reportContoller.getMasterReportExcelFormat
);
apiRoutes.post("/getPolicyChequeReport", reportContoller.getPolicyChequeReport);
apiRoutes.post("/getBookingReport", reportContoller.getBookingReport);
apiRoutes.get("/getTDSReport", reportContoller.getTDSReport);
apiRoutes.get("/getDashboard", reportContoller.getDashboard);
//change by gokul
apiRoutes.delete(
  "/deletePaidRecievedReport/:id",
  reportContoller.deletePaidRecievedReport
);
//change by gokul
apiRoutes.put(
  "/updatePaidRecievedReport/:id",
  reportContoller.updatePaidRecievedReport
);

// Changes by Arun
apiRoutes.get("/getAWSS3FileByDirectoryName", function (req, res) {
  var directoryName = req.query["directoryName"];
  var params = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: directoryName,
  };
  var fileUrlList = [];
  s3.listObjects(params, function (err, data) {
    if (err) return res.status(500).send({ error: true, message: err });

    data.Contents.map((fileObj) => {
      let Key = fileObj.Key;
      let Size = fileObj.Size;
      // console.log("fileObj ", fileObj);
      if (Size > 0)
        s3.getSignedUrl(
          "getObject",
          {
            Bucket: AWS_BUCKET_NAME,
            Key: Key,
            Expires: AWS_SIGNED_URL_EXPIRES_SECONDS,
          },
          (error, url) => {
            if (error) {
              return res.status(500).send({ error: true, message: error });
            } else {
              fileUrlList.push(url);
            }
          }
        );
    });

    Promise.all(fileUrlList).then((data) => {
      console.log("length", fileUrlList.length);
      return res
        .status(200)
        .send({ message: { url: fileUrlList, size: fileUrlList.length } });
    });
    // return res.status(200).send({ message: data });
  });
});

// Change by Arun
apiRoutes.get("/getAWSS3FileByKey", function (req, res, next) {
  var fileKey = req.query["filename"];
  console.log("Trying to download file", fileKey);
  CommonUtil.downloadFileFromAWSS3ByKey(fileKey)
    .then((url) => {
      res.status(200).send({
        error: false,
        data: {
          DownloadURL: url,
        },
        message: "File Retrieved Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({ error: true, message: error });
    });
});

module.exports = apiRoutes;
