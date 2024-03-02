const {
  AWS_BUCKET_NAME,
  AWS_SIGNED_URL_EXPIRES_SECONDS,
  AWS_INVOICE_DIRECTORY_NAME,
} = require("../configuration/constants");
var AWS = require("../shared/aws-s3-config");
const fs = require("fs");
const s3 = new AWS.S3();
const pdfreader = require("pdfreader");
const POLICY_READER_CONST = require("../configuration/policy-reader-constant");
const { resolve } = require("path");

module.exports = {
  // downloadFileFromAWSS3ByKey: (fileKey) => {
  //   return new Promise((resolve, reject) => {
  //     s3.getSignedUrl(
  //       "getObject",
  //       {
  //         Bucket: AWS_BUCKET_NAME,
  //         Key: fileKey,
  //         Expires: AWS_SIGNED_URL_EXPIRES_SECONDS,
  //       },
  //       (error, url) => {
  //         if (error) {
  //           reject(error);
  //         } else {
  //           resolve(url);
  //           // res.status(200).send({
  //           //   error: false,
  //           //   data: {
  //           //     DownloadURL: url,
  //           //   },
  //           //   message: "File Retrieved Successfully",
  //           // });
  //         }
  //       }
  //     );
  //   });
  // },
  isDateInRange: (dateToCheck, startDate, endDate) => {
    // return new Promise((resolve, reject) => {
    return dateToCheck >= startDate && dateToCheck <= endDate;
    // });
  },
  reframeConfigDocument: (summaryData, filterData, actualData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (summaryData.key == "product") {
          actualData.productId = filterData.productId;
          actualData.subProductId = filterData.subProductId;
        }
        if (summaryData.key == "bookingCode") {
          actualData.bookingCodeId = filterData.bookingCodeId;
          actualData.subBookingCodeId = filterData.subBookingCodeId;
        }
        if (summaryData.key == "policyType") {
          actualData.policyTypeId = filterData;
        }
        resolve(actualData);
      });
    }, 2000);
  },
  rebuildArrayofString: (inputArray, keyname) => {
    // console.log("keyname ", keyname);
    return inputArray.map((id) => ({
      [keyname]: id,
    }));
  },
  configurationValidation: (result) => {
    return new Promise((resolve, reject) => {
      let RTOList = result.RTOList;
      let regNoFirstFourCharacters = result.regNoFirstFourCharacters;
      let PACover = result.PACover;
      let policyPACover = result.policyPACover;
      let GVW = result.GVW;
      let CC = result.CC;
      let issueDate = null;
      let startDate = null;
      let endDate = null;
      if (result.disableDate) {
        endDate = new Date(result.disableDate);
      }
      let issueDateTimestamp = new Date(result.issueDate).setHours(24, 0, 0, 0);
      issueDate = new Date(issueDateTimestamp);

      let activeDateTimestamp = new Date(result.activeDate).setHours(
        0,
        0,
        0,
        0
      );
      startDate = new Date(activeDateTimestamp);

      // Check Reg Number
      let validation = {
        rtoCode: false,
        pacover: false,
        issuedate: false,
        GVW: false,
        CC: false,
      };

      if (RTOList.includes(regNoFirstFourCharacters)) {
        validation.rtoCode = true;
      }
      if (PACover?.toLowerCase() == "all") {
        validation.pacover = true;
      } else {
        if (policyPACover == "0" || policyPACover == "1") {
          if (
            (PACover == "yes" && policyPACover == "1") ||
            (PACover == "no" && policyPACover == "0")
          ) {
            validation.pacover = true;
          }
        }
      }

      if (startDate && endDate) {
        console.log(
          issueDate,
          "issueDate ",
          startDate,
          "startDate ",
          endDate,
          "endDate "
        );
        console.log(
          "date Valid ",
          issueDate >= startDate && issueDate <= endDate
        );
        if (issueDate >= startDate && issueDate <= endDate) {
          validation.issuedate = true;
        }
      } else {
        console.log(
          "date Valid ",
          issueDate >= startDate,
          " issueDate ",
          issueDate,
          " startDate ",
          startDate
        );
        if (issueDate >= startDate) {
          validation.issuedate = true;
        }
      }

      if (GVW?.toLowerCase() == "all") {
        validation.GVW = true;
      } else {
        if (GVW?.toLowerCase().includes("to")) {
          let lowerCase = GVW.toLowerCase();
          let splitStr = lowerCase.split("to");
          let from = Number(splitStr[0]);
          let to = Number(splitStr[1]);
          let policyGVW = result.policyGVW;
          console.log("from ", from, "to ", to, "policyGVW ", policyGVW);
          if (from <= policyGVW && to >= policyGVW) {
            validation.GVW = true;
          }
        }
      }

      if (CC?.toLowerCase() == "all") {
        validation.CC = true;
      } else {
        if (CC?.toLowerCase().includes("to")) {
          let lowerCase = CC.toLowerCase();
          let splitStr = lowerCase.split("to");
          let from = Number(splitStr[0]);
          let to = Number(splitStr[1]);
          let policyCC = result.policyCC;
          console.log("from ", from, "to ", to, "policyCC ", policyCC);
          if (from <= policyCC && to >= policyCC) {
            validation.CC = true;
          }
        }
      }

      if (CC?.toLowerCase() == "all") {
        validation.CC = true;
      }

      resolve(validation);

      // if (RTOList.includes(regNoFirstFourCharacters)) {
      //   if (PACover != "all") {
      //     if (policyPACover == "0" || policyPACover == "1") {
      //       if (
      //         (PACover == "yes" && policyPACover == "1") ||
      //         (PACover == "no" && policyPACover == "0")
      //       ) {
      //         if (startDate && endDate) {
      //           console.log(
      //             "issueDate ",
      //             startDate,
      //             "startDate ",
      //             endDate,
      //             "endDate "
      //           );
      //           console.log(
      //             "date Valid ",
      //             issueDate >= startDate && issueDate <= endDate
      //           );
      //           if (issueDate >= startDate && issueDate <= endDate) {
      //             resolve(true);
      //           } else {
      //             resolve(false);
      //           }
      //         } else {
      //           console.log(
      //             "date Valid ",
      //             issueDate >= startDate,
      //             issueDate,
      //             ", ",
      //             startDate
      //           );
      //           if (issueDate >= startDate) {
      //             resolve(true);
      //           } else {
      //             resolve(false);
      //           }
      //         }
      //       }
      //     } else {
      //       resolve(false);
      //     }
      //   } else {
      //     resolve(true);
      //   }
      // } else {
      //   resolve(false);
      // }
    });
  },
  getExtensionFromKey: (key) => {
    const lastIndex = key.lastIndexOf(".");
    return lastIndex !== -1 ? key.slice(lastIndex + 1) : null;
  },
  downloadFileFromAWSS3ByKey: (fileKey) => {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileKey,
      };

      // s3.getSignedUrl(
      //   "getObject",
      //   {
      //     Bucket: AWS_BUCKET_NAME,
      //     Key: fileKey,
      //     Expires: AWS_SIGNED_URL_EXPIRES_SECONDS,
      //   },
      //   (error, url) => {
      //     if (error) {
      //       reject(error);
      //     } else {
      //       resolve(url);
      //       // res.status(200).send({
      //       //   error: false,
      //       //   data: {
      //       //     DownloadURL: url,
      //       //   },
      //       //   message: "File Retrieved Successfully",
      //       // });
      //     }
      //   }
      // );

      const getObjectPromise = await s3.getObject(params).promise();

      if (getObjectPromise) {
        resolve(getObjectPromise.Body.toString("base64"));
      }
    });
  },
  downloadBufferFormatFromAWSS3ByKey: (fileKey) => {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileKey,
      };
      const getObjectPromise = await s3.getObject(params).promise();
      if (getObjectPromise) {
        resolve(getObjectPromise.Body);
      }
    });
  },
  uploadFileToAWSS3: (file, bucketDirectoryName) => {
    return new Promise(async function (resolve, reject) {
      fs.readFile(file.path, function (err, data) {
        if (err) reject(err); // Something went wrong!
        // var s3bucket = new AWS.S3({
        //   params: { Bucket: "srktechnology/Invoice" },
        // });
        console.log("actual filename ", file.originalname);
        var params = {
          Key: file.originalname, //file.name doesn't exist as a property
          Body: data,
          Bucket: bucketDirectoryName
            ? AWS_BUCKET_NAME + "/" + bucketDirectoryName
            : AWS_BUCKET_NAME,
          // Bucket: AWS_BUCKET_NAME
        };
        s3.upload(params, function (err, data) {
          // Whether there is an error or not, delete the temp file
          fs.unlink(file.path, function (err) {
            if (err) {
              console.error(err);
              reject(err);
            }
          });

          if (err) {
            console.log("ERROR MSG: ", err);
            // res.status(500).send(err);
            reject(err);
          } else {
            console.log("Successfully uploaded data", data);
            resolve(data);
            // res.status(200).send(data.Location);
          }
        });
      });
    });
  },
  getFileName: (fileName, extension) => {
    console.log("getFileName");
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    const showdate = new Date();
    const date =
      showdate.getDate().toString() +
      (showdate.getMonth() + 1).toString() +
      showdate.getFullYear().toString();
    return date + "-" + randomString + "-" + fileName + extension;
  },
  // Changes by Arun
  readPolicyPDFFileBuffer: (bufferData) => {
    return new Promise((resolve, reject) => {
      // reader.parseBuffer(buffer,  (err, item)  => {
      //     if (err) return reject(err);

      //     resolve(item);
      // });
      let response = {};

      let companyPreContent = "";
      let isFindCompany = false;

      let policyNoCount = 0;
      let policyPreContent = "";
      let isPolicyNoContains = false;

      let regNoCount = 0;
      let regPreContent = "";
      let isRegNoContains = false;

      let issueDateCount = 0;
      let issueDatePreContent = "";
      let isIssueDateContains = false;

      let totalPremiumCount = 0;
      let totalPremiumPreContent = "";
      let isTotalPremiumContains = false;

      let makeModelCount = 0;
      let makeModelPreContent = "";
      let isMakeModelContains = false;

      let regYearCount = 0;
      let regYearPreContent = "";
      let isRegYearContains = false;

      let cubicCapacityCount = 0;
      let cubicCapacityPreContent = "";
      let isCubicCapacityContains = false;

      const ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;
      const ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT =
        POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.COMPANY_NAME_SEARCH
          .SECOND_SEARCH_TEXT;
      const RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.RAHEJA_QBE.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;
      const RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT =
        POLICY_READER_CONST.COMPANY.RAHEJA_QBE.COMPANY_NAME_SEARCH
          .SECOND_SEARCH_TEXT;
      const FUTURE_GENERALI_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;

      let POLICY_SEARCH_TEXT_CONST = {};
      let SEARCH_STRING = "CUBIC";
      let pageNo = 0;
      new pdfreader.PdfReader().parseBuffer(
        bufferData,
        async function (err, item) {
          if (err) {
            console.err(err);
            reject(err);
          } else if (!item) {
            // console.log("End of file");
            resolve(response);
          } else if (item.page) {
            pageNo = item.page;
            // console.log("Page No ", pageNo);
          } else if (item.text) {
            let text = item.text;
            if (text.includes(SEARCH_STRING)) {
              // console.error(
              //   "///////////////////////////////////////////////////////////////////****************////////////////////////////"
              // );
            }
            // console.log("Start ", text, " End");
            // Find Company
            if (
              text === ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT;
            } else if (
              text === RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT;
            } else if (
              text === FUTURE_GENERALI_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME;
              POLICY_SEARCH_TEXT_CONST =
                POLICY_READER_CONST.COMPANY.FUTURE_GENERALI;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
            }

            if (
              companyPreContent === ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT;
            } else if (
              companyPreContent === RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT;
            }

            if (
              companyPreContent === ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME;
              POLICY_SEARCH_TEXT_CONST =
                POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
              // console.log("POLICY_SEARCH_TEXT_CONST ", POLICY_SEARCH_TEXT_CONST);
            } else if (
              companyPreContent === RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME;
              POLICY_SEARCH_TEXT_CONST = POLICY_READER_CONST.COMPANY.RAHEJA_QBE;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
            }

            // For Policy NO
            if (
              !isPolicyNoContains &&
              policyNoCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              policyNoCount++;
              isPolicyNoContains = true;
              policyPreContent =
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEX;
              return true;
            }

            if (
              policyPreContent ===
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEX &&
              policyNoCount >= 1
            ) {
              if (policyNoCount == 2) {
                response["policyNumber"] = text;
                policyNoCount = 0;
                policyPreContent = "";
                return true;
              }

              if (
                policyNoCount == 1 &&
                text ===
                  POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.SECOND_SEARCH_TEXT
              ) {
                policyNoCount++;
                return true;
              }
            }

            // For Cubic Capacity
            if (
              !isCubicCapacityContains &&
              cubicCapacityCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              cubicCapacityCount++;
              isCubicCapacityContains = true;
              cubicCapacityPreContent =
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEX;
              return true;
            }

            if (
              cubicCapacityPreContent ===
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEX &&
              cubicCapacityCount >= 1
            ) {
              if (
                cubicCapacityCount == 2 ||
                (cubicCapacityCount == 1 &&
                  pageNo == 7 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["cc"] = text;
                cubicCapacityCount = 0;
                cubicCapacityPreContent = "";
                return true;
              }

              if (
                cubicCapacityCount == 1 &&
                pageNo != 7 &&
                response["companyName"] ===
                  POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME
              ) {
                cubicCapacityCount = 0;
                cubicCapacityPreContent = "";
                isCubicCapacityContains = false;
                return true;
              }

              if (
                cubicCapacityCount == 1 &&
                text ===
                  POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                    ?.SECOND_SEARCH_TEXT
              ) {
                cubicCapacityCount++;
                return true;
              }
            }

            // For Registration NO
            if (
              !isRegNoContains &&
              regNoCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              regNoCount++;
              isRegNoContains = true;
              regPreContent =
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              regPreContent ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              regNoCount >= 1
            ) {
              if (
                regNoCount == 2 ||
                (regNoCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["registrationNumber"] = text;
                regNoCount = 0;
                regPreContent = "";
                return true;
              }

              if (regNoCount == 1) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                    ?.SECOND_SEARCH_TEXT
                ) {
                  regNoCount++;
                  return true;
                } else {
                  regNoCount = 0;
                  regPreContent = "";
                  isRegNoContains = false;
                }
              }
            }

            // For Issued Date
            if (
              !isIssueDateContains &&
              issueDateCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              issueDateCount++;
              isIssueDateContains = true;
              issueDatePreContent =
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              issueDatePreContent ===
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              issueDateCount >= 1
            ) {
              if (
                issueDateCount == 3 ||
                (issueDateCount == 2 &&
                  (response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME ||
                    response["companyName"] ===
                      POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME))
              ) {
                response["issueDate"] = text;
                issueDateCount = 0;
                issueDatePreContent = "";
                return true;
              }

              if (
                (issueDateCount == 1 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (issueDateCount == 2 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                      ?.THIRD_SEARCH_TEXT)
              ) {
                issueDateCount++;
                return true;
              }
            }

            // For Total Premium
            if (
              !isTotalPremiumContains &&
              totalPremiumCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              totalPremiumCount++;
              isTotalPremiumContains = true;
              totalPremiumPreContent =
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              totalPremiumPreContent ===
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              totalPremiumCount >= 1
            ) {
              if (
                totalPremiumCount == 2 ||
                (totalPremiumCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["totalPremium"] = text;
                totalPremiumCount = 0;
                totalPremiumPreContent = "";
                return true;
              }

              if (totalPremiumCount == 1) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                    ?.SECOND_SEARCH_TEXT
                ) {
                  totalPremiumCount++;
                  return true;
                } else {
                  totalPremiumCount = 0;
                  totalPremiumPreContent = "";
                  isTotalPremiumContains = false;
                }
              }
            }

            // For Make Model
            if (
              !isMakeModelContains &&
              makeModelCount == 0 &&
              text ==
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              makeModelCount++;
              isMakeModelContains = true;
              makeModelPreContent =
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              makeModelPreContent ==
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              makeModelCount >= 1
            ) {
              if (
                (makeModelCount == 2 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME) ||
                (makeModelCount == 3 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME) ||
                (makeModelCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.BREAK_TEXT
                ) {
                  makeModelCount = 0;
                  makeModelPreContent = "";
                } else {
                  response["makeModel"] = response["makeModel"]
                    ? response["makeModel"] + " " + text
                    : text;
                }
                return true;
              }
              if (
                (makeModelCount == 1 &&
                  text ==
                    POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (makeModelCount == 2 &&
                  text ==
                    POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                      ?.THIRD_SEARCH_TEXT)
              ) {
                makeModelCount++;
                return true;
              }
            }

            // For Registration Year
            if (
              !isRegYearContains &&
              regYearCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              regYearCount++;
              isRegYearContains = true;
              regYearPreContent =
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              regYearPreContent ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              regYearCount >= 1
            ) {
              if (
                (regYearCount == 3 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME) ||
                (regYearCount == 4 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME) ||
                (regYearCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["registrationYear"] = text;
                regYearCount = 0;
                regYearPreContent = "";
                return true;
              }

              if (
                (regYearCount == 1 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (regYearCount == 2 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.THIRD_SEARCH_TEXT) ||
                (regYearCount == 3 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.FOURTH_SEARCH_TEXT)
              ) {
                regYearCount++;
                return true;
              }
            }
          }
        }
      );
    });
  },
  // Changes by Arun
  readPolicyPDFFile: (filePath) => {
    return new Promise((resolve, reject) => {
      // reader.parseBuffer(buffer,  (err, item)  => {
      //     if (err) return reject(err);

      //     resolve(item);
      // });
      let response = {};

      let companyPreContent = "";
      let isFindCompany = false;

      let policyNoCount = 0;
      let policyPreContent = "";
      let isPolicyNoContains = false;

      let regNoCount = 0;
      let regPreContent = "";
      let isRegNoContains = false;

      let issueDateCount = 0;
      let issueDatePreContent = "";
      let isIssueDateContains = false;

      let totalPremiumCount = 0;
      let totalPremiumPreContent = "";
      let isTotalPremiumContains = false;

      let makeModelCount = 0;
      let makeModelPreContent = "";
      let isMakeModelContains = false;

      let regYearCount = 0;
      let regYearPreContent = "";
      let isRegYearContains = false;

      let cubicCapacityCount = 0;
      let cubicCapacityPreContent = "";
      let isCubicCapacityContains = false;

      const ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;
      const ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT =
        POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.COMPANY_NAME_SEARCH
          .SECOND_SEARCH_TEXT;
      const RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.RAHEJA_QBE.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;
      const RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT =
        POLICY_READER_CONST.COMPANY.RAHEJA_QBE.COMPANY_NAME_SEARCH
          .SECOND_SEARCH_TEXT;
      const FUTURE_GENERALI_CMP_SEARCH_FIRST_TEXT =
        POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.COMPANY_NAME_SEARCH
          .FIRST_SEARCH_TEXT;

      let POLICY_SEARCH_TEXT_CONST = {};
      let SEARCH_STRING = "CUBIC";
      let pageNo = 0;
      new pdfreader.PdfReader().parseFileItems(
        filePath,
        async function (err, item) {
          if (err) {
            console.err(err);
            reject(err);
          } else if (!item) {
            console.log("End of file");
            resolve(response);
          } else if (item.page) {
            pageNo = item.page;
            console.log("Page No ", pageNo);
          } else if (item.text) {
            let text = item.text;
            if (text.includes(SEARCH_STRING)) {
              console.error(
                "///////////////////////////////////////////////////////////////////****************////////////////////////////"
              );
            }
            console.log("Start ", text, " End");
            // Find Company
            if (
              text === ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT;
            } else if (
              text === RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT;
            } else if (
              text === FUTURE_GENERALI_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME;
              POLICY_SEARCH_TEXT_CONST =
                POLICY_READER_CONST.COMPANY.FUTURE_GENERALI;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
            }

            if (
              companyPreContent === ROYAL_SUNDARAM_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT;
            } else if (
              companyPreContent === RAHEJA_QBE_CMP_SEARCH_FIRST_TEXT &&
              !isFindCompany
            ) {
              companyPreContent = RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT;
            }

            if (
              companyPreContent === ROYAL_SUNDARAM_CMP_SEARCH_SECOND_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME;
              POLICY_SEARCH_TEXT_CONST =
                POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
              // console.log("POLICY_SEARCH_TEXT_CONST ", POLICY_SEARCH_TEXT_CONST);
            } else if (
              companyPreContent === RAHEJA_QBE_CMP_SEARCH_SECOND_TEXT &&
              !isFindCompany
            ) {
              isFindCompany = true;
              response["companyName"] =
                POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME;
              POLICY_SEARCH_TEXT_CONST = POLICY_READER_CONST.COMPANY.RAHEJA_QBE;
              response["seatingCapacity"] = "2";
              response["gvw"] = "256";
              response["fuelType"] = "DISEL";
            }

            // For Policy NO
            if (
              !isPolicyNoContains &&
              policyNoCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              policyNoCount++;
              isPolicyNoContains = true;
              policyPreContent =
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEX;
              return true;
            }

            if (
              policyPreContent ===
                POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.FIRST_SEARCH_TEX &&
              policyNoCount >= 1
            ) {
              if (policyNoCount == 2) {
                response["policyNumber"] = text;
                policyNoCount = 0;
                policyPreContent = "";
                return true;
              }

              if (
                policyNoCount == 1 &&
                text ===
                  POLICY_SEARCH_TEXT_CONST?.POLICY_NO_SEARCH?.SECOND_SEARCH_TEXT
              ) {
                policyNoCount++;
                return true;
              }
            }

            // For Cubic Capacity
            if (
              !isCubicCapacityContains &&
              cubicCapacityCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              cubicCapacityCount++;
              isCubicCapacityContains = true;
              cubicCapacityPreContent =
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEX;
              return true;
            }

            if (
              cubicCapacityPreContent ===
                POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                  ?.FIRST_SEARCH_TEX &&
              cubicCapacityCount >= 1
            ) {
              if (
                cubicCapacityCount == 2 ||
                (cubicCapacityCount == 1 &&
                  pageNo == 7 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["cc"] = text;
                cubicCapacityCount = 0;
                cubicCapacityPreContent = "";
                return true;
              }

              if (
                cubicCapacityCount == 1 &&
                pageNo != 7 &&
                response["companyName"] ===
                  POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME
              ) {
                cubicCapacityCount = 0;
                cubicCapacityPreContent = "";
                isCubicCapacityContains = false;
                return true;
              }

              if (
                cubicCapacityCount == 1 &&
                text ===
                  POLICY_SEARCH_TEXT_CONST?.CUBIC_CAPACITY_SEARCH
                    ?.SECOND_SEARCH_TEXT
              ) {
                cubicCapacityCount++;
                return true;
              }
            }

            // For Registration NO
            if (
              !isRegNoContains &&
              regNoCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              regNoCount++;
              isRegNoContains = true;
              regPreContent =
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              regPreContent ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              regNoCount >= 1
            ) {
              if (
                regNoCount == 2 ||
                (regNoCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["registrationNumber"] = text;
                regNoCount = 0;
                regPreContent = "";
                return true;
              }

              if (regNoCount == 1) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.REGISTRATION_NO_SEARCH
                    ?.SECOND_SEARCH_TEXT
                ) {
                  regNoCount++;
                  return true;
                } else {
                  regNoCount = 0;
                  regPreContent = "";
                  isRegNoContains = false;
                }
              }
            }

            // For Issued Date
            if (
              !isIssueDateContains &&
              issueDateCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              issueDateCount++;
              isIssueDateContains = true;
              issueDatePreContent =
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              issueDatePreContent ===
                POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              issueDateCount >= 1
            ) {
              if (
                issueDateCount == 3 ||
                (issueDateCount == 2 &&
                  (response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME ||
                    response["companyName"] ===
                      POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME))
              ) {
                response["issueDate"] = text;
                issueDateCount = 0;
                issueDatePreContent = "";
                return true;
              }

              if (
                (issueDateCount == 1 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (issueDateCount == 2 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.ISSUE_DATE_SEARCH
                      ?.THIRD_SEARCH_TEXT)
              ) {
                issueDateCount++;
                return true;
              }
            }

            // For Total Premium
            if (
              !isTotalPremiumContains &&
              totalPremiumCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              totalPremiumCount++;
              isTotalPremiumContains = true;
              totalPremiumPreContent =
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              totalPremiumPreContent ===
                POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              totalPremiumCount >= 1
            ) {
              if (
                totalPremiumCount == 2 ||
                (totalPremiumCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["totalPremium"] = text;
                totalPremiumCount = 0;
                totalPremiumPreContent = "";
                return true;
              }

              if (totalPremiumCount == 1) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.TOTAL_PREMIUM_SEARCH
                    ?.SECOND_SEARCH_TEXT
                ) {
                  totalPremiumCount++;
                  return true;
                } else {
                  totalPremiumCount = 0;
                  totalPremiumPreContent = "";
                  isTotalPremiumContains = false;
                }
              }
            }

            // For Make Model
            if (
              !isMakeModelContains &&
              makeModelCount == 0 &&
              text ==
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.FIRST_SEARCH_TEXT
            ) {
              makeModelCount++;
              isMakeModelContains = true;
              makeModelPreContent =
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              makeModelPreContent ==
                POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              makeModelCount >= 1
            ) {
              if (
                (makeModelCount == 2 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME) ||
                (makeModelCount == 3 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME) ||
                (makeModelCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                if (
                  text ===
                  POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH?.BREAK_TEXT
                ) {
                  makeModelCount = 0;
                  makeModelPreContent = "";
                } else {
                  response["makeModel"] = response["makeModel"]
                    ? response["makeModel"] + " " + text
                    : text;
                }
                return true;
              }
              if (
                (makeModelCount == 1 &&
                  text ==
                    POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (makeModelCount == 2 &&
                  text ==
                    POLICY_SEARCH_TEXT_CONST?.MAKE_MODEL_SEARCH
                      ?.THIRD_SEARCH_TEXT)
              ) {
                makeModelCount++;
                return true;
              }
            }

            // For Registration Year
            if (
              !isRegYearContains &&
              regYearCount == 0 &&
              text ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT
            ) {
              regYearCount++;
              isRegYearContains = true;
              regYearPreContent =
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT;
              return true;
            }

            if (
              regYearPreContent ===
                POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                  ?.FIRST_SEARCH_TEXT &&
              regYearCount >= 1
            ) {
              if (
                (regYearCount == 3 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.ROYAL_SUNDARAM.NAME) ||
                (regYearCount == 4 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.RAHEJA_QBE.NAME) ||
                (regYearCount == 1 &&
                  response["companyName"] ===
                    POLICY_READER_CONST.COMPANY.FUTURE_GENERALI.NAME)
              ) {
                response["registrationYear"] = text;
                regYearCount = 0;
                regYearPreContent = "";
                return true;
              }

              if (
                (regYearCount == 1 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.SECOND_SEARCH_TEXT) ||
                (regYearCount == 2 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.THIRD_SEARCH_TEXT) ||
                (regYearCount == 3 &&
                  text ===
                    POLICY_SEARCH_TEXT_CONST?.REGISTRATION_YEAR_SEARCH
                      ?.FOURTH_SEARCH_TEXT)
              ) {
                regYearCount++;
                return true;
              }
            }
          }
        }
      );
    });
  },
};
