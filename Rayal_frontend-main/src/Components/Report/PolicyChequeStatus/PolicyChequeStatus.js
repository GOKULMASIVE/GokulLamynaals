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
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { CloudOffIcon, SearchIcon , DownloadIcon} from "../../../Resources/Icons/icons";
import { GetPolicyChequeReport } from "../../../Service/_index";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { CSVLink } from "react-csv";

const Last7Days = new Date();
Last7Days.setDate(Last7Days.getDate() - 7);
const TodayDate = new Date();
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
    id: "policyDate",
    placeMent: true,
    disablePadding: false,
    label: "Policy Date",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "userName",
    placeMent: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "company",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "policyType",
    placeMent: true,
    disablePadding: false,
    label: "Policy Type",
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
    label: "Registeration No",
  },
  {
    id: "odStartDate",
    placeMent: true,
    disablePadding: false,
    label: "Od Start Date",
  },
  {
    id: "tpStartDate",
    placeMent: true,
    disablePadding: false,
    label: "TP start Date",
  },
  {
    id: "bookingCode",
    placeMent: true,
    disablePadding: false,
    label: "Booking Code",
  },
  {
    id: "subBookingCode",
    placeMent: true,
    disablePadding: false,
    label: "Sub Booking Code",
  },
  {
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Total Premium",
  },
  {
    id: "paymentMode",
    placeMent: true,
    disablePadding: false,
    label: "Payment Mode",
  },
  {
    id: "chequeStatus",
    placeMent: true,
    disablePadding: false,
    label: "Cheque Status",
  },
  {
    id: "chequeNumber",
    placeMent: true,
    disablePadding: false,
    label: "Cheque Number",
  },
  {
    id: "chequeDate",
    placeMent: true,
    disablePadding: false,
    label: "Cheque Date",
  },
  {
    id: "bank",
    placeMent: false,
    disablePadding: false,
    label: "Bank",
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

const PolicyChequeReport = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tableData, setTableData] = React.useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs(Last7Days));
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs(TodayDate));
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(tableData), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, tableData]
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


  const getTableData = () => {
    let reqBody = {
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
    };
    GetPolicyChequeReport(reqBody).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          PolicyDate:moment(e.policyDate).format('DD/MM/YYYY'),
          OdStartDate:moment(e.odStartDate).format('DD/MM/YYYY'),
          TpStartDate:moment(e.tpStartDate).format('DD/MM/YYYY'),
          ChequeDate:moment(e.chequeDate).format('DD/MM/YYYY'),
        }
      })
      setTableData(data);
    });
  };

  React.useEffect(() => {
    // getTableData();
  }, []);


  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.branch},${el?.userName},${el?.company},${el?.policyType},${el?.policyNumber},${el?.customerName},${el?.registrationNumber},${el?.bookingCode},${el?.subBookingCode},${el?.totalPremium},${el?.paymentMode},${el?.chequeStatus},${el?.chequeNumber},${el?.bank}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const header = [
    { label: "Policy Date", key: "PolicyDate" },
    { label: "OD Start Date", key: "OdStartDate" },
    { label: "TP Start Date", key: "TpStartDate" },
    { label: "Cheque Date", key: "ChequeDate" },
    { label: "User Name", key: "userName" },
    { label: "Policy Type", key: "policyType" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Customer Name", key: "customerName" },
    { label: "Registeration Number", key: "registrationNumber" },
    { label: "Booking Code", key: "bookingCode" },
    { label: "Sub Booking Code", key: "subBookingCode" },
    { label: "Total Premium", key: "totalPremium" },
    { label: "Payment Mode", key: "Cheque" },
    { label: "Cheque Status", key: "chequeStatus" },
    { label: "Cheque Number", key: "chequeNumber" },
    { label: "Bank", key: "bank" },




  ];
  const csvFile = {
    filename: "Cheque Report Data",
    headers: header,
    data: tableData,
  };
  return (
    <>
      <Grid container spacing={1} sx={{ padding: "20px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
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
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "40%" } }}
            onClick={() => getTableData()}
          >
            Cheque Report
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Cheque Report</Typography>
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
          className={
            "container-fluid TableBox "
          }
        >
          <TableContainer className="TableContainer">
            <Table
              aria-labelledby="tableTitle"
              size="small"
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
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        {moment(row?.policyDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row.branch}</TableCell>
                      <TableCell align="left">{row.userName}</TableCell>
                      <TableCell align="left">{row.company}</TableCell>
                      <TableCell align="left">{row.policyType}</TableCell>
                      <TableCell align="left">{row.policyNumber}</TableCell>
                      <TableCell align="left">{row.customerName}</TableCell>
                      <TableCell align="left">
                        {row.registrationNumber}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row?.odStartDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row?.tpStartDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row.bookingCode}</TableCell>
                      <TableCell align="left">{row.subBookingCode}</TableCell>
                      <TableCell align="left">{row.totalPremium}</TableCell>
                      <TableCell align="left">{row.paymentMode}</TableCell>
                      <TableCell align="left">{row.chequeStatus}</TableCell>
                      <TableCell align="left">{row.chequeNumber}</TableCell>
                      <TableCell align="left">
                        {moment(row?.chequeDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row.bank}</TableCell>
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
            count={filter.fn(tableData).length || 0}
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
export default PolicyChequeReport;
