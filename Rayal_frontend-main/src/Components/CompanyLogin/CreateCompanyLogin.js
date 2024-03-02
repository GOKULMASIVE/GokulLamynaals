import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { GetSubBookingCode, UpdateBranch } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastError } from "../../UiComponents/Toaster/Toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  GetCompany,
  GetBookingCode,
  GetUser,
  GetCompanyLogin,
  PostCompanyLogin,
  UpdateCompanyLogin,
  VerifyLoginId
} from "../../Service/_index";
import Button from "@mui/material/Button";

const CreateCompanyLogin = (props) => {
  const {
    setCreateCompanyLoginDrawer,
    GetActiveCompanyLoginData,
    formType,
    selectedData,
    title,
  } = props;
  let formRef = useRef();

  const initialValues = {
    companyId: "",
    bookingCodeId: "",
    url: "",
    userId: "",
    userIdNumber: "",
    password: "",
    branch: "",
    remarks: "",
    subBookingCodeId: "",
  };

  const [companyDetails, setCompanyDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [companyLoginDetails, setCompanyLoginDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [loginIdErrMsg, setLoginIdErrMsg] = useState('')
  const [isButtonDisable, setIsButtonDisabel] = useState(false)

  const [companyValue, setCompanyValue] = useState(
    formType === "edit" ? selectedData?.companyId?.shortName : null
  );
  const [bookingCodeValue, setBookingCodeValue] = useState(
    formType === "edit" ? selectedData?.bookingCodeId?.bookingCode : null
  );
  const [userValue, setUserValue] = useState(
    formType === "edit" ? selectedData.userId.name : null
  );
  const [subBookingCodeValue, setSubBookingCodeValue] = useState(
    formType === "edit" ? selectedData?.subBookingCodeId?.subBookingCode : null
  );

  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const modifiedCompanyDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.shortName,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setCompanyDetails(modifiedCompanyDetails);
    });
  };

  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
      const modifiedBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.bookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setBookingCodeDetails(modifiedBookingCodeDetails);
    });
  };

  const GetSubBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: true }).then((res) => {
      const modifiedSubBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.subBookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      const FilterSubBookingCodeDetails = modifiedSubBookingCodeDetails.filter(
        (item) => item.bookingCode === bookingCodeValue
      );
      setSubBookingCodeDetails(FilterSubBookingCodeDetails);
    });
  };

  const GetUserDetails = () => {
    GetUser({ isAscending: true })
      .then((res) => {
        const modifiedUserDetails = res.data
          .map((e) => {
            if (e.userType.includes("user")) {
              return {
                ...e,
                label: e?.name,
                value: e?._id,
              };
            } else {
              return null;
            }
          })
          .filter(Boolean);
        const ExtraLabel = [
          { name: "All", _id: "All", label: "All" },
          { name: "Admin", _id: "Admin", label: "Admin" },
        ];
        setUserDetails([...ExtraLabel, ...modifiedUserDetails]);
      })
      .catch((err) => ToastError("Network Error"));
  };

  const GetCompanyLoginDetails = () => {
    GetCompanyLogin().then((res) => {
      setCompanyLoginDetails(res.data);
    });
  };
  const [urlValue, setUrlvalue] = React.useState(null);
  useEffect(() => GetSubBookingCodeDetails(), [bookingCodeValue]);
  useEffect(() => {
    GetSubBookingCodeDetails();
    GetCompanyDetails();
    GetBookingCodeDetails();
    GetUserDetails();
    GetCompanyLoginDetails();
    if (formType === "edit") {
      formRef.setFieldValue("companyId", selectedData?.companyId?._id);
      formRef.setFieldValue("bookingCodeId", selectedData.bookingCodeId?._id);
      formRef.setFieldValue(
        "subBookingCodeId",
        selectedData.subBookingCodeId?._id
      );
      formRef.setFieldValue("url", selectedData?.url);
      formRef.setFieldValue("userId", selectedData?.userId?._id);
      formRef.setFieldValue("userIdNumber", selectedData?.userIdNumber);
      formRef.setFieldValue("password", selectedData?.password);
      formRef.setFieldValue("branch", selectedData?.branch);
      formRef.setFieldValue("remarks", selectedData?.remarks);
      setUrlvalue(selectedData?.url);
    }
  }, []);

  const [UrlCollection, setUrlCollection] = useState([]);
  const AutoUrlShow = (value) => {
    const showUrlData = companyLoginDetails.filter(
      (e) => e?.companyId?._id === value?._id
    );
    const uniqueLabels = [...new Set(showUrlData.map((e) => e.url))];
    setUrlCollection(uniqueLabels);
    if (!uniqueLabels.length) {
      setUrlvalue(null);
      formRef.setFieldValue("url", "");
    } else {
      setUrlvalue(uniqueLabels[0]);
      formRef.setFieldValue("url", uniqueLabels[0]);
    }
  };



  const onSubmit = (data, type) => {
    
    if(data?.companyId&&data?.bookingCodeId&&data?.url&&data?.userIdNumber){
    let SubmitType =
      formType === "edit"
        ? UpdateCompanyLogin(selectedData._id, data)
        : PostCompanyLogin(data);
    SubmitType.then((res) => {
      if (res) {
        GetActiveCompanyLoginData();
        if (!type) {
          setCreateCompanyLoginDrawer(false);
        }
      }
    });
  }else{
    ToastError("Fill all the fields");
  }
  };


  const VerifyLoginIdFunction = (e, values) => {
    if (!values.companyId.length) {
      ToastError('Please select company')
      formRef.setFieldValue('userIdNumber', '')
    } else {
      const bodyData = {
        companyId: values.companyId,
        userIdNumber: e
      }
      VerifyLoginId(bodyData).then((res) => {
        if (res?.response?.status === 500) {
          setIsButtonDisabel(true)
          setLoginIdErrMsg(res.response.data.message)
        } else {
          setIsButtonDisabel(false)
          setLoginIdErrMsg('')
        }
      })
    }

  }
  return (
    <>
      <div>
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>{title} Company Login</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setCreateCompanyLoginDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid">
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
            {({ values, setFieldValue }) => (
              <Form>
                <div className="container-fluid pb-3">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="Select Company"
                        value={values.companyId}
                      >
                        <Autocomplete
                          name="companyId"
                          options={companyDetails}
                          value={companyValue}
                          onChange={(e, v) => {
                            setFieldValue("companyId", v?._id);
                            setCompanyValue(v?.label);
                            AutoUrlShow(v);
                          }}
                          className="AutoComplete_InputBox w-100"
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value
                          }
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                              {option.shortName}
                            </li>
                          )}
                        />
                      </FloatLabel>
                    </Grid>
                    {UrlCollection.length ? (
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Select URL" value={values.url}>
                          <Select
                            className="AutoComplete_InputBox w-100"
                            id="demo-simple-select"
                            value={values?.url}
                            onChange={(e, v) =>
                              setFieldValue("url", v.props.value)
                            }
                          >
                            {UrlCollection?.map((url, index) => (
                              <MenuItem key={index} value={url}>
                                {url}
                              </MenuItem>
                            ))}
                          </Select>
                        </FloatLabel>
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="URL" value={values.url}>
                          <Field name="url" className="InputFiled" />
                        </FloatLabel>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="Select BookingCode"
                        value={values.bookingCodeId}
                      >
                        <Autocomplete
                          name="bookingCodeId"
                          className="AutoComplete_InputBox"
                          options={bookingCodeDetails}
                          value={bookingCodeValue}
                          onChange={(e, v) => {
                            setFieldValue("bookingCodeId", v?._id);
                            setBookingCodeValue(v?.label);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option?.label === value
                          }
                        />
                      </FloatLabel>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FloatLabel
                        label="Select SubBooking Code"
                        value={values.subBookingCodeId}
                      >
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          disablePortal
                          id="combo-box-demo"
                          name="subBookingCodeId"
                          value={subBookingCodeValue}
                          options={subBookingCodeDetails}
                          onChange={(e, v) => {
                            setFieldValue("subBookingCodeId", v?._id);
                            setSubBookingCodeValue(v?.label);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option.subBookingCode === value
                          }
                        />
                      </FloatLabel>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Branch" value={values.branch}>
                        <Field
                          name="branch"
                          className="InputFiled"
                          style={{ textTransform: "uppercase" }}
                        />
                      </FloatLabel>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="User Name"
                        value={values.userId || userValue}
                      >
                        <Autocomplete
                          name="userId"
                          options={userDetails}
                          value={userValue}
                          onInputChange={(e, v) => setUserValue(v)}
                          onChange={(e, v) => {
                            setFieldValue("userId", v?._id);
                            setUserValue(v?.label);
                          }}
                          className="AutoComplete_InputBox w-100"
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option?.name === value
                          }
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                              {option.name}
                            </li>
                          )}
                        />
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Login Id" value={values.userIdNumber}>
                        <Field name="userIdNumber" className="InputFiled" onBlur={(e) => VerifyLoginIdFunction(e.target.value, values)} />
                      </FloatLabel>
                      <div className="errorMessage ">
                        <div>{loginIdErrMsg}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Password" value={values.password}>
                        <Field name="password" className="InputFiled" />
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="Remarks"
                        value={values.remarks}
                        style={{ textTransform: "uppercase" }}
                      >
                        <Field
                          name="remarks"
                          className="InputFiled"
                          style={{ textTransform: "uppercase" }}

                        />
                      </FloatLabel>
                    </Grid>
                  </Grid>
                </div>
                <div className="Dialog_Footer">
                  <Button
                    onClick={() => setCreateCompanyLoginDrawer(false)}
                    className="Dialog_Cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="Dialog_Save" disabled={isButtonDisable}>
                    {title}
                  </Button>
                  <Button
                    disabled={isButtonDisable}
                    sx={{ display: formType === "add" ? "block" : "none" }}
                    className="Dialog_Save_Exit"
                    onClick={() => {
                      onSubmit(values, "save&create");
                      setCreateCompanyLoginDrawer(true);
                      setFieldValue("userIdNumber", "");
                      setFieldValue("password", "");
                    }}
                  // type="submit"
                  >
                    Save & Create New
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CreateCompanyLogin;
