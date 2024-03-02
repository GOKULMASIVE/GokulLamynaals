import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostBranch, UpdateBranch } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { FileUploader } from "react-drag-drop-files";
import Button from "@mui/material/Button";

const AddBankDrawer = (props) => {
  const { selectedBankData, formType, setOpenAddBankDrawer, title, GetActiveData, newValue } =
    props;
  let formRef = useRef();

  const initialValues = {
    bankAccountHolderName: "",
    accountNumber: "",
    bankName: "",
    bankBranch: "",
    ifscCode: "",
    micrNumber: '',
    panNumber: '',
    aadharNumber: '',
    gstNumber: '',
    tds: '',
    idProof: ''
  };
  const UserId = localStorage.getItem("UserId");

  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedBankData.values[el];
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const onSubmit = (e) => {
    setOpenAddBankDrawer(false)
    const index = selectedBankData.index
    newValue({ index, e })
  };
  return (
    <>
      <div>
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>{title} Bank Detail</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenAddBankDrawer(false)}
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
              <div className="container pb-3">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Account Holder Name" value={values.bankAccountHolderName}>
                      <Field
                        name="bankAccountHolderName"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Account Number" value={values.accountNumber}>
                      <Field
                        name="accountNumber"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Bank Name" value={values.bankName}>
                      <Field
                        name="bankName"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Bank Branch" value={values.bankBranch}>
                      <Field name="bankBranch" className="InputFiled" />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Ifsc Code" value={values.ifscCode}>
                      <Field
                        name="ifscCode"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="Micr Number" value={values.micrNumber}>
                      <Field
                        name="micrNumber"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>    <Grid item xs={12} sm={6}>
                    <FloatLabel label="Pan Number" value={values.panNumber}>
                      <Field
                        name="panNumber"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>    <Grid item xs={12} sm={6}>
                    <FloatLabel label="Adhar Number" value={values.aadharNumber}>
                      <Field
                        name="aadharNumber"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>    <Grid item xs={12} sm={6}>
                    <FloatLabel label="GST Number" value={values.gstNumber}>
                      <Field
                        name="gstNumber"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FloatLabel label="TDS Percentage" value={values.tds}>
                      <Field
                        name="tds"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={6} className="File-Upload">
                    <FileUploader
                      handleChange={(e) => setFieldValue("idProof", e)}
                      name="idProof"
                      label="Upload Your ID Proof"
                      dropMessageStyle={{
                        color: "red",
                        border: "none",
                        borderRadius: "0px",
                      }}
                    />
                  </Grid>

                  {/* <Grid className="DrawerFooter" item xs={12} sm={6} gap={1}>
                    <button onClick={() => setOpenAddBankDrawer(false)}>
                      Cancel
                    </button>
                    <button type="submit" >
                      {selectedBankData?._id ? "Update" : "Save"}
                    </button>
                  </Grid> */}
                </Grid>
              </div>
              <div className="Dialog_Footer">
                <Button onClick={() => setOpenAddBankDrawer(false)} className="Dialog_Cancel">
                  Cancel
                </Button>
                <Button sx={{ display: formType === 'add' ? 'block' : 'none' }} className="Dialog_Save_Exit" onClick={(e) => onSubmit(e, values, "Save&Create")}>
                  Add New Bank
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddBankDrawer;
