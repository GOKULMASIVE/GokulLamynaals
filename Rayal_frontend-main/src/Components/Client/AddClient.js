import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { PostClient, UpdateClient } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastSuccess } from "../../UiComponents/Toaster/Toast";

const AddClient = (props) => {
  const { selectedData, formType, setOpenDrawer, title, GetData } = props;
  let formRef = useRef();

  const initialValues = {
    client: "",
    clientId: "",
    remarks: "",
  };

  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const onSubmit = (data) => {
    
    let SubmitType =
      formType === "edit"
        ? UpdateClient(selectedData._id, data)
        : PostClient(data);
    SubmitType.then((res) => {
      GetData();
      setOpenDrawer(false);
    }).catch((error) => {
      console.log(error);
    });
  };
  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>{title} Client</Typography>
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
            {({ values }) => (
              <Form>
                <Grid container rowSpacing={1}>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Client Name" value={values.client}>
                      <Field name="client" className="InputFiled" />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Client Id" value={values.clientId}>
                      <Field name="clientId" className="InputFiled" />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Remarks" value={values.remarks}>
                      <Field name="remarks" className="InputFiled" />
                    </FloatLabel>
                  </Grid>

                  <Grid className="DrawerFooter" item xs={12} sm={12} gap={1} >
                    <button onClick={() => setOpenDrawer(false)}>Cancel</button>
                    <button type="submit">
                      {selectedData._id ? "Update" : "Save"}
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

export default AddClient;
