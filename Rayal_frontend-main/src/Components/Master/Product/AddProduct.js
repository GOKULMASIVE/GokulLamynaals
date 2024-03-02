import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostProduct, UpdateProduct } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import Button from "@mui/material/Button";

const AddProduct = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetActiveData } = props;
  let formRef = useRef();

  const initialValues = {
    product: "",
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
    ['product', 'remarks'].forEach((item) => data[item] = data[item]?.toUpperCase())
    data.updatedAt = new Date();

    if (e.key === "Enter" || keys === "Save") {
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }
      let SubmitType =
        formType === "edit"
          ? UpdateProduct(selectedData._id, data)
          : PostProduct(data);
      SubmitType.then((res) => {
        if (!res) {
          setOpenDrawer(true);
        } else {
        GetActiveData();

          setOpenDrawer(false);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    else if (keys === "Save&Create") {
      PostProduct(data).then((res) => {
        if (res) {
          formRef.resetForm()
        }
        GetActiveData();
      })
    }
  };
  return (
    <div >
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>{title} Product</Typography>
        </Grid>
        <Grid item xs={6} sm={6} className="d-flex justify-content-end">
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
        {({ values }) => (
          <Form onKeyDown={(e) => onKeyDownHandler(e, values)}>
            <div className="container-fluid pb-3">

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Product" value={values.product}>
                    <Field
                      name="product"
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
  );
};

export default AddProduct;
