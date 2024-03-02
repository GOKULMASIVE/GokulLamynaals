import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import moment from "moment";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import {
  CloudOffIcon,
  SearchIcon,
  DeleteIcon,
  EditIcon,
  DownloadIcon
} from "../../../Resources/Icons/icons";
import {
  GetPaidReceivedReport,
  GetUser,
  DeletePolicyReportData,
} from "../../../Service/_index";
import { DatePicker } from "antd";
import Dialog from '@mui/material/Dialog';
import { Transition } from "../../../UiComponents/Transition/Transition";
import EditPaidAndReceived from "./EditPaidAndReceived";
import { CSVLink } from "react-csv";


const { RangePicker } = DatePicker;
const TodayDate = new Date();
// TodayDate .setHours(23, 0, 0, 0);
const Last7Days = new Date();
Last7Days.setDate(Last7Days.getDate() - 7);
const YesterDay = new Date();
YesterDay.setDate(YesterDay.getDate() - 1);
const Last30Days = new Date();
Last30Days.setDate(Last30Days.getDate() - 30);

const TodayDateByDaysjs = dayjs();
const FirstDateOfMonth = TodayDateByDaysjs.startOf("month");
const FirstDateOfLastMonth = TodayDateByDaysjs.subtract(1, "month").startOf(
  "month"
);
const LastDateOfLastMonth = TodayDateByDaysjs.subtract(1, "month").endOf(
  "month"
);

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "transactionDate",
    placeMent: true,
    disablePadding: false,
    label: "Transaction Date",
  },
  {
    id: "paymentDate",
    placeMent: true,
    disablePadding: false,
    label: "Payment Date",
  },
  {
    id: "userName",
    placeMent: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "amount",
    placeMent: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "bank",
    placeMent: true,
    disablePadding: false,
    label: "Bank",
  },
  {
    id: "remark",
    placeMent: true,
    disablePadding: false,
    label: "Remark",
  },
  {
    id: "payment",
    placeMent: true,
    disablePadding: false,
    label: "Payment",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
  },
];

const TdsOption = [
  { label: "All", value: "all" },
  { label: "With TDS", value: "yes" },
  { label: "Without TDS", value: "no" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell) => (
          <TableCell
            className="TableHeader"
            key={headCell.id}
            align={headCell.placeMent ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: "16px", fontWeight: 600 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const PaymentPaidAndReceived = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [report, setReport] = React.useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedTds, setSelectedTds] = useState();
  const [isPaid, setIsPaid] = useState(true)
  //   Changes by Arun
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);



  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(report), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, report]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Changes by Arun
  // const GetTableData = (requestType) => {
  //   let reqBody = {
  //     selectedUserId: selectedUser,
  //     tdsType: selectedTds,
  //     selectedStartDate: selectedStartDate,
  //     selectedEndDate: selectedEndDate,
  //   };
  //   GetPaidReceivedReport(requestType, reqBody).then((res) => {
  //     setReport(res.data);
  //   });
  // };

  const PaidFunction = () => {
    setIsPaid(true)
    const requestType = "PAID"
    let reqBody = {
      selectedUserId: selectedUser,
      tdsType: selectedTds,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
    };
    GetPaidReceivedReport(requestType, reqBody).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          TransactionData: moment(e.transactionDate).format('DD/MM/YYYY'),
          PaymentDate:moment(e.paymentDate).format('DD/MM/YYYY')
        }
      })
      setReport(data);
    });
  }

  
  const ReceivedFunction = () => {
    setIsPaid(false)
    const requestType = "RECEIVED"
    let reqBody = {
      selectedUserId: selectedUser,
      tdsType: selectedTds,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
    };
    GetPaidReceivedReport(requestType, reqBody).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          TransactionData: moment(e.transactionDate).format('DD/MM/YYYY'),
          PaymentDate:moment(e.paymentDate).format('DD/MM/YYYY')
        }
      })
      setReport(data);
    });
  }

  const HandleCustomDays = (startDate, endDate) => {
    setSelectedStartDate(dayjs(startDate.setHours(1, 0, 0, 0)));
    setSelectedEndDate(dayjs(endDate.setHours(23, 59, 59, 59)));
    setIsDatePickerOpen(false);
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el.userName},${el.branch},${el.amount},${el.bankName} , ${el.remarks} , ${el.payment}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled && e?.userType?.includes("user")) {
          return {
            ...e,
            label: e.name + " - " + e.mobileNumber + ' - ' + e.email,
            value: e._id,
          };
        } else {
          return null;
        }
      }).filter(Boolean)
      setUserDetails(FilteredData);
    });
  };
  React.useEffect(() => {
    GetUserDetails();
    PaidFunction();
  }, []);


  const [openConfirmBox, setOpenConfirmBox] = useState(false);

  const EditReportData = (row) => {
    setOpenDrawer(true);
    setSelectedData(row)
  };

  const DeleteReportData = (row) => {
    setOpenConfirmBox(true)
    setSelectedData(row)
  }
  const DeleteFunction = () => {
    DeletePolicyReportData(selectedData._id)
    // GetTableData("PAID");
    setOpenConfirmBox(false);
    PaidFunction()
  };



  const header = [
    { label: "Transaction Date", key: "TransactionData" },
    { label: "Payment Date", key: "PaymentDate" },
    { label: "User Name", key: "userName" },
    { label: "Branch", key: "branch" },
    { label: "Amount", key: "amount" },
    { label: "Payment", key: "payment" },
  ];
  const csvFile = {
    filename: "Payment Paid and Received Data",
    headers: header,
    data: report,
  };

  return (
    <>
      <Grid container spacing={1} sx={{ padding: "10px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select User" value={selectedUser}>
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={userDetails}
              onChange={(option, value) => setSelectedUser(value?._id)}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option._id === value._id
              }
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  {option.name + " - " + option.mobileNumber + " - "+ option.email}
                </li>
              )}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select TDS type" value={selectedTds}>
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={TdsOption}
              clearIcon={false}
              onChange={(option, value) => setSelectedTds(value?.value)}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12} className="datePicker">
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker
              placement="bottomLeft"
              className="textField w-100"
              style={{ borderRadius: "0px" }}
              format="DD/MM/YYYY"
              value={[selectedStartDate, selectedEndDate]}
              onChange={(dates) => {
                setSelectedStartDate(dates ? dayjs(dates[0].$d) : null);
                setSelectedEndDate(dates ? dayjs(dates[1].$d) : null);

              }}
              open={isDatePickerOpen}
              onOpenChange={(status) => setIsDatePickerOpen(status)}
              renderExtraFooter={() => (
                <Grid container className="Range_Picker">
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() => HandleCustomDays(TodayDate, TodayDate)}
                  >
                    Today
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() => HandleCustomDays(YesterDay, YesterDay)}
                  >
                    YesterDay
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() => HandleCustomDays(Last7Days, TodayDate)}
                  >
                    Last 7 days
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() => HandleCustomDays(Last30Days, TodayDate)}
                  >
                    Last 30 days
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() =>
                      HandleCustomDays(FirstDateOfMonth, TodayDate)
                    }
                  >
                    This Month
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className="Date_Field"
                    onClick={() =>
                      HandleCustomDays(
                        FirstDateOfLastMonth,
                        LastDateOfLastMonth
                      )
                    }
                  >
                    Last Month
                  </Grid>
                </Grid>
              )}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12} sx={{ display: "flex" }} gap={1}>
          <Button
            onClick={PaidFunction}
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
          >
            Paid
          </Button>
          <Button
            onClick={ReceivedFunction}
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
          >
            Received
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2} mt={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Payment Paid & Received</Typography>
          </Grid>
          <Grid item xs={12} sm={5.5}></Grid>
          <Grid item xs={12} sm={2}>
            <Input
              focused="false"
              className="w-100 Master_Header_Input"
              id="standard-adornment-password"
              onChange={onSearch}
              disableUnderline={true}
              placeholder="Search"
              startAdornment={
                <InputAdornment position="start">
                  <IconButton aria-label="toggle password visibility">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={1.5} className="d-flex justify-content-end">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<DownloadIcon />}
              sx={{ width: { xs: "100%", sm: "fit-content" } }}
            >
              <CSVLink className="Download_Excel_Button" {...csvFile}>
                Download Excel
              </CSVLink>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div className="d-flex PageContainer">
        <Paper
          className="container-fluid TableBox">
          <TableContainer className="TableContainer">
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 750 }}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                      sx={{ cursor: "pointer" }}
                    >
                      {/* Changes by Arun */}
                      <TableCell component="th" scope="row" padding="normal">
                        {moment(row?.transactionDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row?.paymentDate).format("DD-MM-YYYY LT")}
                      </TableCell>
                      <TableCell align="left">{row.userName}</TableCell>
                      <TableCell align="left">{row.branch}</TableCell>
                      <TableCell align="left">{row.amount}</TableCell>
                      <TableCell align="left">
                        {row?.bankDetails?.find(
                          (ele) => ele.accountNumber == row.accountNumber
                        )?.bankName || ""}
                      </TableCell>
                      <TableCell align="left">{row.remarks}</TableCell>
                      <TableCell align="left">{row.payment}</TableCell>
                      {/* End of changes */}
                      <TableCell align="center">
                        <Box className="ActionIcons">
                          <Tooltip title="edit">
                            <EditIcon
                              onClick={() => EditReportData(row)}
                            />
                          </Tooltip>
                          <Tooltip title="delete">
                            <DeleteIcon onClick={() => DeleteReportData(row)} />
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {visibleRows?.length < 1 ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      sx={{ textAlign: "center", border: "none" }}
                    >
                      <CloudOffIcon
                        sx={{ fontSize: "100px", color: "#c5c3c3" }}
                      />
                      <br />
                      <Typography sx={{ color: "#c5c3c3" }}>
                        Oops! No Data Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filter.fn(report)?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      <Dialog
        open={openDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: { maxWidth: '50%' }
        }}
      >
        {openDrawer ? (
          <EditPaidAndReceived
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            setOpenDrawer={setOpenDrawer}
            isPaid={isPaid}
            PaidFunction={PaidFunction}
            ReceivedFunction={ReceivedFunction}
          />
        ) : null}
      </Dialog>

      <ConfirmBox
        open={openConfirmBox}
        title={"Delete"}
        content={"Are you sure want to delete"}
        confirmButton={"Delete"}
        setOpenConfirmBox={setOpenConfirmBox}
        Function={DeleteFunction}
        icon={<DeleteIcon />}
        color={"error"}
      />
    </>
  );
};
export default PaymentPaidAndReceived;
