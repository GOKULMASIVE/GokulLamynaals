import React, { useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostCompany, UpdateCompany, GetBookingCode, UpdatePolicyList } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import moment from "moment";
import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { RemoveRedEyeIcon, DownloadIcon, CalculateIcon } from '../../../Resources/Icons/icons'
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import { PolicyFilterTypes } from "../../../Shared/CommonConstant";

const CommonPayableDrawer = (props) => {
  const { selectedData, formType, setOpenDrawer, payableType, GetData, path, editType, UserPayablePercentage , BranchPayablePercentage , ReceivablePayablePercentage} = props;
  let formRef = useRef();
  const initialValues = {
    policyNumber: '',
    companyName: '',
    bookingCode: '',
    subBookingCode: '',
    registrationNumber: '',
    product: '',
    subProduct: '',
    policyType: '',
    paCover: '',
    odPremium: '',
    tpPremium: '',
    netPremium: '',
    ODPercentage: '',
    ODAmount: '',
    TPPercentage: '',
    TPAmount: '',
    NETPercentage: '',
    NETAmount: '',
    Total: ''
  }


  const [touchedVal, setTouchedVal] = useState(false)
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [allowDirectTotal, setAllowDirectTotal] = useState(null)
  const [bookingCodeValue, setBookingCodeValue] = useState(
    formType === "edit" ? selectedData?.bookingCodeId?.bookingCode : null
  );

  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
      const modifiedBookingCodeDetails = res?.data
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
      setBookingCodeDetails(modifiedBookingCodeDetails);
    });
  };


  useEffect(() => {
    GetBookingCodeDetails()
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
      if (payableType === "userPayable") {
        formRef.setFieldValue('ODPercentage', selectedData?.userPayable?.ODPercentage || UserPayablePercentage?.OD)
        formRef.setFieldValue('TPPercentage', selectedData?.userPayable?.TPPercentage || UserPayablePercentage?.TP)
        formRef.setFieldValue('NETPercentage', selectedData?.userPayable?.NETPercentage || UserPayablePercentage?.Net)
        formRef.setFieldValue('ODAmount', selectedData?.userPayable?.ODAmount)
        formRef.setFieldValue('TPAmount', selectedData?.userPayable?.TPAmount)
        formRef.setFieldValue('NETAmount', selectedData?.userPayable?.NETAmount)
        formRef.setFieldValue('Total', selectedData?.userPayable?.Total)
      }
      else if (payableType === "branchPayable") {
        formRef.setFieldValue('ODPercentage', selectedData?.branchPayable?.ODPercentage || BranchPayablePercentage?.OD)
        formRef.setFieldValue('TPPercentage', selectedData?.branchPayable?.TPPercentage || BranchPayablePercentage?.TP)
        formRef.setFieldValue('NETPercentage', selectedData?.branchPayable?.NETPercentage || BranchPayablePercentage?.Net)
        formRef.setFieldValue('ODAmount', selectedData?.branchPayable?.ODAmount)
        formRef.setFieldValue('TPAmount', selectedData?.branchPayable?.TPAmount)
        formRef.setFieldValue('NETAmount', selectedData?.branchPayable?.NETAmount)
        formRef.setFieldValue('Total', selectedData?.branchPayable?.Total)
      }
      else {
        formRef.setFieldValue('ODPercentage', selectedData?.commisionRecievable?.ODPercentage || ReceivablePayablePercentage?.OD)
        formRef.setFieldValue('TPPercentage', selectedData?.commisionRecievable?.TPPercentage || ReceivablePayablePercentage?.TP)
        formRef.setFieldValue('NETPercentage', selectedData?.commisionRecievable?.NETPercentage || ReceivablePayablePercentage?.Net)
        formRef.setFieldValue('ODAmount', selectedData?.commisionRecievable?.ODAmount)
        formRef.setFieldValue('TPAmount', selectedData?.commisionRecievable?.TPAmount)
        formRef.setFieldValue('NETAmount', selectedData?.commisionRecievable?.NETAmount)
        formRef.setFieldValue('Total', selectedData?.commisionRecievable?.Total)
      }
      formRef.setFieldValue('companyName', selectedData?.companyId?.companyName);
      formRef.setFieldValue("bookingCodeId", selectedData?.bookingCodeId?._id);
      formRef.setFieldValue('product', selectedData?.productId?.product);
      formRef.setFieldValue('subProduct', selectedData?.subProductId?.subProduct);
      formRef.setFieldValue('subBookingCode', selectedData?.subBookingCodeId?.subBookingCode);
      formRef.setFieldValue('policyType', selectedData?.policyTypeId?.policyType);
      formRef.setFieldValue(initialValues);
    }
    else {

    }
  }, []);


  const validationSchema = Yup.object().shape({
    Total: Yup.number().min(0.1, "Total amount will be greater than zero").required("Enter Total value").typeError('Total must be a number')

  });

  const CalaculteFunction = (e) => {
    if (allowDirectTotal) {
      setTouchedVal(true)
    }
    else {
      const ODAmountValue = (e?.odPremium * e.ODPercentage) / 100
      const TPAmountValue = (e?.tpPremium * e.TPPercentage) / 100
      const NETAmountValue = (e?.netPremium * e.NETPercentage) / 100
      const TotalValue = ((ODAmountValue ? ODAmountValue : 0) + (TPAmountValue ? TPAmountValue : 0) + (NETAmountValue ? NETAmountValue : 0)).toFixed(2)
      formRef.setFieldValue('ODAmount', ODAmountValue ? ODAmountValue : 0)
      formRef.setFieldValue('TPAmount', TPAmountValue ? TPAmountValue : 0)
      formRef.setFieldValue('NETAmount', NETAmountValue ? NETAmountValue : 0)
      formRef.setFieldValue('Total', TotalValue)
      setTouchedVal(true)
    }
  }

  const UserName = localStorage.getItem('UserId')

  const onSubmit = (e) => {
    const CurrentDate = new Date()
    let sendData = {};
    if (path === "commisionReceivable") {
      sendData = {
        commisionRecievable: {
          ODPercentage: e?.ODPercentage,
          TPPercentage: e?.TPPercentage,
          NETPercentage: e?.NETPercentage,
          ODAmount: e?.ODAmount,
          TPAmount: e?.TPAmount,
          NETAmount: e?.NETAmount,
          Total: e?.Total.replace(/,/g, ""),
          createdBy: selectedData.isCommisionRecievable ? selectedData?.commisionRecievable?.createdBy : UserName,
          createdAt: selectedData.isCommisionRecievable ? selectedData?.commisionRecievable?.createdAt : CurrentDate,
          updatedBy: selectedData.isCommisionRecievable ? UserName : '',
          updatedAt: selectedData.isCommisionRecievable ? CurrentDate : CurrentDate,
          ReceivedAmount: selectedData?.commisionRecievable?.ReceivedAmount,
          PendingAmount: editType === 'Edit' ? (e?.Total) - (selectedData?.commisionRecievable?.ReceivedAmount) : e?.Total
        }, isCommisionRecievable: true, bookingCodeId: e?.bookingCodeId,
      }
    }
    else if (path === "userPayable") {
      sendData = {
        userPayable: {
          ODPercentage: e?.ODPercentage,
          TPPercentage: e?.TPPercentage,
          NETPercentage: e?.NETPercentage,
          ODAmount: e?.ODAmount,
          TPAmount: e?.TPAmount,
          NETAmount: e?.NETAmount,
          Total: e?.Total.replace(/,/g, ""),
          PendingAmount: e.Total.replace(/,/g, ""),
          createdBy: selectedData.isUserPayable ? selectedData?.userPayable?.createdBy : UserName,
          createdAt: selectedData.isUserPayable ? selectedData?.userPayable?.createdAt : CurrentDate,
          updatedBy: selectedData.isUserPayable ? UserName : '',
          updatedAt: selectedData.isUserPayable ? CurrentDate : CurrentDate
        }, isUserPayable: true, bookingCodeId: e?.bookingCodeId, status: PolicyFilterTypes[4].value,
        rejectedReason: selectedData.paymentMode === "Cheque" ? "Approved" : "Suspend"
      }
    }
    else {
      sendData = {
        branchPayable: {
          ODPercentage: e?.ODPercentage,
          TPPercentage: e?.TPPercentage,
          NETPercentage: e?.NETPercentage,
          ODAmount: e?.ODAmount,
          TPAmount: e?.TPAmount,
          NETAmount: e?.NETAmount,
          Total: e?.Total.replace(/,/g, ""),
          createdBy: selectedData.isBranchPayable ? selectedData?.branchPayable?.createdBy : UserName,
          createdAt: selectedData.isBranchPayable ? selectedData?.branchPayable?.createdAt : CurrentDate,
          updatedBy: selectedData.isBranchPayable ? UserName : '',
          updatedAt: selectedData.isBranchPayable ? CurrentDate : CurrentDate,
          PendingAmount: e.Total
        }, isBranchPayable: true, bookingCodeId: e?.bookingCodeId
      }
    }

    UpdatePolicyList(selectedData._id, sendData).then((res) => {
      setOpenDrawer(false)
      GetData()

    }).catch((err) => {
      ToastError("Something wend wrong !")
    })
  }

  const ViewPdfFunction = () => {
    const pdfUrl = selectedData?.policyFile?.downloadURL
    const pdfWindow = window.open("", "_blank");
    pdfWindow?.document?.write(
      `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
    );
  };


  return <>
    <div className="MainRenderinContainer" >

      {
        formType === 'view' ?
          <>
            <Grid container className="DrawerHeader">
              <Grid item xs={6} sm={6}>
                <Typography>View Policy</Typography>
              </Grid>
              <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                <CloseIcon
                  onClick={() => setOpenDrawer(false)}
                  sx={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
            <div className="container-fluid" style={{ padding: "20px" }}>
              <Typography className="EditPageHeadingTittle">
                Policy Files
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">New Policy</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent" onClick={() => ViewPdfFunction()} sx={{ color: 'red', cursor: 'pointer' }}>
                    {selectedData?.policyNumber} . PolicyFile
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Documents</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchId?.branchName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">User Name</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.userId?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Branch</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.userId?.name}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Typography className="EditPageHeadingTittle">
                Policy Details
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Issue Date</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {moment(selectedData?.issueDate).format("L")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Company Name</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.companyId?.companyName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Product</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.productId?.product}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Sub Product</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.subProductId?.subProduct}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Policy Type</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.policyTypeId?.policyType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">
                    Booking Code
                  </Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.bookingCodeId?.bookingCode}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">
                    Sub Booking Code
                  </Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.subBookingCodeId?.subBookingCode}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Policy Number</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.policyNumber}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Typography className="EditPageHeadingTittle">
                Customer Details
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Customer Name</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.customerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Mobile</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.mobileNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Email</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.email}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Typography className="EditPageHeadingTittle">
                Vehicle Details
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Reg Number</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.registrationNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Make model</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.makeModel}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">CC</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.cc}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Seating Capacity</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.seatingCapacity}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">GVW</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.gvw}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Typography className="EditPageHeadingTittle">
                OD Policy Date
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">User Type</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {moment(selectedData?.issueDate).format("L")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Branch</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchId?.branchName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Branch Manager</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchManager?.name}
                  </Typography>
                </Grid>
              </Grid><hr />
              <Typography className="EditPageHeadingTittle">
                TP Policy Date
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">TP Policy Start Date</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {moment(selectedData?.tpPolicyStartDate).format("L")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">TP Policy Period</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.tpPolicyPeriod}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">TP Policy End Date</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.branchManager?.name}
                  </Typography>
                </Grid>
              </Grid>
              <hr />

              <Typography className="EditPageHeadingTittle">
                Premium
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">OD Disc</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.odDisc}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">OD Premium</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.odPremium}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">TP Premium</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.tpPremium}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">NET Premium</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.netPremium}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Total Premium</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.totalPremium}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">PA Cover</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.paCover}
                  </Typography>
                </Grid>
              </Grid><hr />
              <Typography className="EditPageHeadingTittle">
                Payment Details
              </Typography>
              <Grid container rowGap={2} p={2} className="CCEntryForm">
                <Grid item xs={12} sm={4} className="d-flex">
                  <Typography className="CCHeading">Payment Mode</Typography>
                  <Typography className="CCdivider">:</Typography>
                  <Typography className="CCContent">
                    {selectedData?.paymentMode}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  className="d-flex justify-content-end"
                >
                  <button
                    onClick={() => setOpenDrawer(false)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 40px",
                    }}
                  >
                    Close
                  </button>
                </Grid>
              </Grid>

            </div></> :

          <>
            <Grid container className="DrawerHeader">
              <Grid item xs={6} sm={6}>
                <Typography>View Policy Documents</Typography>
              </Grid>
              <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                <CloseIcon
                  onClick={() => setOpenDrawer(false)}
                  sx={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
            <div className="container-fluid" >
              <Formik
                initialValues={initialValues}
                innerRef={(ref) => {
                  if (ref) {
                    formRef = ref;
                  }
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmit(values)}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} >
                        <FloatLabel label="Policy Number" value={values?.policyNumber}>
                          <Field name="policyNumber" className="InputFiled" disabled
                          // style={{position:'absolute'}}
                          />
                          <Tooltip title="view">
                            <RemoveRedEyeIcon sx={{ position: 'absolute', right: '10px', bottom: 8, color: 'gray', cursor: 'pointer' }} onClick={() => ViewPdfFunction()} />
                          </Tooltip>

                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Company Name" value={values?.companyName}>
                          <Field
                            name="companyName"
                            className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel
                          label="Booking Code"
                          value={values?.bookingCodeId}
                        >
                          <Autocomplete
                        className="AutoComplete_InputBox w-100"
                            name="bookingCodeId"
                            options={bookingCodeDetails}
                            value={bookingCodeValue}
                            onInputChange={(e, v) => setBookingCodeValue(v)}
                            onChange={(e, v) => {
                              setFieldValue("bookingCodeId", v?._id);
                              setBookingCodeValue(v?.label);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                              option.bookingCode === value
                            }
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Sub Booking Code" value={values?.subBookingCode}>
                          <Field name="subBookingCode" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Product" value={values.product}>
                          <Field name="product" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Sub Product" value={values.subProduct}>
                          <Field name="subProduct" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Reg No" value={values?.registrationNumber}>
                          <Field name="registrationNumber" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="Policy Type" value={values?.policyType}>
                          <Field name="policyType" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="PA Cover" value={values?.paCover}>
                          <Field name="paCover" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="OD Pre" value={values?.odPremium}>
                          <Field name="odPremium" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="OD Per(%)" value={values?.ODPercentage}>
                          <Field name="ODPercentage" className="InputFiled"
                            onChange={(e) => {
                              setFieldValue('ODPercentage', e.target.value)
                              setTouchedVal(false)
                              setAllowDirectTotal(false)

                            }}

                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="OD Amount" value={values?.ODAmount}>
                          <Field name="ODAmount" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="TP Pre" value={values?.tpPremium}>
                          <Field name="tpPremium" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FloatLabel label="TP Per(%)" value={values?.TPPercentage}>
                          <Field name="TPPercentage" className="InputFiled"
                            onChange={(e) => {
                              setFieldValue('TPPercentage', e.target.value)
                              setTouchedVal(false)
                              setAllowDirectTotal(false)
                            }}

                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4} >
                        <FloatLabel label="PA Amount" value={values?.TPAmount}>
                          <Field name="TPAmount" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4} >
                        <FloatLabel label="NET Pre" value={values?.netPremium}>
                          <Field name="netPremium" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4} >
                        <FloatLabel label="NET Per(%)" value={values?.NETPercentage}>
                          <Field name="NETPercentage" className="InputFiled"
                            onChange={(e) => {
                              setFieldValue('NETPercentage', e.target.value)
                              setTouchedVal(false)
                              setAllowDirectTotal(false)

                            }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={4} >
                        <FloatLabel label="NET Amount" value={values?.NETAmount}>
                          <Field name="NETAmount" className="InputFiled"
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FloatLabel label="Total" value={values?.Total}>
                          <Field name="Total" className="InputFiled"

                            onChange={(e) => {
                              setFieldValue('Total', e.target.value)
                              setTouchedVal(false)
                              setAllowDirectTotal(true)
                            }}
                          />
                        </FloatLabel>
                        <div className="errorMessage">
                          {errors.Total && touched.Total ? (
                            <div>{errors.Total}</div>
                          ) : (
                            " "
                          )}
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={4} >
                        {
                          touchedVal ? <button type="submit" className="TabelButton" style={{ border: 'none' }} >
                            Approve
                          </button> :

                            <Button className="Common_Button" endIcon={<CalculateIcon />} onClick={() => CalaculteFunction(values)}>
                              Calculate
                            </Button>
                        }
                      </Grid>
                    </Grid>
                    <Grid className="DrawerFooter" item xs={12} sm={12} gap={1} p={1} >
                      <button onClick={() => setOpenDrawer(false)} >
                        Cancel
                      </button>
                      {/* <button type="submit"  >
                        Approve
                      </button> */}
                    </Grid>
                  </Form>
                )}
              </Formik>
            </div>
          </>
      }


    </div>
  </>
}

export default CommonPayableDrawer;