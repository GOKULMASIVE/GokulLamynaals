module.exports = {
   MONGODB_URI: "mongodb://127.0.0.1:27017/rayal", // Development
  // MONGODB_URI:
    // "mongodb+srv://lamynaals:BdXV7bxvfK3PnyRC@rayalproduction.a1pepzl.mongodb.net/rayalproduction", // Production
  // AWS_BUCKET_NAME: "rayalbrokerspolicylistprod", // Production
  AWS_BUCKET_NAME: "srktechnology", // Development
  AWS_USER_PHOTO_DIRECTORY_NAME: "UserPhoto",
  AWS_ADDRESS_PROOF_DIRECTORY_NAME: "AddressProof",
  AWS_ID_PROOF_DIRECTORY_NAME: "IDProof",
  AWS__PAN_CARD_DIRECTORY_NAME: "PANCard",
  AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME: "EducationalProof",
  AWS_BANK_BOOK_DIRECTORY_NAME: "BankBook",
  AWS_PHONEPAY_QR_DIRECTORY_NAME: "PhonepayQR",
  AWS_PAYTM_QR_DIRECTORY_NAME: "PaytmQR",
  AWS_GOOGLEPAY_QR_DIRECTORY_NAME: "GooglepayQR",
  AWS_INVOICE_DIRECTORY_NAME: "Invoice",
  AWS_POLICY_FILE_DIRECTORY_NAME: "Policy",
  AWS_OTHER_FILE_DIRECTORY_NAME: "Other",
  AWS_SIGNED_URL_EXPIRES_SECONDS: 30000,
  AWS_S3_CONFIGURATION: {
    region: "ap-south-1",
    accessKeyId: "AKIAUTOWISXA6WWZRV5G", // Development
    secretAccessKey: "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", // Development
    // accessKeyId: "AKIAXYKJUDBVUKO3X6B4", // Production
    // secretAccessKey: "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", // Production
    signatureVersion: "v4",
  },
  PAYMENT_MODE: {
    USER_RECEIVED: "RECEIVED",
    USER_PAID: "PAID",
    COMPANY_RECEIVED: "COMPANY RECEIVED",
  },
  DOCUMENT_TYPE: {
    POLICY: "POLICY",
    WALLET: "WALLET",
    COMPANY_WALLET: "COMPANY WALLET",
  },
  USER_TYPE: {
    USER: "user",
    BRANCH_MANAGER: "branchManager",
  },
};
