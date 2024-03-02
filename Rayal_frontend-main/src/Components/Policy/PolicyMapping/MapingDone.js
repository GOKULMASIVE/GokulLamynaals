import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { GetFileFromAWSS3BucketByKey, UpdatePolicyMapping } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { ToastError } from "../../../UiComponents/Toaster/Toast";

const MappingDone = (props) => {
  const { setOpenMapingDonedrawer, selectedData , GetData} =
    props;



  const UserId = localStorage.getItem("UserId");
  const [remarks, setRemarks] = useState()
  const fontSize = "18px"
  const ViewPdfFunction = (e) => {
    if (!e) {
      ToastError("No file Detected");
    } else {
      GetFileFromAWSS3BucketByKey(e)
        .then((res) => res.data.fileData)
        .then((data) => {
          const fileExtension = e.split('.').pop(); // Get file extension
          const fileWindow = window.open("", "_blank");
          if (fileExtension.toLowerCase() === 'pdf') {
            // Display PDF using embed tag
            fileWindow?.document?.write(
              `<embed src="data:application/pdf;base64,${data}" width="100%" height="100%" />`
            );
          } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension.toLowerCase())) {
            // Display image using img tag
            fileWindow?.document?.write(
              `<embed src="data:image/${fileExtension.toLowerCase()};base64,${data}"/>`
            );
          } else {
            // Handle other file types
            ToastError("Unsupported file type");
            fileWindow?.close();
          }
        })
        .catch((err) => ToastError("Something went wrong"));
    }
  };
  const UpdatePolicyMappingFunction = (key) => {
    const data = {
      action: key,
      policyId: selectedData?._id,
      remark: remarks
    }
    UpdatePolicyMapping(data).then((res) => {
      setOpenMapingDonedrawer(false)
      GetData()
    })
  }
  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>Policy Mapping details</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenMapingDonedrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid">
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ border: '1px solid gray', padding: '10px' }}>
              <Typography sx={{ backgroundColor: 'green', padding: '4px', textAlign: 'center', color: 'white', fontSize: '20px' }}>Missing Policy</Typography>

              <Grid container mt={2}>
                <Grid item xs={12} sm={4} >
                  <Typography sx={{ fontSize: fontSize }}>Policy Details</Typography>
                  <Button onClick={() => ViewPdfFunction(selectedData?.missingPolicy?.policyMappingFile?.key)}>View PDF</Button>
                </Grid>
              </Grid><hr />
              <Grid container>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Issue Date</Typography>
                  <Typography>{moment(selectedData?.missingPolicy?.issueDate).format("DD-MM-YYYY")}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Company Name</Typography>
                  <Typography>{selectedData?.missingPolicy?.company}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Policy Number</Typography>
                  <Typography>{selectedData?.missingPolicy?.policyNumber}</Typography>
                </Grid>
              </Grid><hr />
              <Typography>Premium</Typography>
              <Grid container>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Total Premium</Typography>
                  <Typography>{selectedData?.missingPolicy?.totalPremium}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Payment Mode</Typography>
                  <Typography>{selectedData?.missingPolicy?.paymentMode}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>User Name</Typography>
                  <Typography>{selectedData?.missingPolicy?.userName}</Typography>
                </Grid>
              </Grid>
              <hr />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ border: '1px solid gray', padding: '10px' }}>
              <Typography sx={{ backgroundColor: 'green', padding: '4px', textAlign: 'center', color: 'white', fontSize: '20px' }}>Policy Table</Typography>
              <Grid container mt={2}>
                <Grid item xs={12} sm={4} >
                  <Typography sx={{ fontSize: fontSize }}>Policy Details</Typography>
                  <Button onClick={() => ViewPdfFunction(selectedData?.policyTable?.policyFile?.key)}>View PDF</Button>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Policy Status</Typography>
                  <Typography sx={{ textTransform: 'uppercase' }}>{selectedData?.policyTable?.policyStatus}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>CC Entry Status</Typography>
                  <Typography>{selectedData?.policyTable?.ccEntryStatus}</Typography>
                </Grid>
              </Grid><hr />
              <Grid container>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Issue Date</Typography>
                  <Typography>{moment(selectedData?.policyTable?.issueDate).format("DD-MM-YYYY")}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Company Name</Typography>
                  <Typography>{selectedData?.policyTable?.company}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Policy Number</Typography>
                  <Typography>{selectedData?.policyTable?.policyNumber}</Typography>
                </Grid>
              </Grid><hr />
              <Typography>Premium</Typography>
              <Grid container>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Total Premium</Typography>
                  <Typography>{selectedData?.policyTable?.totalPremium}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>Payment Mode</Typography>
                  <Typography>{selectedData?.policyTable?.paymentMode}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: fontSize }}>User Name</Typography>
                  <Typography>{selectedData?.policyTable?.userName}</Typography>
                </Grid>
              </Grid>
              <hr />
            </Grid>
          </Grid>
          <Grid container mt={4} gap={2} sx={{display:selectedData?.policyMappingStatus === "Mapping" ? "block" : 'none'}}>
            <Grid item xs={12} sm={4}>
              <FloatLabel label="Remarks">
                <TextField className="InputFiled" onChange={(e) => setRemarks(e.target.value)} />
              </FloatLabel>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex' }} gap={2}>
              <Button className="TabelButton" onClick={() => UpdatePolicyMappingFunction("Mapping Done")}>Mapping Done</Button>
              <Button className="TabelButton" onClick={() => UpdatePolicyMappingFunction("Rejected")}>Rejected</Button>

            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default MappingDone;
