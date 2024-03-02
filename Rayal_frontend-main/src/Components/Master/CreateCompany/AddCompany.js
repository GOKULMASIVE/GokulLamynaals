import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostCompany, UpdateCompany } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import Button from "@mui/material/Button";
import useLoadingStore from '../../../Redux/Zustand'

const AddCompany = (props) => {
  const { selectedData, formType, setOpenCompanyDrawer, title, GetActiveData } = props;

  const {setLoading} = useLoadingStore()
  let formRef = useRef();

  const initialValues = {
    companyName: "",
    shortName: "",
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

  const onKeyDownHandler = (e, values) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e, values, "Save");
    }
  };

  const onSubmit = (e, data, keys) => {
    let UserId = localStorage.getItem("UserId");
    data.updatedAt = new Date();
    ['companyName', 'remarks', 'shortName'].forEach((item) => data[item] = data[item]?.toUpperCase())

    if (e.key === "Enter" || keys === "Save") {
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }

      let SubmitType =
        formType === "edit"
          ? UpdateCompany(selectedData._id, data)
          : PostCompany(data);
      SubmitType.then((res) => {

        if (!res) {
          setOpenCompanyDrawer(true);
        } else {
        GetActiveData();
          setOpenCompanyDrawer(false)
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (keys === "Save&Create") {
      PostCompany(data).then((res) => {
        GetActiveData();
        if (res) {
          formRef.resetForm()
        }
      })
    }
  };

  return (
    <div>
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>{title} Company </Typography>
        </Grid>
        <Grid item xs={6} sm={6} className="d-flex justify-content-end">
          <CloseIcon
            onClick={() => setOpenCompanyDrawer(false)}
            sx={{ cursor: "pointer" }}
          />
        </Grid>
      </Grid>
      <Formik
        initialValues={initialValues}
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
                  <FloatLabel label="Company Name" value={values.companyName}>
                    <Field
                      disabled={formType === "view" ? true : false}
                      name="companyName"
                      className="InputFiled"
                      style={{ textTransform: "uppercase" }}
                    />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Short Name" value={values.shortName}>
                    <Field
                      disabled={formType === "view" ? true : false}
                      name="shortName"
                      className="InputFiled"
                      style={{ textTransform: "uppercase" }}
                    />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Remarks" value={values.remarks}>
                    <Field name="remarks" className="InputFiled"
                      disabled={formType === "view" ? true : false}
                      style={{ textTransform: 'uppercase' }}
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
              <Button onClick={() => setOpenCompanyDrawer(false)} className="Dialog_Cancel">
                Cancel
              </Button>
              <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save" sx={{ display: formType === 'view' ? 'none' : 'block' }}>
                {selectedData?._id ? "Update" : "Save & Exit"}
              </Button>
              <Button sx={{ display: formType === 'add' ? 'block' : 'none' }} onClick={(e) => onSubmit(e, values, "Save&Create")} className="Dialog_Save_Exit">
                Save & Create new
              </Button>

            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCompany;
