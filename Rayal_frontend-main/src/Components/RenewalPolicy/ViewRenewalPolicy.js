import React from "react";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import moment from "moment";
const ViewRenewalPolicy = (props) => {

    const {setOpenDrawer , selectedData} = props

    const ViewPdfFunction = () => {
        const pdfUrl = selectedData?.policyFile?.downloadURL
        const pdfWindow = window.open("", "_blank");
        pdfWindow?.document?.write(
          `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
        );
      };
    return <>

        <div className="MainRenderinContainer">
            <Grid container className="DrawerHeader">
            <Grid item xs={6} sm={6}>
            <Typography> View Policy List</Typography>
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
          </div>
        </div>
    </>
}

export default ViewRenewalPolicy;