import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { Paper } from "@mui/material";
import {
  GetBranch,
  PostUser,
  UpdateUser,
  GetUser,
  GetPayout,
  GetFileFromAWSS3BucketByKey,
  verifyMobileNumber,
  verifyEmailAddress,
} from "../../Service/_index";
import { FileUploader } from "react-drag-drop-files";
import { ToastError, ToastSuccess } from "../../UiComponents/Toaster/Toast";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  RemoveRedEyeIcon,
  CloudOffIcon,
  EditIcon,
} from "../../Resources/Icons/icons";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import {
  FilterOption,
  getLabelForValue,
  AWS_DIRECTORY_NAME,
  PolicyFilterTypes,
  filterOption,
  filterSort

} from "../../Shared/CommonConstant";
import AddBranch from "../Master/Branch/AddBranch";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import ReactDOMServer from "react-dom/server";
import { Link } from "react-router-dom";
import Loader from "../../UiComponents/Loader/Loader";
import ViewPdfFiles from "../ViewPdfFiles/ViewPfdFiles";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddBankDrawer from "./AddBankDrawer";
import { Select, Space } from "antd";
import Dialog from '@mui/material/Dialog';
import { Transition } from "../../UiComponents/Transition/Transition";
const { Option } = Select;

const AddUser = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetData } = props;

  const [branchData, setBranchData] = useState({});
  const [user, setUser] = useState([]);
  const [userEmail, setUserEmail] = useState({});

  const [roleFilter, setRoleFilter] = useState(
    formType === "edit" ? selectedData?.userType : []
  );
  const [branchValue, setBranchValue] = useState(
    formType === "edit" ? selectedData?.branchId?.branchName : null
  );
  const [branchManagerValue, setBranchManagerValue] = useState(
    formType === "edit" ? selectedData?.branchManager?.name : null
  );
  const [openBranchDrawer, setOpenBranchDrawer] = React.useState(false);
  const [openAddBankDrawer, setOpenAddBankDrawer] = React.useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [editBankDrawerFormType, setEditBankDrawerFormType] = useState(null);
  const [defaultLocationDetails, setDefaultLocationDetails] = useState(
    formType === "edit" ? selectedData?.userType : []
  );

  // defined by gokul...
  const [showMobileErrMsg, setShowMobileErrMsg] = useState("");
  const [showEmailErrMsg, setShowEmailErrMsg] = useState("");

  let formRef = useRef();
  const initialValues = {
    userType: "",
    branchId: "",
    branchManager: "",
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    clientId: "",
    password: "",
    aadharNumber: "",
    tds: "",
    panNumber: "",
    gstNumber: "",
    bankAccountHolderName: "",
    accountNumber: "",
    bankName: "",
    bankBranch: "",
    ifscCode: "",
    micrNumber: "",
    payoutCycle: "",
    idProof: "",
  };

  const PayoutOption = [
    {
      label: "DAILY PAYOUT",
      value: "Daily",
    },
    {
      label: "WEEKLY PAYOUT",
      value: "Weekly",
    },
    {
      label: "MONTHLY PAYOUT",
      value: "Monthly",
    },
  ];

  const GetUserDetails = () => {
    GetUser({isAscending:true}).then((res) => {
      const modifiedUser = res?.data?.map((e) => {
        return {
          ...e,
          label: e.name,
          value: e._id,
        };
      });
      setUserEmail(modifiedUser.map((res) => res.email));
      const FilterUserType = modifiedUser?.filter(
        (item) => item.userType.includes('branchManager') && item.isEnabled
      );
      setUser(FilterUserType);
    });
  };


  const [emailErrMsg, setEmailErrMsg] = useState("");
  const EmailValitaionFunction = (e) => {
    if (userEmail.includes(e.target.value)) {
      setEmailErrMsg("Email Already Exsists");
    } else {
      setEmailErrMsg("");
    }
  };
  const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string().required("Mobile Number Required"),
    userType: Yup.array().required("User Type Required"),
    // branchId: Yup.string().required("Branch Required"),
    // branchManager:Yup.string().required("Branch Manager Required"),
    address: Yup.string().required("Address Required"),
    email: Yup.string()
      .required("Email Required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        "Invalid email format"
      ),
  });

  useEffect(() => {
    GetUserDetails();
  }, []);

  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    if (formType === "edit") {
      formRef.setFieldValue(initialValues);
      formRef.setFieldValue("branchId", selectedData?.branchId?._id);
      formRef.setFieldValue("branchManager", selectedData?.branchManager?._id);
      formRef.setFieldValue("payoutCycle", selectedData?.payoutCycle);
    }
  }, []);

  const BranchDetails = () => {
    GetBranch().then((res) => {
      const filterData = res?.data?.filter((item) => item.isEnabled === true);
      const FilterData = filterData.map((e) => {
        return {
          ...e,
          label: e.branchName,
        };
      });
      const ExtrOption = { label: "Add Branch", value: 1, _id: "AddLabel" };
      setBranchData([ExtrOption, ...FilterData]);
    });
  };
  useEffect(() => {
    BranchDetails();
  }, []);

  const UserId = localStorage.getItem("UserId");

  const [formValues, setFormValues] = useState(
    formType === "edit" || formType === "view" ? selectedData.bankDetails : []
  );

  const handleInputChange = (index, name, value) => {
    setFormValues((prevFormValues) => {
      const newFormValues = [...prevFormValues];
      newFormValues[index] = {
        ...newFormValues[index],
        [name]: value,
      };
      return newFormValues;
    });
  };

  const NewUserValues = (index, newValue) => {
    if (index !== undefined && index.index !== undefined) {
      setFormValues((prevFormValues) => {
        const updatedFormValues = [...prevFormValues];
        const existingData = updatedFormValues[index.index];

        if (existingData) {
          updatedFormValues[index.index] = {
            ...existingData,
            bankAccountHolderName: index?.e?.bankAccountHolderName,
            accountNumber: index?.e?.accountNumber,
            bankName: index?.e?.bankName,
            bankBranch: index?.e?.bankBranch,
            ifscCode: index?.e?.ifscCode,
            micrNumber: index?.e?.micrNumber,
            isActive: true,
            panNumber: index?.e?.panNumber,
            aadharNumber: index?.e?.aadharNumber,
            gstNumber: index?.e?.gstNumber,
            tds: index?.e?.tds,
            idProof: index?.e?.idProof,
          };
        }

        return updatedFormValues;
      });
    } else {
      setFormValues((prevFormValues) => [
        ...prevFormValues,
        {
          bankAccountHolderName: index?.e?.bankAccountHolderName,
          accountNumber: index?.e?.accountNumber,
          bankName: index?.e?.bankName,
          bankBranch: index?.e?.bankBranch,
          ifscCode: index?.e?.ifscCode,
          micrNumber: index?.e?.micrNumber,
          isActive: true,
          panNumber: index?.e?.panNumber,
          gstNumber: index?.e?.gstNumber,
          aadharNumber: index?.e?.aadharNumber,
          tds: index?.e?.tds,
          idProof: index?.e?.idProof,
        },
      ]);
    }
  };

  const handleRemoveFields = (index, values) => {
    const newFormValues = [...formValues];
    newFormValues.splice(index, 1);
    setFormValues(newFormValues);
  };

  const onSubmit = (data) => {
    console.log("Data:",data);
    data.bankDetails = JSON.stringify(formValues);
    setOpenLoader(true);
    data.password = data?.password;
    const UpdatedTime = new Date();
    let formData = new FormData();
    data.updatedAt = UpdatedTime;
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    formType === "edit"
      ? (data.clientId = data.clientId)
      : (data.clientId = randomNumber);
    for (var key in data) {
      formData.append(key, data[key]);
    }
    formData.append(
      AWS_DIRECTORY_NAME.AWS_USER_PHOTO_DIRECTORY_NAME,
      data.photo
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_PHONEPAY_QR_DIRECTORY_NAME,
      data.phonePay
    );
    formData.append(AWS_DIRECTORY_NAME.AWS_PAYTM_QR_DIRECTORY_NAME, data.paytm);
    formData.append(
      AWS_DIRECTORY_NAME.AWS_GOOGLEPAY_QR_DIRECTORY_NAME,
      data.googlePay
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_ADDRESS_PROOF_DIRECTORY_NAME,
      data.addrProof
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_ID_PROOF_DIRECTORY_NAME,
      data.idProof
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS__PAN_CARD_DIRECTORY_NAME,
      data.panCard
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_EDUCATIONAL_PROOF_DIRECTORY_NAME,
      data.educationalProof
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_BANK_BOOK_DIRECTORY_NAME,
      data.bankBook
    );
    formType === "edit"
      ? (data.clientId = data.clientId)
      : (data.clientId = randomNumber);
    if (formType === "add") {
      data.createdBy = UserId;
    } else if (formType === "edit") {
      data.updatedBy = UserId;
    }
    let SubmitType =
      formType === "edit"
        ? UpdateUser(selectedData._id, formData)
        : PostUser(formData);
    SubmitType.then((res) => {
      if (!res) {
        setOpenLoader(false);
      } else {
        setOpenLoader(false);
        GetData();
        setOpenDrawer(false);
      }
    }).catch((error) => {
      console.log(error);
      setOpenDrawer(false);
    });
  };

  const AddBranchData = () => {
    setOpenBranchDrawer(true);
  };
  const ViewPdfFunction = (e) => {
    if (!e) {
      ToastError("No file Detected");
    } else {
      GetFileFromAWSS3BucketByKey(e)
        .then((res) => res.data.fileData)
        .then((data) => {
          const fileExtension = e.split(".").pop(); // Get file extension
          const fileWindow = window.open("", "_blank");
          if (fileExtension.toLowerCase() === "pdf") {
            // Display PDF using embed tag
            fileWindow?.document?.write(
              `<embed src="data:application/pdf;base64,${data}" width="100%" height="100%" />`
            );
          } else if (
            ["png", "jpg", "jpeg", "gif"].includes(fileExtension.toLowerCase())
          ) {
            // Display image using img tag
            fileWindow?.document?.write(
              `<embed src="data:image/${fileExtension.toLowerCase()};base64,${data}"/>`
            );
          } else {
            // Handle other file types
            ToastError("Unsupported file type");
            fileWindow?.close();
          }
        })
        .catch((err) => ToastError("Something went wrong"));
    }
  };

  const getLabelForValueUser = (value) => {
    const option = PolicyFilterTypes.find((option) => option.value === value);
    return option ? option.label : null;
  };

  const getLabelForValuePayout = (value) => {
    const option = PayoutOption.find((option) => option.value === value);
    return option ? option.label : null;
  };

  const [selectedBankData, setSelectedBankData] = useState([]);
  const EditBankDetails = (index, values) => {
    setSelectedBankData({ index, values });
    setOpenAddBankDrawer(true);
    setEditBankDrawerFormType("edit");
  };

  // written by gokul..
  function handleKeyDown(e) {
    if (e.key === "") {
      e.preventDefault();
    }
  }

  function verifyMobileNumberFunction(e) {
    verifyMobileNumber(e)
      .then(() => {
        // console.log("res")
        setShowMobileErrMsg("");
      })
      .catch((err) => {
        setShowMobileErrMsg(err.response.data.message);
      });
  }

  function verifyEmailAddressFunction(e) {
    verifyEmailAddress(e)
      .then(() => setShowEmailErrMsg(""))
      .catch((err) => setShowEmailErrMsg(err.response.data.message));
  }

  return (
    <>
      <div className="MainRenderinContainer">
        {formType === "view" ? (
          <>
            <Grid container className="DrawerHeader">
              <Grid item xs={6} sm={6}>
                <Typography>View User</Typography>
              </Grid>
              <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                <CloseIcon
                  onClick={() => setOpenDrawer(false)}
                  sx={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
            <div className="container-fluid" style={{ padding: "20px" }}>
              <Typography className="EditPageHeadingTittle">
                User Type
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">User Type</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.userType.join(" , ")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Branch</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchId?.branchName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Branch Manager</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchManager?.name}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Typography className="EditPageHeadingTittle">
                Personal Details
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Name</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Mobile Number</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.mobileNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Email</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.email}
                  </Typography>
                </Grid>
                {/*password field*/}
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Password</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">{selectedData?.password}</Typography>
                </Grid>
                {/* end */}
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Address</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">
                    Aadhar card Number
                  </Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.aadharNumber}
                  </Typography>
                </Grid>
                {/* Changes by Arun */}
                {/* <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Pan Card Number</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.panNumber}
                  </Typography>
                </Grid> */}
              </Grid>
              <hr />

              {selectedData?.userType === "user" ||
              selectedData?.userType === "branchManager" ? (
                <>
                  <Typography className="EditPageHeadingTittle">
                    Bank Details
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead sx={{ backgroundColor: "gray" }}>
                        <TableRow>
                          <TableCell align="left" sx={{ color: "white" }}>
                            Account Holder Name
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            Account Number
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            Bank Name
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            Bank Branch
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            IFSC Code
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            MICR Number
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            PAN Number
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            Aadhar Number
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            GST Number
                          </TableCell>
                          <TableCell align="left" sx={{ color: "white" }}>
                            TDS Percentge
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formValues &&
                          formValues?.map((values, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {values?.bankAccountHolderName}
                              </TableCell>
                              <TableCell align="left">
                                {values?.accountNumber}
                              </TableCell>
                              <TableCell align="left">
                                {values?.bankName}
                              </TableCell>
                              <TableCell align="left">
                                {values?.bankBranch}
                              </TableCell>
                              <TableCell align="left">
                                {values?.ifscCode}
                              </TableCell>
                              <TableCell align="left">
                                {values?.micrNumber}
                              </TableCell>
                              <TableCell align="left">
                                {values?.panNumber}
                              </TableCell>
                              <TableCell align="left">
                                {values?.aadharNumber}
                              </TableCell>
                              <TableCell align="left">
                                {values?.gstNumber}
                              </TableCell>{" "}
                              <TableCell align="left">{values?.tds}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      {formValues?.length < 2 ? (
                        <TableRow>
                          <TableCell
                            colSpan={12}
                            sx={{ textAlign: "center", border: "none" }}
                          >
                            <CloudOffIcon
                              sx={{ fontSize: "100px", color: "#c5c3c3" }}
                            />
                            <br />
                            <Typography sx={{ color: "#c5c3c3" }}>
                              Oops! No Data Found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Table>
                  </TableContainer>
                  <hr />
                </>
              ) : null}

              <Typography className="EditPageHeadingTittle">
                Attachments
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Photo</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() => ViewPdfFunction(selectedData?.photo?.key)}
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Address Proof</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() =>
                        ViewPdfFunction(selectedData?.addressProof?.key)
                      }
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">ID Proof</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() =>
                        ViewPdfFunction(selectedData?.idProof?.key)
                      }
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Pan Card</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() =>
                        ViewPdfFunction(selectedData?.panProof?.key)
                      }
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">
                    Educational Proof
                  </Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() =>
                        ViewPdfFunction(selectedData?.educationalProof?.key)
                      }
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Bank Proof</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent d-flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveRedEyeIcon />}
                      onClick={() =>
                        ViewPdfFunction(selectedData?.bankBook?.key)
                      }
                    >
                      View
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  className="d-flex justify-content-end"
                >
                  <button
                    onClick={() => setOpenDrawer(false)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 40px",
                    }}
                  >
                    Close
                  </button>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <>
            <div
              className="container-fluid "
              style={{ padding: "20px 20px 20px 36px" }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  className="Master_Header_Container"
                  sx={{ padding: 0 }}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography className="Master_Header_Heading">
                      Add User
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <Typography className="Master_Header_Heading">
                      <CloseIcon
                        onClick={() => setOpenDrawer(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <hr />
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  onSubmit(values);
                }}
                validationSchema={validationSchema}
                innerRef={(ref) => {
                  if (ref) {
                    formRef = ref;
                  }
                }}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    {/* <Paper sx={{ p: 2, mt: 10 }}> */}
                    <Typography mt={2} className="EditPageHeadingTittle">
                      User Type
                    </Typography>

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Select User type" value={roleFilter}>
                          {/* <Autocomplete
                            className="w-100 AutoComplete_InputBox"
                            clearIcon={false}
                            options={FilterOption}
                            name="userType"
                            value={getLabelForValue(values.userType)}
                            onChange={(e, v) => {
                              setRoleFilter(v.value);
                              setFieldValue("userType", v.value);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                              option?.label === value?.label
                            }
                          /> */}
                          <Select
                            mode="multiple"
                            dropdownStyle={{ zIndex: 11000 }}
                            className="AutoComplete_InputBox"
                            maxTagCount="responsive"
                            filterOption={filterOption}
                            filterSort={filterSort}
                            onChange={(selectedValues) => {
                              setFieldValue("userType", selectedValues);
                              setRoleFilter(selectedValues);
                            }}
                            defaultValue={defaultLocationDetails}
                          >
                            {FilterOption.map((el) => (
                              <Option value={el.value} key={el.value}>
                                {el.label}
                              </Option>
                            ))}
                          </Select>
                        </FloatLabel>
                        <div className="errorMessage">
                          {errors.userType && touched.userType ? (
                            <div>{errors.userType}</div>
                          ) : (
                            " "
                          )}
                        </div>
                      </Grid>
                      {roleFilter.includes("branchManager") ? (
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Branch"
                            value={openBranchDrawer ? null : values.branchId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox w-100"
                              clearIcon={false}
                              options={branchData}
                              value={openBranchDrawer ? null : branchValue}
                              name="branchId"
                              onInputChange={(e, v) => setBranchValue(v)}
                              onChange={(e, v) => {
                                if (v._id === "AddLabel") {
                                  AddBranchData();
                                }
                                setFieldValue("branchId", v?._id);
                                setBranchValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.label === value
                              }
                              renderOption={(props, option, index) => (
                                <>
                                  <Button
                                    component="li"
                                    {...props}
                                    className={
                                      index.index === 0
                                        ? "AddLabel"
                                        : "selectedLabel"
                                    }
                                    endIcon={
                                      index.index === 0 ? <AddIcon /> : null
                                    }
                                  >
                                    {option.label}
                                  </Button>
                                </>
                              )}
                            />
                          </FloatLabel>
                          <div className="errorMessage">
                            {errors.branchId && touched.branchId ? (
                              <div>{errors.branchId}</div>
                            ) : (
                              " "
                            )}
                          </div>
                        </Grid>
                      ) : null}

                      {roleFilter.includes("user") ? (
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Branch Manager"
                            value={values.branchManager}
                          >
                            <Autocomplete
                              className="w-100 AutoComplete_InputBox"
                              clearIcon={false}
                              options={user}
                              value={branchManagerValue}
                              onInputChange={(e, v) => setBranchManagerValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("branchManager", v?._id);
                                setBranchManagerValue(v?.label);
                              }}
                              name="branchManager"
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.label === value
                              }
                            />
                          </FloatLabel>
                          <div className="errorMessage">
                            {errors.branchManager && touched.branchManager ? (
                              <div>{errors.branchManager}</div>
                            ) : (
                              " "
                            )}
                          </div>
                        </Grid>
                      ) : null}
                      {roleFilter.includes("user") ? (
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="Payout" value={values.payoutCycle}>
                            <Autocomplete
                              className="w-100 AutoComplete_InputBox"
                              clearIcon={false}
                              options={PayoutOption}
                              value={getLabelForValuePayout(values.payoutCycle)}
                              onChange={(e, v) => {
                                setFieldValue("payoutCycle", v?.value);
                              }}
                              name="payoutCycle"
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.label === value.value
                              }
                            />
                          </FloatLabel>
                        </Grid>
                      ) : null}
                    </Grid>
                    <hr />

                    <Typography mt={2} className="EditPageHeadingTittle">
                      Personal Details
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Name" value={values.name}>
                          <Field
                            name="name"
                            className="textField w-100"
                            style={{ textTransform: "uppercase" }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel
                          label="Mobile Number"
                          value={values.mobileNumber}
                        >
                          <Field
                            type="number"
                            name="mobileNumber"
                            className="textField w-100"
                            id="mobileNumber"
                            onKeyDown={handleKeyDown}
                            onBlur={(e) =>
                              verifyMobileNumberFunction(e.target.value)
                            }
                          />
                        </FloatLabel>
                        <div className="errorMessage">
                          {errors.mobileNumber && touched.mobileNumber ? (
                            <div>{errors.mobileNumber}</div>
                          ) : (
                            showMobileErrMsg
                          )}
                          {/* {showMobileErrMsg} */}
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Email" value={values.email}>
                          <Field
                            name="email"
                            className="textField w-100"
                            id="email"
                            onKeyDown={handleKeyDown}
                            onBlur={(e) =>
                              verifyEmailAddressFunction(e.target.value)
                            }
                          />
                        </FloatLabel>
                        <div className="errorMessage">
                          {errors.email && touched.email ? (
                            <div>{errors.email}</div>
                          ) : (
                            <>{showEmailErrMsg}</>
                          )}
                        </div>
                      </Grid>
                      {/* password field */}
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Password" value={values.password}>
                          <Field
                            name="password"
                            className="textField w-100"
                          />
                        </FloatLabel>
                      </Grid>

                      {/* end */}
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Address" value={values.address}>
                          <Field
                            style={{ textTransform: "uppercase" }}
                            name="address"
                            className="textField w-100"
                          />
                        </FloatLabel>
                        <div className="errorMessage">
                          {errors.address && touched.address ? (
                            <div>{errors.address}</div>
                          ) : (
                            " "
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <hr />
                    {roleFilter.includes("user") ||
                    roleFilter.includes("branchManager") ? (
                      <>
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              mt={2}
                              className="EditPageHeadingTittle"
                            >
                              Bank Details
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{ display: "flex", justifyContent: "end" }}
                          >
                            <Button
                              className="Common_Button"
                              onClick={() => {
                                setSelectedBankData({});
                                setOpenAddBankDrawer(true);
                                setEditBankDrawerFormType("add");
                              }}
                            >
                              Add Bank Detail +{" "}
                            </Button>
                          </Grid>
                        </Grid>
                        <div>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="simple table"
                            >
                              <TableHead sx={{ backgroundColor: "#CEDDFF" }}>
                                <TableRow>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Account Holder Name
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Account Number
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Bank Name
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Bank Branch
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    IFSC Code
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    MICR Number
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    PAN Number
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Aadhar Number
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    GST Number
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    TDS Percentge
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "Black" }}
                                  >
                                    Action
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {formValues &&
                                  formValues?.map((values, index) => (
                                    <TableRow key={index}>
                                      <TableCell component="th" scope="row">
                                        {values?.bankAccountHolderName}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.accountNumber}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.bankName}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.bankBranch}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.ifscCode}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.micrNumber}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.panNumber}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.aadharNumber}
                                      </TableCell>
                                      <TableCell align="left">
                                        {values?.gstNumber}
                                      </TableCell>{" "}
                                      <TableCell align="left">
                                        {values?.tds}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Tooltip title="Delete">
                                          <DeleteIcon
                                            onClick={() =>
                                              handleRemoveFields(index, values)
                                            }
                                          />
                                        </Tooltip>
                                        <Tooltip title="edit">
                                          <EditIcon
                                            onClick={() =>
                                              EditBankDetails(index, values)
                                            }
                                          />
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                {formValues?.length < 2 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={12}
                                      sx={{
                                        textAlign: "center",
                                        border: "none",
                                      }}
                                    >
                                      <CloudOffIcon
                                        sx={{
                                          fontSize: "100px",
                                          color: "#c5c3c3",
                                        }}
                                      />
                                      <br />
                                      <Typography sx={{ color: "#c5c3c3" }}>
                                        Oops! No Data Found
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ) : null}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                        <hr />
                      </>
                    ) : null}
                    <Typography mt={2} className="EditPageHeadingTittle">
                      Attachments
                    </Typography>
                    <Grid container spacing={2} mt={1} className="d-flex">
                      <Grid item xs={12} sm={4} className="File-Upload d-flex">
                        <div style={{ width: "100%" }}>
                          <FileUploader
                            handleChange={(e) => setFieldValue("photo", e)}
                            name="photo"
                            label="Upload Your Photo"
                            dropMessageStyle={{
                              color: "red",
                              border: "none",
                              borderRadius: "0px",
                            }}
                          />
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={4} className="File-Upload">
                        <FileUploader
                          handleChange={(e) => setFieldValue("addrProof", e)}
                          name="addrProof"
                          label="Upload Your Address Proof"
                          dropMessageStyle={{
                            color: "red",
                            border: "none",
                            borderRadius: "0px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} className="File-Upload">
                        <FileUploader
                          handleChange={(e) => setFieldValue("idProof", e)}
                          name="idProof"
                          label="Upload Your ID Proof"
                          dropMessageStyle={{
                            color: "red",
                            border: "none",
                            borderRadius: "0px",
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4} className="File-Upload">
                        <FileUploader
                          handleChange={(e) => setFieldValue("panCard", e)}
                          name="panCard"
                          label="Upload Your Pan Card"
                          dropMessageStyle={{
                            color: "red",
                            border: "none",
                            borderRadius: "0px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} className="File-Upload">
                        <FileUploader
                          handleChange={(e) =>
                            setFieldValue("educationalProof", e)
                          }
                          name="educationalProof"
                          label="Upload Your Educational Proof"
                          dropMessageStyle={{
                            color: "red",
                            border: "none",
                            borderRadius: "0px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} className="File-Upload">
                        <FileUploader
                          handleChange={(e) => setFieldValue("bankBook", e)}
                          name="bankBook"
                          label="Upload Your Bank Book"
                          dropMessageStyle={{
                            color: "red",
                            border: "none",
                            borderRadius: "0px",
                          }}
                        />
                      </Grid>
                    </Grid>
                    <hr />
                    <Grid container>
                      <Grid item xs={12} sm={2}>
                        <button className="Common_Button w-100" type="submit">
                          {title}
                        </button>
                      </Grid>
                    </Grid>
                    {/* </Paper> */}
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
        <Loader open={openLoader} />

        {openBranchDrawer ? (
          <Drawer
            open={openBranchDrawer}
            sx={{
              zIndex: 1000,
            }}
            anchor="right"
            PaperProps={{
              sx: { width: { xs: "100%", sm: "25%" } },
            }}
          >
            <AddBranch
              title={"Create"}
              formType={"add"}
              setOpenBranchDrawer={setOpenBranchDrawer}
              GetActiveData={BranchDetails}
            />
          </Drawer>
        ) : null}
        {/* 
        {openAddBankDrawer ? (
          <Drawer
            open={openAddBankDrawer}
            sx={{
              zIndex: 1000,
            }}
            anchor="right"
            PaperProps={{
              sx: { width: { xs: "100%", sm: "25%" } },
            }}
          >
            <AddBankDrawer
              newValue={NewUserValues}
              title={selectedData._id ? "Edit" : "Add"}
              formType={editBankDrawerFormType}
              setOpenAddBankDrawer={setOpenAddBankDrawer}
              selectedBankData={selectedBankData}
            />
          </Drawer>
        ) : null} */}

        {openAddBankDrawer ? (
          <Dialog
            open={openAddBankDrawer}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
              style: { maxWidth: "50%" },
            }}
          >
            <AddBankDrawer
              newValue={NewUserValues}
              title={selectedData._id ? "Edit" : "Add"}
              formType={editBankDrawerFormType}
              setOpenAddBankDrawer={setOpenAddBankDrawer}
              selectedBankData={selectedBankData}
            />
          </Dialog>
        ) : null}
      </div>
    </>
  );
};

export default AddUser;
