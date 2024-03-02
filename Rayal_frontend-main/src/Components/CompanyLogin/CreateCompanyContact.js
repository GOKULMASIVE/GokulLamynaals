import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ToastError } from "../../UiComponents/Toaster/Toast";
import {
  GetCompany,
  GetBookingCode,
  PostCompanyContact,
  GetUser,
  PostCompanyLogin,
  GetSubBookingCode,
} from "../../Service/_index";
import Button from "@mui/material/Button";

const CreateCompanyContact = (props) => {
  const {
    setCreateCompanyContactDrawer,
    GetCompanyContactData,
    formType,
    selectedData,
    title,
  } = props;
  let formRef = useRef();

  const initialValues = {
    companyId: "",
    bookingCodeId: "",
    subBookingCodeId: "",
    Desigination: "",
    branch: "",
    name: "",
    email: "",
    mobileNumber: "",
  };

  const [companyDetails, setCompanyDetails] = useState();
  const [bookingCodeDetails, setBookingCodeDetails] = useState();
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState();

  // defined by gokul..
  const [bookingCodeValue, setBookingCodeValue] = useState(null);
  const [subBookingCodeValue, setSubBookingCodeValue] = useState(null);
  const [selectedBookingCodeId,setSelectedBookingCodeId]=useState(null);
  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      setCompanyDetails(res.data);
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
      setSubBookingCodeDetails(
        modifiedSubBookingCodeDetails.filter(
          (item) => item.bookingCodeId === selectedBookingCodeId
        )
      );
    });
  };

  useEffect(() => GetSubBookingCodeDetails(), [selectedBookingCodeId]);
  useEffect(() => {
    GetCompanyDetails();
    GetBookingCodeDetails();

    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const onSubmit = (data) => {
    if(data?.Desigination && data?.bookingCodeId&&data?.branch&&data?.companyId&&data?.email&&data?.mobileNumber&&data?.name&&data?.subBookingCodeId){
    PostCompanyContact(data)
    GetCompanyContactData();
    setCreateCompanyContactDrawer(false);
    }else{
      ToastError("Fill all the fields");
    }
  };

  return (
    <>
      <div>
        <Grid container className="DrawerHeader" sx={{ padding: "10px" }}>
          <Grid item xs={6} sm={6}>
            <Typography>Create Company Contact</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setCreateCompanyContactDrawer(false)}
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
                  <Grid container rowSpacing={2} columnSpacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Company Name" value={values.companyId}>
                        <Autocomplete
                          className="AutoComplete_InputBox w-100"
                          name="companyId"
                          disablePortal
                          id="combo-box-demo"
                          options={companyDetails}
                          onChange={(e, v) => setFieldValue("companyId", v._id)}
                          clearIcon={false}
                          getOptionLabel={(option) => option.companyName}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="Designation"
                        value={values.Desigination}
                      >
                        <Field name="Desigination" className="InputFiled" style={{textTransform:'uppercase'}}/>
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel
                        label="Booking Code"
                        value={values.bookingCodeId}
                      >
                        <Autocomplete
                          className="AutoComplete_InputBox w-100"
                          disablePortal
                          name="bookingCodeId"
                          value={bookingCodeValue}
                          id="combo-box-demo"
                          options={bookingCodeDetails}
                          onChange={(e, v) => {
                            setFieldValue("bookingCodeId", v._id);
                            setBookingCodeValue(v?.label);
                            setSelectedBookingCodeId(v?.value);
                          }}
                          clearIcon={false}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FloatLabel>
                    </Grid>
                    {/* written by gokul... */}
                    
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
                          clearIcon={false}
                          isOptionEqualToValue={(option, value) =>
                            option?.bookingCodeId === value
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FloatLabel>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Branch" value={values.branch}>
                        <Field name="branch" className="InputFiled"  style={{textTransform:'uppercase'}}/>
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Name" value={values.name}>
                        <Field name="name" className="InputFiled" style={{textTransform:'uppercase'}}/>
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Email" value={values.email}>
                        <Field name="email" className="InputFiled" />
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FloatLabel label="Mobile" value={values.mobileNumber}>
                        <Field name="mobileNumber" className="InputFiled" />
                      </FloatLabel>
                    </Grid>
                  </Grid>
                </div>
                <div className="Dialog_Footer">
                  <Button
                    onClick={() => setCreateCompanyContactDrawer(false)}
                    className="Dialog_Cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="Dialog_Save">
                    {title}
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

export default CreateCompanyContact;
