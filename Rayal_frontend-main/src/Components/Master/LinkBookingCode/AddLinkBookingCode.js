import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  GetCompany,
  GetBookingCode,
  PostLinkBookingCode,
} from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AddLinkBookingCode = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetActiveData } = props;
  let formRef = useRef();
  const UserId = localStorage.getItem("UserId");
  const initialValues = {
    bookingCodeId: "",
    companyId: "",
  };

  const [companyDetails, setCompanyDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [refreshKey, setRefreshKey] = useState(1)

  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const filteredData = res.data
        .map((item) => {
          if (item.isEnabled) {
            return {
              ...item,
              label: item?.shortName,
              value: item?._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setCompanyDetails(filteredData);
    });
  };

  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
      const filteredData = res.data
        .map((item) => {
          if (item.isEnabled) {
            return {
              ...item,
              label: item?.bookingCode,
              value: item?._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setBookingCodeDetails(filteredData);
    });
  };

  useEffect(() => {
    GetCompanyDetails();
    GetBookingCodeDetails();
    if (formType === "view") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
        formRef.setFieldValue('companyId', selectedData?.companyId?.shortName)
        formRef.setFieldValue('bookingCodeId', selectedData?.bookingCodeId?.bookingCode)
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const onKeyDownHandler = (e, values) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e, values, "Save");
    }
  };

  const onSubmit = (e, data, keys) => {
    if (e.key === "Enter" || keys === "Save") {
      const UpdatedTime = new Date()
      data.updatedAt = UpdatedTime
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }
      PostLinkBookingCode(data).then((res) => {
        if (!res) {
          setOpenDrawer(true);
        } else {
          setOpenDrawer(false);
          GetActiveData();
        }
      })
    } else if (keys === "Save&Create") {
      PostLinkBookingCode(data).then((res) => {
        if (res) {
          formRef.resetForm()
          setRefreshKey(refreshKey + 1)
        }
        GetActiveData();
      })
    }
  };

  return (
    <>
      <div >
        <Grid container className="DrawerHeader">
          <Grid item xs={10} sm={10}>
            <Typography>{title} Link Booking Code</Typography>
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
                    <FloatLabel label="Company Name" value={values.companyId}>
                      <Autocomplete
                        name="companyId"
                        className="AutoComplete_InputBox w-100"
                        onChange={(option, value) => {
                          setFieldValue('companyId', value._id);
                        }}
                        disabled={formType === 'view'}
                        options={companyDetails}
                        renderInput={(params) => <TextField {...params} focused={false} />}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        key={refreshKey}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Booking Code" value={values.bookingCodeId}>
                      <Autocomplete
                        name="bookingCodeId"
                        className="AutoComplete_InputBox w-100"
                        onChange={(option, value) => {
                          setFieldValue('bookingCodeId', value._id);
                        }}
                        disabled={formType === 'view'}
                        options={bookingCodeDetails}
                        renderInput={(params) => <TextField {...params} focused={false} />}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        key={refreshKey}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: formType === "view" ? "block" : "none" }}>
                    <FloatLabel label="Created Date" value={"react"}>
                      <Field name="createdAt" className="InputFiled"
                        disabled={formType === "view" ? true : false}
                        value={moment(selectedData?.createdAt).format("L")}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: formType === "view" ? "block" : "none" }}>
                    <FloatLabel label="Updated Date" value={"react"}>
                      <Field name="updatedAt" className="InputFiled"
                        disabled={formType === "view" ? true : false}
                        style={{ textTransform: 'uppercase' }}
                        value={moment(selectedData?.updatedAt).format("L")}
                      />
                    </FloatLabel>
                  </Grid>
                </Grid>
              </div>
              <div className="Dialog_Footer">
                <Button onClick={() => setOpenDrawer(false)} className="Dialog_Cancel">
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

export default AddLinkBookingCode;
