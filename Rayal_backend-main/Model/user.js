const mongoose = require("mongoose");
const { Schema } = mongoose;

var BankDetailField = new Schema(
  {
    accountNumber: {
      type: String,
      uppercase: true,
    },
    bankAccountHolderName: {
      type: String,
      uppercase: true,
    },
    bankBranch: {
      type: String,
      uppercase: true,
    },
    bankName: {
      type: String,
      uppercase: true,
    },
    ifscCode: {
      type: String,
      uppercase: true,
    },
    micrNumber: {
      type: String,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    aadharNumber: {
      type: String,
      uppercase: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    tds: {
      type: String,
    },
    panNumber: {
      type: String,
      uppercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const tableSchema = new Schema({
  branchId: {
    type: Schema.Types.ObjectId,
    ref: "branch",
    auto: true,
  },
  branchManager: {
    type: Schema.Types.ObjectId,
    ref: "user",
    auto: true,
  },
  name: {
    type: String,
    trim: true,
    uppercase: true,
  },
  payoutCycle: {
    type: String,
  },
  mobileNumber: {
    type: String,
    trim: true,
    // unique: true,
  },
  email: {
    type: String,
    trim: true,
    // unique: true,
  },
  clientId: {
    type: String,
    trim: true,
  },
  roleId: {
    type: String,
    default: "",
  },
  bankDetails: {
    type: [BankDetailField],
  },
  address: {
    type: String,
    trim: true,
    uppercase: true,
  },
  upiId: {
    type: String,
    trim: true,
    uppercase: true,
  },
  phonePeNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  paytmNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  googlePayNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  phonePeQr: {
    type: Object,
    default: {},
  },
  paytmQr: {
    type: Object,
    default: {},
  },
  googlePayQr: {
    type: Object,
    default: {},
  },
  photo: {
    type: Object,
    default: {},
  },
  addressProof: {
    type: Object,
    default: {},
  },
  idProof: {
    type: Object,
    default: {},
  },
  panProof: {
    type: Object,
    default: {},
  },
  educationalProof: {
    type: Object,
    default: {},
  },
  bankBook: {
    type: Object,
    default: {},
  },

  password: {
    type: String,
    default: "Pass@123",
    require: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  userType: {
    type: [String],
  },
});
tableSchema.index({ clientId: 1, email: 1 }, { unique: true });
tableSchema.index({ clientId: 1, mobileNumber: 1 }, { unique: true });

const accessTable = mongoose.model("user", tableSchema, "user");
module.exports = accessTable;
