import React, { useState, useRef, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Typography from "@mui/material/Typography";
import {
  GetUser,
  GetCompany,
  GetPolicyList,
  VerifyPolicyNumber,
  LoginPortalData,
} from "../../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { Formik, Form, Field } from "formik";
import Box from "@mui/material/Box";
import { PostCreatePolicy, AutoFillPolicyDetails } from "../../../Service/_index";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import * as Yup from "yup";
import { FileUploader } from "react-drag-drop-files";
import swal from "sweetalert";
import { AWS_DIRECTORY_NAME, checkUserType } from '../../../Shared/CommonConstant'
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AddCompany from "../../Master/CreateCompany/AddCompany";
import Loader from "../../../UiComponents/Loader/Loader";
import Dialog from "@mui/material/Dialog";
import { Transition } from "../../../UiComponents/Transition/Transition";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { DatePicker, Space } from 'antd';
const PaymentDetails = [
  {
    label: "Cash",
    value: 1,
  },
  {
    label: "Online",
    value: 2,
  },
  {
    label: "Cheque",
    value: 3,
  },
  {
    label: "DD",
    value: 4,
  },
];

const initialValues = {
  userId: "",
  issueDate: "",
  companyId: "",
  loginId: {//added by gokul
    companyId: "",
    userId: "",
  },
  loginIdFull: "",//added by gokul
  policyNumber: "",
  totalPremium: "",
  paymentMode: "",
  chequeNumber: "",
  chequeDate: "",
  bankName: "",
  PolicyFile: "",
  OtherFile: "",
  policyPortal: "",
};

const UserName = localStorage.getItem("UserId");

const PolicyPortal = [
  {
    label: "Company Portal",
    value: 1,
  },
  {
    label: "Broker Portal",
    value: 2,
  },
];

const Policycreate = () => {
  let formRef = useRef();
  const UserType = localStorage.getItem('userType');
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [showPaymentMethod, setShowPaymentMethod] = useState("");
  const [policyNumbers, setPolicyNumbers] = useState([]);
  const [openCompanyDrawer, setOpenCompanyDrawer] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectPortal, setSelectedPortal] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshPolicyNumber, setRefreshPolicyNumber] = useState(0)
  const [openLoader, setOpenLoader] = useState(false)
  const [showPolicyErrMsg, setShowPolicyErrMsg] = useState('')
  const [isAllow, setIsAllow] = useState({})

  const CreatePolicySchema = Yup.object().shape({
    policyNumber: Yup.string().required("Policy Number Required"),
    userId: Yup.string().required("User Name Required"),
    companyId: Yup.string().required("Company Name Required"),
    issueDate: Yup.string().required("Issue Date Required"),
    totalPremium: Yup.string().required("Total Premium Required"),
    policyPortal: Yup.string().required("Policy Portal Required"),
    paymentMode: Yup.string().required("Payment Mode Required"),
    PolicyFile: Yup.string().required("Policy File Required"),
    chequeNumber: Yup.string().required("Cheque Number Required"),
    chequeDate: Yup.string().required("Cheque Date Required"),
    bankName: Yup.string().required("Bank Name Required"),
  });


  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const modifiedCompanyDetails = res?.data
        .filter((e) => e.isEnabled === true)
        .map((e) => {
          return {
            ...e,
            label: e.shortName,
            value: e._id,
          };
        })
        .filter(Boolean);

      setCompanyDetails(modifiedCompanyDetails);
    });
  };
  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData).then((res) => {
      const modifiedUserDetails = res?.data
        ?.map((e) => {
          console.log(e);
          if (e.userType.includes("user") && e.isEnabled === true) {
            return {
              ...e,
              label: e.name + " - " + e.mobileNumber + ' - ' + e.email,
              value: e._id,
            };
          }
        })
        .filter(Boolean);
      setUserDetails(modifiedUserDetails);
    });
  };

  const GetPolicyDetails = () => {
    GetPolicyList().then((res) => {
      const policyNumbers = res?.data?.map((e) => e.policyNumber);
      setPolicyNumbers(policyNumbers);
    });
  };

  const BackToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    GetUserDetails();
    GetCompanyDetails();
    GetPolicyDetails();
  }, []);

  const PaymentFunction = (e) => {
    setShowPaymentMethod(e?.value);
    formRef.setFieldValue("paymentMode", e?.label);
  };

  const LoginUserId = localStorage.getItem('UserId')

  const SaveAndExit = (data, keys) => {
    data.userId = isAllow.isUser ? LoginUserId : data?.userId
    data.policyNumber = data.policyNumber//.replace(/[^a-zA-Z0-9]/g, "");
    data.totalPremium = String(data?.totalPremium)?.replace(/,/g, "");
    data.createdBy = UserName;
    let formData = new FormData();
    for (var key in data) { formData.append(key, data[key]) }
    const loginId = data?.loginId
    formData.set("loginId", JSON.stringify(loginId));
    formData.append(AWS_DIRECTORY_NAME.AWS_POLICY_FILE_DIRECTORY_NAME, data.PolicyFile);
    formData.append(AWS_DIRECTORY_NAME.AWS_OTHER_FILE_DIRECTORY_NAME, data.OtherFile);


    if (
      data?.userId &&
      data?.PolicyFile &&
      data?.issueDate &&
      data?.companyId &&
      data?.policyNumber &&
      data?.totalPremium &&
      data?.policyPortal &&
      data?.paymentMode
    ) {
      setOpenLoader(true);
      PostCreatePolicy(formData)
        .then((res) => {
          setOpenLoader(false);
          if (policyNumbers.includes(data?.policyNumber)) {
            ToastError("Policy Number Already Exists");
            setSelectedCompany("");
            setSelectedPortal("");
            setSelectedUser("");
            setSelectedPaymentMode("");
            BackToTop();
            setRefreshCount(refreshCount + 1);
            formRef.setFieldValue("paymentMode", null);
          } else if (keys === "SaveAndExit") {
            navigate("/policyList");
            swal({
              title: "Policy Created Successfully!",
              icon: "success",
              timer: 4000,
              buttons: true,
            });
          } else if (keys === "CreateSameUser") {
            formRef.setFieldValue("policyNumber", null);
            setRefreshPolicyNumber(refreshPolicyNumber + 1);
            formRef.setFieldValue('totalPremium', '');
            BackToTop();
            swal({
              title: "Policy Created Successfully!",
              icon: "success",
              timer: 4000,
              buttons: true,
            });
          } else {
            setSelectedCompany("");
            setSelectedPortal("");
            setSelectedUser("");
            setSelectedPaymentMode("");
            setSelectedLoginPortal('')
            BackToTop();
            formRef.resetForm();
            setRefreshCount(refreshCount + 1);
            setShowPaymentMethod("");
            formRef.setFieldValue("paymentMode", null);
            swal({
              title: "Policy Created Successfully!",
              icon: "success",
              timer: 4000,
              buttons: true,
            });
          }
        })
        .catch((err) => {
          ToastError(err?.message);
        });
    } else {
      ToastError("Enter all fields")
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  const VerifyPolicyNumberFunction = (e) => {
    // console.log(e);
    VerifyPolicyNumber(e)
      .then((res) => {
        setShowPolicyErrMsg("");
      })
      .catch((err) => {
        setShowPolicyErrMsg(err.response.data.message);
      });
  };

  // loginPortal added by gokul...
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedLoginPortal, setSelectedLoginPortal] = useState(null)
  const [loginPortalDetails, setLoginPortalDetails] = useState([]);

  const GetLoginPortalData = () => {

    LoginPortalData({
      userId: selectedUserId,
      companyId: selectedCompanyId,
    }).then((res) => {
      const filterData1 = res?.data.filter((item) => {
        if (item?.userId === selectedUserId) {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }
      });
      const UserAllData = res?.data.filter((item) => {
        if (item?.userId === "All") {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }
      });

      const UserAdminData = res?.data.filter((item) => {
        if (item?.userId === "Admin") {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }
      });


      setLoginPortalDetails([...filterData1, ...UserAllData, ...UserAdminData]);
    });
  }

  useEffect(() => {
    if (selectedUserId) GetLoginPortalData();
    else setLoginPortalDetails([]);
  }, [selectedUserId, selectedCompanyId]);

  React.useEffect(() => {
    const isallowObj = checkUserType(UserType)
    setIsAllow(isallowObj)
  }, [UserType])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container">
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Create Policy
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} />
        </Grid>
      </Box>
      <Paper sx={{ padding: "10px 0 0 0", margin: "0 4px 20px 12px" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={CreatePolicySchema}
          innerRef={(ref) => {
            if (ref) {
              formRef = ref;
            }
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form >
              <Typography sx={{ display: isAllow.isUser ? 'none' : 'block', ml: 2 }}>User</Typography>
              <Grid container sx={{ p: 2, display: isAllow.isUser ? 'none' : 'block' }} columnSpacing={2} >
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Select User" value={values?.userId}>
                    <Autocomplete
                      name="userId"
                      disablePortal
                      className="AutoComplete_InputBox"
                      id="combo-box-demo"
                      value={selectedUser}
                      options={userDetails}
                      onChange={(e, v) => {
                        console.log(v)
                        if (!v) {
                          setSelectedUser('')
                        } else {
                          setSelectedUser(v?.name + " - " + v?.mobileNumber + " - " + v?.email);

                        }
                        setSelectedUserId(v?._id);
                        setFieldValue("userId", v?._id || "");
                      }}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                          {option?.name + " - " + option?.mobileNumber + " - " + option?.email}
                        </li>
                      )}
                      isOptionEqualToValue={(e, v) => e.name === v}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FloatLabel>
                  <div className="errorMessage ">
                    {errors.userId && touched.userId ? (
                      <div>{errors.userId}</div>
                    ) : (
                      " "
                    )}
                  </div>
                </Grid>
              </Grid>
              <hr style={{ display: isAllow.isUser ? 'none' : 'block' }} />
              <Typography sx={{ ml: 2 }}>Policy Details</Typography>
              <Grid container sx={{ p: 2 }} columnSpacing={2}>
                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="issueDate"
                      className="Date_Picker w-100"
                      onChange={(e) => setFieldValue("issueDate", e?.$d)}
                      key={refreshCount}
                      format={'DD/MM/YYYY'}
                    />
                  </LocalizationProvider>
                  <div className="errorMessage mb-2 mt-2">
                    {errors.issueDate && touched.issueDate ? (
                      <div>{errors.issueDate}</div>
                    ) : (
                      " "
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Select Company" value={values?.companyId}>
                    <Autocomplete
                      name="companyId"
                      className="AutoComplete_InputBox"
                      disablePortal
                      id="combo-box-demo"
                      value={selectedCompany}
                      options={companyDetails}
                      onChange={(e, v) => {
                        setSelectedCompany(v?.shortName);
                        setSelectedCompanyId(v?._id);
                        setFieldValue("companyId", v?._id);
                      }}
                      clearIcon={false}
                      renderInput={(params) => <TextField {...params} />}
                      renderOption={(props, option, state) => {
                        const isFirstOption = state.index === 0;
                        return (
                          <>
                            {isFirstOption && (
                              <li
                                style={{
                                  padding: "10px 0 4px 16px",
                                  backgroundColor: "gray",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                                key="add-user"
                                onClick={() => setOpenCompanyDrawer(true)}
                              >
                                Add Company +
                              </li>
                            )}
                            <li {...props} key={option._id}>
                              {option.label}
                            </li>
                          </>
                        );
                      }}
                    />
                  </FloatLabel>
                  <div className="errorMessage mb-2">
                    {errors.companyId && touched.companyId ? (
                      <div>{errors.companyId}</div>
                    ) : (
                      " "
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: isAllow.isUser ? 'none' : 'block' }}>
                  <FloatLabel
                    label="Select Policy Portal"
                    value={values?.policyPortal}
                  >
                    <Autocomplete
                      className="AutoComplete_InputBox"
                      name="policyPortal"
                      disablePortal
                      value={selectPortal}
                      options={PolicyPortal}
                      onChange={(e, v) => {
                        setSelectedPortal(v?.label);
                        setFieldValue("policyPortal", v?.label);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      isOptionEqualToValue={(e, v) => e.value === v.value}
                    />
                    <div className="errorMessage mb-2 mt-2">
                      {errors.policyPortal && touched.policyPortal ? (
                        <div>{errors.policyPortal}</div>
                      ) : (
                        " "
                      )}
                    </div>
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Select LoginId" value={values?.loginId}>
                    <Autocomplete
                      name="loginId"
                      disablePortal
                      className="AutoComplete_InputBox"
                      id="combo-box-demo"
                      value={selectedLoginPortal}
                      options={loginPortalDetails}
                      key={refreshCount}
                      onChange={(e, v) => {
                        setSelectedLoginPortal(v?.loginPortal);
                        setFieldValue("loginId.companyId", v?.companyId)
                        setFieldValue("loginId.userId", v?.userId)
                        setFieldValue("loginIdFull", v?.loginPortal);
                      }}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                          {option.loginPortal}
                        </li>
                      )}
                      isOptionEqualToValue={(e, v) => e.loginPortal === v}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FloatLabel>
                </Grid>
              </Grid>
              <hr />
              <Typography sx={{ ml: 2 }}>Premium Details</Typography>
              <Grid container sx={{ p: 2 }} columnSpacing={2}>
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Policy Number" value={values.policyNumber}>
                    <Field
                      className="textField w-100"
                      name="policyNumber"
                      id="policyNumber"
                      onKeyDown={handleKeyDown}
                      key={refreshPolicyNumber}
                      onBlur={(e) => VerifyPolicyNumberFunction(String(e.target.value).split("/"))}
                    />
                  </FloatLabel>
                  <div className="errorMessage mb-2">{showPolicyErrMsg}</div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Total Premium" value={values.totalPremium}>
                    <Field key={refreshPolicyNumber} name="totalPremium" type='number' className="textField w-100" />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FloatLabel label="Payment Mode" value={showPaymentMethod}>
                    <Autocomplete
                      className="AutoComplete_InputBox"
                      options={PaymentDetails}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      clearIcon={false}
                      value={selectedPaymentMode}
                      name="paymentMode"
                      onChange={(option, value) => {
                        setSelectedPaymentMode(value?.label);
                        PaymentFunction(value);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <div className="errorMessage mb-2 mt-2">
                      {errors.paymentMode && touched.paymentMode ? (
                        <div>{errors.paymentMode}</div>
                      ) : (
                        " "
                      )}
                    </div>
                  </FloatLabel>
                </Grid>
                {showPaymentMethod === 3 ? (
                  <>
                    <Grid item xs={12} sm={4}>
                      <FloatLabel
                        label="Cheque Number"
                        value={values.chequeNumber}
                      >
                        <Field
                          name="chequeNumber"
                          className="textField w-100"
                        />
                        <div className="errorMessage mb-2 mt-2">
                          {errors.chequeNumber && touched.chequeNumber ? (
                            <div>{errors.chequeNumber}</div>
                          ) : (
                            " "
                          )}
                        </div>
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={4} className="datePicker">
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                      <DatePicker
                        name="chequeDate"
                        className="Date_Picker w-100"
                        onChange={(e) => setFieldValue("chequeDate", e?.$d ? e?.$d : null)}
                      />
                      {/* </LocalizationProvider> */}
                      <div className="errorMessage mb-2 mt-2">
                        {errors.chequeDate && touched.chequeDate ? (
                          <div>{errors.chequeDate}</div>
                        ) : (
                          " "
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FloatLabel label="Bank Name" value={values.bankName}>
                        <Field className="textField w-100" name="bankName" />
                        <div className="errorMessage mb-2 mt-2">
                          {errors.bankName && touched.bankName ? (
                            <div>{errors.bankName}</div>
                          ) : (
                            " "
                          )}
                        </div>
                      </FloatLabel>
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <hr />
              <Typography sx={{ ml: 2 }}>Files</Typography>
              <Grid container sx={{ p: 2 }} columnSpacing={2}>
                <Grid item xs={12} sm={4} className="File-Upload">
                  <FileUploader
                    handleChange={(e) => setFieldValue("PolicyFile", e)}
                    name="PolicyFile"
                    label="Upload Your Policy File"
                    dropMessageStyle={{
                      color: "red",
                      border: "none",
                      borderRadius: "0px",
                    }}
                    types={["PDF"]}
                  />
                  <div className="errorMessage">
                    {errors.PolicyFile && touched.PolicyFile ? (
                      <div>{errors.PolicyFile}</div>
                    ) : (
                      " "
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={4} className="File-Upload">
                  <FileUploader
                    handleChange={(e) => setFieldValue("OtherFile", e)}
                    name="OtherFile"
                    label="Upload Your Other documents"
                    dropMessageStyle={{
                      color: "red",
                      border: "none",
                      borderRadius: "0px",
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={1}>
                  <button className="w-100 Common_Button" onClick={(e) => SaveAndExit(values, "AutoFill")}>
                    Auto Fill
                  </button>
                </Grid> */}
              </Grid>
              <hr />
              <Grid container columnSpacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={1}>
                  <button
                    className="w-100 Common_Button"
                    onClick={(e) => SaveAndExit(values, "SaveAndExit")}
                  >
                    Save & Exit
                  </button>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <button
                    className="w-100 Common_Button"
                    onClick={(e) => SaveAndExit(values, "CreateSameUser")}
                  >
                    Create Same User
                  </button>
                </Grid>
                <Grid item xs={12} sm={1.5} sx={{ display: isAllow.isUser ? 'none' : 'block' }}>
                  <button
                    className="w-100 Common_Button"
                    onClick={(e) => SaveAndExit(values, "CreateOtherUser")}
                  >
                    Create Other User
                  </button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
      <Loader open={openLoader} />
      <Dialog
        open={openCompanyDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            maxWidth: "50%",
          },
        }}
      >
        {openCompanyDrawer ? (
          <AddCompany
            title="Create"
            formType="add"
            setOpenCompanyDrawer={setOpenCompanyDrawer}
            GetActiveData={GetCompanyDetails}
          />
        ) : null}
      </Dialog>
    </>
  );
};

export default Policycreate;
