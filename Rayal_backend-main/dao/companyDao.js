const company = require("../Model/company");
const RTO = require("../Model/RTO");
const CompanyRTO = require("../Model/companyRTO");
const mongoose = require("mongoose");

module.exports.postCompany = (clientId, receivedData, next, callback) => {
  try {
    let data = new company(receivedData);
    data["clientId"] = clientId;
    data.save(function (err, response) {
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

module.exports.getCompany = (
  clientId,
  isAscending,
  receivedData,
  next,
  callback
) => {
  try {
    company
      .find({ clientId: clientId, ...receivedData })
      .sort(isAscending ? { shortName: 1 } : {})
      .exec(function (err, data) {
        //sort added by gokul..
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

// Changes by Arun
module.exports.getRTO = (next, callback) => {
  try {
    RTO.aggregate([
      {
        $sort: {
          RTOCode: 1,
        },
      },
      {
        $group: {
          _id: "$State",
          RTO: {
            $push: {
              id: "$_id",
              value: "$RTOCode",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]).exec(function (err, data) {
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

// Changes by Arun
module.exports.saveCompanyRTO = (clientId, receivedData, next, callback) => {
  try {
    receivedData["clientId"] = clientId;
    let data = new CompanyRTO(receivedData);
    data.save(function (err, response) {
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

// Changes by Arun
module.exports.updateCompanyRTO = (id, receivedData, next, callback) => {
  try {
    console.log("id ", id, " receivedData ", receivedData);
    CompanyRTO.findByIdAndUpdate(id, receivedData, function (err, response) {
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

// Changes by Arun
module.exports.getCompanyRTOByID = (clientId, companyRTOID, next, callback) => {
  try {
    const companyRTOIDObjectId = mongoose.Types.ObjectId(companyRTOID);
    CompanyRTO.aggregate([
      {
        $match: {
          _id: companyRTOIDObjectId,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$companyId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$companyId"] },
              },
            },
            {
              $project: {
                _id: 1,
                shortName: 1,
              },
            },
          ],
          as: "CompanyData",
        },
      },
      {
        $unwind: {
          path: "$CompanyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          location: 1,
          RTOCode: 1,
          isEnabled: 1,
          remarks: 1,
          company: { id: "$CompanyData._id", value: "$CompanyData.shortName" },
        },
      },
    ]).exec(function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data[0]);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.getRTOLocationByCompanyID = (companyId, next, callback) => {
  try {
    CompanyRTO.aggregate([
      { $match: { companyId: companyId } },
      {
        $group: {
          _id: "$companyId",
          location: { $push: { id: "$_id", value: "$location" } },
        },
      },
    ]).exec(function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data[0]);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Changes by Arun
module.exports.getCompanyRTO = (clientId, requestType, next, callback) => {
  try {
    let matchQuery = { clientId: clientId };
    if (requestType == "ACTIVE") {
      matchQuery["isEnabled"] = true;
    }
    if (requestType == "INACTIVE") {
      matchQuery["isEnabled"] = false;
    }

    CompanyRTO.aggregate([
      { $match: matchQuery },

      {
        $unwind: {
          path: "$RTOCode",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "company",
          let: { companyId: { $toObjectId: "$companyId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $project: {
                _id: 1,
                companyName: "$shortName",
              },
            },
          ],
          as: "CompanyData",
        },
      },
      {
        $unwind: {
          path: "$CompanyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "RTOList",
          let: { id: { $toObjectId: "$RTOCode" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { _id: 0, RTOCode: 1 } },
          ],
          as: "RTOData",
        },
      },
      {
        $unwind: {
          path: "$RTOData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$CompanyData.companyName" },
          location: { $first: "$location" },
          remarks: { $first: "$remarks" },
          RTOCode: { $push: "$RTOData.RTOCode" },
          isEnabled: { $first: "$isEnabled" },
        },
      },
    ]).exec(function (err, data) {
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

module.exports.updateCompany = (id, receivedData, next, callback) => {
  try {
    company
      .findOneAndUpdate({ _id: id }, { $set: receivedData })
      .exec(function (err, data) {
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

module.exports.deleteCompany = (id, next, callback) => {
  try {
    company.findOneAndRemove({ _id: id }).exec(function (err, data) {
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

module.exports.filterCompany = (clientId, data, next, callback) => {
  try {
    company
      .find({ $and: [{ clientId: clientId }, data] })
      .exec(function (err, response) {
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

module.exports.deleteRTO = (id, next, callback) => {
  try {
    CompanyRTO.findOneAndRemove({ _id: id }).exec(function (err, data) {
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
