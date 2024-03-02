import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "antd";
import { GetSubBookingCode, GetBookingReport} from "../../../Service/_index";
import "./index.scss";
const { RangePicker } = DatePicker;

const BookingScoreOption = [
  { label: "Default", value: true },
  { label: "Custom", value: false },
];

const BookingReport = () => {
  const [selectedScore, setSelectedScore] = useState();
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [bookingReportData, setBookingReportData] = useState();
  const [isShowRangePicker, setIsShowRangePicker] = useState(true);
  const [filterBy,setFilterBy] = useState({})

  const GetBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: true }).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled) {
          return {
            ...e,
            label: e.bookingCode + " - " + e.subBookingCode,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      setBookingCodeDetails(FilteredData);
    });
  };

  //   Changes by Arun
  const getBookingReport = () => {
    const reqBody = {...filterBy , requestType: selectedScore ? "DEFAULT" : "CUSTOM"}
    console.log("hello world",reqBody)
    GetBookingReport(reqBody).then((res) => {
      setBookingReportData(res.data);
    });
  };

  useEffect(() => {
    GetBookingCodeDetails();
  }, []);


  return (
    <>
      <Grid container spacing={1} sx={{ padding: "20px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Filter Type" value={selectedScore}>
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={BookingScoreOption}
              clearIcon={false}
              onChange={(option, value) => {
                setSelectedScore(value.value);
                if (value.value) {
                  setIsShowRangePicker(true);
                } else {
                  setIsShowRangePicker(false);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel
            label="Select Booking code & Sub Booking Code"
            value={filterBy.bookingCode}
          >
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={bookingCodeDetails}
              onChange={(event, option) => {
                if (option) {
                  setFilterBy({...filterBy,bookingCode: option.bookingCodeId,subBookingCode: option._id});
                } else {
                  setFilterBy({...filterBy,bookingCode: null,subBookingCode: null});
                }
              }}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option._id === value._id
              }
            />
          </FloatLabel>
        </Grid>
        <Grid
          item
          sm={3}
          xs={12}
          className="datePicker"
          sx={{ display: isShowRangePicker ? "none" : "block" }}
        >
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker
              placement="bottomLeft"
              className="textField w-100"
              style={{ borderRadius: "0px" }}
              format="DD/MM/YYYY"
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setFilterBy({...filterBy,selectedStartDate:dates[0] , selectedEndDate:dates[1]})
                }
              }}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12} sx={{ display: "flex" }} gap={1}>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
            onClick={() => getBookingReport()}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }} mt={2}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={12}>
            <Typography className="Master_Header_Heading">Booking Report</Typography>
          </Grid>
        </Grid>
      </Box>
      <div className="d-flex PageContainer">
        <Paper className="container-fluid TableBox">
          <Grid
            container
            sx={{ padding: "80px 60px 80px 60px", width: "100%" }}
          >
            <Grid item xs={12} sm={3} className="Super_Container">
              <Paper
                sx={{ textAlign: "center" }}
                className="Super_Paper Paper_1"
              >
                {/* Changes by Arun */}
                <Typography className="Header_Heading">Today</Typography>
                <Typography className="Header_Count">
                  {bookingReportData?.today?.policyCount} Policy Count
                </Typography>
                <Typography className="Box_Od">
                  OD - ( {bookingReportData?.today?.odTotal} )
                </Typography>
                <Typography className="Box_Tp">
                  TP - ( {bookingReportData?.today?.tpTotal} )
                </Typography>
                <Typography className="Box_Net">
                  Net - ( {bookingReportData?.today?.netTotal} )
                </Typography>
                <Typography className="Box_Total">
                  Total - ( {bookingReportData?.today?.total} )
                </Typography>
                <Button className="Box_Button">Download</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3} className="Super_Container">
              <Paper
                sx={{ textAlign: "center" }}
                className="Super_Paper Paper_2"
              >
                {/* Changes by Arun */}
                <Typography className="Header_Heading">Month</Typography>
                <Typography className="Header_Count">
                  {bookingReportData?.monthly?.policyCount} Policy Count
                </Typography>
                <Typography className="Box_Od">
                  OD - ( {bookingReportData?.monthly?.odTotal} )
                </Typography>
                <Typography className="Box_Tp">
                  TP - ( {bookingReportData?.monthly?.tpTotal} )
                </Typography>
                <Typography className="Box_Net">
                  Net - ( {bookingReportData?.monthly?.netTotal} )
                </Typography>
                <Typography className="Box_Total">
                  Total - ( {bookingReportData?.monthly?.total} )
                </Typography>
                <Button className="Box_Button">Download</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3} className="Super_Container">
              <Paper
                sx={{ textAlign: "center" }}
                className="Super_Paper Paper_3"
              >
                {/* Changes by Arun */}
                <Typography className="Header_Heading">Total</Typography>
                <Typography className="Header_Count">
                  {bookingReportData?.total?.policyCount} Policy Count
                </Typography>
                <Typography className="Box_Od">
                  OD - ( {bookingReportData?.total?.odTotal} )
                </Typography>
                <Typography className="Box_Tp">
                  TP - ( {bookingReportData?.total?.tpTotal} )
                </Typography>
                <Typography className="Box_Net">
                  Net - ( {bookingReportData?.total?.netTotal} )
                </Typography>
                <Typography className="Box_Total">
                  Total - ( {bookingReportData?.total?.total} )
                </Typography>
                <Button className="Box_Button">Download</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3} className="Super_Container">
              <Paper
                sx={{ textAlign: "center" }}
                className="Super_Paper Paper_4"
              >
                {/* Changes by Arun */}
                <Typography className="Header_Heading">Receivable</Typography>
                <Typography className="Header_Count">
                  {bookingReportData?.receivable?.policyCount} Policy Count
                </Typography>
                <Typography className="Box_Od">
                  Total Receivable - ({" "}
                  {bookingReportData?.receivable?.totalReceivable} )
                </Typography>
                <Typography className="Box_Tp">
                  Total Received - ({" "}
                  {bookingReportData?.receivable?.totalReceived} )
                </Typography>
                <Typography className="Box_Net">
                  Pending - ( {bookingReportData?.receivable?.pending} )
                </Typography>
                <Typography className="Box_Total">
                  -
                </Typography>
                <Button className="Box_Button" >View</Button>

              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
};
export default BookingReport;
