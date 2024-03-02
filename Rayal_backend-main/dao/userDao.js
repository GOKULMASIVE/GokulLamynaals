const user = require("../Model/user");
const branchId = require("../Model/branch");
const {
  AWS_USER_PHOTO_DIRECTORY_NAME,
  AWS_ADDRESS_PROOF_DIRECTORY_NAME,
  AWS_ID_PROOF_DIRECTORY_NAME,
  AWS__PAN_CARD_DIRECTORY_NAME,
  AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME,
  AWS_BANK_BOOK_DIRECTORY_NAME,
  AWS_PHONEPAY_QR_DIRECTORY_NAME,
  AWS_PAYTM_QR_DIRECTORY_NAME,
  AWS_GOOGLEPAY_QR_DIRECTORY_NAME,
  USER_TYPE,
} = require("../configuration/constants");
const CommonUtil = require("../shared/common-util");
const Client = require("../Model/client");
const commonUtil = require("../shared/common-util");
var path = require("path");
module.exports.postUser = async (
  clientId,
  receivedData,
  files,
  next,
  callback
) => {
  try {
    let branchManager = receivedData.branchManager;
    let branchId = receivedData.branchId;
    // receivedData.bankDetails = JSON.parse(receivedData.bankDetails);

    if (!branchManager) {
      delete receivedData["branchManager"];
    }
    if (!branchId) {
      delete receivedData["branchId"];
    }
    //   Changes by Arun for file upload
    let userPhoto = files.find((file) => {
      return file.fieldname == AWS_USER_PHOTO_DIRECTORY_NAME;
    });
    let userPhotoObj = {};
    if (userPhoto) {
      const extenstion = path.extname(userPhoto.originalname);
      userPhoto.originalname = CommonUtil.getFileName(
        AWS_USER_PHOTO_DIRECTORY_NAME,
        extenstion
      );
      let filename = userPhoto.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        userPhoto,
        AWS_USER_PHOTO_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          userPhotoObj["fileName"] = filename;
          userPhotoObj["key"] = response.key;
          userPhotoObj["location"] = response.Location;
          receivedData["photo"] = userPhotoObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let addrProof = files.find((file) => {
      return file.fieldname == AWS_ADDRESS_PROOF_DIRECTORY_NAME;
    });
    let addrProofObj = {};
    if (addrProof) {
      const extenstion = path.extname(addrProof.originalname);
      addrProof.originalname = CommonUtil.getFileName(
        AWS_ADDRESS_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = addrProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        addrProof,
        AWS_ADDRESS_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          addrProofObj["fileName"] = filename;
          addrProofObj["key"] = response.key;
          addrProofObj["location"] = response.Location;
          receivedData["addressProof"] = addrProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let IDProof = files.find((file) => {
      return file.fieldname == AWS_ID_PROOF_DIRECTORY_NAME;
    });
    let IDProofObj = {};
    if (IDProof) {
      const extenstion = path.extname(IDProof.originalname);
      IDProof.originalname = commonUtil.getFileName(
        AWS_ID_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = IDProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        IDProof,
        AWS_ADDRESS_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          IDProofObj["fileName"] = filename;
          IDProofObj["key"] = response.key;
          IDProofObj["location"] = response.Location;
          receivedData["idProof"] = IDProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let PANCard = files.find((file) => {
      return file.fieldname == AWS__PAN_CARD_DIRECTORY_NAME;
    });
    let PANCardObj = {};
    if (PANCard) {
      const extenstion = path.extname(PANCard.originalname);
      PANCard.originalname = CommonUtil.getFileName(
        AWS__PAN_CARD_DIRECTORY_NAME,
        extenstion
      );
      let filename = PANCard.originalname || "";
      await CommonUtil.uploadFileToAWSS3(PANCard, AWS__PAN_CARD_DIRECTORY_NAME)
        .then((response) => {
          // console.log("response ", response);
          PANCardObj["fileName"] = filename;
          PANCardObj["key"] = response.key;
          PANCardObj["location"] = response.Location;
          receivedData["panProof"] = PANCardObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let educationalProof = files.find((file) => {
      return file.fieldname == AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME;
    });
    let educationalProofObj = {};
    if (educationalProof) {
      const extenstion = path.extname(educationalProof.originalname);
      educationalProof.originalname = CommonUtil.getFileName(
        AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = educationalProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        educationalProof,
        AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          educationalProofObj["fileName"] = filename;
          educationalProofObj["key"] = response.key;
          educationalProofObj["location"] = response.Location;
          receivedData["educationalProof"] = educationalProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let bankBook = files.find((file) => {
      return file.fieldname == AWS_BANK_BOOK_DIRECTORY_NAME;
    });
    let bankBookObj = {};
    if (bankBook) {
      const extenstion = path.extname(bankBook.originalname);
      bankBook.originalname = CommonUtil.getFileName(
        AWS_BANK_BOOK_DIRECTORY_NAME,
        extenstion
      );
      let filename = bankBook.originalname || "";
      await CommonUtil.uploadFileToAWSS3(bankBook, AWS_BANK_BOOK_DIRECTORY_NAME)
        .then((response) => {
          bankBookObj["fileName"] = filename;
          bankBookObj["key"] = response.key;
          bankBookObj["location"] = response.Location;
          receivedData["bankBook"] = bankBookObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let phonepeQR = files.find((file) => {
      return file.fieldname == AWS_PHONEPAY_QR_DIRECTORY_NAME;
    });
    let phonepeQRObj = {};
    if (phonepeQR) {
      const extenstion = path.extname(phonepeQR.originalname);
      phonepeQR.originalname = CommonUtil.getFileName(
        AWS_PHONEPAY_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = phonepeQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        phonepeQR,
        AWS_PHONEPAY_QR_DIRECTORY_NAME
      )
        .then((response) => {
          phonepeQRObj["fileName"] = filename;
          phonepeQRObj["key"] = response.key;
          phonepeQRObj["location"] = response.Location;
          receivedData["phonePeQr"] = phonepeQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let paytmQR = files.find((file) => {
      return file.fieldname == AWS_PAYTM_QR_DIRECTORY_NAME;
    });
    let paytmQRObj = {};
    if (paytmQR) {
      const extenstion = path.extname(paytmQR.originalname);
      paytmQR.originalname = CommonUtil.getFileName(
        AWS_PAYTM_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = paytmQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(paytmQR, AWS_PAYTM_QR_DIRECTORY_NAME)
        .then((response) => {
          paytmQRObj["fileName"] = filename;
          paytmQRObj["key"] = response.key;
          paytmQRObj["location"] = response.Location;
          receivedData["paytmQr"] = paytmQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let googlePayQR = files.find((file) => {
      return file.fieldname == AWS_GOOGLEPAY_QR_DIRECTORY_NAME;
    });
    let googlePayQRObj = {};
    if (googlePayQR) {
      const extenstion = path.extname(googlePayQR.originalname);
      googlePayQR.originalname = CommonUtil.getFileName(
        AWS_GOOGLEPAY_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = googlePayQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        googlePayQR,
        AWS_GOOGLEPAY_QR_DIRECTORY_NAME
      )
        .then((response) => {
          googlePayQRObj["fileName"] = filename;
          googlePayQRObj["key"] = response.key;
          googlePayQRObj["location"] = response.Location;
          receivedData["googlePayQr"] = googlePayQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }
    let userType = receivedData.userType;
    let userTypeArray = userType.split(",");
    // console.log("userTypeArray ", userTypeArray);
    // return callback(new Error("UserType"));
    let data = new user(receivedData);
    data.bankDetails = JSON.parse(receivedData.bankDetails);
    data["clientId"] = clientId;
    data["userType"] = userTypeArray;
    const userEmail = data.email;
    const userMobileNo = data.mobileNumber;
    try {
      const userExists = await Client.findOne({
        $or: [{ email: userEmail }, { mobileNumber: userMobileNo }],
      });

      if (userExists) {
        if (userExists.email === userEmail) {
          console.log("Email already exists by the Client");
          return callback(new Error("email"));
        } else if (userExists.mobileNumber === userMobileNo) {
          console.log("Mobile Number already exists by the Client");
          return callback(new Error("mobileNumber"));
        }
      }

      data.save(function (err, response) {
        if (err) {
          return callback(err);
        }
        callback(null, response);
      });
    } catch (err) {
      console.log("Error from catch: ", err);
      callback(err);
    }
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.login = async (receivedData, next, callback) => {
  try {
    let userData = {};
    let email = receivedData.email;
    let mobile = receivedData.mobile;
    let password = receivedData.password;
    // Changes by Arun
    const matchQuery = email ? { email: email } : { mobileNumber: mobile };
    Client.findOne(
      matchQuery,
      "password name _id email",
      async function (err, response) {
        if (err) {
          callback(err);
        } else {
          if (!response) {
            user.findOne(
              matchQuery,
              "clientId userType password name _id email",
              function (userErr, userRes) {
                if (userErr) {
                  callback(err);
                }
                if (!userRes) {
                  callback(new Error("Invalid User"));
                } else {
                  // console.log("node", userRes);
                  let userPassword = userRes.password;
                  if (userPassword === password) {
                    userData["userID"] = userRes?._id;
                    userData["clientID"] = userRes?.clientId || "";
                    userData["name"] = userRes?.name || "";
                    userData["userType"] = userRes?.userType || "";
                    userData["email"] = userRes?.email || "";
                    callback(null, userData);
                  } else {
                    callback(new Error("Invalid Password"));
                  }
                }
              }
            );
          } else {
            let userPassword = response.password;
            if (userPassword === password) {
              userData["userID"] = response?._id;
              userData["clientID"] = response?._id;
              userData["name"] = response?.name;
              userData["userType"] = ["CLIENT"];
              userData["email"] = response?.email;
              callback(null, userData);
            } else {
              callback(new Error("Invalid Password"));
            }
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports.getlogin = async (userId, userType, next, callback) => {
  try {
    let userData;
    if (userType === "CLIENT") {
      userData = await Client.findById(userId, "email mobileNumber password");
      if (userData) {
        callback(null, userData);
      } else {
        callback("Client not found", null);
      }
    } else {
      userData = await user.findById(
        userId,
        "email mobileNumber password userType"
      );
      if (userData) {
        callback(null, userData);
      } else {
        callback("User not found", null);
      }
    }
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.register = async (receivedData, next, callback) => {
  try {
    let clientData = new Client(receivedData);
    clientData.save(function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  } catch (err) {
    next(err);
  }
};
// Changes by somesh
module.exports.getUser = (
  clientId,
  isAscending,
  requestType,
  userId,
  userType,
  next,
  callback
) => {
  try {
    // Changes by Arun
    let findQuery = { clientId: clientId };
    let project = "_id name userType isEnabled";
    let populate = [];
    if (requestType == "TABLE") {
      project = "_id name mobileNumber email password userType isEnabled";
      populate = [
        {
          path: "branchManager",
          model: user,
          select: "branchId",
          populate: { path: "branchId", model: branchId, select: "branchName" },
        },
        { path: "branchId", model: branchId, select: "branchName" },
      ];
    }
    if (userType == USER_TYPE.BRANCH_MANAGER) {
      findQuery.branchManager = userId;
    }
    // End of changes

    user
      .find(findQuery, project)
      .populate(populate)
      .sort(isAscending ? { name: 1 } : {})
      .exec(async function (error, response) {
        if (error) {
          callback(error);
        } else {
          // const modifiedResponse = response.map((data) => {
          //   const {
          //     photo,
          //     addressProof,
          //     idProof,
          //     panProof,
          //     educationalProof,
          //     bankBook,
          //     ...rest
          //   } = data.toObject();
          //   return rest;
          // });

          callback(null, response);
          // console.log(modifiedResponse);
        }
      });
  } catch (err) {
    next(err);
  }
};
// Changes by somesh
module.exports.getUserById = (id, next, callback) => {
  try {
    user
      .findById(id)
      .populate([
        { path: "branchId", model: branchId, select: "branchName isEnabled" },
        { path: "branchManager", model: user },
      ])
      .exec(async function (err, data) {
        if (err) {
          callback(err);
        } else {
          // if (data.photo && Object.keys(data.photo).length > 0) {
          //   // console.log("user photo ", data.photo);
          //   let photoObj = data.photo;
          //   let key = photoObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       photoObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.phonePeQr && Object.keys(data.phonePeQr).length > 0) {
          //   let phonePeQrObj = data.phonePeQr;
          //   let key = phonePeQrObj.key;

          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       phonePeQrObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.paytmQr && Object.keys(data.paytmQr).length > 0) {
          //   let paytmQrObj = data.paytmQr;
          //   let key = paytmQrObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       paytmQrObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.googlePayQr && Object.keys(data.googlePayQr).length > 0) {
          //   let googlePayQrObj = data.googlePayQr;
          //   let key = googlePayQrObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       googlePayQrObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.addressProof && Object.keys(data.addressProof).length > 0) {
          //   let addressProofObj = data.addressProof;
          //   let key = addressProofObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       addressProofObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.idProof && Object.keys(data.idProof).length > 0) {
          //   let idProofObj = data.idProof;
          //   let key = idProofObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       idProofObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.panProof && Object.keys(data.panProof).length > 0) {
          //   let panProofObj = data.panProof;
          //   let key = panProofObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       panProofObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (
          //   data.educationalProof &&
          //   Object.keys(data.educationalProof).length > 0
          // ) {
          //   let educationalProofObj = data.educationalProof;
          //   let key = educationalProofObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       educationalProofObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }

          // if (data.bankBook && Object.keys(data.bankBook).length > 0) {
          //   let bankBookObj = data.bankBook;
          //   let key = bankBookObj.key;
          //   await CommonUtil.downloadFileFromAWSS3ByKey(key)
          //     .then((downloadURL) => {
          //       bankBookObj["downloadURL"] = downloadURL;
          //     })
          //     .catch((error) => {
          //       console.error("downloadFileFromAWSS3ByKey error ", error);
          //     });
          // }
          callback(null, data);
        }
      });
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.getFileFromAWSS3BucketByKey = async (
  fileKey,
  next,
  callback
) => {
  try {
    await CommonUtil.downloadFileFromAWSS3ByKey(fileKey)
      .then((fileData) => {
        let response = {};
        response["fileData"] = fileData;
        response["extension"] = CommonUtil.getExtensionFromKey(fileKey);
        callback(null, response);
      })
      .catch((error) => {
        console.error("downloadFileFromAWSS3ByKey error ", error);
        callback(err);
      });
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.getBankDetailsByUserId = (id, next, callback) => {
  try {
    user.findById(id, "bankDetails").exec(async function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.putUser = async (id, receivedData, files, next, callback) => {
  try {
    //   Changes by Arun for file upload
    let userPhoto = files?.find((file) => {
      return file.fieldname == AWS_USER_PHOTO_DIRECTORY_NAME;
    });
    // console.log("userPhoto ", userPhoto);
    let userPhotoObj = {};
    if (userPhoto) {
      const extenstion = path.extname(userPhoto.originalname);
      userPhoto.originalname = CommonUtil.getFileName(
        AWS_USER_PHOTO_DIRECTORY_NAME,
        extenstion
      );
      let filename = userPhoto.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        userPhoto,
        AWS_USER_PHOTO_DIRECTORY_NAME
      )
        .then((response) => {
          userPhotoObj["fileName"] = filename;
          userPhotoObj["key"] = response.key;
          userPhotoObj["location"] = response.Location;
          receivedData["photo"] = userPhotoObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let addrProof = files?.find((file) => {
      return file.fieldname == AWS_ADDRESS_PROOF_DIRECTORY_NAME;
    });
    let addrProofObj = {};
    if (addrProof) {
      const extenstion = path.extname(addrProof.originalname);
      addrProof.originalname = CommonUtil.getFileName(
        AWS_ADDRESS_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = addrProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        addrProof,
        AWS_ADDRESS_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          addrProofObj["fileName"] = filename;
          addrProofObj["key"] = response.key;
          addrProofObj["location"] = response.Location;
          receivedData["addressProof"] = addrProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let IDProof = files?.find((file) => {
      return file.fieldname == AWS_ID_PROOF_DIRECTORY_NAME;
    });
    let IDProofObj = {};
    if (IDProof) {
      const extenstion = path.extname(IDProof.originalname);
      IDProof.originalname = commonUtil.getFileName(
        AWS_ID_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = IDProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        IDProof,
        AWS_ADDRESS_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          IDProofObj["fileName"] = filename;
          IDProofObj["key"] = response.key;
          IDProofObj["location"] = response.Location;
          receivedData["idProof"] = IDProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let PANCard = files?.find((file) => {
      return file.fieldname == AWS__PAN_CARD_DIRECTORY_NAME;
    });
    let PANCardObj = {};
    if (PANCard) {
      const extenstion = path.extname(PANCard.originalname);
      PANCard.originalname = CommonUtil.getFileName(
        AWS__PAN_CARD_DIRECTORY_NAME,
        extenstion
      );
      let filename = PANCard.originalname || "";
      await CommonUtil.uploadFileToAWSS3(PANCard, AWS__PAN_CARD_DIRECTORY_NAME)
        .then((response) => {
          // console.log("response ", response);
          PANCardObj["fileName"] = filename;
          PANCardObj["key"] = response.key;
          PANCardObj["location"] = response.Location;
          receivedData["panProof"] = PANCardObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let educationalProof = files?.find((file) => {
      return file.fieldname == AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME;
    });
    let educationalProofObj = {};
    if (educationalProof) {
      const extenstion = path.extname(educationalProof.originalname);
      educationalProof.originalname = CommonUtil.getFileName(
        AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME,
        extenstion
      );
      let filename = educationalProof.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        educationalProof,
        AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          educationalProofObj["fileName"] = filename;
          educationalProofObj["key"] = response.key;
          educationalProofObj["location"] = response.Location;
          receivedData["educationalProof"] = educationalProofObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let bankBook = files?.find((file) => {
      return file.fieldname == AWS_BANK_BOOK_DIRECTORY_NAME;
    });
    let bankBookObj = {};
    if (bankBook) {
      const extenstion = path.extname(bankBook.originalname);
      bankBook.originalname = CommonUtil.getFileName(
        AWS_BANK_BOOK_DIRECTORY_NAME,
        extenstion
      );
      let filename = bankBook.originalname || "";
      await CommonUtil.uploadFileToAWSS3(bankBook, AWS_BANK_BOOK_DIRECTORY_NAME)
        .then((response) => {
          bankBookObj["fileName"] = filename;
          bankBookObj["key"] = response.key;
          bankBookObj["location"] = response.Location;
          receivedData["bankBook"] = bankBookObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let phonepeQR = files?.find((file) => {
      return file.fieldname == AWS_PHONEPAY_QR_DIRECTORY_NAME;
    });
    let phonepeQRObj = {};
    if (phonepeQR) {
      const extenstion = path.extname(phonepeQR.originalname);
      phonepeQR.originalname = CommonUtil.getFileName(
        AWS_PHONEPAY_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = phonepeQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        phonepeQR,
        AWS_PHONEPAY_QR_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          phonepeQRObj["fileName"] = filename;
          phonepeQRObj["key"] = response.key;
          phonepeQRObj["location"] = response.Location;
          receivedData["phonePeQr"] = phonepeQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let paytmQR = files?.find((file) => {
      return file.fieldname == AWS_PAYTM_QR_DIRECTORY_NAME;
    });
    let paytmQRObj = {};
    if (paytmQR) {
      const extenstion = path.extname(paytmQR.originalname);
      paytmQR.originalname = CommonUtil.getFileName(
        AWS_PAYTM_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = paytmQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(paytmQR, AWS_PAYTM_QR_DIRECTORY_NAME)
        .then((response) => {
          // console.log("response ", response);
          paytmQRObj["fileName"] = filename;
          paytmQRObj["key"] = response.key;
          paytmQRObj["location"] = response.Location;
          receivedData["paytmQr"] = paytmQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }

    let googlePayQR = files?.find((file) => {
      return file.fieldname == AWS_GOOGLEPAY_QR_DIRECTORY_NAME;
    });
    let googlePayQRObj = {};
    if (googlePayQR) {
      const extenstion = path.extname(googlePayQR.originalname);
      googlePayQR.originalname = CommonUtil.getFileName(
        AWS_GOOGLEPAY_QR_DIRECTORY_NAME,
        extenstion
      );
      let filename = googlePayQR.originalname || "";
      await CommonUtil.uploadFileToAWSS3(
        googlePayQR,
        AWS_GOOGLEPAY_QR_DIRECTORY_NAME
      )
        .then((response) => {
          // console.log("response ", response);
          googlePayQRObj["fileName"] = filename;
          googlePayQRObj["key"] = response.key;
          googlePayQRObj["location"] = response.Location;
          receivedData["googlePayQr"] = googlePayQRObj;
        })
        .catch((error) => {
          console.error("Upload file error ", error);
        });
    }
    let userType = receivedData.userType;
    if (userType) {
      let userTypeArray = userType.split(",");
      receivedData.userType = userTypeArray;
    }
    if (receivedData.bankDetails) {
      receivedData.bankDetails = JSON.parse(receivedData.bankDetails);
    }

    user.findByIdAndUpdate({ _id: id }, receivedData, function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = (id, next, callback) => {
  try {
    user.findByIdAndDelete({ _id: id }, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  } catch (err) {
    next(err);
  }
};

// written by gokul...

module.exports.verifyMobileNumber = async (mobileNum, next, callback) => {
  try {
    let data = await user.findOne({ mobileNumber: mobileNum });
    // console.log(data);
    if (data) {
      let error = new Error();
      error.message = `Mobile Number already exist in ${data.name}`;
      error.name = "CustomError";
      callback(error);
    } else {
      callback(null, {});
    }
  } catch (err) {
    next(err);
  }
};

module.exports.verifyEmailAddress = async (email, next, callback) => {
  try {
    let data = await user.findOne({ email: email });

    if (data) {
      let error = new Error();
      error.message = `Email addresss already exist in ${data.name}`;
      error.name = "CustomError";
      callback(error);
    } else {
      callback(null, {});
    }
  } catch (err) {
    next(err);
  }
};
