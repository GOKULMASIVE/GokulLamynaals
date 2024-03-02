import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostFuelType, UpdateFuelType } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { ToastError } from "../../../UiComponents/Toaster/Toast";

const AddFuelType = (props) => {
  const { selectedData, formType, setOpenFuelTypeDrawer, title, GetActiveData } =
    props;
  let formRef = useRef();

  const initialValues = {
    fuelType: "",
    remarks: "",
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
    console.log(data);
    ['fuelType', 'remarks'].forEach((item) => data[item] = data[item]?.toUpperCase())
    data.updatedAt = new Date();
    if (e.key === "Enter" || keys === "Save") {
      if(data?.fuelType && data?.remarks){
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }
      let SubmitType =
        formType === "edit"
          ? UpdateFuelType(selectedData._id, data)
          : PostFuelType(data);
      SubmitType.then((res) => {
        if (!res) {
          setOpenFuelTypeDrawer(true);
        } else {
          setOpenFuelTypeDrawer(false);
          GetActiveData();
        }
      }).catch((error) => {
        console.log(error);
      });
    }else{
      ToastError("Fill all the fields!!");
    }
    }
    else if (keys === "Save&Create") {
      if (data?.fuelType && data?.remarks) {
        PostFuelType(data).then((res) => {
          if (res) {
            formRef.resetForm();
          }
          GetActiveData();
        });
      } else {
        ToastError("Fill all the fields!!");
      }
    }
  };
  return (
    <div >
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>{title} FuelType</Typography>
        </Grid>
        <Grid item xs={6} sm={6} className="d-flex justify-content-end">
          <CloseIcon
            onClick={() => setOpenFuelTypeDrawer(false)}
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
                  <FloatLabel label="FuelType" value={values.fuelType}>
                    <Field
                      name="fuelType"
                      className="InputFiled"
                      style={{ textTransform: "uppercase" }}
                    />
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
              <Button onClick={() => setOpenFuelTypeDrawer(false)} className="Dialog_Cancel">
                Cancel
              </Button>
              <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save" >
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
  );
};

export default AddFuelType;
