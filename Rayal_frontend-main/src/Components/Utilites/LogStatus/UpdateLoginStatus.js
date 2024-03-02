
import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostBranch, UpdateBranch } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const UpdateLoginStatus = (props) => {
    const { selectedData, formType, setOpenDrawer, title, GetActiveData } =
        props;
    let formRef = useRef();

    const initialValues = {
        policyNumber: "",
        companyName: "",
        bookingCode: "",
        registrationNumber: "",
        product: "",
        policyType: "",
        LoginId: ''
    };

    const UserId = localStorage.getItem("UserId");

    const userDetails = [{
        label: 'Dummy Login Id'
    }]
    console.log(selectedData)
    useEffect(() => {
        if (formType === "edit") {
            Object.keys(initialValues).forEach((el) => {
                initialValues[el] = selectedData[el];
            });
            formRef.setFieldValue('companyName', selectedData?.companyId?.companyName)
            formRef.setFieldValue('bookingCode', selectedData?.bookingCodeId?.bookingCode)
            formRef.setFieldValue('product', selectedData?.productId?.product)
            formRef.setFieldValue('policyType', selectedData?.policyTypeId?.policyType)



        }
        formRef.setFieldValue(initialValues);
    }, []);

    const onSubmit = (e, data, keys) => {
        return true
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
                GetActiveData();
                ToastSuccess(res.message);
                setOpenDrawer(false);
            }).catch((error) => {
                console.log(error);
            });
        }
    };
    return (
        <>
            <div className="MainRenderinContainer">
                <Grid container className="DrawerHeader">
                    <Grid item xs={6} sm={6}>
                        <Typography>Update Login ID</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                        <CloseIcon
                            onClick={() => setOpenDrawer(false)}
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Policy Number" value={values.policyNumber}>
                                            <Field
                                                name="policyNumber"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Company Name" value={values.companyName}>
                                            <Field
                                                name="companyName"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled

                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Booking Code" value={values.bookingCode}>
                                            <Field
                                                name="bookingCode"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled

                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel label="Reg Number" value={values?.registrationNumber}>

                                            <Field name="registrationNumber" className="InputFiled" disabled />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FloatLabel label="Product" value={values?.product}>
                                            <Field
                                                name="product"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FloatLabel label="Policy Type" value={values?.policyType}>
                                            <Field
                                                name="policyType"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FloatLabel label="PA Cover" value={values.remarks}>
                                            <Field
                                                name="remarks"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FloatLabel
                                            label="Login Id"
                                            value={values?.LoginId}
                                        >
                                            <Autocomplete
                                                className="AutoComplete_InputBox w-100"
                                                disablePortal
                                                id="combo-box-demo"
                                                name="LoginId"
                                                options={userDetails}
                                                onChange={(e, v) => setFieldValue("LoginId", v.label)}
                                                clearIcon={false}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                                        <button onClick={() => setOpenDrawer(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" onClick={(e) => onSubmit(e, values, "Save")}>
                                            {selectedData?._id ? "Update" : "Save"}
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

export default UpdateLoginStatus;
