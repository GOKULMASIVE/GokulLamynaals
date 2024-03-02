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
  DownloadIcon,
} from "../../../Resources/Icons/icons";
import {
  GetPaidReceivedReport,
  DeletePolicyReportData,
  GetQuoteQueryRecords
} from "../../../Service/_index";
import { DatePicker } from "antd";
import Dialog from "@mui/material/Dialog";
import { Transition } from "../../../UiComponents/Transition/Transition";
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
    id: "S.No",
    placeMent: true,
    disablePadding: false,
    label: "S.No",
  },
  {
    id: "UserName",
    placeMent: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "VehicleName",
    placeMent: true,
    disablePadding: false,
    label: "Vehicle Name",
  },
  {
    id: "VehicleCount",
    placeMent: true,
    disablePadding: false,
    label: "Vehicle Count",
  },

];


const UserType=[
    {label:"All",value:"all"},
    {label:"WebUser",value:true},
    {label:"MobileUser",value:false}
]

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

const MotorReport = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [report, setReport] = React.useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [selectedTds, setSelectedTds] = useState();
  const [isPaid, setIsPaid] = useState(true);
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
            `${el.userName},${el?.vehicleName},${el?.vehicleCount}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0);
  };



  const GetUserDetails = () => {
    GetQuoteQueryRecords({isWebUser:selectedUserType,startDate:selectedStartDate,endDate:selectedEndDate}).then((res) => {
    console.log(res.data);
      const FilteredData = res.data
        .map((e) => {
            return {
              ...e,
              label: e.isWebUser?e.userName:e.motorUserName,
              value: e._id,
            };
        })
        .filter(Boolean);
      setReport(FilteredData);
      setUserDetails(FilteredData);
    });
    
    console.log({
      isWebUser: selectedUserType,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    });
  };
  React.useEffect(() => {
    GetUserDetails();
  }, []);

  React.useEffect(()=>GetUserDetails(),[selectedUserType]);

  const header = [
    { label: "User Name", key: "userName" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Vehicle Count", key: "vehicleCount" },
  ];
  const csvFile = {
    filename: "Motor Report Data",
    headers: header,
    data: report,
  };

  

  return (
    <>
      <Grid container spacing={1} sx={{ padding: "10px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select User Type" value={selectedUserType}>
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={UserType}
              clearIcon={false}
              onChange={(option, value) => setSelectedUserType(value?.value)}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select User" value={selectedUser}>
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={userDetails}
              clearIcon={false}
              onChange={(option, value) => setSelectedUser(value?.value)}
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
            onClick={GetUserDetails}
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
          >
            Search
          </Button>
         
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2} mt={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Motor Report
            </Typography>
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
        <Paper className="container-fluid TableBox">
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
                      <TableCell component="th" scope="row" padding="normal">
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">
                        {row?.isWebUser ? row?.userName : row?.motorUserName}
                      </TableCell>
                      <TableCell align="left">{row?.vehicleName}</TableCell>
                      <TableCell align="left">{row?.vehicleCount}</TableCell>
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

      
    </>
  );
};
export default MotorReport;
