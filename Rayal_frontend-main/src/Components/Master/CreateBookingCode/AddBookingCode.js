import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostBookingCode, UpdateBookingCode } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import Button from "@mui/material/Button";
import { ToastError } from "../../../UiComponents/Toaster/Toast";


const AddBookingCode = (props) => {
  const {
    selectedData,
    formType,
    setOpenBookingCodeDrawer,
    title,
    GetActiveData,
  } = props;
  let formRef = useRef();

  const initialValues = {
    bookingCode: "",
    remarks: "",
  };

  useEffect(() => {
    if (formType === "edit" || formType === "view") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
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
    
    ['bookingCode', 'remarks'].forEach((item) => data[item] = data[item]?.toUpperCase())
    data.updatedAt = new Date();
    if (e.key === "Enter" || keys === "Save") {
      if (data?.bookingCode && data?.remarks) {
        if (formType === "add") {
          data.createdBy = UserId;
        } else if (formType === "edit") {
          data.updatedBy = UserId;
        }
        let SubmitType =
          formType === "edit"
            ? UpdateBookingCode(selectedData._id, data)
            : PostBookingCode(data);
        SubmitType.then((res) => {
          if (!res) {
            setOpenBookingCodeDrawer(true);
          } else {
            setOpenBookingCodeDrawer(false);
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
      if (data?.bookingCode && data?.remarks) {
        PostBookingCode(data).then((res) => {
          GetActiveData();
          if (res) {
            formRef.resetForm();
          }
        });
      } else {
        ToastError("Fill all the fields!!");
      }
    }
  };
  return (
    <div>
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>{title} Booking Code</Typography>
        </Grid>
        <Grid item xs={6} sm={6} className="d-flex justify-content-end">
          <CloseIcon
            onClick={() => setOpenBookingCodeDrawer(false)}
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
        {({ values }) => (
          <Form onKeyDown={(e) => onKeyDownHandler(e, values)}>
            <div className="container pb-3">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Booking Code" value={values.bookingCode}>
                    <Field
                      name="bookingCode"
                      className="InputFiled"
                      style={{ textTransform: "uppercase" }}
                      disabled={formType === "view" ? true : false}
                    />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Remarks" value={values.remarks}>
                    <Field
                      name="remarks"
                      className="InputFiled"
                      style={{ textTransform: "uppercase" }}
                      disabled={formType === "view" ? true : false}
                    />
                  </FloatLabel>
                </Grid>
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
                onClick={() => setOpenBookingCodeDrawer(false)}
                className="Dialog_Cancel"
              >
                Cancel
              </Button>

              <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save">
                {selectedData?._id ? "Update" : "Save & Exit"}
              </Button>

              <Button
                sx={{ display: formType === "add" ? "block" : "none" }}
                className="Dialog_Save_Exit"
                onClick={(e) => onSubmit(e, values, "Save&Create")}
              >
                Save & Create New
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBookingCode;
