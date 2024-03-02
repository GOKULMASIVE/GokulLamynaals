const FilterOption = [
  {
    label: "Branch Manager",
    value: "branchManager",
  },
  {
    label: "Operator",
    value: "operator",
  },
  {
    label: "Accountant",
    value: "accountant",
  },
  {
    label: "User",
    value: "user",
  },
  {
    label: "PT Staff",
    value: "ptstaff",
  },
];

function getLabelForValue(value) {
  const option = FilterOption.find((option) => option.value === value);
  return option ? option.label : null;
}

const PolicyFilterTypes = [
  { 
    label: "All Policy",
    value: "allPolicy",
  },
  {
    label: "Entry Pending",
    value: "entryPending",
  },
  {
    label: "Verify Pending",
    value: "verifyPending",
  },

  {
    label: "Approve Pending",
    value: "approvePending",
  },
  {
    label: "Approved Policy",
    value: "approvedPolicy",
  },
  {
    label: "Cheque Pending",
    value: "chequePending",
  },
  {
    label: "Rejected Policy",
    value: "rejectedPolicy",
  },
  {
    label: "Entry Done",
    value: "entryDone",
  },
];


const AWS_DIRECTORY_NAME = {
  AWS_USER_PHOTO_DIRECTORY_NAME: "UserPhoto",
  AWS_ADDRESS_PROOF_DIRECTORY_NAME: "AddressProof",
  AWS_ID_PROOF_DIRECTORY_NAME: "IDProof",
  AWS__PAN_CARD_DIRECTORY_NAME: "PANCard",
  AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME: "EducationalProof",
  AWS_BANK_BOOK_DIRECTORY_NAME: "BankBook",
  AWS_PHONEPAY_QR_DIRECTORY_NAME: "PhonepayQR",
  AWS_PAYTM_QR_DIRECTORY_NAME: "PaytmQR",
  AWS_GOOGLEPAY_QR_DIRECTORY_NAME: "GooglepayQR",
  AWS_POLICY_FILE_DIRECTORY_NAME: "Policy",
  AWS_OTHER_FILE_DIRECTORY_NAME: "Other",
};

const filterOption = (input, option) =>
  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const filterSort = (optionA, optionB) => {
  if (!optionA.children === "Others") {
    return optionA?.children
      ?.toLowerCase()
      .localeCompare(optionB.children.toLowerCase());
  }
};



const checkUserType = (userType) => {
  const isUser = userType === 'user' ? true : false;
  const isClient = userType === 'CLIENT'  ? true : false;
  const isOperator = userType === 'operator'  ? true : false;
  const isBranchManager = userType === 'branchManager'  ? true : false;

  return { isUser, isClient, isOperator , isBranchManager};
};


export {
  FilterOption,
  getLabelForValue,
  AWS_DIRECTORY_NAME,
  PolicyFilterTypes,
  filterOption,
  filterSort,
  checkUserType
};
