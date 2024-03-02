import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostFuelType, UpdateFuelType, GetMasterCompany, PaidWallet, ReceivedWallet, GetBookingCode, GetSubBookingCode } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

const ReceivedTransaction = (props) => {
    const UserId = localStorage.getItem("UserId");

    const { selectedData, GetData, setOpenPaidTransaction, GetUserWalletDetails, PaidUserName, functionType } =
        props;
    let formRef = useRef();

    const initialValues = {
        walletCompanyId: "",
        amount: '',
        TDS: '',
        transactionDate: new Date(),
        bookingCodeId:"",
        subBookingCodeId:"",
        TDSamount:'',
        TransferAmount:''
    };

    const [companyDetails, setCompanyDetails] = useState([])


    const [withTDS, setWithTDS] = useState(false)


    const onSubmit = (e) => {
        e.isCommisionRecievable = true
        const RandomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
        e.userId = selectedData.userId
        e.policyNumber = RandomNumber.toString()
        e.status = "WALLET"
        e.withTDS = false
        e.bookingCodeId = selectedData?.bookingCodeId
        e.subBookingCodeId = selectedData?.subBookingCodeId
        // e.paymentMode = functionType === "Paid" ? "PAID" : "RECEIVED"
        e.createdBy = UserId
        ReceivedWallet(e).then((res) => {
            console.log(res)
            GetData()
            GetUserWalletDetails()
            setOpenPaidTransaction(false)
        }).catch((err) => { console.log(err) })
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



    React.useEffect(() => {
        GetCompanyDetails()
     
    }, [])

    return (
        <>
            <div className="MainRenderinContainer">
                <Grid container className="DrawerHeader">
                    <Grid item xs={6} sm={11}>
                        <Typography>Received to {selectedData?.bookingCode} - {selectedData?.subBookingCode}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={1} className="d-flex justify-content-end">
                        <CloseIcon
                            onClick={() => setOpenPaidTransaction(false)}
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
                                <Grid container rowSpacing={1}>
                                    <Grid item xs={12} sm={12} sx={{ display: functionType === 'Paid' ? 'block' : 'none' }}>
                                        <Button onClick={() => setWithTDS(true)} style={{ background: withTDS ? 'green' : 'gray', padding: '4px 10px', color: 'white' }} sx={{borderRadius:'0px'}}>With TDS</Button>
                                        <Button onClick={() => setWithTDS(false)} style={{ background: withTDS ? 'gray' : 'green', padding: '4px 10px', color: 'white' }} sx={{borderRadius:'0px'}}>Without TDS</Button>
                                    </Grid>
                                    <Grid item xs={12} sm={12} mt={2} >
                                        <FloatLabel label="Transaction Date" value="React">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="transactionDate"
                                                    className="w-100"
                                                    format="DD/MM/YYYY"
                                                    onChange={(e)=>setFieldValue('transactionDate',e.$d)}
                                                    defaultValue={dayjs()}
                                                />
                                            </LocalizationProvider>
                                        </FloatLabel>
                                    </Grid>
                                
                                    <Grid item xs={12} sm={12} >
                                        <FloatLabel label="Bank" value={values.bank}>
                                            <Field
                                                name="bank"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                 
                                    <Grid item xs={12} sm={12}>
                                        <FloatLabel label="Remarks" value={values.remarks}>
                                            <Field
                                                name="remarks"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FloatLabel label="Select Company" value={values?.walletCompanyId}>
                                            <Autocomplete
                                                name="walletCompanyId"
                                                disablePortal
                                                id="combo-box-demo"
                                                onChange={(e, v) => setFieldValue('walletCompanyId', v?._id)}
                                                options={companyDetails}
                                                clearIcon={false}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </FloatLabel>
                                    </Grid>
                              
                                    <Grid item xs={12} sm={12}>
                                        <FloatLabel label="Amount" value={values.amount}>
                                            <TextField
                                                name="amount"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                onChange={(e) => {
                                                    setFieldValue('amount', e.target.value)
                                                    setFieldValue('amount', e.target.value)
                                                }}
                                            />
                                        </FloatLabel>
                                    </Grid>

                                    <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                                        <button onClick={() => setOpenPaidTransaction(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit">
                                            Confirm
                                        </button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default ReceivedTransaction;
