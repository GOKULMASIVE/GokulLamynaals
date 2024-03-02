const mongoose = require("mongoose");
const { DOCUMENT_TYPE } = require("../configuration/constants");
const { Schema } = mongoose;

var PayablePercentageField = new Schema(
  {
    ODPercentage: {
      type: String,
    },
    TPPercentage: {
      type: String,
    },
    NETPercentage: {
      type: String,
    },
    ODAmount: {
      type: String,
    },
    TPAmount: {
      type: String,
    },
    NETAmount: {
      type: String,
    },
    Total: {
      type: String,
    },
    ReceivedAmount: {
      type: String,
      default: "0",
    },
    PendingAmount: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

var PolicyMappingField = new Schema(
  {
    userId: {
      type: String,
    },
    issueDate: {
      type: String,
    },
    companyId: {
      type: String,
    },
    policyNumber: {
      type: String,
    },
    totalPremium: {
      type: String,
    },
    paymentMode: {
      type: String,
    },
    chequeNumber: {
      type: String,
      default: "",
      trim: true,
    },
    bankName: {
      type: String,
      uppercase: true,
      default: "",
      trim: true,
    },
    chequeDate: {
      type: Date,
    },
    remark: {
      type: String,
      uppercase: true,
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const loginIdData = new Schema(
  {
    companyId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const tableSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  documentType: {
    type: String,
    default: DOCUMENT_TYPE.POLICY,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },

  loginId: loginIdData, //added by gokul...

  loginIdFull: {
    type: String, //added by gokul...
  },
  walletCompanyId: {
    type: Schema.Types.ObjectId,
  },
  accountNumber: {
    type: String,
  },
  TDSamount: {
    type: Number,
  },
  TDS: {
    type: Number,
  },
  withTDS: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  subProductId: {
    type: Schema.Types.ObjectId,
    ref: "subProduct",
  },
  policyTypeId: {
    type: Schema.Types.ObjectId,
    ref: "policyType",
  },
  bookingCodeId: {
    type: Schema.Types.ObjectId,
    ref: "bookingCode",
  },
  subBookingCodeId: {
    type: Schema.Types.ObjectId,
    ref: "subBookingCode",
  },
  customerName: {
    type: String,
    trim: true,
    uppercase: true,
  },
  policyNumber: {
    type: String,
    trim: true,
    // unique : true
    set: function (value) {
      return value.replace(/\s/g, "");
    },
  },
  ticketNumber: {
    type: String,
    trim: true,
  },
  ticketCreatedDate: {
    type: Date,
  },
  ticketCreatedBy: {
    type: String,
    default: "",
  },
  ticketStatus: {
    type: String,
    enum: ["", "Entry Done", "Already Exist"],
    default: "",
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    uppercase: true,
  },
  totalPremium: {
    type: String,
    trim: true,
  },
  commisionRecievable: PayablePercentageField,
  userPayable: PayablePercentageField,
  branchPayable: PayablePercentageField,
  policyMapping: PolicyMappingField,
  policyTableMapping: PolicyMappingField,
  isPolicyMapping: { type: Boolean, default: false },
  isCommisionRecievable: { type: Boolean, default: false },
  isUserPayable: { type: Boolean, default: false },
  isBranchPayable: { type: Boolean, default: false },
  policyPortal: {
    type: String,
    trim: true,
  },
  paymentMode: {
    type: String,
    trim: true,
  },
  policyFile: {
    type: Object,
    default: {},
  },
  policyMappingFile: {
    type: Object,
    default: {},
  },
  policyMappingOtherFile: {
    type: Object,
    default: {},
  },
  otherFile: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    trim: true,
    default: "entryPending",
  },
  policyMappingStatus: {
    type: String,
    trim: true,
    enum: ["", "Mapping", "Mapping Done", "Rejected"],
    default: "",
  },
  chequeStatus: {
    type: String,
    default: "",
    trim: true,
  },
  chequeNumber: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    uppercase: true,
    trim: true,
  },
  chequeDate: {
    type: Date,
  },
  entryCleared: {
    type: String,
    trim: true,
  },
  approvedBy: {
    type: Date,
  },
  ccEntryCleared: {
    type: Date,
  },
  // Vehicle details
  registrationNumber: {
    type: String,
    trim: true,
    set: function (value) {
      return value.replace(/\s/g, "");
    },
  },
  makeModel: {
    type: String,
    trim: true,
  },
  make: {
    type: Schema.Types.ObjectId,
    ref: "vehicleMake", //changes by gokul
    // uppercase: true,
  },
  model: {
    type: String,
    trim: true,
    uppercase: true,
  },
  cc: {
    type: String,
    trim: true,
    uppercase: true,
  },
  gvw: {
    type: String,
    trim: true,
    uppercase: true,
  },
  seatingCapacity: {
    type: String,
    trim: true,
  },
  registrationYear: {
    type: String,
    trim: true,
  },
  fuelType: {
    type: Schema.Types.ObjectId,
    ref: "fuelType",
  },
  //OD policy Date
  odPolicyStartDate: {
    type: Date,
  },
  odPolicyEndDate: {
    type: Date,
  },
  odPolicyPeriod: {
    type: Number,
  },
  //TP policy date
  tpPolicyStartDate: {
    type: Date,
  },
  tpPolicyEndDate: {
    type: Date,
  },
  tpPolicyPeriod: {
    type: Number,
  },
  // Premium
  odDisc: {
    type: Number,
  },
  odPremium: {
    type: Number,
  },
  tpPremium: {
    type: Number,
  },
  netPremium: {
    type: Number,
  },
  paCover: {
    type: String,
    uppercase: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  rejectedReason: {
    type: String,
    uppercase: true,
  },
  remark: {
    type: String,
    uppercase: true,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
  verifyPendingBy: {
    type: String,
  },
  verifyPendingAt: {
    type: Date,
  },
  approvePendingBy: {
    type: String,
  },
  approvePendingAt: {
    type: Date,
  },
  filterType: {
    type: String,
  },
});

tableSchema.index(
  { clientId: 1, policyNumber: 1 },
  { unique: true, partialFilterExpression: { policyNumber: { $exists: true } } }
);

tableSchema.index(
  { clientId: 1, ticketNumber: 1 },
  { unique: true, partialFilterExpression: { ticketNumber: { $exists: true } } }
);

// tableSchema.index({ policyNumber: 1, clientId: 1 }, { unique: true });

tableSchema.pre("save", function (next) {
  if (this.registrationNumber) {
    // Remove special characters using a regular expression
    this.registrationNumber = this.registrationNumber.replace(/[^\w\s]/gi, "");
  }
  next();
});

tableSchema.pre("findOneAndUpdate", function (next) {
  let registrationNumber = this._update.$set?.registrationNumber;
  // console.log("registrationNumber ", registrationNumber);
  if (registrationNumber) {
    // Remove special characters using a regular expression
    this._update.$set.registrationNumber = registrationNumber.replace(
      /[^\w\s]/gi,
      ""
    );
  }
  next();
});

const accessTable = mongoose.model("policy", tableSchema, "policy");
module.exports = accessTable;
