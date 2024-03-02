import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import {
  PostFuelType,
  GetBankDetailsByUserId,
  GetMasterCompany,
  PaidWallet,
} from "../../Service/_index";
import { ToastSuccess } from "../../UiComponents/Toaster/Toast";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { Paper } from "@mui/material";
import {
  CloseIcon,
  DeleteIcon,
  CloudOffIcon,
  EditIcon,
} from "../../Resources/Icons/icons";

const PaidTransaction = (props) => {
  const UserId = localStorage.getItem("UserId");

  const {
    selectedData,
    GetData,
    setOpenPaidTransaction,
    GetUserWalletDetails,
    PaidUserName,
    functionType,
    setDrawerWidth,
  } = props;
  let formRef = useRef();

  const initialValues = {
    walletCompanyId: "",
    amount: "",
    TDS: "",
    transactionDate: new Date(),
    TDSamount: "",
    TransferAmount: "",
    accountNumber: "",
    bankName: "",
    panNumber: "",
  };

  const [companyDetails, setCompanyDetails] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [withTDS, setWithTDS] = useState(false);
  const [amountVal, setAmountVal] = useState(null);
  const [tdsAmount, setTdsAmount] = useState(null);
  const [showBankDetail, setShowBankDetail] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const onSubmit = (e) => {
    e.isUserPayable = true;
    const RandomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    e.userId = selectedData.userId;
    e.policyNumber = RandomNumber.toString();
    e.paymentMode = functionType === "Paid" ? "PAID" : "RECEIVED";
    e.createdBy = UserId;
    e.withTDS = withTDS; //Changes by Arun
    PaidWallet(e)
      .then((res) => {
        GetData();
        GetUserWalletDetails();
        setOpenPaidTransaction(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetCompanyDetails = () => {
    GetMasterCompany().then((res) => {
      const modifiedCompanyDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.masterCompanyName,
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

  const GetBankDetails = () => {
    GetBankDetailsByUserId(selectedData?.userId).then((res) => {
      const ModifiedData = res.data.bankDetails.map((e) => {
        return {
          ...e,
          label: e.bankAccountHolderName,
        };
      });
      setBankDetails(ModifiedData);
    });
  };
  React.useEffect(() => {
    GetCompanyDetails();
    GetBankDetails();
  }, []);

  const AccountHandleFunction = (v) => {
    formRef.setFieldValue("accountNumber", v?.accountNumber);
    formRef.setFieldValue("bankName", v?.bankName);
    formRef.setFieldValue("panNumber", v?.panNumber);
    formRef.setFieldValue("TDS", v?.tds);
    setTdsAmount(v?.tds);
    setSelectedBank(v);
    console.log(v);
  };

  const AmountCalculateFunction = (key, val) => {
    setAmountVal(val);
    const TDSamount = (val / 100) * tdsAmount;
    if (tdsAmount) {
      formRef.setFieldValue("TDSamount", TDSamount);
    } else {
      formRef.setFieldValue("TDSamount", val);
    }
    formRef.setFieldValue("TransferAmount", val - TDSamount);
  };

  const TDSCalculateFunction = (key, val) => {
    setTdsAmount(val);
    const TDSamount = (amountVal / 100) * val;
    if (amountVal) {
      formRef.setFieldValue("TDSamount", TDSamount);
    } else {
      formRef.setFieldValue("TDSamount", 0);
    }
    formRef.setFieldValue("TransferAmount", amountVal - TDSamount);
  };

  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader" sx={{ padding: '10px' }}>
          <Grid item xs={10} sm={10}>
            <Typography>
              {functionType} to {PaidUserName}
            </Typography>
          </Grid>
          <Grid item xs={2} sm={2} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => {
                setDrawerWidth("25%");
                setShowBankDetail(false);
                setOpenPaidTransaction(false);
              }}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid">
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
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{
                          display: functionType === "Paid" ? "flex" : "none",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          {" "}
                          <Button
                            onClick={() => setWithTDS(true)}
                            style={{
                              background: withTDS ? "green" : "gray",
                              padding: "4px 10px",
                              color: "white",
                            }}
                            sx={{ borderRadius: "0px" }}
                          >
                            With TDS
                          </Button>
                          <Button
                            onClick={() => setWithTDS(false)}
                            style={{
                              background: withTDS ? "gray" : "green",
                              padding: "4px 10px",
                              color: "white",
                            }}
                            sx={{ borderRadius: "0px" }}
                          >
                            Without TDS
                          </Button>
                        </div>
                        <Button
                          onClick={() => {
                            setDrawerWidth(showBankDetail ? "25%" : "60%");
                            setShowBankDetail(!showBankDetail);
                          }}
                          style={{
                            background: showBankDetail ? "green" : "gray",
                            padding: "4px 10px",
                            color: "white",
                          }}
                          sx={{
                            borderRadius: "0px",
                            display: selectedBank ? "block" : "none",
                          }}
                        >
                          Bank Details
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={showBankDetail ? 4 : 12} mt={2}>
                        <FloatLabel label="Transaction Date" value="React">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              name="transactionDate"
                              className="Date_Picker w-100"
                              format="DD/MM/YYYY"
                              onChange={(e) =>
                                setFieldValue("transactionDate", e.$d)
                              }
                              defaultValue={dayjs()}
                            />
                          </LocalizationProvider>
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        mt={showBankDetail ? 2 : 0}
                        sx={{ display: withTDS ? "block" : "none" }}
                      >
                        <FloatLabel
                          label="Account Holder"
                          value={values.accountNumber}
                        >
                          <Autocomplete
                            className="AutoComplete_InputBox w-100"
                            name="accountNumber"
                            disablePortal
                            id="combo-box-demo"
                            onChange={(e, v) => AccountHandleFunction(v)}
                            options={bankDetails}
                            clearIcon={false}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                              option.accountNumber === value.accountNumber
                            }
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        sx={{
                          display:
                            withTDS || functionType === "Received"
                              ? "block"
                              : "none",
                        }}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="Bank" value={values.bankName}>
                          <Field
                            name="bankName"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        sx={{ display: withTDS ? "block" : "none" }}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="Pan Number" value={values.panNumber}>
                          <Field
                            name="panNumber"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="remark" value={values.remark}>
                          <Field
                            name="remark"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel
                          label="Select Company"
                          value={values?.walletCompanyId}
                        >
                          <Autocomplete
                            className="AutoComplete_InputBox w-100"
                            name="walletCompanyId"
                            disablePortal
                            id="combo-box-demo"
                            onChange={(e, v) =>
                              setFieldValue("walletCompanyId", v?._id)
                            }
                            options={companyDetails}
                            clearIcon={false}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="Amount" value={values.amount}>
                          <TextField
                            name="amount"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                            onChange={(e) => {
                              AmountCalculateFunction("Amount", e.target.value);
                              setFieldValue("amount", e.target.value);
                            }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        sx={{ display: withTDS ? "block" : "none" }}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="TDS" value={values.TDS}>
                          <TextField
                            name="TDS"
                            className="InputFiled"
                            value={values.TDS}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e) => {
                              TDSCalculateFunction("TDS", e.target.value);
                              setFieldValue("TDS", e.target.value);
                            }}
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        sx={{ display: withTDS ? "block" : "none" }}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel label="TDS Amount" value={values.TDSamount}>
                          <Field
                            name="TDSamount"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                            disabled
                          />
                        </FloatLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={showBankDetail ? 4 : 12}
                        sx={{ display: withTDS ? "block" : "none" }}
                        mt={showBankDetail ? 2 : 0}
                      >
                        <FloatLabel
                          label="Transfer Amount"
                          value={values.TransferAmount}
                        >
                          <Field
                            name="TransferAmount"
                            className="InputFiled"
                            style={{ textTransform: "uppercase" }}
                            disabled
                          />
                        </FloatLabel>
                      </Grid>

                      <Grid
                        className="DrawerFooter"
                        item
                        xs={12}
                        sm={12}
                        gap={1}
                      >
                        <button
                          onClick={() => {
                            setDrawerWidth("25%");
                            setShowBankDetail(false);
                            setOpenPaidTransaction(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit">Confirm</button>
                      </Grid>
                    </Grid>
                  </Grid>
                  {showBankDetail ? (
                    <Grid item xs={12} sm={12} mt={5}>
                      <hr />
                      <Typography>
                        Bank Details of {selectedBank?.bankAccountHolderName}
                      </Typography>
                      <Grid
                        container
                        mt={3}
                        sx={{ width: "100%" }}
                        rowSpacing={3}
                      >
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Name{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.bankAccountHolderName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Bank Name{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.bankName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Account Number{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.accountNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Bank Branch{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.bankBranch}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            GST Number{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.gstNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Pan Number{" "}
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.panNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Ifsc Code
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.ifscCode}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "400",
                              width: "40%",
                            }}
                          >
                            Micr Number
                          </Typography>
                          <Typography sx={{ width: "20%" }}>:</Typography>
                          <Typography
                            sx={{
                              fontSize: "19px",
                              color: "gray",
                              width: "40%",
                            }}
                          >
                            {selectedBank?.micrNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default PaidTransaction;
