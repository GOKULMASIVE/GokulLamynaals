import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  PostVehicleMake,
  UpdateVehicleMake,
  GetProduct,
} from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Autocomplete, TextField } from "@mui/material";
import { Select } from "antd";
import { filterOption, filterSort } from "../../../Shared/CommonConstant";
import { ToastError } from "../../../UiComponents/Toaster/Toast";

const AddVehicleMake = (props) => {
  const { selectedData, formType, setOpenBranchDrawer, title, GetActiveData } =
    props;
  let formRef = useRef();

  const initialValues = {
    product: "",
    productID: "",
    vehicleMake: "",
    remarks: "",
  };

  const UserId = localStorage.getItem("UserId");
  const [productDetails, setProductDetails] = useState([]);
  const [productValue, setProductValue] = useState(
    formType === "edit" ? selectedData?.product : null
  );
  const [refershKey, setRefreshKey] = useState(0);

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
      if (
        data?.product &&
        data?.productID &&
        data?.vehicleMake &&
        data?.remarks
      ) {
        const UpdatedTime = new Date();
        data.vehicleMake = data?.vehicleMake?.toUpperCase();
        data.remarks = data?.remarks?.toUpperCase();
        data.updatedAt = UpdatedTime;
        if (formType === "add") {
          data.createdBy = UserId;
        } else if (formType === "edit") {
          data.updatedBy = UserId;
        }
        let SubmitType =
          formType === "edit"
            ? UpdateVehicleMake(selectedData._id, data)
            : PostVehicleMake(data);
        SubmitType.then((res) => {
          if (!res) {
            setOpenBranchDrawer(true);
          } else {
            GetActiveData();
            setOpenBranchDrawer(false);
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        ToastError("Fill all the fields");
      }
    } else if (keys === "Save&Create") {
      if (
        data?.product &&
        data?.productID &&
        data?.vehicleMake &&
        data?.remarks
      ) {
        const UpdatedTime = new Date();
        data.vehicleMake = data?.vehicleMake?.toUpperCase();
        data.remarks = data?.remarks?.toUpperCase();
        data.updatedAt = UpdatedTime;
        PostVehicleMake(data).then((res) => {
          if (res) {
            formRef.resetForm();
            setRefreshKey(refershKey + 1);
            GetActiveData();
          }
        });
      } else {
        ToastError("Fill all the fields");
      }
    }
  };

  const GetProductDetails = () => {
    GetProduct({ isAscending: true }).then((res) => {
      const FilteredData = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e?.product,
            };
          }
        })
        .filter(Boolean);
      setProductDetails(FilteredData);
    });
  };

  React.useEffect(() => {
    GetProductDetails();
  }, []);

  return (
    <>
      <div>
        <Grid container className="DrawerHeader" sx={{ padding: "10px" }}>
          <Grid item xs={6} sm={6}>
            <Typography>{title} Vehicle Make</Typography>
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
          {({ values, setFieldValue }) => (
            <Form onKeyDown={(e) => onKeyDownHandler(e, values)}>
              <div className="container pb-3">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Product"
                      value={productValue || values?.productID}
                    >
                      {formType === "edit" ? (
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          name="productId"
                          options={productDetails}
                          value={productValue}
                          onChange={(e, v) => {
                            console.log(v);
                            setFieldValue("productID", v?._id);
                            setProductValue(v?.label);
                            setFieldValue("product", v?.product);
                          }}
                          key={refershKey}
                          clearIcon={false}
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value
                          }
                        />
                      ) : (
                        <Select
                          mode="multiple"
                          dropdownStyle={{ zIndex: 11000 }}
                          className="AutoComplete_InputBox"
                          maxTagCount={"responsive"}
                          filterOption={filterOption}
                          filterSort={filterSort}
                          key={refershKey}
                          style={{ borderRadius: "0px", height: "43px" }}
                          onChange={(selectedValues) => {
                            const data = [];
                            selectedValues.map((item) => {
                              const newData = item.split(",");
                              data.push(newData.join());
                            });
                            const productData = [];
                            const productIdData = [];
                            data.map((n) => {
                              const splitData = n.split(",");
                              productData.push(splitData[0]);
                              productIdData.push(splitData[1]);
                            });
                            setFieldValue("product", productData);
                            setFieldValue("productID", productIdData);
                          }}
                        >
                          {productDetails.map((el) => (
                            <option
                              value={`${el.product},${el._id}`}
                              key={el.value}
                            >
                              {el.label}
                            </option>
                          ))}
                        </Select>
                      )}
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Vehicle Make" value={values.vehicleMake}>
                      <Field
                        name="vehicleMake"
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
                <Button
                  onClick={() => setOpenBranchDrawer(false)}
                  className="Dialog_Cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={(e) => onSubmit(e, values, "Save")}
                  className="Dialog_Save"
                >
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
    </>
  );
};

export default AddVehicleMake;
