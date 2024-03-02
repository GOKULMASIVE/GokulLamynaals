import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { UpdatePolicyReportData } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const EditPaidAndReceived = (props) => {
    const { selectedData, formType, setOpenDrawer, GetTableData, isPaid, PaidFunction, ReceivedFunction } =
        props;

    let formRef = useRef();

    const initialValues = {
        amount: "",
    };
    const TransferOption = [
        { label: "Paid", value: "PAID" },
        { label: "Received", value: "RECEIVED" },
    ];
    const [selectTransferOption, setSelectTransferOption] = React.useState("PAID")


    useEffect(() => {
        if (formType === "edit") {
            Object.keys(initialValues).forEach((el) => {
                initialValues[el] = selectedData[el];
            });
        }
        formRef.setFieldValue(initialValues);
    }, []);


    const onSubmit = (values) => {
        const data = {
            userPayable: {
                Total: values.amount,
            },
            paymentMode: selectTransferOption,
        }
        UpdatePolicyReportData(selectedData._id, data).then((res) => {
            setOpenDrawer(false)
            isPaid ? PaidFunction() : ReceivedFunction()
        })
    };

    return (
        <>
            <div >
                <Grid container className="DrawerHeader">
                    <Grid item xs={6} sm={6}>
                        <Typography>Edit Payment Paid and Received</Typography>
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
                        <Form >
                            <div className="container pb-3">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Amount" value={values.amount}>
                                            <Field
                                                name="amount"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Transfer Option" value={selectTransferOption}>
                                            <Autocomplete
                                                className="AutoComplete_InputBox"
                                                id="combo-box-demo"
                                                options={TransferOption}
                                                defaultValue={TransferOption.find((el) =>el.value === selectedData?.payment)}//changes by gokul
                                                onChange={(e, value) => {
                                                setSelectTransferOption(value.value)}}
                                                renderInput={(params) => <TextField {...params} />}
                                                isOptionEqualToValue={(option, value) =>
                                                    option.value === value.value
                                                }
                                                clearIcon={false}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="Dialog_Footer">
                                <Button onClick={() => setOpenDrawer(false)} className="Dialog_Cancel">
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={(e) => onSubmit(e, values, "Save")} className="Dialog_Save">
                                    {selectTransferOption === 'PAID' ? 'Pay' : 'Receive'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default EditPaidAndReceived;
