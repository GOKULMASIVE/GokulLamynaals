import React, { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {
  GetUser,
  GetCompany,
  VerifyPolicyNumber,
} from "../../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CreatePolicyMappingService } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { AWS_DIRECTORY_NAME } from '../../../Shared/CommonConstant'
import { FileUploader } from "react-drag-drop-files";
import { ToastError } from "../../../UiComponents/Toaster/Toast";

const fileTypes = ["PDF"];
const PaymentDetails = [
  {
    method: "Cash",
    value: 1,
  },
  {
    method: "Online",
    value: 2,
  },
  {
    method: "Cheque",
    value: 3,
  },
  {
    method: "DD",
    value: 4,
  },
];

const CreatePolicyMapping = ({ setOpenDrawer , GetData }) => {
  const initialValues = {
    userId: "",
    issueDate: "",
    companyId: "",
    policyNumber: "",
    totalPremium: "",
    paymentMode: "",
    chequeNumber: "",
    chequeDate: "",
    bankName: "",
    PolicyFile: "",
    OtherFile: "",
  };

  const [userDetails, setUserDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [showPaymentMethod, setShowPaymentMethod] = useState();
  let formRef = useRef();

  const GetUserDetails = () => {
    GetUser({isAscending:true}).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled && e?.userType.includes('user')) {
          return {
            ...e,
            label: e.name,
            value: e._id,
          }
        } else {
          return null
        }
      })
      setUserDetails(FilteredData.filter(Boolean))
    })
  }

  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled) {
          return {
            ...e,
            label: e.companyName,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      setCompanyDetails(FilteredData.filter(Boolean));
    });
  }

  const PaymentFunction = (e) => {
    setShowPaymentMethod(e.target.value.value);
    formRef.setFieldValue("paymentMode", e.target.value.method);
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const VerifyPolicyNumberFunction = (e) => {
    VerifyPolicyNumber(e)
      .then((res) => {
        setIsButtonDisabled(true);
      })
      .catch((err) => {
        setIsButtonDisabled(false);
      });
  };

  React.useEffect(() => {
    GetUserDetails();
    GetCompanyDetails();
  }, []);

  const onSubmit = (data) => {
    let formData = new FormData()
    for (var key in data) {
      formData.append(key, data[key]);
    }
    formData.append(
      AWS_DIRECTORY_NAME.AWS_POLICY_FILE_DIRECTORY_NAME,
      data.PolicyFile
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_OTHER_FILE_DIRECTORY_NAME,
      data.OtherFile
    );
    CreatePolicyMappingService(formData).then((res) => {
      setOpenDrawer(false)
      GetData()
    }).catch((err) => ToastError("Something Went wrong"))
  };
  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>Create Policy Mapping</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid">
          {/* <Paper sx={{ m: 2, p: 1 }}> */}
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            innerRef={(ref) => {
              if (ref) {
                formRef = ref;
              }
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Typography sx={{ ml: 2 }}>User</Typography>

                <Grid container sx={{ p: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel label="Select User" value={values.userId}>
                      <Autocomplete
                        name="userId"
                        className="AutoComplete_InputBox w-100"
                        disablePortal
                        id="combo-box-demo"
                        options={userDetails}
                        clearIcon={false}
                        onChange={(option, v) => setFieldValue("userId", v?._id)}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                      />
                    </FloatLabel>
                  </Grid>
                </Grid>
                <hr></hr>
                <Typography sx={{ ml: 2 }}>Policy Details</Typography>
                <Grid container sx={{ p: 2 }} spacing={2}>
                  <Grid item xs={12} sm={4} className="datePicker">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        name="issueDate"
                        className="Date_Picker w-100"
                        onChange={(e) => setFieldValue("issueDate", e.$d)}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel label="Select Company" value={values.companyId}>
                      <Autocomplete
                        name="companyId"
                        className="AutoComplete_InputBox w-100"
                        disablePortal
                        id="combo-box-demo"
                        options={companyDetails}
                        onChange={(e, v) =>
                          setFieldValue("companyId", v?._id || "")
                        }
                        clearIcon={false}
                        getOptionLabel={(option) => option.companyName || ""}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel
                      label="Policy Number"
                      value={values.policyNumber}
                    >
                      <Field
                        className="textField w-100"
                        name="policyNumber"
                        onBlur={(e) =>
                          VerifyPolicyNumberFunction(e.target.value)
                        }
                      />
                    </FloatLabel>
                  </Grid>
                </Grid>
                <hr></hr>
                <Typography sx={{ ml: 2 }}>Premium Details</Typography>
                <Grid container sx={{ p: 2 }} spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel
                      label="Total Premium"
                      value={values.totalPremium}
                    >
                      <Field name="totalPremium" className="textField w-100" />
                    </FloatLabel>
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <FloatLabel label="Select Policy Portal">
                      <Select className="w-100 DropdownField InputFiled">
                        {companyDetails?.map((e) => {
                          return (
                            <MenuItem value={e._id} key={e._id}>
                              {e.companyName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel label="Select Login Portal">
                      <Select className="w-100 DropdownField InputFiled">
                        {companyDetails?.map((e) => {
                          return (
                            <MenuItem value={e._id} key={e._id}>
                              {e.companyName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FloatLabel>
                  </Grid> */}
                </Grid>
                <hr></hr>
                <Typography sx={{ ml: 2 }}>Payment Details</Typography>
                <Grid container sx={{ p: 2 }} spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FloatLabel label="Payment Mode" value={showPaymentMethod}>
                      <Select
                        className="w-100 DropdownField InputFiled"
                        onChange={(e) => PaymentFunction(e)}
                        value={showPaymentMethod}
                        name="paymentMode"
                      >
                        {PaymentDetails?.map((e) => {
                          return (
                            <MenuItem value={e} key={e.value}>
                              {e.method}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FloatLabel>
                  </Grid>
                  {showPaymentMethod === 3 || showPaymentMethod === 4 ? (
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
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4} className="datePicker">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="chequeDate"
                            className="Date_Picker w-100"
                            onChange={(e) => setFieldValue("chequeDate", e.$d)}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Bank Name" value={values.bankName}>
                          <Field className="textField w-100" name="bankName" />
                        </FloatLabel>
                      </Grid>
                    </>
                  ) : null}
                </Grid>

                <hr></hr>
                <Typography sx={{ ml: 2 }}>Files</Typography>
                <Grid container sx={{ p: 2 }} spacing={2}>
                <Grid item xs={12} sm={4} className="File-Upload">
                  {/* <Typography>Policy File</Typography> */}
                  <FileUploader
                    handleChange={(e) => setFieldValue("PolicyFile", e)}
                    name="PolicyFile"
                    label="Upload Your Policy File"
                    dropMessageStyle={{
                      color: "red",
                      border: "none",
                      borderRadius: "0px",

                    }}
                    types={fileTypes}
                  />
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
                </Grid>
                <Grid container spacing={1} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={2}>
                    <button
                      className="w-100 TabelButton"
                      type="submit"
                      disabled={isButtonDisabled}
                    >
                      Mapping Required
                    </button>
                  </Grid>
                  {/* <Grid item xs={12} sm={2}>
                    <button className="w-100 TabelButton">
                      Save / Create New
                    </button>
                  </Grid> */}
                  <Grid item xs={12} sm={2}>
                    <button
                      className="w-100 TabelButton"
                      onClick={() => setOpenDrawer(false)}
                    >
                      Cancel
                    </button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          {/* </Paper> */}
        </div>
      </div>
    </>
  );
};

export default CreatePolicyMapping;
