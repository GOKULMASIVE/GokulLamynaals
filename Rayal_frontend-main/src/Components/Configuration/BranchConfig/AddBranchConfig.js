import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  PostUserConfig,
  GetCompany,
  GetUser,
  GetProduct,
  GetPolicyType,
  GetSubBookingCode,
  GetSubProduct,
  GetRTOLocationByCompanyID,
  PostBranchConfig,
  UpdateBranchConfig,
  GetVehicleMake,
} from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Select, Space } from "antd";
import { filterOption, filterSort } from "../../../Shared/CommonConstant";
import Button from "@mui/material/Button";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
const AddBranchConfig = (props) => {
  const {
    selectedData,
    formType,
    setOpenDrawer,
    ActiveFunction,
    GetActiveData,
    selectedUser,
  } = props;
  let formRef = useRef();

  const initialValues = {
    companyId: "",
    bookingCodeId: "",
    productId: "",
    subProductId: "",
    bookingCode: "",
    product: "",
    policyTypeId: "",
    subBookingCodeId: "",
    branchManagerId: "",
    PACover: "",
    CC: "",
    GVW: "",
    OD: "",
    TP: "",
    Net: "",
    locationId: "",
    make: "",
    year: "ALL",
    ccfrom: "",
    ccto: "",
    gvwfrom: "",
    gvwto: "",
    yearfrom: "",
    yearto: "",
  };

  const UserName = localStorage.getItem("UserId");
  const [companyDetails, setCompanyDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [subProductDetails, setSubProductDetails] = useState([]);
  const [policyTypeDetails, setPolicyTypeDetails] = useState([]);
  const [branchManagerDetails, setBranchManagerDetails] = useState([]);
  const [locationDetails, setLocationDetails] = useState([]);
  const [resetValue, setResetValue] = useState(1);
  const [makeDetails, setMakeDetails] = useState([]);

  const [defaultLocationDetails, setDefaultLocationDetails] = useState(
    formType === "edit" ? selectedData?.locationId : []
  );
  const [bookingCodeValue, setBookingCodeValue] = useState(
    formType === "edit"
      ? selectedData?.bookingCode?.value +
      " - " +
      selectedData?.subBookingCode?.value
      : null
  );
  const [productValue, setProductValue] = useState(
    formType === "edit"
      ? selectedData?.product?.value + " - " + selectedData?.subProduct?.value
      : null
  );
  const [makeValue, setMakeValue] = useState(
    formType === "edit" ? selectedData?.make : null
  );
  const [userValue, setUserValue] = useState(
    formType === "edit" ? selectedData?.user?.value : null
  );

  const [policyTypeValue, setPolicyTypeValue] = useState(
    formType === "edit" ? selectedData?.policyType?.value : null
  );
  const [companyValue, setCompanyValue] = useState(
    formType === "edit" ? selectedData?.company?.value : null
  );
  const [paCoverValue, setPaCoverValue] = useState(
    formType === "edit" ? selectedData?.PACover : null
  );

  const [ccValue, setCcValue] = useState(
    selectedData.CC === "ALL" ? "ALL" : formType === "add" ? "" : "Range"
  );
  const [gvwValue, setGvwValue] = useState(
    selectedData.GVW === "ALL" ? "ALL" : formType === "add" ? "" : "Range"
  );
  const [yearValue, setYearValue] = useState(
    selectedData.year === "ALL" ? "ALL" : formType === "add" ? "" : "Range"
  );
  const [openCcRangeBox, setOpenCcRangeBox] = useState(
    selectedData.CC === "ALL" ? false : formType === "add" ? false : true
  );
  const [openGvwRangeBox, setOpenGvwRangeBox] = useState(
    selectedData.GVW === "ALL" ? false : formType === "add" ? false : true
  );
  const [openYearRangeBox, setOpenYearRangeBox] = useState(
    selectedData.year === "ALL" ? false : formType === "add" ? false : true
  );

  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
      console.log(selectedData);
      formRef.setFieldValue("filterId", selectedData?._id);
      formRef.setFieldValue("companyId", selectedData?.company?.id);
      formRef.setFieldValue("bookingCodeId", selectedData?.bookingCode?.id);
      formRef.setFieldValue("policyTypeId", selectedData?.policyType?.id);
      formRef.setFieldValue("productId", selectedData?.product?.id);
      formRef.setFieldValue("make", selectedData?.make);
      formRef.setFieldValue("branchManagerId", selectedData?.user?.id);
      formRef.setFieldValue(
        "subBookingCodeId",
        selectedData?.subBookingCode?.id
      );
      formRef.setFieldValue("subProductId", selectedData?.subProduct?.id);
      if (selectedData?.CC !== "ALL") {
        const ccRangeValues = selectedData?.CC?.split(" TO ");
        formRef.setFieldValue("ccfrom", ccRangeValues[0]);
        formRef.setFieldValue("ccto", ccRangeValues[1]);
      }
      if (selectedData?.GVW !== "ALL") {
        const gvwRangeValues = selectedData?.GVW?.split(" TO ");
        formRef.setFieldValue("gvwfrom", gvwRangeValues[0]);
        formRef.setFieldValue("gvwto", gvwRangeValues[1]);
      }
      if (selectedData?.year !== "ALL") {
        const yearRangeValues = selectedData?.year?.split(" TO ");
        formRef.setFieldValue("yearfrom", yearRangeValues[0]);
        formRef.setFieldValue("yearto", yearRangeValues[1]);
      }
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const paCoverDetails = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];
  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const modifiedCompanyDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.shortName,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setCompanyDetails(modifiedCompanyDetails);
    });
  };

  const GetBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: "combineData" }).then((res) => {
      const modifiedBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.bookingCode + " - " + e.subBookingCode,
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

  const GetProductDetails = () => {
    GetSubProduct({ isAscending: "combineData" }).then((res) => {
      const modifiedProductDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.product + " - " + e.subProduct,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      // console.log(modifiedProductDetails);
      setProductDetails(modifiedProductDetails);
    });
  };

  // vehicleMake added by gokul..
  const [productID, setProductID] = useState([]);
  const GetVehicleMakeDetails = () => {
    GetVehicleMake({ isAscending: true }).then((res) => {
      const modifiedVehicleMakeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.vehicleMake,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      const filterData = modifiedVehicleMakeDetails.filter((item) => productID.includes(item.productID)

      );
      // console.log(filterData);
      setMakeDetails(filterData);
    });
  };

  useEffect(() => GetVehicleMakeDetails(), [productID]);

  const GetPolicyTypeDetails = () => {
    GetPolicyType({ isAscending: true }).then((res) => {
      const modifiedPolicyTypeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.policyType,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setPolicyTypeDetails(modifiedPolicyTypeDetails);
    });
  };

  const GetRtoLocationFunction = (id) => {
    GetRTOLocationByCompanyID(id).then((res) => {
      setLocationDetails(res?.data?.location);
    });
  };
  const GetUserDetails = () => {
    GetUser({ isAscending: true }).then((res) => {
      const modifiedUser = res?.data?.map((e) => {
        return {
          ...e,
          label: e.name,
          value: e._id,
        };
      });
      const FilterUserType = modifiedUser?.filter((item) =>
        item.userType.includes("branchManager") && item.isEnabled
      );
      setBranchManagerDetails(FilterUserType);
    });
  };
  useEffect(() => {
    GetCompanyDetails();
    GetBookingCodeDetails();
    GetProductDetails();
    GetPolicyTypeDetails();
    GetUserDetails();
  }, []);

  const onSubmit = (e) => {
    // console.log(e);
    e.createdBy = UserName;
    if (openCcRangeBox) {
      if (e.ccfrom && e.ccto) {
        e.CC = String(e.ccfrom + " to " + e.ccto);
      } else {
        ToastError("Enter CC range values");
      }
    } else {
      e.CC = "ALL";
    }
    if (openGvwRangeBox) {
      if (e.gvwfrom && e.gvwto) {
        e.GVW = String(e.gvwfrom + " to " + e.gvwto);
      } else {
        ToastError("Enter GVW range values");
      }
    } else {
      e.GVW = "ALL";
    }
    if (openYearRangeBox) {
      if (e.yearfrom && e.yearto) {
        e.year = String(e.yearfrom + " to " + e.yearto);
      } else {
        ToastError("Enter Year range values");
      }
    } else {
      e.year = "ALL";
    }
    if (e.CC && e.GVW && e.year) {
      if (
        e.branchManagerId &&
        e.policyTypeId &&
        e.companyId &&
        e.bookingCodeId &&
        e.productId &&
        e.PACover &&
        e.make &&
        e.CC &&
        e.GVW &&
        e.year
      ) {
        const ApiType =
          formType === "edit" ? UpdateBranchConfig(e) : PostBranchConfig(e);
        ApiType.then((res) => {
          ActiveFunction();
          setOpenDrawer(false);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        ToastError("Enter All fields");
      }
    }
  };

  const { Option } = Select;
  return (
    <>
      <div>
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>Add Branch Configuration</Typography>
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
            <Form>
              <div className="container-fluid pb-3">
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <FloatLabel
                      label="Branch Manager"
                      value={values?.branchManagerId || userValue}
                    >
                      {formType === "edit" ? (
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          name="branchManagerId"
                          options={branchManagerDetails}
                          value={userValue}
                          onInputChange={(e, v) => setUserValue(v)}
                          onChange={(e, v) => {
                            setFieldValue("branchManagerId", v?._id);
                            setUserValue(v?.label);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option?.label === value
                          }
                        />
                      ) : (
                        <Select
                          mode="multiple"
                          className="AutoComplete_InputBox"
                          style={{ borderRadius: "0px", height: "43px" }}
                          maxTagCount="responsive"
                          filterOption={filterOption}
                          filterSort={filterSort}
                          onChange={(selectedValues) => {
                            setFieldValue("branchManagerId", selectedValues);
                          }}
                          dropdownStyle={{ zIndex: 11000 }}
                        >
                          {branchManagerDetails.map((el) => (
                            <Option value={el._id} key={el.value}>
                              {el.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Policy Type"
                      value={values?.policyTypeId}
                    >
                      {formType === "edit" ? (
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          name="policyTypeId"
                          options={policyTypeDetails}
                          value={policyTypeValue}
                          onInputChange={(e, v) => setPolicyTypeValue(v)}
                          onChange={(e, v) => {
                            setFieldValue("policyTypeId", v?._id);
                            setPolicyTypeValue(v?.label);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          isOptionEqualToValue={(option, value) =>
                            option?.label === value
                          }
                        />
                      ) : (
                        <Select
                          mode="multiple"
                          dropdownStyle={{ zIndex: 11000 }}
                          className="AutoComplete_InputBox"
                          style={{ borderRadius: "0px", height: "43px" }}
                          maxTagCount="responsive"
                          filterOption={filterOption}
                          filterSort={filterSort}
                          onChange={(selectedValues) => {
                            setFieldValue("policyTypeId", selectedValues);
                          }}
                        >
                          {policyTypeDetails.map((el) => (
                            <Option value={el._id} key={el.value}>
                              {el.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Company"
                      value={values?.companyId}
                    >
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        name="companyId"
                        options={companyDetails}
                        value={companyValue}
                        onChange={(e, v) => {
                          setFieldValue("companyId", v?._id);
                          setResetValue(resetValue + 1);
                          setFieldValue("locationId", null);
                          setDefaultLocationDetails([]);
                          setCompanyValue(v?.label);
                          GetRtoLocationFunction(v?._id);
                        }}
                        onInputChange={(e, v) => {
                          GetRtoLocationFunction(selectedData?.company?.id);
                        }}
                        clearIcon={false}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option.label === value
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Location" value={values.locationId}>
                      <Select
                        mode="multiple"
                        className="AutoComplete_InputBox"
                        style={{ borderRadius: "0px", height: "43px" }}
                        maxTagCount="responsive"
                        filterOption={filterOption}
                        filterSort={filterSort}
                        onChange={(selectedValues) => {
                          setFieldValue("locationId", selectedValues);
                        }}
                        defaultValue={defaultLocationDetails}
                        dropdownStyle={{ zIndex: 11000 }}
                        key={resetValue}
                      >
                        {locationDetails?.map((el) => (
                          <Option value={el.id} key={el.id}>
                            {el.value}
                          </Option>
                        ))}
                      </Select>
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Booking Code & Sub Booking Code"
                      value={values?.bookingCodeId || bookingCodeValue}
                    >
                      {formType === "edit" ? (
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          name="companyId"
                          options={bookingCodeDetails}
                          value={bookingCodeValue}
                          onChange={(e, v) => {
                            setFieldValue("bookingCodeId", v?.bookingCodeId);
                            setFieldValue("subBookingCodeId", v?._id);
                            setBookingCodeValue(v?.label);
                          }}
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
                          style={{ borderRadius: "0px", height: "43px" }}
                          maxTagCount="responsive"
                          filterOption={filterOption}
                          filterSort={filterSort}
                          onChange={(selectedValues) => {
                            try {
                              const parsedObjects = selectedValues.map(
                                (value) => JSON.parse(value)
                              );
                              const bookingCodeValues = parsedObjects.map(
                                (el) => ({
                                  bookingCodeId:
                                    el.bookingCodeId !== undefined
                                      ? el.bookingCodeId
                                      : "",
                                  subBookingCodeId:
                                    el._id !== undefined ? el._id : "",
                                })
                              );
                              setFieldValue(
                                "bookingCodeId",
                                bookingCodeValues.map(
                                  (obj) => obj.bookingCodeId
                                )
                              );
                              setFieldValue(
                                "subBookingCodeId",
                                bookingCodeValues.map(
                                  (obj) => obj.subBookingCodeId
                                )
                              );
                              setFieldValue("bookingCode", bookingCodeValues);
                            } catch (error) {
                              console.error("Error parsing JSON:", error);
                            }
                          }}
                        >
                          {bookingCodeDetails.map((el) => (
                            <Option value={JSON.stringify(el)} key={el.value}>
                              {el.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel
                      label="Select Product & Sub Product"
                      value={values?.productId || productValue}
                    >
                      {formType === "edit" ? (
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          name="productId"
                          options={productDetails}
                          value={productValue}
                          onChange={(e, v) => {
                            setFieldValue("productId", v?.productID);
                            setFieldValue("subProductId", v?._id);
                            setProductValue(v?.label);
                            setProductID(v?.productID);
                            // console.log(v);
                          }}
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
                          style={{ borderRadius: "0px", height: "43px" }}
                          maxTagCount="responsive"
                          filterOption={filterOption}
                          filterSort={filterSort}
                          onChange={(selectedValues) => {
                            try {
                              const parsedObjects = selectedValues.map(
                                (value) => JSON.parse(value)
                              );
                              const productValues = parsedObjects.map((el) => ({
                                productId:
                                  el.productID !== undefined
                                    ? el.productID
                                    : "",
                                subProductId:
                                  el._id !== undefined ? el._id : "",
                              }));
                              console.log(productValues);
                              setFieldValue(
                                "productId",
                                productValues.map((obj) => obj.productId)
                              );
                              setProductID(
                                productValues.map((obj) => obj.productId)
                              );
                              setFieldValue(
                                "subProductId",
                                productValues.map((obj) => obj.subProductId)
                              );
                              setFieldValue("product", productValues);
                            } catch (error) {
                              console.error("Error parsing JSON:", error);
                            }
                          }}
                        >
                          {productDetails.map((el) => (
                            <Option value={JSON.stringify(el)} key={el.value}>
                              {el.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={openCcRangeBox ? 2 : 6}>
                    <FloatLabel label="CC" value={ccValue}>
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        name="CC"
                        value={ccValue}
                        options={[{ label: "ALL" }, { label: "Range" }]}
                        clearIcon={false}
                        onChange={(e, v) => {
                          if (v?.label === "ALL") {
                            setCcValue(v.label);
                            setOpenCcRangeBox(false);
                            setFieldValue("ccfrom", "");
                            setFieldValue("ccto", "");
                          } else {
                            setCcValue(v.label);
                            setOpenCcRangeBox(true);
                          }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?.label === value?.label
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openCcRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="CC from" value={values.ccfrom}>
                      <Field
                        name="ccfrom"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openCcRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="CC to" value={values.ccto}>
                      <Field
                        name="ccto"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={openGvwRangeBox ? 2 : 6}>
                    <FloatLabel label="GVW" value={gvwValue}>
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        name="GVW"
                        value={gvwValue}
                        options={[{ label: "ALL" }, { label: "Range" }]}
                        clearIcon={false}
                        onChange={(e, v) => {
                          if (v?.label === "ALL") {
                            setGvwValue(v.label);
                            setOpenGvwRangeBox(false);
                            setFieldValue("gvwfrom", "");
                            setFieldValue("gvwto", "");
                          } else {
                            setGvwValue(v.label);
                            setOpenGvwRangeBox(true);
                          }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?.label === value?.label
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openGvwRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="Gvw from" value={values.gvwfrom}>
                      <Field
                        name="gvwfrom"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openGvwRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="Gvw to" value={values.gvwto}>
                      <Field
                        name="gvwto"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="PA Cover" value={values?.PACover}>
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        name="PACover"
                        options={paCoverDetails}
                        value={paCoverValue}
                        onChange={(e, v) => {
                          setFieldValue("PACover", v?.value);
                          setPaCoverValue(v?.label);
                        }}
                        clearIcon={false}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option.label === value
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Make" value={values.make}>
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        name="make"
                        options={makeDetails}
                        value={makeValue}
                        onInputChange={(e, v) => setMakeValue(v)}
                        onChange={(e, v) => {
                          setFieldValue("make", v?.label);
                          setMakeValue(v?.label);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?.label === value
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={openYearRangeBox ? 2 : 6}>
                    <FloatLabel label="Year" value={yearValue}>
                      <Autocomplete
                        className="AutoComplete_InputBox"
                        value={yearValue}
                        options={[{ label: "ALL" }, { label: "Range" }]}
                        clearIcon={false}
                        onChange={(e, v) => {
                          if (v?.label === "ALL") {
                            setYearValue(v.label);
                            setOpenYearRangeBox(false);
                            setFieldValue("yearfrom", "");
                            setFieldValue("yearto", "");
                          } else {
                            setYearValue(v.label);
                            setOpenYearRangeBox(true);
                          }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?.label === value?.label
                        }
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openYearRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="Year from" value={values.yearfrom}>
                      <Field
                        type="number"
                        name="yearfrom"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: openYearRangeBox ? "block" : "none" }}
                  >
                    <FloatLabel label="year to" value={values.yearto}>
                      <Field
                        type="number"
                        name="yearto"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="OD %" value={values.OD}>
                      <Field
                        name="OD"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="TP %" value={values.TP}>
                      <Field name="TP" className="InputFiled" />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="NET %" value={values.Net}>
                      <Field
                        name="Net"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
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
                <Button type="submit" className="Dialog_Save">
                  {selectedData?._id ? "Update" : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddBranchConfig;
