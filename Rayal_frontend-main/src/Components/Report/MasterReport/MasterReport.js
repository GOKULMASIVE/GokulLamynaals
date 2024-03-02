import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from "@mui/material/TextField";
import {
  SearchIcon,
  FilterAltOutlinedIcon,
  DownloadIcon,
  CloudOffIcon,
} from "../../../Resources/Icons/icons";
import Autocomplete from "@mui/material/Autocomplete";
import {
  GetBranch,
  GetCompany,
  GetSubProduct,
  GetPolicyType,
  GetSubBookingCode,
  GetMasterReport,
  GetUser,
  GetMasterReportExcelFormat,
  GetVehicleMake,
} from "../../../Service/_index";
import { Select, Space } from "antd";
import { DatePicker } from "antd";
import { filterOption, filterSort } from "../../../Shared/CommonConstant";
import moment from "moment";
import dayjs from "dayjs";
import Drawer from "@mui/material/Drawer";
import DownloadReport from "./DownloadReport";
import { CSVLink } from "react-csv";

const { RangePicker } = DatePicker;
const { Option } = Select;
const TodayDate = new Date();

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
    id: "issueDate",
    placeMent: true,
    disablePadding: false,
    label: "Policy Date",
  },
  {
    id: "company",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "policyNumber",
    placeMent: true,
    disablePadding: false,
    label: "Policy Number",
  },
  {
    id: "customerName",
    placeMent: true,
    disablePadding: false,
    label: "Customer Name",
  },
  {
    id: "registrationNumber",
    placeMent: true,
    disablePadding: false,
    label: "Reg Number",
  },
  {
    id: "odPremium",
    placeMent: true,
    disablePadding: false,
    label: "OD Premium",
  },
  {
    id: "tpPremium",
    placeMent: true,
    disablePadding: false,
    label: "TP Premium",
  },
  {
    id: "netPremium",
    placeMent: true,
    disablePadding: false,
    label: "NET Premium",
  },
  {
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Totl Premium",
  },
  {
    id: "userEmail",
    placeMent: true,
    disablePadding: false,
    label: "User Email",
  },
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

const MasterReport = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [report, setReport] = React.useState([]);
  const [summaryData, setSummary] = React.useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]); // Changes by Arun
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [policyTypeDetails, setPolicyTypeDetails] = useState([]);
  const [vehicleMakeDetails, setVehicleMakeDetails] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedUser, setSelectedUser] = useState(); //Changes by Arun
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedBookingCode, setSelectedBookingCode] = useState();
  const [selectedSubBookingCode, setSelectedSubBookingCode] = useState();
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedSubProduct, setSelectedSubProduct] = useState([]);
  const [selectedPolicyType, setSelectedPolicyType] = useState([]);
  // const [selectedVehicleMake,setSelectedVehicleMake]=useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
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

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.company},${el?.policyNumber},${el?.customerName},${
              el?.registrationNumber
            },${el?.odPremium},${el?.tpPremium},${el?.netPremium},${
              el?.totalPremium
            },${el?.userEmail},${moment(el?.issueDate).format("DD-MM-YYYY")}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0);
  };

  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled && e?.userType.includes("user")) {
          return {
            ...e,
            label: e.name + " - " + e.mobileNumber + ' - ' + e.email,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      setUserDetails(FilteredData.filter(Boolean));
    });
  };

  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled) {
          return {
            ...e,
            label: e.shortName,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      setCompanyDetails(FilteredData);
    });
  };

  const GetBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: "combineData" }).then((res) => {
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

  const GetBranchDetails = () => {
    GetBranch().then((res) => {
      const FilteredData = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e?.branchName,
              value: e?._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setBranchDetails(FilteredData);
    });
  };

  const GetProductDetails = () => {
    GetSubProduct({ isAscending: "combineData" }).then((res) => {
      const modifiedProductDetails = res?.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.product + " - " + e.subProduct,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setProductDetails(modifiedProductDetails);
    });
  };

  const GetPolicyTypeDetails = () => {
    GetPolicyType({ isAscending: true }).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled) {
          return {
            ...e,
            label: e.policyType,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      setPolicyTypeDetails(FilteredData);
    });
  };

  React.useEffect(() => {
    GetUserDetails();
    GetCompanyDetails();
    GetBookingCodeDetails();
    GetBranchDetails();
    GetProductDetails();
    GetPolicyTypeDetails();
  }, []);

  const HandleCustomDays = (startDate, endDate) => {
    setSelectedStartDate(dayjs(startDate.setHours(0, 0, 0, 0)));
    setSelectedEndDate(dayjs(endDate.setHours(23, 59, 59, 59)));
    setIsDatePickerOpen(false);
  };

  const header = [
    { label: "Policy Date", key: "formateData" },
    { label: "Company Name", key: "company" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Customer Name", key: "customerName" },
    { label: "OD Premium", key: "odPremium" },
    { label: "TP Premium", key: "tpPremium" },
    { label: "Net Premium", key: "netPremium" },
    { label: "Total Premium", key: "totalPremium" },
    { label: "User Email", key: "userEmail" },
    { label: "Vehicle Make", key: "make" }, //added by gokul..
  ];
  const csvFile = {
    filename: "Master Report Data",
    headers: header,
    data: report,
  };

  const getTableData = (requestType) => {
    console.log(selectedStartDate);
    console.log(selectedEndDate);
    let reqBody = {
      selectedProductIdList: selectedProduct,
      selectedSubProductIdList: selectedSubProduct,
      selectedBookingCodeId: selectedBookingCode,
      selectedSubBookingCodeId: selectedSubBookingCode,
      selectedUserId: selectedUser,
      selectedCompanyIdList: selectedCompany,
      selectedBranchId: selectedBranch,
      selectedPolicyTypeIdList: selectedPolicyType,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
      // selectedVehicleMakeIdList: selectedVehicleMake,//added by gokul..
    };
    GetMasterReport(requestType, reqBody).then((res) => {
      const FormatedData = res?.data?.tableData
        ? res.data.tableData
        : // .map((e) => {
          //     return {
          //       ...e,
          //       formateData: moment(e.issueDate).format("DD/MM/YYYY"),
          //     };
          //   })
          [];
      setReport(FormatedData);
      let data = res?.data;
      if (data) {
        delete data["tableData"];
        setSummary(data);
      } else {
        setSummary({});
      }
    });
  };

  const GetMasterReportExcelData = () => {
    let data = {
      selectedProductIdList: selectedProduct,
      selectedSubProductIdList: selectedSubProduct,
      selectedBookingCodeId: selectedBookingCode,
      selectedSubBookingCodeId: selectedSubBookingCode,
      selectedUserId: selectedUser,
      selectedCompanyIdList: selectedCompany,
      selectedBranchId: selectedBranch,
      selectedPolicyTypeIdList: selectedPolicyType,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
      // selectedVehicleMakeIdList:selectedVehicleMake,//added by gokul..
    };
    GetMasterReportExcelFormat(data).then((res) => {
      setExcelData(res);
      setExcelData([res.data]);
    });
  };

  return (
    <>
      <Grid container spacing={2} sx={{ padding: "10px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select User" value={selectedUser}>
            <Autocomplete
              className="AutoComplete_InputBox w-100"
              disablePortal
              id="combo-box-demo"
              options={userDetails}
              onChange={(option, value) =>
                value ? setSelectedUser(value._id) : setSelectedUser(null)
              }
              renderInput={(params) => <TextField {...params} />}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  {option.name + " - " + option.mobileNumber + " - "+ option.email}
                </li>
              )}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Branch" value={selectedBranch}>
            <Autocomplete
              id="combo-box-demo"
              className="AutoComplete_InputBox w-100"
              options={branchDetails}
              onChange={(option, value) =>
                value ? setSelectedBranch(value._id) : setSelectedBranch(null)
              }
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Company" value={selectedCompany}>
            <Select
              mode="multiple"
              className="AutoComplete_InputBox w-100"
              style={{ borderRadius: "0px", height: "43px" }}
              maxTagCount="responsive"
              filterOption={filterOption}
              onChange={(value) => setSelectedCompany(value)}
              filterSort={filterSort}
            >
              {companyDetails.map((el) => (
                <Option value={el?._id} key={el?.value}>
                  {el?.label}
                </Option>
              ))}
            </Select>
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel
            label="Select Booking code & Sub Booking Code"
            value={selectedBookingCode}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={bookingCodeDetails}
              onChange={(option, value) => {
                if (value) {
                  setSelectedBookingCode(value.bookingCodeId);
                  setSelectedSubBookingCode(value._id);
                } else {
                  setSelectedBookingCode(null);
                  setSelectedSubBookingCode(null);
                }
              }}
              className="AutoComplete_InputBox w-100"
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel
            label="Select Product & Sub Product"
            value={selectedProduct}
          >
            <Select
              mode="multiple"
              className="AutoComplete_InputBox w-100"
              style={{ borderRadius: "0px", height: "43px" }}
              maxTagCount="responsive"
              filterOption={filterOption}
              onChange={(selectedValues) => {
                console.log(selectedValues);
                try {
                  const parsedObjects = selectedValues.map((value) =>
                    JSON.parse(value)
                  );
                  const productValues = parsedObjects.map((el) => ({
                    productId: el.productID !== undefined ? el.productID : "",
                    subProductId: el._id !== undefined ? el._id : "",
                  }));
                  console.log("productValues ", productValues);
                  setSelectedProduct(productValues.map((obj) => obj.productId));
                  setSelectedSubProduct(
                    productValues.map((obj) => obj.subProductId)
                  );
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }}
              filterSort={filterSort}
            >
              {productDetails.map((el) => (
                <Option value={JSON.stringify(el)} key={el.value}>
                  {el.label}
                </Option>
              ))}
            </Select>
          </FloatLabel>
        </Grid>

        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Policytype" value={selectedPolicyType}>
            <Select
              mode="multiple"
              className="AutoComplete_InputBox w-100"
              style={{ borderRadius: "0px", height: "43px" }}
              maxTagCount="responsive"
              filterOption={filterOption}
              onChange={(value) => setSelectedPolicyType(value)}
              filterSort={filterSort}
            >
              {policyTypeDetails.map((el) => (
                <Option value={el._id} key={el.value}>
                  {el.label}
                </Option>
              ))}
            </Select>
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

        <Grid item sm={3} xs={12} sx={{ display: "flex" }} gap={2}>
          <Button
            onClick={getTableData.bind(null, "MASTER")}
            className="Common_Button"
            sx={{ width: "40%" }}
          >
            Master
          </Button>
          <Button
            onClick={getTableData.bind(null, "SCORE")}
            className="Common_Button"
            sx={{ width: "40%" }}
          >
            Score
          </Button>
        </Grid>
      </Grid>

      <Grid
        className="Count_Page"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
        mt={4}
        mb={4}
        gap={1}
      >
        <Grid className="Count_1" sx={{ width: "100%" }}>
          <Typography className="Total">
            {summaryData?.policyCount || 0}
          </Typography>
          <Typography className="Title">Policy Count </Typography>
        </Grid>
        <Grid className="Count_2" sx={{ width: "100%" }}>
          <Typography className="Total">{summaryData?.ODTotal || 0}</Typography>
          <Typography className="Title">OD Total </Typography>
        </Grid>
        <Grid className="Count_3" sx={{ width: "100%" }}>
          <Typography className="Total">{summaryData?.TPTotal || 0}</Typography>
          <Typography className="Title">TP Total</Typography>
        </Grid>
        <Grid className="Count_1" sx={{ width: "100%" }}>
          <Typography className="Total">
            {summaryData?.NETTotal || 0}
          </Typography>
          <Typography className="Title">NET Total </Typography>
        </Grid>
        <Grid className="Count_2" sx={{ width: "100%" }}>
          <Typography className="Total">{summaryData?.total || 0}</Typography>
          <Typography className="Title">Total</Typography>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Master Report
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}></Grid>
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
          <Grid item xs={12} sm={2} sx={{ display: "flex" }}>
            <Button
              className="Master_Header_create_Button"
              endIcon={<DownloadIcon />}
              sx={{ marginRight: "2px", width: "82%" }}
            >
              <CSVLink className="Download_Excel_Button" {...csvFile}>
                Download Excel
              </CSVLink>
            </Button>
            <Tooltip title="Special Filter">
              <FilterAltOutlinedIcon
                onClick={() => {
                  GetMasterReportExcelData();
                  setOpenDrawer(true);
                }}
                sx={{
                  color: "white",
                  width: "18%",
                  cursor: "pointer",
                  backgroundColor: "#0142DA",
                  padding: "9px",
                  borderRadius: "3px",
                  fontSize: "43px",
                  height: "40px",
                }}
              />
            </Tooltip>
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
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        {moment(row?.issueDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row?.company}</TableCell>
                      <TableCell align="left">{row?.policyNumber}</TableCell>
                      <TableCell align="left">{row?.customerName}</TableCell>
                      <TableCell align="left">
                        {row?.registrationNumber}
                      </TableCell>
                      <TableCell align="left">{row?.odPremium}</TableCell>
                      <TableCell align="left">{row?.tpPremium}</TableCell>
                      <TableCell align="left">{row?.netPremium}</TableCell>
                      <TableCell align="left">{row?.totalPremium}</TableCell>
                      <TableCell align="left">{row?.userEmail}</TableCell>
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
          <Drawer
            open={openDrawer}
            sx={{
              zIndex: 100,
            }}
            anchor="right"
            PaperProps={{
              sx: { width: { xs: "100%", sm: "50%" } },
            }}
          >
            {openDrawer ? (
              <DownloadReport
                setOpenDrawer={setOpenDrawer}
                excelData={excelData}
                header={header}
                report={report}
              />
            ) : null}
          </Drawer>
        </Paper>
      </div>
    </>
  );
};
export default MasterReport;
