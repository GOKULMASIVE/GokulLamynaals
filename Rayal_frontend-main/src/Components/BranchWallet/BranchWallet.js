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
  RemoveRedEyeIcon,
  SearchIcon,
  EditIcon,
  DownloadIcon,
  CloudOffIcon,
  RestartAltIcon,
} from "../../Resources/Icons/icons";
import moment from "moment";
// import ManageWallet from "./ManageWallet";

import { GetBranchWallet } from "../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CommonPayableDrawer from "../CommonPayableDrawer/CommonPayableDrawer";
import { PolicyFilterTypes } from "../../Shared/CommonConstant";
import Loader from "../../UiComponents/Loader/Loader";
import { DatePicker, Radio } from "antd";
import { CSVLink } from "react-csv";
import { useEffect } from "react";
import ManageBranchWallet from "./ManageBranchWallet";
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
    id: "name",
    placeMent: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "branchPayable",
    placeMent: true,
    disablePadding: false,
    label: "Branch Payable",
  },
  {
    id: "commisionPayable",
    placeMent: true,
    disablePadding: false,
    label: "Commision Payable",
  },
  {
    id: "pendingPayable",
    placeMent: true,
    disablePadding: false,
    label: "Pending Payable",
  },
  {
    id: "transaction",
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

const BranchWallet = () => {
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
  const [resetValue, setResetValue] = useState(1);

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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - wallet.length) : 0;

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.branchManager},${el?.branch},${el?.branchPayable},${el?.commisionPayable},${el?.pendingBalance}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetData = () => {
    setOpenLoader(true);
    GetBranchWallet({startDate:selectedStartDate,endDate:selectedEndDate})
      .then((res) => {
        setOpenLoader(false);
        const FilteredData = res.data.filter(
          (item) => item.pendingBalance !== 0
        );
        // console.log(FilteredData);
        setWallet(FilteredData);
      })
      .catch((err) => {
        setOpenLoader(false);
        console.log("err");
      });
  };

  const header = [
    { label: "Branch Manager", key: "branchManager" },
    { label: "Branch", key: "branch" },
    { label: "Branch Payable", key: "branchPayable" },
    { label: "Commision Payable", key: "commisionPayable" },
    { label: "Pending Payable", key: "pendingBalance" },
  ];
  const csvFile = {
    filename: "Branch Payable Data",
    headers: header,
    data: wallet,
  };

  const StateMentFunction = (row) => {
    setOpenDrawer(true);
    setSelectedData(row);
  };
  return (
    <>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
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
            sx={{ width: { xs: "100%", sm: "45%" } }}
            onClick={() => GetData()}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }} mt={4}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Branch Wallet
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
                      key={row?._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">{row?.branchManager}</TableCell>
                      <TableCell align="left">{row?.branch}</TableCell>
                      <TableCell align="left">
                        {row?.branchPayable.toFixed(2)}
                      </TableCell>
                      <TableCell align="left">
                        {row?.commisionPayable.toFixed(2)}
                      </TableCell>
                      <TableCell align="left">
                        {row?.pendingBalance.toFixed(2)}
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
          <ManageBranchWallet
            selectedData={selectedData}
            setOpenDrawer={setOpenDrawer}
          />
        ) : null}
      </Drawer>
    </>
  );
};
export default BranchWallet;
