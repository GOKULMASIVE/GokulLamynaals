import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  UpdateSubProduct,
  GetProduct,
  PostSubProduct,
} from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Button from "@mui/material/Button";

const AddSubProduct = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetActiveData } = props;
  const [productDetails, setProductDetails] = useState([]);
  const [refreshKey, setRefreshKey] = useState(1)
  const [productValue, setProductValue] = useState(
    (formType === "edit") || (formType === "view") ? selectedData?.product : null
  );
  let formRef = useRef();

  const initialValues = {
    subProduct: "",
    productID: "",
    remarks: "",
  };

  const GetProductDetails = () => {
    GetProduct({ isAscending: true }).then((res) => {
      const FilteredProduct = res?.data
        ?.map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.product,
              value: e._id,
            };
          } else return null;
        })
        .filter(Boolean);
      setProductDetails(FilteredProduct);
    });
  };

  useEffect(() => {
    GetProductDetails();
    if (formType === "edit" || formType === "view") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue("productId", selectedData?.productId);
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
    ['subProduct', 'remarks'].forEach((item) => data[item] = data[item]?.toUpperCase())
    data.updatedAt = new Date();
    if (e.key === "Enter" || keys === "Save") {
      if (formType === "add") {
        data.createdBy = UserId;
      } else if (formType === 'edit') {
        data.updatedBy = UserId;
      }
      let SubmitType =
        formType === "edit"
          ? UpdateSubProduct(selectedData._id, data)
          : PostSubProduct(data);
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
      PostSubProduct(data).then((res) => {
        if (res) {
          formRef.resetForm()
          setRefreshKey(refreshKey + 1)
          setProductValue('')
        }
        GetActiveData();
      })
    }
  };
  return (
    <div >
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>{title} Sub Product</Typography>
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
        {({ values, setFieldValue }) => (
          <Form onKeyDown={(e) => onKeyDownHandler(e, values)}>
            <div className="container pb-3">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Select Product" value={values.productID}>
                    <Autocomplete
                      name="productID"
                      className="AutoComplete_InputBox"
                      options={productDetails}
                      renderInput={(params) => <TextField {...params} />}
                      isOptionEqualToValue={(option, value) =>
                        option.product === value
                      }
                      onChange={(option, value) => {
                        setFieldValue("productID", value._id);
                        setProductValue(value?.label);
                      }}
                      value={productValue}
                      onInputChange={(e, v) => setProductValue(v)}
                      key={refreshKey}
                    />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FloatLabel label="Sub Product" value={values.subProduct}>
                    <Field
                      name="subProduct"
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

                {/* <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                    <button onClick={() => setOpenDrawer(false)}>Cancel</button>
                    <button type="submit" onClick={(e) => onSubmit(e, values, "Save")}>
                      {selectedData?._id ? "Update" : "Save"}
                    </button>
                  </Grid> */}
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

export default AddSubProduct;
