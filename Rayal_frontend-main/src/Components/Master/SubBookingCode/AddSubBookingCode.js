import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  PostProduct,
  UpdateSubBookingCode,
  GetBookingCode,
  PostSubBookingCode,
} from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Button from "@mui/material/Button";

const AddSubBookingCode = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetActiveData } = props;
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [bookingCodeValue, setBookingCodeValue] = useState(
    formType === "edit" || formType === "view"
      ? selectedData?.bookingCode
      : null
  );
  let formRef = useRef();

  const initialValues = {
    bookingCodeId: "",
    subBookingCode: "",
    remarks: "",
    cc: "",
    email: "",
    mobile: "",
    password: "",
  };

  const CCselector = [
    {
      label: "Yes",
      value: "Yes",
    },
    {
      label: "No",
      value: "No",
    },
  ];
  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
      const FilteredBookingCode = res.data
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
      setBookingCodeDetails(FilteredBookingCode);
    });
  };

  useEffect(() => {
    GetBookingCodeDetails();
    if (formType === "edit" || formType === "view") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue("productId", selectedData?.bookingCodeId);
    formRef.setFieldValue(initialValues);
  }, []);

  const UserId = localStorage.getItem("UserId");

  const onKeyDownHandler = (e, values) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e, values, "Save");
    }
  };
  const onSubmit = (e, data, keys) => {
    // console.log("Data:",data);
    ['subBookingCode', 'remarks'].forEach((item) => data[item] = data[item]?.toUpperCase())
    data.updatedAt = new Date();
    if (e.key === "Enter" || keys === "Save") {
      if (
        data?.bookingCodeId &&
        data?.subBookingCode &&
        data?.cc &&
        data?.email &&
        data?.mobile &&
        data?.password &&
        data?.remarks
      ) {
        if (formType === "add") {
          data.createdBy = UserId;
        } else if (formType === "edit") {
          data.updatedBy = UserId;
        }
        let SubmitType =
          formType === "edit"
            ? UpdateSubBookingCode(selectedData._id, data)
            : PostSubBookingCode(data);
        SubmitType.then((res) => {
          if (!res) {
            setOpenDrawer(true);
          } else {
            setOpenDrawer(false);
            GetActiveData();
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        ToastError("Fill all the fields!!");
      }
    }
    else if (keys === "Save&Create") {
      if (
        data?.bookingCodeId &&
        data?.subBookingCode &&
        data?.cc &&
        data?.email &&
        data?.mobile &&
        data?.password &&
        data?.remarks
      ) {
        PostSubBookingCode(data).then((res) => {
          if (res) {
            formRef.resetForm();
          }
          GetActiveData();
          setBookingCodeValue("");
        });
      } else {
        ToastError("Fill all the fields!!");
      }
    }
  };
  return (
    <>
      <div>
        <Grid container className="DrawerHeader">
          <Grid item xs={10} sm={10}>
            <Typography>{title} Sub Booking Code</Typography>
          </Grid>
          <Grid item xs={2} sm={2} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
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
            <Form onKeyDown={(e) => onKeyDownHandler(e, values)}>
              <div className="container pb-3">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Booking Code"
                      value={values.bookingCodeId}
                    >
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        disabled={formType === "view" ? true : false}
                        name="bookingCodeId"
                        options={bookingCodeDetails}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) => option.bookingCode === value}
                        onChange={(option, value) => {
                          setFieldValue("bookingCodeId", value._id);
                          setBookingCodeValue(value?.label);
                        }}
                        value={bookingCodeValue}
                        onInputChange={(e, v) => setBookingCodeValue(v)}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Sub Booking Code"
                      value={values.subBookingCode}
                    >
                      <Field
                        disabled={formType === "view" ? true : false}
                        name="subBookingCode"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="CC" value={values.cc}>
                      <Autocomplete
                        disabled={formType === "view" ? true : false}
                        className="AutoComplete_InputBox"
                        clearIcon={false}
                        name="cc"
                        value={values.cc}
                        options={CCselector}
                        onChange={(e, v) => setFieldValue("cc", v?.value)}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?.label === value
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Remarks" value={values.remarks}>
                      <Field
                        disabled={formType === "view" ? true : false}
                        name="remarks"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  {/* written by gokul... */}
                  {/* Start */}
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Email" value={values.email}>
                      <Field
                        disabled={formType === "view" ? true : false}
                        name="email"
                        className="InputFiled"
                        style={{ textTransform: "lowercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Phone" value={values.mobile}>
                      <Field
                        disabled={formType === "view" ? true : false}
                        name="mobile"
                        className="InputFiled"
                      // style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Password" value={values.password}>
                      <Field
                        disabled={formType === "view" ? true : false}
                        name="password"
                        className="InputFiled"
                      // style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  {/* End */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: formType === "view" ? "block" : "none" }}
                  >
                    <FloatLabel label="Created Date" value={"react"}>
                      <Field
                        name="createdAt"
                        className="InputFiled"
                        disabled={formType === "view" ? true : false}
                        value={moment(selectedData?.createdAt).format("L")}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: formType === "view" ? "block" : "none" }}
                  >
                    <FloatLabel label="Updated Date" value={"react"}>
                      <Field
                        name="updatedAt"
                        className="InputFiled"
                        disabled={formType === "view" ? true : false}
                        style={{ textTransform: "uppercase" }}
                        value={moment(selectedData?.updatedAt).format("L")}
                      />
                    </FloatLabel>
                  </Grid>
                </Grid>
              </div>

              <div className="Dialog_Footer">
                <Button
                  onClick={() => setOpenDrawer(false)}
                  className="Dialog_Cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save" sx={{ display: formType === 'view' ? 'none' : 'block' }}>
                  {selectedData?._id ? "Update" : "Save & Exit"}
                </Button>
                <Button sx={{ display: formType === 'add' ? 'block' : 'none' }} className="Dialog_Save_Exit" onClick={(e) => onSubmit(e, values, "Save&Create")}>
                  Save & Create New
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddSubBookingCode;
