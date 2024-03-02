import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostBranch, UpdateBranch } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

const AddBranch = (props) => {

  const { selectedData, formType, setOpenBranchDrawer, title, GetActiveData } = props;

  let formRef = useRef();

  const initialValues = {
    branchName: "",
    address: "",
    remarks: "",
    city: "",
    pincode: "",
  };

  const UserId = localStorage.getItem("UserId");

  useEffect(() => {
    if (formType === "edit") {
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
    if (e.key === "Enter" || keys === "Save") {
      const UpdatedTime = new Date();
      data.branchName = data?.branchName?.toUpperCase()
      data.remarks = data?.remarks?.toUpperCase()
      data.updatedAt = UpdatedTime;
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }
      let SubmitType =
        formType === "edit"
          ? UpdateBranch(selectedData._id, data)
          : PostBranch(data);
      SubmitType.then((res) => {
        if (!res) {
          setOpenBranchDrawer(true);
        } else {
          setOpenBranchDrawer(false);
          GetActiveData();

        }
      }).catch((error) => {
        console.log(error);
      });
    }
    else if (keys === "Save&Create") {
      const UpdatedTime = new Date();
      data.branchName = data?.branchName?.toUpperCase()
      data.remarks = data?.remarks?.toUpperCase()
      data.updatedAt = UpdatedTime;
      PostBranch(data).then((res) => {
        if (res) {
          formRef.resetForm()
        }
        GetActiveData();
      })
    }
  };

  return (
    <>
      <div >
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>{title} Branch</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenBranchDrawer(false)}
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
                    <FloatLabel label="Branch Name" value={values.branchName}>
                      <Field
                        name="branchName"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Address" value={values.address}>
                      <Field
                        name="address"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="City" value={values.city}>
                      <Field
                        name="city"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Pincode" value={values.pincode}>
                      <Field name="pincode" className="InputFiled" />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Remarks" value={values.remarks}>
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
                <Button onClick={() => setOpenBranchDrawer(false)} className="Dialog_Cancel">
                  Cancel
                </Button>
                <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save">
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

export default AddBranch;
