import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostPayout, UpdatePayout } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastSuccess } from "../../../UiComponents/Toaster/Toast";

const AddPayout = (props) => {
  const { selectedData, formType, setOpenPayoutDrawer, title, GetActiveData } =
    props;
  let formRef = useRef();

  const initialValues = {
    payoutCycle: "",
    address: "",
    remarks: "",
    city: "",
    pincode: "",
  };

  const UserId = localStorage.getItem("UserId");

  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const onSubmit = (e,data,keys) => {
    if (e.key === "Enter" || keys === "Save") {
    const UpdatedTime = new Date();
    data.payoutCycle = data?.payoutCycle?.toUpperCase()
    data.remarks = data?.remarks?.toUpperCase()
    data.updatedAt = UpdatedTime;
    if (formType === "add") {
      data.createdBy = UserId;
    } else if (formType === 'edit') {
      data.updatedBy = UserId;
    }
    let SubmitType =
      formType === "edit"
        ? UpdatePayout(selectedData._id, data)
        : PostPayout(data);
    SubmitType.then((res) => {
      GetActiveData();
      ToastSuccess(res.message);
      setOpenPayoutDrawer(false);
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
            <Typography>{title} Payout</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenPayoutDrawer(false)}
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
            {({ values }) => (
              <Form>
                <Grid container rowSpacing={1}>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Payout Name" value={values.payoutCycle}>
                      <Field
                        name="payoutCycle"
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

                  <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                    <button onClick={() => setOpenPayoutDrawer(false)}>
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

export default AddPayout;
