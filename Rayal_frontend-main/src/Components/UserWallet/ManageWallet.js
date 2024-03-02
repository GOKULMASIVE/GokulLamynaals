import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { GetUserWalletByUserId } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  DeleteIcon,
  SearchIcon,
  CloudOffIcon,
} from "../../Resources/Icons/icons";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import PaidTransaction from "./PaidTransaction";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { CSVLink } from "react-csv";
import { GetPolicyFileById } from "../../Service/_index";
import Loader from "../../UiComponents/Loader/Loader";
import { ToastError } from "../../UiComponents/Toaster/Toast";

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
    id: "approveDate",
    placeMent: true,
    disablePadding: false,
    label: "Approve Date",
  },
  {
    id: "policyDate",
    placeMent: true,
    disablePadding: false,
    label: "Policy Date",
  },
  {
    id: "companyName",
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
    id: "paymentMode",
    placeMent: true,
    disablePadding: false,
    label: "Payment Mode",
  },
  {
    id: "netPremium",
    placeMent: true,
    disablePadding: false,
    label: "Net Premium",
  },
  {
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Total Premium",
  },
  {
    id: "payableAmount",
    placeMent: true,
    disablePadding: false,
    label: "Payable Amount",
  },
  {
    id: "policyBalance",
    placeMent: true,
    disablePadding: false,
    label: "Policy Balance",
  },
  {
    id: "walletBalance",
    placeMent: true,
    disablePadding: false,
    label: "Wallet Balance",
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
            style={{ minWidth: headCells.minWidth }}
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
  // rowCount: PropTypes.number.isRequired,
};

const ManageWallet = (props) => {
  const { selectedData, formType, setOpenDrawer, GetData, startDate, endDate } =
    props;
  let formRef = useRef();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = useState([]);
  const [openPaidTransaction, setOpenPaidTransaction] = useState();
  const [functionType, setFunctionType] = useState();
  const [openLoader, setOpenLoader] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("25%");

  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });
  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(data), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, data]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const UserId = localStorage.getItem("UserId");

  const GetUserWalletDetails = () => {
    GetUserWalletByUserId(selectedData.userId, { startDate, endDate }).then(
      (res) => {
        setData(res.data);
      }
    );
  };

  useEffect(() => {
    GetUserWalletDetails();
  }, []);

  const PaidUserName = visibleRows[0]?.userName;

  const PaidFunction = () => {
    setOpenPaidTransaction(true);
    setFunctionType("Paid");
  };

  const ReceivedFunction = () => {
    setOpenPaidTransaction(true);
    setFunctionType("Received");
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.policyNumber},${el?.companyName},${el.customerName},${el?.netPremium},${el?.paymentMode},${el?.totalPremium},${el?.payableAmount},${el?.policyBalance},${el?.walletBalance}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
  };


  const OpenPolicyFile = (row) => {
    setOpenLoader(true);
    GetPolicyFileById(row?.policyId)
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
      })
      .catch((err) => {
        ToastError("Something went wrong");
        setOpenLoader(false);
      });
  };
  const header = [
    { label: "Approve Date", key: "approvedDate" },
    { label: "Policy Date", key: "policyDate" },
    { label: "Company Name", key: "companyName" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Customer Name", key: "customerName" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Net Premium", key: "netPremium" },
    { label: "Total Premium", key: "totalPremium" },
    { label: "Payable Amount", key: "payableAmount" },
    { label: "Policy Balance", key: "policyBalance" },
    { label: "Wallet Balance", key: "walletBalance" },
  ];
  const csvFile = {
    filename: "User Manage Wallet",
    headers: header,
    data: data,
  };
  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>Manage Wallet</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid" style={{ padding: "0 34px 0 34px" }}>
          <div>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Button className="Common_Button">
                  Total Manage Wallet ={" "}
                  {visibleRows[0]?.walletBalance.toFixed(2)}
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <ButtonGroup sx={{ display: "flex", gap: "8px" }}>
                  <Button
                    className="Common_Button"
                    onClick={() => PaidFunction()}
                  >
                    Paid
                  </Button>
                  <Button
                    className="Common_Button"
                    onClick={() => ReceivedFunction()}
                  >
                    Received
                  </Button>
                  <Button className="Common_Button">
                    <CSVLink
                      style={{ textDecoration: "none", color: "white" }}
                      {...csvFile}
                    >
                      Download Excel
                    </CSVLink>
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>

            <Box>
              <Grid
                container
                className="Master_Header_Container"
                spacing={2}
                sx={{ padding: "20px 0px" }}
              >
                <Grid item xs={12} sm={3}>
                  <Typography className="Master_Header_Heading">
                    Transaction of {visibleRows[0]?.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}></Grid>
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
              </Grid>
            </Box>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer className="TableContainer">
                <Table
                  aria-labelledby="tableTitle"
                  size="small"
                  stickyHeader
                  sx={{ minWidth: 750 }}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.length}
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
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {moment(row?.approvedDate).format("DD-MM-YYYY LT")}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {moment(row?.policyDate).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell align="left">{row?.companyName}</TableCell>
                          <TableCell align="left" sx={{ color: "blue" }}>
                            <label
                              onClick={() => OpenPolicyFile(row)}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              {row?.policyNumber}
                            </label>
                          </TableCell>
                          <TableCell align="left">
                            {row?.customerName}
                          </TableCell>
                          <TableCell align="left">{row?.paymentMode}</TableCell>
                          <TableCell align="left">{row?.netPremium}</TableCell>
                          <TableCell align="left">
                            {row?.totalPremium}
                          </TableCell>
                          <TableCell align="left">
                            {row?.payableAmount}
                          </TableCell>
                          <TableCell align="left">
                            {row?.policyBalance}
                          </TableCell>
                          <TableCell align="left">
                            {row?.walletBalance.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
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
                count={data?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </div>

        <Drawer
          open={openPaidTransaction}
          sx={{
            zIndex: 101,
          }}
          anchor="right"
          PaperProps={{
            sx: { width: { xs: "100%", sm: drawerWidth } },
          }}
        >
          {openPaidTransaction ? (
            <PaidTransaction
              setOpenPaidTransaction={setOpenPaidTransaction}
              selectedData={selectedData}
              PaidUserName={PaidUserName}
              GetUserWalletDetails={GetUserWalletDetails}
              functionType={functionType}
              GetData={GetData}
              setDrawerWidth={setDrawerWidth}
            />
          ) : null}
        </Drawer>
      </div>
      <Loader open={openLoader} />
    </>
  );
};

export default ManageWallet;
