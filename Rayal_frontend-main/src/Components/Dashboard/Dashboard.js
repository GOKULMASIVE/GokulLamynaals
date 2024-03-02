import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DatePicker } from "antd";
import EntryPendingImage from "../../Resources/Images/EntryPendingImage.png";
import Typography from "@mui/material/Typography";
import PolicyServiceImage from "../../Resources/Images/PolicyServiceImage.png";
import VerifyImage from "../../Resources/Images/VerifyImage.png";
import { BarChart } from "@mui/x-charts/BarChart";
import ArrowImage from "../../Resources/Images/Arrow 2.png";
import { GetDashboard, GetLogin } from "../../Service/_index";
import { useNavigate } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Transition } from "../../UiComponents/Transition/Transition";
import Dialog from "@mui/material/Dialog";
import { CloseIcon } from "../../Resources/Icons/icons";
import { checkUserType } from "../../Shared/CommonConstant";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { DialogContent, DialogContentText } from "@mui/material";
import Loader from '../../UiComponents/Loader/Loader'
import Button from "@mui/material/Button";
import axios from "axios";
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = React.useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [openLoader, setOpenLoader] = useState(false)
  const [isAllow, setIsAllow] = useState({})
  // Changes by Arun
  const getDashboardData = () => {
    setOpenLoader(true)
    GetDashboard({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    }).then((res) => {
      setOpenLoader(false)

      //changes by gokul...

      setDashboardData(res?.data);
      getYearBasedChartData(res?.data, new Date().getFullYear().toString());
    });
  };

  React.useEffect(() => {
    getDashboardData();
    getYearBasedChartData(
      "inital function",
      new Date().getFullYear().toString()
    );
  }, []);

  useEffect(() => getDashboardData(), [selectedStartDate, selectedEndDate]); //added by gokul;

  // Changes by Arun
  const getYearBasedChartData = async (tempData, year) => {
    // Changes by Arun
    let data = tempData?.barChartData || [];
    let policyCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let premiumCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let findYearData = data.find((element) => {
      return element.year == year;
    });

    if (findYearData) {
      await Promise.all(
        findYearData.data.map((element) => {
          let month = element.month;
          policyCount[month - 1] = element.totalPolicy;
          premiumCount[month - 1] = element.totalPremium;
        })
      );
    }

    let obj = {
      policyCount: policyCount,
      premiumCount: premiumCount,
      year: year,
    };
    setChartData(obj);
    // End of changes
  };

  const [open, setOpen] = React.useState(false);
  const [headerTitle, setHeaderTitle] = useState("");
  const [selectedDataLeft, setSelectedDataLeft] = useState([]);
  const [selectedDataRight, setSelectedDataRight] = useState([]);
  const [selectedTitleLeft, setSelectedTitleLeft] = useState("");
  const [selectedTitleRight, setSelectedTitleRight] = useState("");

  const handleClickOpen = (key) => {
    setOpen(true);
    if (key === "Entry_Pending") {
      setHeaderTitle("Entry Pending");
      setSelectedTitleLeft("Policy Entry");
      setSelectedTitleRight("CC Entry");
      setSelectedDataLeft(dashboardData?.policyRelatedData?.entryPendingPolicy);
      setSelectedDataRight(
        dashboardData?.policyRelatedData?.ccEntryPendingPolicy
      );
    } else if (key === "Policy_Status") {
      setHeaderTitle("Policy Status");
      setSelectedTitleLeft("Verify Pending");
      setSelectedTitleRight("Cheque Pending");
      setSelectedDataLeft(
        dashboardData?.policyRelatedData?.verifyPendingPolicy
      );
      setSelectedDataRight(dashboardData?.policyRelatedData?.chequePending);
    } else if (key === "Approval_Pending") {
      setHeaderTitle("Approval Pending");
      setSelectedTitleLeft("Payable");
      setSelectedTitleRight("Receivable");
      setSelectedDataLeft(dashboardData?.policyRelatedData?.payablePending);
      setSelectedDataRight(dashboardData?.policyRelatedData?.receivablePending);
    } else if (key === "Renewal_Policy") {
      setHeaderTitle("Renewal Policy");
      setSelectedTitleLeft("Renewal Count");
      setSelectedTitleRight("Today Renewal");
      setSelectedDataLeft(
        dashboardData?.userRelatedData?.expiryCurrentMonthPolicyCount
      );
      setSelectedDataRight(
        dashboardData?.userRelatedData?.expiryTodayPolicyCount
      );
    } else {
      return null;
    }
  };

  const UserType = localStorage.getItem("userType")
  const UserId = localStorage.getItem("UserId")


  const [filterDataLeft, setFilterDataLeft] = useState([]);
  const [filterDataRight, setFilterDataRight] = useState([]);

  // written by gokul..
  // start
  const filterDataLeftFunct = () => {
    setFilterDataLeft(selectedDataLeft?.filter((item) => item?.value !== 0));


  };

  const filterDataRightFunct = () => {

    setFilterDataRight(selectedDataRight?.filter((item) => item?.value !== 0));

  };

  useEffect(() => {
    filterDataLeftFunct();
    filterDataRightFunct();
  }, [selectedDataLeft, selectedDataRight]);

  // end...

  React.useEffect(() => {
    const isallowObj = checkUserType(UserType)
    setIsAllow(isallowObj)
  }, [UserType])

  const GetLoginFunction = () => {
    GetLogin().then((res) => {
      console.log(res)
      let credentials = { username: '', password: '' }
      if (res?.userType) {
        credentials.username = res.mobileNumber ? res.mobileNumber : res.email
        credentials.password = res.password
      } else {
        credentials.username = res.email
        credentials.password = res.password
      }
      axios.post(`https://rayal.1policy.in/login`, credentials).then((responce) => {
        console.log(responce)
        window.open(`https://rayal.1policy.in/login-url?Authorization=${responce.data.Authorization}`)
      })
    })
  }

  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",

        }}
        rowSpacing={2}
        className="RenderingBigContainer"
      >
        <div
          style={{
            position: "relative",
            left: "10px",
            top: "5px",
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker
              placement="bottomLeft"
              className="textField w-10"
              style={{ borderRadius: "0px" }}
              onChange={(e) => {
                setSelectedStartDate(e ? e[0].$d : null);
                setSelectedEndDate(e ? e[1].$d : null);
              }}
              format="DD/MM/YYYY"
            />
          </FloatLabel>
          <Button className="Common_Button" onClick={() => GetLoginFunction()} sx={{marginRight:'10px'}}>
            Go to Old Website
          </Button>
        </div>

        <Grid item xs={12} sm={12}>
          <Grid container className="Top_Big_Box" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box className="Top_Containers">
                <Grid container className="Top_Con_Main_Grid">
                  <Grid item xs={3} sm={3} className="Top_Con_Image">
                    <img
                      src={EntryPendingImage}
                      alt="Logo"
                      style={{ backgroundColor: "#edf2ff" }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} className="Top_Con_Content_one">
                    <Typography className="Top_Text">Policy Entry</Typography>
                    <Typography className="Top_Text">CC Entry</Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} className="Top_Con_Content_two">
                    {/* Changes by Arun */}
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData
                        ?.entryPendingPolicySummary || 0}
                    </Typography>
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData
                        ?.ccEentryPendingPolicySummary || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="Top_Con_Link"
                    onClick={() => handleClickOpen("Entry_Pending")}
                  >
                    Entry Pending <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box className="Top_Containers">
                <Grid container className="Top_Con_Main_Grid">
                  <Grid item xs={3} sm={3} className="Top_Con_Image">
                    <img
                      src={EntryPendingImage}
                      alt="Logo"
                      style={{ backgroundColor: "#edf2ff" }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} className="Top_Con_Content_one">
                    <Typography className="Top_Text">Verify Pending</Typography>
                    <Typography className="Top_Text">Cheque Pending</Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} className="Top_Con_Content_two">
                    {/* Changes by Arun */}
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData?.verifyPendingSummary ||
                        0}
                    </Typography>
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData?.chequePendingSummary ||
                        0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="Top_Con_Link"
                    onClick={() => handleClickOpen("Policy_Status")}
                  >
                    Policy Status <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: isAllow.isUser ? "none" : "block" }}
            >
              <Box className="Top_Containers">
                <Grid container className="Top_Con_Main_Grid">
                  <Grid item xs={3} sm={3} className="Top_Con_Image">
                    <img
                      src={PolicyServiceImage}
                      alt="Logo"
                      style={{ backgroundColor: "#fdf3ed" }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} className="Top_Con_Content_one">
                    <Typography className="Top_Text">Policy Entry</Typography>
                    <Typography className="Top_Text">CC Entry</Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} className="Top_Con_Content_two">
                    <Typography className="Count-Value">0</Typography>
                    <Typography className="Count-Value">0</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className="Top_Con_Link">
                    Performance
                    <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box className="Top_Containers">
                <Grid container className="Top_Con_Main_Grid">
                  <Grid item xs={3} sm={3} className="Top_Con_Image">
                    <img
                      src={VerifyImage}
                      alt="Logo"
                      style={{ backgroundColor: "#fbeef2" }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} className="Top_Con_Content_one">
                    <Typography className="Top_Text">
                      Payable Pending
                    </Typography>
                    <Typography className="Top_Text">
                      Receivable Pending
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} className="Top_Con_Content_two">
                    {/* Changes by Arun */}
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData
                        ?.payablePendingSummary || 0}
                    </Typography>
                    <Typography className="Count-Value">
                      {dashboardData?.policyRelatedData
                        ?.receivablePendingSummary || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="Top_Con_Link"
                    onClick={() => handleClickOpen("Approval_Pending")}
                  >
                    Approval Pending <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Grid container className="Center_Big_Box" spacing={2}>
            <Grid item xs={12} sm={9}>
              {/* Changes by Arun */}
              <DatePicker
                style={{ float: "right" }}
                picker="year"
                allowClear="true"
                onChange={(date) => {
                  console.log("selected year", date?.year());
                  getYearBasedChartData(
                    dashboardData,
                    date?.year().toString() || ""
                  );
                }}
              />
              {chartData ? (
                <Box className="Chart_Container">
                  <BarChart
                    height={300}
                    xAxis={[
                      {
                        scaleType: "band",
                        label: chartData.year,
                        data: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "June",
                          "July",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        barGapRatio: 0.2,
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    series={[
                      {
                        data: chartData.premiumCount,
                        label: "Premium",
                      },
                      {
                        data: chartData.policyCount,
                        label: "Policy Count",
                      },
                    ]}
                  />
                </Box>
              ) : (
                <p>Loading chart data...</p>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: isAllow.isUser ? "none" : "block" }}
            >
              <Box className="Cheque_Status_Box">
                <Typography pb={2} pt={1} sx={{ fontWeight: 600 }}>
                  Cheque Status
                </Typography>
                <Grid container rowSpacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Pending</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "#FFC107",
                        fontSize: "20px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.policyRelatedData?.chequePendingSummary ||
                        0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Cleared</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "#00D656",
                        fontSize: "20px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.policyRelatedData?.chequeClearedSummary ||
                        0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Bounced</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "#FF0000",
                        fontSize: "20px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.policyRelatedData?.chequeBouncedSummary ||
                        0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="Cheque_box_Link"
                    onClick={() => navigate("/chequeStatus")}
                  >
                    See All <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} mb={4}>
          <Grid container spacing={2} className="Footer_Big_box">
            <Grid item xs={12} sm={3}>
              <Box className="Footer_Box">
                <Typography
                  sx={{
                    fontWeight: "600",
                    color: "black",
                    fontSize: "16px",
                  }}
                >
                  Renewal Policy
                </Typography>
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Typography className="Cheque_Text">This Month</Typography>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        color: "black",
                        fontSize: "48px",
                      }}
                    >
                      {
                        dashboardData?.userRelatedData
                          ?.expiryCurrentMonthPolicySummary
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography className="Cheque_Text">Today</Typography>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        color: "black",
                        fontSize: "48px",
                      }}
                    >
                      {dashboardData?.userRelatedData?.expiryTodayPolicySummary}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="Footer_box_Link"
                    onClick={() => handleClickOpen("Renewal_Policy")}
                  >
                    See All <img src={ArrowImage} alt="arrow" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: isAllow.isUser ? "none" : "block" }}
            >
              <Box className="Footer_Box">
                <Grid container rowSpacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Users</Typography>
                    <Typography className="Footer_second_Link">
                      See All
                      <img src={ArrowImage} alt="arrow" />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Account</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.userRelatedData?.accountantCount || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Manager</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.userRelatedData?.branchManagerCount || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Operator</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.userRelatedData?.operatorCount || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">PT Staff</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.userRelatedData?.ptstaffCount || 0}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography className="Cheque_Text">Users</Typography>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      {/* Changes by Arun */}
                      {dashboardData?.userRelatedData?.userCount || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                display: isAllow.isUser ? "none" : "flex",
              }}
            >
              <PieChart
                series={[
                  {
                    // arcLabel: (item) => (
                    //   item.value > 0 ? `${item.label} - ${item.value}` : ''
                    // ),
                    data: [
                      {
                        id: 0,
                        value:
                          dashboardData?.userRelatedData?.accountantCount || 0,
                        label: `Accountant - ${dashboardData?.userRelatedData?.accountantCount || 0
                          }`,
                      },
                      {
                        id: 1,
                        value:
                          dashboardData?.userRelatedData?.branchManagerCount ||
                          0,
                        label: `Manager - ${dashboardData?.userRelatedData?.branchManagerCount ||
                          0
                          }`,
                      },
                      {
                        id: 2,
                        value:
                          dashboardData?.userRelatedData?.operatorCount || 0,
                        label: `Operator - ${dashboardData?.userRelatedData?.operatorCount || 0
                          }`,
                      },
                      {
                        id: 3,
                        value:
                          dashboardData?.userRelatedData?.ptstaffCount || 0,
                        label: `PT Staff - ${dashboardData?.userRelatedData?.ptstaffCount || 0
                          }`,
                      },
                      {
                        id: 4,
                        value: dashboardData?.userRelatedData?.userCount || 0,
                        label: `Users - ${dashboardData?.userRelatedData?.userCount || 0
                          }`,
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 40,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={240}
              // sx={{
              //   [`& .${pieArcLabelClasses.root}`]: {
              //     fill: 'white',
              //     fontWeight: '200',
              //     overflow: 'hidden',
              //     fontSize: '10px',
              //     pointerEvents: 'none'
              //   },
              // }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          maxWidth={"sm"}
          fullWidth={true}
        >
          <DialogContent
            sx={{
              padding: "10px 0 15px 0",
              // border: "2px solid black",
              display: "flex",
              height: "200px",
              overflow: "auto",
            }}
          >
            <Grid container sx={{ height: "100px" }}>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 14px 0px 14px",
                  // borderBottom: "1px solid #dbdbdb",
                  position: "sticky",
                  top: 0,
                  zIndex: 500,
                  background: "white",
                  color: "black",
                  height: "23px",
                }}
              >
                {headerTitle}
                <CloseIcon
                  onClick={() => setOpen(false)}
                  sx={{ cursor: "pointer" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    textAlign: "center",
                    position: "sticky",
                    background: "white",
                    color: "black",
                    zIndex: 200,
                    top: "38px",
                    borderBottom: "1px solid black",
                  }}
                  mb={1}
                  mt={1}
                >
                  {selectedTitleLeft}
                </Typography>
                {filterDataLeft?.length ? (
                  filterDataLeft.map((e, i) => {
                    return (
                      <>
                        <Box sx={{ display: "flex" }} key={i}>
                          <Typography className="Dialogbox_left_li">
                            {i + 1} . {e?.comapny || e?.user}
                          </Typography>
                          <Typography className="Dialogbox_Right_li">
                            {e?.value}
                          </Typography>
                        </Box>
                      </>
                    );
                  })
                ) : (
                  <center>No {selectedTitleLeft.toLowerCase()} data!</center>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    textAlign: "center",
                    position: "sticky",
                    background: "white",
                    color: "black",
                    zIndex: 200,
                    top: "38px",
                    borderBottom: "1px solid black",
                  }}
                  mb={1}
                  mt={1}
                >
                  {selectedTitleRight}
                </Typography>
                {filterDataRight?.length ? (
                  filterDataRight.map((e, i) => {
                    return (
                      <>
                        <Box sx={{ display: "flex" }} key={i}>
                          <Typography className="Dialogbox_left_li">
                            {i + 1} . {e?.comapny || e?.user}
                          </Typography>
                          <Typography className="Dialogbox_Right_li">
                            {e?.value}
                          </Typography>
                        </Box>
                      </>
                    );
                  })
                ) : (
                  <center>No {selectedTitleRight.toLowerCase()} data!</center>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
      <Loader open={openLoader} />

    </>
  );
};

export default Dashboard;
