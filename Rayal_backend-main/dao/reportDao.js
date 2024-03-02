const Policy = require("../Model/policy");
const User = require("../Model/user");
const mongoose = require("mongoose");
const { PAYMENT_MODE } = require("../configuration/constants");

module.exports.getMasterReport = (
  clientId,
  requestType,
  body,
  next,
  callback
) => {
  try {
    const selectedUserId = body.selectedUserId;
    const selectedStartDate = new Date(body.selectedStartDate);
    const selectedEndDate = new Date(body.selectedEndDate);
    const selectedBookingCodeId = body.selectedBookingCodeId;
    const selectedSubBookingCodeId = body.selectedSubBookingCodeId;
    const selectedBranchId = body.selectedBranchId;
    const selectedCompanyIdList = body.selectedCompanyIdList || [];
    const selectedProductIdList = body.selectedProductIdList || [];
    const selectedSubProductIdList = body.selectedSubProductIdList || [];
    const selectedPolicyTypeIdList = body.selectedPolicyTypeIdList || [];

    let matchQuery = {
      status: "approvedPolicy",
      clientId: clientId,
    };
    if (body.selectedStartDate && body.selectedEndDate) {
      matchQuery["issueDate"] = {
        $gte: selectedStartDate,
        $lte: selectedEndDate,
      };
    }

    if (selectedUserId) {
      matchQuery["userId"] = mongoose.Types.ObjectId(selectedUserId);
    }
    if (selectedBookingCodeId) {
      matchQuery["bookingCodeId"] = selectedBookingCodeId;
    }
    if (selectedSubBookingCodeId) {
      matchQuery["subBookingCodeId"] = selectedSubBookingCodeId;
    }
    if (selectedCompanyIdList.length) {
      matchQuery["companyId"] = {
        $in: selectedCompanyIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedProductIdList.length) {
      matchQuery["productId"] = {
        $in: selectedProductIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedSubProductIdList.length) {
      matchQuery["subProductId"] = {
        $in: selectedSubProductIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedPolicyTypeIdList.length) {
      matchQuery["policyTypeId"] = {
        $in: selectedPolicyTypeIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }

    // console.log("matchQuery ", matchQuery);
    let root = { $first: null };
    if (requestType == "MASTER") {
      root = { $push: "$$ROOT" };
    }

    Policy.aggregate([
      {
        $match: matchQuery,
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
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                email: 1,
              },
            },
          ],
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$UserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // added by gokul....
      {
        $lookup: {
          from: "vehicleMake",
          let: {
            make: "$make",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$make"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                vehicleMake: 1,
              },
            },
          ],
          as: "VehicleMakeData",
        },
      },
      {
        $unwind: {
          path: "$VehicleMakeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          issueDate: 1,
          company: "$CompanyData.shortName",
          policyNumber: { $concat: ["'", "$policyNumber"] },
          customerName: 1,
          userEmail: "$UserData.email",
          registrationNumber: 1,
          odPremium: 1,
          tpPremium: 1,
          netPremium: 1,
          totalPremium: 1,
          make: "$VehicleMakeData.vehicleMake",
        },
      },
      {
        $group: {
          _id: null,
          policyCount: { $sum: 1 },
          ODTotal: { $sum: "$odPremium" },
          TPTotal: { $sum: "$tpPremium" },
          NETTotal: { $sum: "$netPremium" },
          total: { $sum: { $toDouble: "$totalPremium" } },
          tableData: root,
        },
      },
    ]).exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response[0]);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getMasterReportExcelFormat = (body, next, callback) => {
  try {
    const selectedUserId = body.selectedUserId;
    const selectedStartDate = new Date(body.selectedStartDate);
    const selectedEndDate = new Date(body.selectedEndDate);
    const selectedBookingCodeId = body.selectedBookingCodeId;
    const selectedSubBookingCodeId = body.selectedSubBookingCodeId;
    const selectedBranchId = body.selectedBranchId;
    const selectedCompanyIdList = body.selectedCompanyIdList || [];
    const selectedProductIdList = body.selectedProductIdList || [];
    const selectedSubProductIdList = body.selectedSubProductIdList || [];
    const selectedPolicyTypeIdList = body.selectedPolicyTypeIdList || [];

    let matchQuery = {
      status: "approvedPolicy",
      clientId: clientId,
      issueDate: {
        $gte: selectedStartDate,
        $lte: selectedEndDate,
      },
    };

    if (selectedUserId) {
      matchQuery["userId"] = mongoose.Types.ObjectId(selectedUserId);
    }
    if (selectedBookingCodeId) {
      matchQuery["bookingCodeId"] = selectedBookingCodeId;
    }
    if (selectedSubBookingCodeId) {
      matchQuery["subBookingCodeId"] = selectedSubBookingCodeId;
    }
    if (selectedCompanyIdList.length) {
      matchQuery["companyId"] = {
        $in: selectedCompanyIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedProductIdList.length) {
      matchQuery["productId"] = {
        $in: selectedProductIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedSubProductIdList.length) {
      matchQuery["subProductId"] = {
        $in: selectedSubProductIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (selectedPolicyTypeIdList.length) {
      matchQuery["policyTypeId"] = {
        $in: selectedPolicyTypeIdList.map((id) => mongoose.Types.ObjectId(id)),
      };
    }

    // console.log("matchQuery ", matchQuery);

    Policy.aggregate([
      {
        $match: matchQuery,
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
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                email: 1,
                name: 1,
              },
            },
          ],
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$UserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bookingCode",
          let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$bookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                bookingCode: 1,
              },
            },
          ],
          as: "BookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$BookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subBookingCode",
          let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$subBookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                subBookingCode: 1,
              },
            },
          ],
          as: "SubBookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$SubBookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "policyType",
          let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$policyTypeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                policyType: 1,
              },
            },
          ],
          as: "PolicyTypeData",
        },
      },
      {
        $unwind: {
          path: "$PolicyTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "product",
          let: { productId: { $toObjectId: "$productId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
            {
              $project: {
                _id: 1,
                product: 1,
              },
            },
          ],
          as: "ProductData",
        },
      },
      {
        $unwind: {
          path: "$ProductData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subProduct",
          let: { subProductId: { $toObjectId: "$subProductId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$subProductId"] } } },
            {
              $project: {
                _id: 1,
                subProduct: 1,
              },
            },
          ],
          as: "SubProductData",
        },
      },
      {
        $unwind: {
          path: "$SubProductData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          //added by gokul....
          from: "vehicleMake",
          let: { make: { $toObjectId: "$make" } },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$make"] } },
            },
            {
              $project: {
                _id: 1,
                vehicleMake: 1,
              },
            },
          ],
          as: "VehicleMakeData",
        },
      },
      {
        $unwind: {
          path: "$VehicleMakeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "fuelType",
          let: { fuelType: "$fuelType" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$fuelType"] } } },
            {
              $project: {
                _id: 1,
                fuelType: 1,
              },
            },
          ],
          as: "FuelTypeData",
        },
      },
      {
        $unwind: {
          path: "$FuelTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // \\\\
      {
        $project: {
          _id: 0,
          issueDate: 1,
          company: "$CompanyData.shortName",
          policyNumber: 1,
          customerName: 1,
          email: 1,
          mobileNumber: { $concat: ["'", "$mobileNumber"] }, //concat added by gokul...
          userEmail: "$UserData.email",
          userName: "$UserData.name",
          registrationNumber: 1,
          registrationYear: "$make",
          bookingCode: "$BookingCodeData.bookingCode",
          subBookingCode: "$SubBookingCodeData.subBookingCode",
          policyType: "$PolicyTypeData.policyType",
          product: "$ProductData.product",
          subProduct: "$SubProductData.subProduct",
          vehicleMake: "$VehicleMakeData.vehicleMake", //added by gokul...
          model: 1,
          gvw: 1,
          cc: 1,
          seatingCapacity: 1,
          fuelType: "$FuelTypeData.fuelType",
          odPremium: 1,
          tpPremium: 1,
          netPremium: 1,
          totalPremium: 1,
          odPolicyStartDate: 1,
          tpPolicyStartDate: 1,
          odPolicyEndDate: 1,
          tpPolicyEndDate: 1,
          tpPolicyPeriod: 1,
          odPolicyPeriod: 1,
          paCover: 1,
          odDisc: 1,
          payODPer: "$userPayable.ODPercentage",
          payTPPer: "$userPayable.TPPercentage",
          payNetPer: "$userPayable.NETPercentage",
          payODAmount: "$userPayable.ODAmount",
          payTPAmount: "$userPayable.TPAmount",
          payNetAmount: "$userPayable.NETAmount",
          totalPayableAmount: "$userPayable.Total",
          recODPer: "$commisionRecievable.ODPercentage",
          recTPPer: "$commisionRecievable.TPPercentage",
          recNetPer: "$commisionRecievable.NETPercentage",
          recODAmount: "$commisionRecievable.ODAmount",
          recTPAmount: "$commisionRecievable.TPAmount",
          recNetAmount: "$commisionRecievable.NETAmount",
          totalReceivableAmount: "$commisionRecievable.Total",
        },
      },
      // {
      //   $group: {
      //     _id: null,
      //     policyCount: { $sum: 1 },
      //     ODTotal: { $sum: "$odPremium" },
      //     TPTotal: { $sum: "$tpPremium" },
      //     NETTotal: { $sum: "$netPremium" },
      //     total: { $sum: { $toDouble: "$totalPremium" } },
      //     tableData: root,
      //   },
      // },
    ]).exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response[0]);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPaidReceivedReport = (
  clientId,
  requestType,
  body,
  next,
  callback
) => {
  try {
    const selectedUserId = body.selectedUserId;
    const selectedStartDate = new Date(body.selectedStartDate);
    const selectedEndDate = new Date(body.selectedEndDate);
    const tdsType = body.tdsType;

    console.log("client:", clientId);

    selectedEndDate.setDate(selectedEndDate.getDate() + 1); //added by gokul...
    let matchQuery = {
      documentType: "WALLET",
      // issueDate: {
      //   $gte: selectedStartDate,
      //   $lte:selectedEndDate,
      // },
    };

    // console.log("datesel",selectedStartDate.getTime(),selectedEndDate)

    if (selectedStartDate.getTime() && selectedEndDate.getTime()) {
      matchQuery["issueDate"] = {
        $gte: selectedStartDate,
        $lte: selectedEndDate,
      };
    }

    if (selectedUserId) {
      matchQuery["userId"] = mongoose.Types.ObjectId(selectedUserId);
    }
    if (tdsType == "yes") {
      matchQuery["withTDS"] = true;
    }

    if (tdsType == "no") {
      matchQuery["withTDS"] = false;
    }

    if (requestType == "PAID") {
      matchQuery["paymentMode"] = PAYMENT_MODE.USER_PAID;
    }
    if (requestType == "RECEIVED") {
      matchQuery["paymentMode"] = PAYMENT_MODE.USER_RECEIVED;
    }
    // console.log("matchQuery ", matchQuery);
    // console.log("Date:",selectedStartDate.getMonth());

    Policy.aggregate([
      {
        $match: {
          clientId: clientId,
          ...matchQuery,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                name: 1,
                bankDetails: 1,
                branchManager: 1,
              },
            },
          ],
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$UserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { branchManager: { $toObjectId: "$UserData.branchManager" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchManager"] } } },
            {
              $project: {
                _id: 0,
                name: 1,
                mobileNumber: 1,
                branchId: 1,
              },
            },
          ],
          as: "BranchManagerData",
        },
      },
      {
        $unwind: {
          path: "$BranchManagerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branch",
          let: { branchId: { $toObjectId: "$BranchManagerData.branchId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchId"] } } },
            { $project: { _id: 0, branchName: 1 } },
          ],
          as: "BranchData",
        },
      },
      {
        $unwind: {
          path: "$BranchData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          transactionDate: "$issueDate",
          paymentDate: "$userPayable.updatedAt",
          userName: "$UserData.name",
          branch: "$BranchData.branchName",
          amount: "$userPayable.Total",
          remark: 1,
          payment: "$paymentMode",
          accountNumber: 1,
          bankDetails: "$UserData.bankDetails",
        },
      },
    ]).exec(function (err, response) {
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

module.exports.getTDSReport = (
  clientId,
  requestType,
  selectedDate,
  next,
  callback
) => {
  try {
    let matchQuery = {
      clientId: clientId,
      documentType: "WALLET",
      paymentMode: PAYMENT_MODE.USER_PAID,
    };
    if (selectedDate) {
      let date = new Date(selectedDate);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      console.log("month ", month, " year ", year);
      matchQuery["$expr"] = {
        $and: [
          { $eq: [{ $month: "$issueDate" }, month] },
          { $eq: [{ $year: "$issueDate" }, year] },
        ],
      };
    }

    console.log("requestType ", requestType);
    console.log("matchQuery ", matchQuery);

    let conditionalQuery = [
      {
        $project: {
          _id: 0,
          transactionDate: "$issueDate",
          paymentDate: "$userPayable.updatedAt",
          userName: "$UserData.name",
          userId: "$UserData._id",
          branch: "$BranchData.branchName",
          amount: "$userPayable.Total",
          TDSamount: 1,
          TDS: 1,
          remark: 1,
          payment: "$paymentMode",
          accountNumber: 1,
          bankDetails: "$UserData.bankDetails",
          company: "$CompanyData.name",
        },
      },
    ];

    if (requestType == "MONTH") {
      conditionalQuery.push({
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          branch: { $first: "$branch" },
          accountNumber: { $first: "$accountNumber" },
          bankDetails: { $first: "$bankDetails" },
          TDSamount: { $sum: "$TDSamount" },
          amount: { $sum: { $toDouble: "$amount" } },
          TDS: { $first: "$TDS" },
          company: { $first: "$company" },
        },
      });
    }

    Policy.aggregate(
      [
        {
          $match: matchQuery,
        },
        {
          $lookup: {
            from: "masterCompany",
            let: { companyId: { $toObjectId: "$walletCompanyId" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$companyId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: "$masterCompanyName",
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
            from: "user",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  bankDetails: 1,
                  branchManager: 1,
                },
              },
            ],
            as: "UserData",
          },
        },
        {
          $unwind: {
            path: "$UserData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user",
            let: { branchManager: { $toObjectId: "$UserData.branchManager" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$branchManager"] } } },
              {
                $project: {
                  _id: 0,
                  name: 1,
                  mobileNumber: 1,
                  branchId: 1,
                },
              },
            ],
            as: "BranchManagerData",
          },
        },
        {
          $unwind: {
            path: "$BranchManagerData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "branch",
            let: { branchId: { $toObjectId: "$BranchManagerData.branchId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$branchId"] } } },
              { $project: { _id: 0, branchName: 1 } },
            ],
            as: "BranchData",
          },
        },
        {
          $unwind: {
            path: "$BranchData",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $project: {
        //     _id: 0,
        //     transactionDate: "$issueDate",
        //     paymentDate: "$userPayable.updatedAt",
        //     userName: "$UserData.name",
        //     userId: "$UserData._id",
        //     branch: "$BranchData.branchName",
        //     amount: "$userPayable.Total",
        //     TDSamount: 1,
        //     TDS: 1,
        //     remark: 1,
        //     payment: "$paymentMode",
        //     accountNumber: 1,
        //     bankDetails: "$UserData.bankDetails",
        //     company: "$CompanyData.name",
        //   },
        // },
        // {
        //   $group: {
        //     _id: "$userId",
        //     userName: { $first: "$userName" },
        //     branch: { $first: "$branch" },
        //     accountNumber: { $first: "$accountNumber" },
        //     bankDetails: { $first: "$bankDetails" },
        //     TDSamount: { $sum: "$TDSamount" },
        //     amount: { $sum: { $toDouble: "$amount" } },
        //     TDS: { $first: "$TDS" },
        //     company: { $first: "$company" },
        //   },
        // },
      ].concat(conditionalQuery)
    ).exec(function (err, response) {
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

module.exports.getPolicyChequeReport = (clientId, body, next, callback) => {
  try {
    const selectedStartDate = new Date(body.selectedStartDate);
    const selectedEndDate = new Date(body.selectedEndDate);
    let matchQuery = {
      paymentMode: "Cheque",
      status: "approvedPolicy",
      clientId: clientId,
      issueDate: {
        $gte: selectedStartDate,
        $lte: selectedEndDate,
      },
    };
    console.log("matchQuery ", matchQuery);

    Policy.aggregate([
      {
        $match: matchQuery,
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
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                _id: 1,
                email: 1,
                name: 1,
                branchManager: 1,
              },
            },
          ],
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$UserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          let: { branchManager: { $toObjectId: "$UserData.branchManager" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchManager"] } } },
            {
              $project: {
                _id: 0,
                branchId: 1,
              },
            },
          ],
          as: "BranchManagerData",
        },
      },
      {
        $unwind: {
          path: "$BranchManagerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branch",
          let: { branchId: { $toObjectId: "$BranchManagerData.branchId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$branchId"] } } },
            { $project: { _id: 0, branchName: 1 } },
          ],
          as: "BranchData",
        },
      },
      {
        $unwind: {
          path: "$BranchData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "policyType",
          let: { policyTypeId: { $toObjectId: "$policyTypeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$policyTypeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                policyType: 1,
              },
            },
          ],
          as: "PolicyTypeData",
        },
      },
      {
        $unwind: {
          path: "$PolicyTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bookingCode",
          let: { bookingCodeId: { $toObjectId: "$bookingCodeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$bookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                bookingCode: 1,
              },
            },
          ],
          as: "BookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$BookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subBookingCode",
          let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$subBookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                subBookingCode: 1,
              },
            },
          ],
          as: "SubBookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$SubBookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          policyDate: "$issueDate",
          branch: "$BranchData.branchName",
          company: "$CompanyData.shortName",
          userName: "$UserData.name",
          policyType: "$PolicyTypeData.policyType",
          policyNumber: { $concat: ["'", "$policyNumber"] }, //concat added by gokul...
          customerName: 1,
          registrationNumber: 1,
          odStartDate: "$odPolicyStartDate",
          tpStartDate: "$tpPolicyStartDate",
          bookingCode: "$BookingCodeData.bookingCode",
          subBookingCode: "$SubBookingCodeData.subBookingCode",
          totalPremium: 1,
          paymentMode: 1,
          chequeStatus: 1,
          chequeNumber: 1,
          chequeDate: 1,
          bank: "$bankName",
        },
      },
    ]).exec(function (err, response) {
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

module.exports.getBookingReport = async (clientId, body, next, callback) => {
  try {
    const requestType = body.requestType;
    const currentDate = new Date();
    const selectedStartDate =
      requestType == "DEFAULT" ? currentDate : new Date(body.selectedStartDate);
    const selectedEndDate = new Date(body.selectedEndDate);
    const bookingCodeId = body.bookingCode;
    const subBookingCodeId = body.subBookingCode;
    const bookingCodeObjectId = mongoose.Types.ObjectId(bookingCodeId);
    const subBookingCodeObjectId = mongoose.Types.ObjectId(subBookingCodeId);
    let month = selectedStartDate.getMonth() + 1;
    let year = selectedStartDate.getFullYear();
    console.log("month ", month, " year ", year);

    let receiveMatchQuery = {
      clientId: clientId,
      status: "approvedPolicy",
      bookingCodeId: bookingCodeObjectId,
      subBookingCodeId: subBookingCodeObjectId,
      isCommisionRecievable: true,
    };
    if (requestType != "DEFAULT") {
      receiveMatchQuery["issueDate"] = {
        $gte: selectedStartDate,
        $lte: selectedEndDate,
      };
    }
    console.log("receiveMatchQuery ", receiveMatchQuery);

    let result = {};
    let todayData = await Policy.aggregate([
      {
        $project: {
          _id: 1,
          issueDate: 1,
          status: 1,
          bookingCodeId: 1,
          subBookingCodeId: 1,
          odPremium: 1,
          tpPremium: 1,
          netPremium: 1,
          totalPremium: 1,
        },
      },
      {
        $match: receiveMatchQuery,
      },
      {
        $group: {
          _id: null,
          policyCount: { $sum: 1 },
          odTotal: { $sum: "$odPremium" },
          tpTotal: { $sum: "$tpPremium" },
          netTotal: { $sum: "$netPremium" },
          total: { $sum: { $toDouble: "$totalPremium" } },
        },
      },
    ]);
    let monthData = await Policy.aggregate([
      {
        $project: {
          _id: 1,
          issueDate: 1,
          status: 1,
          bookingCodeId: 1,
          odPremium: 1,
          tpPremium: 1,
          netPremium: 1,
          totalPremium: 1,
        },
      },
      {
        $match: {
          status: "approvedPolicy",
          bookingCodeId: bookingCodeObjectId,
          $expr: {
            $and: [
              { $eq: [{ $month: "$issueDate" }, month] },
              { $eq: [{ $year: "$issueDate" }, year] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          policyCount: { $sum: 1 },
          odTotal: { $sum: "$odPremium" },
          tpTotal: { $sum: "$tpPremium" },
          netTotal: { $sum: "$netPremium" },
          total: { $sum: { $toDouble: "$totalPremium" } },
        },
      },
    ]);
    let totalData = await Policy.aggregate([
      {
        $project: {
          _id: 1,
          issueDate: 1,
          status: 1,
          bookingCodeId: 1,
          odPremium: 1,
          tpPremium: 1,
          netPremium: 1,
          totalPremium: 1,
        },
      },
      {
        $match: {
          status: "approvedPolicy",
          bookingCodeId: bookingCodeObjectId,
        },
      },
      {
        $group: {
          _id: null,
          policyCount: { $sum: 1 },
          odTotal: { $sum: "$odPremium" },
          tpTotal: { $sum: "$tpPremium" },
          netTotal: { $sum: "$netPremium" },
          total: { $sum: { $toDouble: "$totalPremium" } },
        },
      },
    ]);
    let receivableData = await Policy.aggregate([
      {
        $project: {
          _id: 1,
          issueDate: 1,
          status: 1,
          bookingCodeId: 1,
          isCommisionRecievable: 1,
          commisionRecievable: 1,
        },
      },
      {
        $match: receiveMatchQuery,
      },
      {
        $group: {
          _id: null,
          policyCount: { $sum: 1 },
          totalReceived: {
            $sum: { $toDouble: "$commisionRecievable.ReceivedAmount" },
          },
          totalReceivable: {
            $sum: { $toDouble: "$commisionRecievable.Total" },
          },
          pending: {
            $sum: { $toDouble: "$commisionRecievable.PendingAmount" },
          },
        },
      },
    ]);
    result["today"] = todayData[0];
    result["monthly"] = monthData[0];
    result["total"] = totalData[0];
    result["receivable"] = receivableData[0];
    callback(null, result);
  } catch (err) {
    next(err);
  }
};

module.exports.getDashboard = async (
  clientId,
  userId,
  userType,
  startDate,
  endDate,
  next,
  callback
) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const barChartMatch = {
      status: "approvedPolicy",
    };

    const policyRelatedMatch = {
      clientId: clientId,
      documentType: "POLICY",

      // status: "entryPending",
    };

    const userRelatedMatch = {
      clientId: clientId,
    };

    if (userId && userType !== "CLIENT") {
      barChartMatch["userId"] = mongoose.Types.ObjectId(userId);
      policyRelatedMatch["userId"] = mongoose.Types.ObjectId(userId);
      userRelatedMatch["branchManager"] = mongoose.Types.ObjectId(userId);
    }

    // }
    if (startDate && endDate) {
      barChartMatch["issueDate"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };

      policyRelatedMatch["issueDate"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // if (userId && userType === "branchManager") {
    //   userRelatedMatch["branchManager"] = mongoose.Types.ObjectId(userId);
    // }

    let result = {};
    let barChartData = await Policy.aggregate([
      {
        $project: {
          yearMonth: {
            $dateToString: {
              format: "%Y-%m",
              date: "$issueDate",
            },
          },
          year: {
            $dateToString: {
              format: "%Y",
              date: "$issueDate",
            },
          },
          month: {
            $dateToString: {
              format: "%m",
              date: "$issueDate",
            },
          },
          totalPremium: { $toDouble: "$totalPremium" },
          status: 1,
          userId: 1, //added by gokul....
        },
      },
      {
        $match: barChartMatch,

        // {
        //   status: "approvedPolicy",
        // },
      },
      {
        $group: {
          _id: "$yearMonth",
          year: { $first: "$year" },
          month: { $first: { $toDouble: "$month" } },
          totalPolicy: { $sum: 1 },
          totalPremium: { $sum: "$totalPremium" },
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
      {
        $project: {
          _id: 1,
          year: 1,
          // monthName: {
          //   $switch: {
          //     branches: [
          //       { case: { $eq: ["$month", 1] }, then: "Jan" },
          //       { case: { $eq: ["$month", 2] }, then: "Feb" },
          //       { case: { $eq: ["$month", 3] }, then: "Mar" },
          //       { case: { $eq: ["$month", 4] }, then: "Apr" },
          //       { case: { $eq: ["$month", 5] }, then: "May" },
          //       { case: { $eq: ["$month", 6] }, then: "Jun" },
          //       { case: { $eq: ["$month", 7] }, then: "Jul" },
          //       { case: { $eq: ["$month", 8] }, then: "Aug" },
          //       { case: { $eq: ["$month", 9] }, then: "Sep" },
          //       { case: { $eq: ["$month", 10] }, then: "Oct" },
          //       { case: { $eq: ["$month", 11] }, then: "Nov" },
          //       { case: { $eq: ["$month", 12] }, then: "Dec" },
          //     ],
          //     default: "Invalid Month",
          //   },
          // },
          month: 1,
          totalPolicy: 1,
          totalPremium: 1,
        },
      },
      {
        $group: {
          _id: "$year",
          year: { $first: "$year" },
          data: {
            $push: {
              // monthName: "$monthName",
              month: "$month",
              totalPolicy: "$totalPolicy",
              totalPremium: "$totalPremium",
            },
          },
        },
      },
    ]);
    let policyRelatedData = await Policy.aggregate([
      {
        $match: policyRelatedMatch,
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
        $lookup: {
          from: "subBookingCode",
          let: { subBookingCodeId: { $toObjectId: "$subBookingCodeId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$subBookingCodeId"] },
              },
            },
            {
              $project: {
                _id: 1,
                cc: 1,
              },
            },
          ],
          as: "SubBookingCodeData",
        },
      },
      {
        $unwind: {
          path: "$SubBookingCodeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$companyId",
          company: { $first: "$CompanyData.shortName" },
          entryPendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "entryPending"] }, 1, 0] },
          },
          verifyPendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "verifyPending"] }, 1, 0] },
          },
          chequePendingCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMode", "Cheque"] },
                    { $eq: ["$status", "chequePending"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          chequeClearedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMode", "Cheque"] },
                    { $eq: ["$chequeStatus", "Cleared"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          chequeBouncedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMode", "Cheque"] },
                    { $eq: ["$chequeStatus", "Bounced"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          payablePendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "approvePending"] }, 1, 0] },
          },
          approvedPolicyCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: [{ $month: "$issueDate" }, month] },
                    { $eq: [{ $year: "$issueDate" }, year] },
                    { $eq: ["$status", "approvedPolicy"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          // totalPremium: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $and: [
          //           { $eq: [{ $month: "$issueDate" }, month] },
          //           { $eq: [{ $year: "$issueDate" }, year] },
          //           { $eq: ["$status", "approvedPolicy"] },
          //         ],
          //       },
          //       { $toDouble: "$totalPremium" },
          //       0,
          //     ],
          //   },
          // },
          receivablePendingCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "approvePending"] },
                    { $eq: ["$isCommisionRecievable", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          ccPendingCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$status", "approvePending"] },
                        { $eq: ["$status", "approvedPolicy"] },
                      ],
                    },
                    { $eq: ["$ticketStatus", ""] },
                    { $eq: ["$SubBookingCodeData.cc", "Yes"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          entryPendingPolicySummary: { $sum: "$entryPendingCount" },
          entryPendingPolicy: {
            $push: { comapny: "$company", value: "$entryPendingCount" },
          },
          ccEentryPendingPolicySummary: { $sum: "$ccPendingCount" },
          ccEntryPendingPolicy: {
            $push: { comapny: "$company", value: "$ccPendingCount" },
          },
          // totalPolicyMonthSummary: { $sum: "$approvedPolicyCount" },
          // totalPolicyMonth: {
          //   $push: { comapny: "$company", value: "$approvedPolicyCount" },
          // },
          // totalPolicyMonthPremiumSummary: { $sum: "$totalPremium" },
          // totalPolicyMonthPremium: {
          //   $push: { comapny: "$company", value: "$totalPremium" },
          // },
          verifyPendingSummary: { $sum: "$verifyPendingCount" },
          verifyPendingPolicy: {
            $push: { comapny: "$company", value: "$verifyPendingCount" },
          },
          chequePendingSummary: { $sum: "$chequePendingCount" },
          chequeClearedSummary: { $sum: "$chequeClearedCount" },
          chequeBouncedSummary: { $sum: "$chequeBouncedCount" },
          chequePending: {
            $push: { comapny: "$company", value: "$chequePendingCount" },
          },
          payablePendingSummary: { $sum: "$payablePendingCount" },
          payablePending: {
            $push: { comapny: "$company", value: "$payablePendingCount" },
          },
          receivablePendingSummary: { $sum: "$receivablePendingCount" },
          receivablePending: {
            $push: { comapny: "$company", value: "$receivablePendingCount" },
          },
        },
      },
    ]);
    let userRelatedData = await User.aggregate([
      {
        $match: userRelatedMatch,
      },
      {
        $lookup: {
          from: "policy",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            { $project: { odPolicyEndDate: 1, status: 1 } },
          ],
          as: "PolicyData",
        },
      },
      {
        $unwind: {
          path: "$PolicyData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$_id",
          userName: { $first: "$name" },
          expiryCurrentMonthPolicyCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: ["$PolicyData.status", "approvedPolicy"],
                    },
                    {
                      $eq: [
                        { $month: "$PolicyData.odPolicyEndDate" },
                        new Date().getMonth() + 1,
                      ],
                    }, // Check for current month
                    {
                      $eq: [
                        { $year: "$PolicyData.odPolicyEndDate" },
                        new Date().getFullYear(),
                      ],
                    }, // Check for current year
                  ],
                },
                1,
                0,
              ],
            },
          },

          expiryTodayPolicyCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: ["$PolicyData.status", "approvedPolicy"],
                    },
                    {
                      $eq: [
                        { $dayOfMonth: "$PolicyData.odPolicyEndDate" },
                        { $dayOfMonth: new Date() },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          // $map added by gokul...
          // start
          userCount: {
            $first: {
              $sum: {
                $map: {
                  input: "$userType",
                  as: "userCount",
                  in: {
                    $cond: {
                      if: { $in: ["$$userCount", ["user"]] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          branchManagerCount: {
            $first: {
              $sum: {
                $map: {
                  input: "$userType",
                  as: "userCount",
                  in: {
                    $cond: {
                      if: { $in: ["$$userCount", ["branchManager"]] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          operatorCount: {
            $first: {
              $sum: {
                $map: {
                  input: "$userType",
                  as: "userCount",
                  in: {
                    $cond: {
                      if: { $in: ["$$userCount", ["operator"]] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          accountantCount: {
            $first: {
              $sum: {
                $map: {
                  input: "$userType",
                  as: "userCount",
                  in: {
                    $cond: {
                      if: { $in: ["$$userCount", ["accountant"]] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          ptstaffCount: {
            $first: {
              $sum: {
                $map: {
                  input: "$userType",
                  as: "userCount",
                  in: {
                    $cond: {
                      if: { $in: ["$$userCount", ["ptstaff"]] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          // end
        },
      },
      {
        $group: {
          _id: null,
          expiryCurrentMonthPolicySummary: {
            $sum: "$expiryCurrentMonthPolicyCount",
          },
          expiryCurrentMonthPolicyCount: {
            $push: {
              user: "$userName",
              value: { $sum: "$expiryCurrentMonthPolicyCount" },
            },
          },
          expiryTodayPolicySummary: { $sum: "$expiryTodayPolicyCount" },
          expiryTodayPolicyCount: {
            $push: {
              user: "$userName",
              value: { $sum: "$expiryTodayPolicyCount" },
            },
          },
          userCount: { $sum: "$userCount" },
          branchManagerCount: { $sum: "$branchManagerCount" },
          operatorCount: { $sum: "$operatorCount" },
          accountantCount: { $sum: "$accountantCount" },
          ptstaffCount: { $sum: "$ptstaffCount" },
        },
      },
    ]);
    result["policyRelatedData"] = policyRelatedData[0];
    result["userRelatedData"] = userRelatedData[0];
    result["barChartData"] = barChartData;
    callback(null, result);
  } catch (err) {
    next(err);
  }
};

//change by gokul
module.exports.deletePaidRecievedReport = (id, next, callback) => {
  try {
    Policy.findByIdAndDelete(id, function (err, response) {
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

//change by gokul
module.exports.updatePaidRecievedReport = (
  id,
  receivedData,
  next,
  callback
) => {
  try {
    Policy.findByIdAndUpdate(
      { _id: id },
      { $set: receivedData },
      function (err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null, response);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
