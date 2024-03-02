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
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../UiComponents/Toaster/Toast";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  AccountBalanceWalletIcon,
  SearchIcon,
  EditIcon,
  DownloadIcon,
  CloudOffIcon,
  RestartAltIcon,
} from "../../Resources/Icons/icons";
import moment from "moment";
import ManageWallet from "./ManageWallet";

import {
  GetCompanyWallet,
  DeleteBranch,
  GetCompany,
  GetBookingCode,
  GetSubBookingCode,
  GetPolicyFindbyId,
  FilterPolicyList,
  GetUser,
  GetUserWallet,
} from "../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CommonPayableDrawer from "../CommonPayableDrawer/CommonPayableDrawer";
import { PolicyFilterTypes } from "../../Shared/CommonConstant";
import Loader from "../../UiComponents/Loader/Loader";
import { DatePicker, Radio } from "antd";
import { CSVLink } from "react-csv";
import { useEffect } from "react";

const { RangePicker } = DatePicker;

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
    id: "bookingCode",
    numeric: true,
    disablePadding: false,
    label: "Booking Code",
  },
  {
    id: "subBookingCode",
    numeric: true,
    disablePadding: false,
    label: "Sub Booking Code",
  },
  {
    id: "totalCommisionPayable",
    numeric: true,
    disablePadding: false,
    label: "Commision Payable",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Transaction",
  },
];

const EnhancedTableHead = (props) => {
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
            align={headCell.numeric ? "left" : "center"}
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
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const CompanyWallet = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [wallet, setWallet] = React.useState([]);

  const [openLoader, setOpenLoader] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [resetValue, setResetValue] = useState(1);
  const [filterType, setFilterType] = useState();

  const [userDetails, setUserDetails] = useState([]);
  const [totalWallet, setTotalWallet] = useState([]);

  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  // defined by gokul....

  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [subBookingCodeValue, setSubBookingCodeValue] = useState(null);
  const [bookingCodeValue, setBookingCodeValue] = useState(null);
  const [bookingCodeId, setBookingCodeId] = useState();

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(wallet), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, wallet]
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



  const GetUserDetails = async () => {
    setOpenLoader(true);
    try {
      const res = await GetUser({ isAscending: true });
      setOpenLoader(false);

      const modifiedUserDetails = res.data.map((e) => {
        return {
          ...e,
          label: e.name,
          value: e._id,
        };
      });

      setUserDetails(modifiedUserDetails);
    } catch (error) {
      setOpenLoader(false);

      console.error(error);
    }
  };

  useEffect(() => {
    GetUserDetails();
  }, []);

  const calculateSum = (arr) => {
    return arr?.reduce((total, current) => {
      return Number(total) + Number(current);
    }, 0);
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.subBookingCode},${el?.bookingCode},${el.totalCommisionPayable}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
  };

  const GetData = () => {
    setOpenLoader(true);

    GetCompanyWallet({
      bookingCodeId: bookingCodeId,
      subBookingCodeId: subBookingCodeValue,
      startDate: selectedStartDate?.setHours(0, 0, 0, 0),
      endDate: selectedEndDate?.setHours(23, 59, 59, 59),
    })
      .then((res) => {
        setOpenLoader(false);
        const FilteredWallet = res.data.filter(
          (e) => e?.totalCommisionPayable !== 0
        );
        setWallet(FilteredWallet);
        const totalWalletValues = res.data.map((e) => e?.totalCommisionPayable);
        setTotalWallet(totalWalletValues);
      })
      .catch((err) => {
        setOpenLoader(false);
        console.log("err");
      });
  };

  const ResetFilter = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setResetValue(resetValue + 1);
    setWallet([]);
  };

  const header = [
    { label: "Booking Code", key: "bookingCode" },
    { label: "SubBooking Code", key: "subBookingCode" },
    { label: "Commission Payable", key: "totalCommisionPayable" },
  ];
  const csvFile = {
    filename: "Company Wallet Data",
    headers: header,
    data: wallet,
  };
  const FilterOptions = [
    {
      label: "Daily Payout",
      value: "Daily",
    },
    {
      label: "Weekly Payout",
      value: "Weekly",
    },
    {
      label: "Monthly Payout",
      value: "Monthly",
    },
    {
      label: "All Payout",
      value: "All",
    },
  ];

  const StateMentFunction = (e) => {
    setOpenDrawer(true);
    setSelectedData(e);
  };

  // Written by gokul...
  const getBookingCodeFunct = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
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
    });
  };

  const getSubBookingCodeFunct = () => {
    GetSubBookingCode({ isAscending: true }).then((res) => {
      const modifiedSubBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.subBookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      const FilterSubBookingCodeDetails = modifiedSubBookingCodeDetails.filter(
        (item) => item.bookingCode === bookingCodeValue
      );

      setSubBookingCodeDetails(FilterSubBookingCodeDetails);
    });
  };
  useEffect(() => {
    getSubBookingCodeFunct();
  }, [bookingCodeValue]);
  useEffect(() => getBookingCodeFunct(), []);

  return (
    <>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Booking Code" value={bookingCodeValue}>
            <Autocomplete
              className="AutoComplete_InputBox"
              disablePortal
              id="combo-box-demo"
              options={bookingCodeDetails}
              onChange={(e, v) => {
                setBookingCodeValue(v?.label);
                setBookingCodeId(v?._id);
              }}
              clearIcon={false}
              value={bookingCodeValue}
              isOptionEqualToValue={(option, value) =>
                option.bookingCode === value
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel
            label="Select SubBooking Code"
            value={subBookingCodeValue}
          >
            <Autocomplete
              className="AutoComplete_InputBox"
              disablePortal
              id="combo-box-demo"
              options={subBookingCodeDetails}
              value={subBookingCodeValue}
              onChange={(e, v) => {
                setSubBookingCodeValue(v?.label);
              }}
              clearIcon={false}
              isOptionEqualToValue={(option, value) =>
                option.bookingCodeId === value
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker
              placement="bottomLeft"
              className="textField w-100"
              style={{ borderRadius: "0px" }}
              onChange={(e) => {
                setSelectedStartDate(e ? e[0].$d : null);
                setSelectedEndDate(e ? e[1].$d : null);

              }}
              format="DD/MM/YYYY"
              key={resetValue}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
            onClick={() => GetData()}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }} mt={1}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Company Wallet
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3.5}></Grid>
          <Grid item xs={12} sm={2}>
            <Button
              className="Common_Button w-100"
              startIcon={<AccountBalanceWalletIcon />}
            >
              Total Wallet ={" "}
              {calculateSum(totalWallet?.map((value) => value)).toFixed(2)}
            </Button>
          </Grid>
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
        <Paper className={"container-fluid TableBox "}>
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
                rowCount={wallet?.length}
              />
              <TableBody>
                {visibleRows?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">{row?.bookingCode}</TableCell>
                      <TableCell align="left">{row?.subBookingCode}</TableCell>
                      <TableCell align="left">
                        {row?.totalCommisionPayable}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          className="ActionIcons d-flex"
                          sx={{ justifyContent: "center" }}
                        >
                          <Button
                            variant="outlined"
                            color="success"
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "50%",
                                backgroundColor: "green",
                                fontSize: "12px",
                                color: "white",
                                padding: "10px",
                                textTransform: "capitalize",
                                "&:hover": {
                                  color: "green",
                                },
                              },
                            }}
                            onClick={() => StateMentFunction(row)}
                          >
                            Statement
                          </Button>
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
            count={wallet?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Loader open={openLoader} />
      <Drawer
        open={openDrawer}
        sx={{
          zIndex: 100,
        }}
        anchor="right"
        PaperProps={{
          sx: { width: { xs: "100%", sm: "100%" } },
        }}
      >
        {openDrawer ? (
          <ManageWallet
            setOpenDrawer={setOpenDrawer}
            selectedData={selectedData}
            formType={selectedData?._id ? "edit" : "add"}
            GetData={GetData}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
          />
        ) : null}
      </Drawer>
    </>
  );
};
export default CompanyWallet;
