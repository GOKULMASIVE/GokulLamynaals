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
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import moment from "moment";
import { visuallyHidden } from "@mui/utils";
import { CloudOffIcon, SearchIcon, DownloadIcon } from "../../../Resources/Icons/icons";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GetTDSReport } from "../../../Service/_index";
import { CSVLink } from "react-csv";
import { DatePicker, Space } from 'antd';

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

const Month_headCells = [
  {
    id: "month",
    placeMent: true,
    disablePadding: false,
    label: "Month",
  },
  {
    id: "websiteName",
    placeMent: true,
    disablePadding: false,
    label: "Website Name",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "accountHolderName",
    placeMent: true,
    disablePadding: false,
    label: "Acc Holder Name",
  },
  {
    id: "panNumber",
    placeMent: true,
    disablePadding: false,
    label: "Pan Number",
  },
  {
    id: "amount",
    placeMent: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "tdsPercentage",
    placeMent: true,
    disablePadding: false,
    label: "TDS Percentage",
  },
  {
    id: "tdsAmount",
    placeMent: true,
    disablePadding: false,
    label: "TDS Amount",
  },
  {
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
];

const Date_headCells = [
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
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, isMonth } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCells = isMonth ? Month_headCells : Date_headCells;
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

const TdsReport = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [isMonth, setIsMonth] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [filterType, setFilterType] = useState()

  console.log(filterType)
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


  const getTableData = (requestType) => {
    setFilterType(requestType)
    GetTDSReport(requestType, selectedDate).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          PaymentDate: moment(e?.paymentDate).format('DD/MM/YYYY'),
          TransactionDate: moment(e?.transactionDate).format('DD/MM/YYYY')
        }
      }).filter(Boolean)
      setData(data);
    });
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.userName},${el?.branch},${el?.amount},${el?.TDSamount},${el?.company}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const MonthOfFilterFunction = () => {
    setIsMonth(true);
    getTableData("MONTH");
  };

  const DateOfFilterFunction = () => {
    setIsMonth(false);
    getTableData("DATE");
  };

  const header = [
    { label: "Transaction Date", key: "TransactionDate" },
    { label: "Payment Date", key: "PaymentDate" },
    { label: "User Name", key: "userName" },
    { label: "Branch", key: "branch" },
    { label: "Amount", key: "amount" },
    { label: "Payment", key: "payment" },
    { label: "Company", key: "company" },
  ];

  const csvFile = {
    filename: "TDS Report Data",
    headers: filterType === 'MONTH' ? header.filter((item) => item.key !== 'TransactionDate' && item.key !== 'PaymentDate') : header,
    data: data,
  };

  
  return (
    <>
      <Grid container spacing={1} sx={{ padding: "10px 10px 0 10px" }}>
        <Grid item sm={3} xs={12} className="datePicker">
          <FloatLabel label="Month & Year" value="react">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="Date_Picker w-100"
                views={["month", "year"]}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
              />
            </LocalizationProvider>
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12} sx={{ display: "flex" }} gap={1}>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
            onClick={() => MonthOfFilterFunction()}
          >
            Month
          </Button>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
            onClick={() => DateOfFilterFunction()}
          >
            Date
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">TDS Report</Typography>
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
                isMonth={isMonth}
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
                        {isMonth
                          ? Intl.DateTimeFormat("en-US", {
                            month: "long",
                          }).format(selectedDate)
                          : moment(row?.transactionDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth
                          ? row.userName
                          : moment(row?.paymentDate).format("DD-MM-YYYY LT")}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth ? row.branch : row.userName}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth
                          ? row?.bankDetails?.find(
                            (ele) => ele.accountNumber == row.accountNumber
                          )?.bankAccountHolderName || ""
                          : row.branch}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth
                          ? row?.bankDetails?.find(
                            (ele) => ele.accountNumber == row.accountNumber
                          )?.panNumber || ""
                          : row.amount}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth
                          ? row.amount
                          : row?.bankDetails?.find(
                            (ele) => ele.accountNumber == row.accountNumber
                          )?.bankName || ""}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth ? row?.TDS : row.remark}
                      </TableCell>
                      <TableCell align="left">
                        {isMonth ? row?.TDSamount?.toFixed(2) : row.payment}
                      </TableCell>
                      <TableCell align="left">{row.company}</TableCell>
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
            count={filter.fn(data).length || 0}
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
export default TdsReport;
