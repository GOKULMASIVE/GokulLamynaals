import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from "@mui/material/TextField";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import {
  GetFilterCCEntry,
  GetFilterCCEntryAll,
  GetPolicyFileById,
  UpdatePolicyList,
  ticketAlreadyExist,
  unlinkTicketNumber,
} from "../../../Service/SearchPolicy";
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";
import { GetSubBookingCode } from "../../../Service/SubBookingCodeService";
import { GetBookingCode } from "../../../Service/BookingCodeService";

const ViewCCentry = (props) => {
  const { selectedData, setOpenViewCC, setPolicyList, edit } = props;
  const [ticketNumber, setTicketNumber] = useState(selectedData.ticketNumber);
  const [filterData, setFilterData] = useState({
    bookingCodeId: "",
    subBookingCodeId: "",
  });

  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [subBookingCode, setSubBookingCode] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);

  const GetData = async () => {
    try {
      const result = await GetFilterCCEntryAll();
      if (result) {
        setPolicyList(result.data);
        setOpenViewCC(false);
      }
    } catch (error) {
      console.log("Error from tickNumber", error);
    }
  };
  const UserId = localStorage.getItem("UserId");
  const id = selectedData._id;
  const updateTickNumber = async (check) => {
    try {
      const result = await UpdatePolicyList(id, {
        ticketNumber: ticketNumber,
        ticketCreatedBy: UserId,
      });
      if (result) {
        const res = await GetFilterCCEntry({ status: "approvePending" });
        setPolicyList(res.data);
        setOpenViewCC(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFilterData((pre) => ({
      ...pre,
      bookingCodeId: selectedValue,
    }));
  };
  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true })
      .then((res) => {
        const modifiedBookingCodeDetails = res.data
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const GetSubBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: true })
      .then((res) => {
        const SubBookingCodeDetails = res.data.map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.subBookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        });
        const selectedBookingCode = bookingCodeDetails.find(
          (e) => e._id === filterData.bookingCodeId
        );
        const filteredSubBookingCodes = SubBookingCodeDetails.filter(
          (item) => item.bookingCode === selectedBookingCode?.bookingCode
        );
        console.log(filteredSubBookingCodes);
        setSubBookingCode(filteredSubBookingCodes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const AlreadyExist = async () => {
    const result = await ticketAlreadyExist(id, {
      createdBy: UserId,
    });
    try {
      if (result) {
        const res = await GetFilterCCEntry({ status: "alreadyExist" });
        setPolicyList(res.data);
        setOpenViewCC(false);
        ToastError("Already Exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateBookingCodes = async () => {
    try {
      const result = await unlinkTicketNumber(id, filterData);
      if (result) {
        GetData();
        ToastSuccess("Booking Code Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ViewPdfFunction = () => {
    setOpenLoader(true);
    GetPolicyFileById(selectedData?._id)
      .then((res) => {
        const pdfUrl = res.data.policyFile.downloadURL;
        return pdfUrl;
      })
      .then((pdfUrl) => {
        setOpenLoader(false);
        const pdfWindow = window.open("", "_blank");
        pdfWindow?.document?.write(
          `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
        );
      });
  };

  React.useEffect(() => {
    GetBookingCodeDetails();
    GetSubBookingCodeDetails();
  }, [filterData.bookingCodeId]);

  return (
    <>
      {edit === "ccEntry" ? (
        <div className="MainRenderinContainer">
          <Grid container className="DrawerHeader">
            <Grid item xs={6} sm={6}>
              <Typography>CC Entry</Typography>
            </Grid>
            <Grid item xs={6} sm={6} className="d-flex justify-content-end">
              <CloseIcon
                onClick={() => setOpenViewCC(false)}
                sx={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
          <div className="container-fluid" style={{ padding: "20px" }}>
            <Typography className="EditPageHeadingTittle">
              Policy Files
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex" sx={{ gap: 2 }}>
                <Button
                  className="w-50 TabelButton"
                  variant="contained"
                  endIcon={<PictureAsPdfIcon />}
                  onClick={() => ViewPdfFunction()}
                >
                  View PDF
                </Button>
                <Button
                  className="w-50 TabelButton"
                  variant="contained"
                  endIcon={<DescriptionSharpIcon />}
                >
                  Other Documents
                </Button>
              </Grid>
              <Grid item xs={12} sm={8} />

              <Grid item xs={12} sm={4} className="d-flex" mt={3}>
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
                <Typography className="CCHeading">Booking Code</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.bookingCodeId?.bookingCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Sub Booking Code</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.subBookingCodeId?.subBookingCode}
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
                <Typography className="CCHeading">Make</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.make}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Model</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.model}
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
                <Typography className="CCHeading">
                  OD Policy Start Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.odPolicyStartDate).format("L")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">OD Policy Period</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.odPolicyPeriod}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  OD Policy End Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.odPolicyEndDate).format("L")}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              TP Policy Date
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  TP Policy Start Date
                </Typography>
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
                <Typography className="CCHeading">
                  TP Policy End Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.tpPolicyEndDate).format("L")}
                </Typography>
              </Grid>
            </Grid>
            <hr />

            <Typography className="EditPageHeadingTittle">Premium</Typography>
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
            </Grid>
            <hr />
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
            <Typography className="EditPageHeadingTittle">
              Company Entry Number
            </Typography>
            <Grid container gap={2} p={2}>
              <Grid item xs={12} sm={4}>
                <FloatLabel label="Ticket Number">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="InputFiled w-100"
                    onChange={(e) => setTicketNumber(e.target.value)}
                    value={ticketNumber}
                  />
                </FloatLabel>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex" gap={2}>
                <Button
                  onClick={() => updateTickNumber("")}
                  className="TabelButton"
                >
                  Update Ticket Number
                </Button>
                <Button onClick={AlreadyExist} className="TabelButton">
                  Already Exsists
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      ) : edit === "edit" ? (
        <>
          <DialogTitle>Edit Ticket Number</DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-basic"
              variant="outlined"
              className="InputFiled w-100"
              onChange={(e) => setTicketNumber(e.target.value)}
              value={ticketNumber}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewCC(false)}>Cancel</Button>
            <Button onClick={() => updateTickNumber("update")}>Update</Button>
          </DialogActions>
        </>
      ) : (
        <>
          <Typography
            variant="h6"
            sx={{
              p: 3,
              pb: 1,
            }}
          >
            CC Unlink Ticket
          </Typography>
          <DialogContent
            sx={{
              display: "flex",
              gap: 2,
              // justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <FloatLabel
                label="Booking Code"
                value={filterData?.bookingCodeId}
              >
                <Select
                  className="w-100 DropdownField InputFiled"
                  name="BookingCode"
                  onChange={handleSelectChange}
                  value={filterData?.bookingCodeId}
                >
                  {bookingCodeDetails?.map((e) => {
                    return (
                      <MenuItem value={e._id} key={e._id}>
                        {e.bookingCode}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FloatLabel>
            </Box>
            <Box sx={{ width: "100%" }}>
              <FloatLabel
                label="Sub Booking Code"
                value={filterData?.subBookingCodeId}
              >
                <Select
                  className="w-100 DropdownField InputFiled"
                  name="SubBookingCode"
                  onChange={(e) => {
                    setFilterData((pre) => ({
                      ...pre,
                      subBookingCodeId: e.target.value,
                    }));
                  }}
                  value={filterData?.subBookingCodeId}
                >
                  {subBookingCode?.map((e) => {
                    return (
                      <MenuItem value={e._id} key={e._id}>
                        {e.subBookingCode}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FloatLabel>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewCC(false)}>Cancel</Button>
            <Button onClick={updateBookingCodes}>Unlink</Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default ViewCCentry;
