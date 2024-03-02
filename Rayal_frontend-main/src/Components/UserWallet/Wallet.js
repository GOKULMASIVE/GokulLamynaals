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
  GetPolicyList,
  DeleteBranch,
  GetCompany,
  GetBookingCode,
  GetPolicyFindbyId,
  FilterPolicyList,
  GetUser,
  GetUserWallet,
} from "../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CommonPayableDrawer from "../CommonPayableDrawer/CommonPayableDrawer";
import { checkUserType } from "../../Shared/CommonConstant";
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
    id: "user",
    placeMent: true,
    disablePadding: false,
    label: "User",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "balance",
    placeMent: true,
    disablePadding: false,
    label: "Balance",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Transaction",
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
  rowCount: PropTypes.number.isRequired,
};

const Wallet = () => {
  const UserType = localStorage.getItem('userType')

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [wallet, setWallet] = React.useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isAllow, setIsAllow] = useState({})
  const [filterType, setFilterType] = useState(UserType === 'user' ? "All" : "Weekly");
  const [selectedUser, setSelecteduser] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [totalWallet, setTotalWallet] = useState([]);

  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });


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


  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData)
      .then((res) => {
        const FilteredData = res.data
          .map((e) => {
            if (e.userType.includes("user")) {
              return {
                ...e,
                label: e.name + " - " + e.mobileNumber + ' - ' + e.email,
                value: e?._id,
              };
            } else {
              return null;
            }
          })
          .filter(Boolean);
        setUserDetails(FilteredData);
      })
      .catch((err) => ToastError("Network Error"));
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
            `${el?.userName},${el?.branch} , ${el?.walletBalance}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetData = () => {
    setOpenLoader(true);
    GetUserWallet(filterType, {
      userId: selectedUser,
      startDate: selectedStartDate?.setHours(0, 0, 0, 0),
      endDate: selectedEndDate?.setHours(23, 59, 59, 59),
    })
      .then((res) => {
        setOpenLoader(false);
        setWallet(res.data);
        const totalWalletValues = res.data.map((e) => e?.walletBalance);
        setTotalWallet(totalWalletValues);
      })
      .catch((err) => {
        setOpenLoader(false);
      });
  };

  useEffect(() => {
    GetData();
  }, []);


  const header = [
    { label: "User Name", key: "userName" },
    { label: "Branch", key: "branch" },
    { label: "Wallet Balance", key: "walletBalance" },
  ];


  const csvFile = {
    filename: "User Wallet",
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

  React.useEffect(() => {
    const renderData = checkUserType(UserType);
    setIsAllow(renderData);
  }, [UserType]);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ padding: "10px 10px 0 10px" }}
        className="Master_Header_Container"
      >
        <Grid item xs={12} sm={3} sx={{ display: isAllow.isUser ? 'none' : 'block' }}>
          <FloatLabel label="Filter Type" value={filterType}>
            <Autocomplete
              className="AutoComplete_InputBox"
              options={FilterOptions}
              defaultValue={FilterOptions.find((el) => el.value === "Weekly")}
              onChange={(e, v) => {
                setFilterType(v ? v?.value : null);
              }}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12} sx={{ display: isAllow.isUser ? 'none' : 'block' }}>
          <FloatLabel label="Select User" value={selectedUser}>
            <Autocomplete
              className="AutoComplete_InputBox"
              disablePortal
              id="combo-box-demo"
              options={userDetails}
              onChange={(e, v) => setSelecteduser(v?._id)}
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
            />
          </FloatLabel>
        </Grid>

        <Grid
          item
          sm={3}
          xs={12}
          sx={{ display: "flex", marginBottom: "8px" }}
          gap={2}
        >
          <Button
            className="Master_Header_create_Button"
            sx={{ width: { xs: "100%", sm: "50%" } }}
            onClick={() => {
              GetData();
            }}
          >
            Search
          </Button>
        </Grid>
        <Grid item sm={3} xs={12} sx={{ display: isAllow.isUser ? 'block' : 'none' }} />

      </Grid>
      <Box sx={{ flexGrow: 1 }} mt={4}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              User Wallet
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3.5}></Grid>
          <Grid item xs={12} sm={2}>
            <Button
              className="Master_Header_create_Button w-100"
              startIcon={<AccountBalanceWalletIcon />}
            >
              Total Wallet =
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
                      tabIndex={-1}
                      key={row.userId}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">{row?.userName}</TableCell>
                      <TableCell align="left">{row?.branch}</TableCell>
                      <TableCell align="left">
                        {row?.walletBalance.toFixed(2)}
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
            count={filter.fn(wallet).length || 0}
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
export default Wallet;
