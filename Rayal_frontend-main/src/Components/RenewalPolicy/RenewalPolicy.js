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
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import ViewRenewalPolicy from "./ViewRenewalPolicy";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import moment from 'moment';
import dayjs from "dayjs";
import { visuallyHidden } from "@mui/utils";
import { RemoveRedEyeIcon, SearchIcon, DownloadIcon } from "../../Resources/Icons/icons";
import { GetRenewalData, GetPolicyFindbyId, GetPolicyFileById } from "../../Service/_index";
import { DatePicker } from 'antd';
import { CloudOffIcon } from "../../Resources/Icons/icons";
import { CSVLink } from "react-csv";
import Loader from '../../UiComponents/Loader/Loader'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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
    id: "branchName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "product",
    placeMent: true,
    disablePadding: false,
    label: "Product",
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
    id: "mobile",
    placeMent: true,
    disablePadding: false,
    label: "Mobile",
  },
  {
    id: "regNumber",
    placeMent: true,
    disablePadding: false,
    label: "Reg Number",
  },
  {
    id: "expiryDate",
    placeMent: true,
    disablePadding: false,
    label: "Expiry Date",
  },
  {
    id: "oldPremium",
    placeMent: true,
    disablePadding: false,
    label: "Old Premium",
  },
  {
    id: "Email",
    placeMent: true,
    disablePadding: false,
    label: "User",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
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


const RenewalPolicy = () => {
  const todayDate = new Date()
  const LastWeekDate = new Date();
  LastWeekDate.setDate(LastWeekDate.getDate() - 7);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openLoader, setOpenLoader] = useState(false)
  const [renewalPolicy, setRenewalPolicy] = React.useState([]);
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(renewalPolicy), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, renewalPolicy]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - renewalPolicy.length) : 0;



  const lastMonth = moment().subtract(1, 'months').startOf('month');
  const today = moment();

  const GetData = () => {
    const Range = { startDate: lastMonth, endDate: today }
    GetRenewalData(Range).then((res) => {
      setRenewalPolicy(res.data);
    });
  };

  React.useEffect(() => {
    GetData();
  }, []);

  const [startDate, setStartDate] = useState(dayjs(LastWeekDate)?.$d)
  const [endDate, setEndDate] = useState(dayjs(todayDate)?.$d)

  const UniverselSearch = () => {
    const Range = { startDate: startDate?.setHours(0, 0, 0, 0), endDate: endDate?.setHours(23, 59, 59, 59) }
    GetRenewalData(Range).then((res) => {
      console.log(res.data)
      const data = res.data.map((e) => {
        return{
          ...e,
          formatDate:moment(e.tpPolicyEndDate).format('DD/MM/YYYY')
        }
      })
      setRenewalPolicy(data);
    });
  }

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.companyId?.companyName},${el?.productId?.product},${el?.policyNumber},${el?.customerName},${el?.mobileNumber},${el?.registrationNumber},${el?.email}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)
    
  };


  const ViewRenewalPolicyFunction = (row) => {
    GetPolicyFindbyId(row._id).then((res) => {
      setOpenDrawer(true);
      setSelectedData(res?.data);

    })
  }

  const header = [
    { label: "Company Name", key: "companyId.companyName" },
    { label: "Product", key: "productId.product" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Customer Name", key: "customerName" },
    { label: "Mobile", key: "mobileNumber" },
    { label: "Reg Number", key: "registrationNumber" },
    { label: "Expiry Date", key: "formatDate" },
    { label: "Old Premium", key: "remarks" },
    { label: "User", key: "email" },
  ];

  const csvFile = {
    filename: "Renewal Policy",
    headers: header,
    data: renewalPolicy
  };


  const OpenPolicyFile = (row) => {
    setOpenLoader(true)
    GetPolicyFileById(row?._id).then((res) => {
      const pdfUrl = res.data.policyFile.downloadURL
      return pdfUrl
    }).then((pdfUrl) => {
      setOpenLoader(false)
      const pdfWindow = window.open("", "_blank");
      pdfWindow?.document?.write(
        `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
      );
    })
  };

  return (
    <>
      <Grid container sx={{ padding: '10px 10px 0 10px' }} className="Master_Header_Container">
        <Grid item xs={12} sm={3}>
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker placement='bottomLeft' className="w-100 Range_Picker" onChange={(e) => {
              setStartDate(e ? e[0].$d : null);
              setEndDate(e ? e[1].$d : null);
             
            }}
              defaultValue={[dayjs(moment(LastWeekDate).format("YYYY-MM-DD"), dateFormat), dayjs(moment(todayDate).format("YYYY-MM-DD"), dateFormat)]}
              format='DD/MM/YYYY'
            />
          </FloatLabel>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button endIcon={<SearchIcon />}
            sx={{ margin: '0 0 6px 20px' }}
            onClick={() => UniverselSearch()}
            className="Master_Header_create_Button w-25"
          >Search</Button>
        </Grid> <Grid item xs={12} sm={6} />
      </Grid>
      <Box sx={{ flexGrow: 1 }} mt={3}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Renewal Policy</Typography>
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
            >
              <CSVLink className="Download_Excel_Button" {...csvFile} >
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
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        {row?.companyId?.shortName}
                      </TableCell>
                      <TableCell align="left">{row?.productId?.product}</TableCell>
                      <TableCell align="left" sx={{ color: 'blue' }}>
                        <label onClick={() => OpenPolicyFile(row)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{row?.policyNumber}</label>
                      </TableCell>
                      <TableCell align="left">{row?.customerName}</TableCell>
                      <TableCell align="left">{row?.mobileNumber}</TableCell>
                      <TableCell align="left">{row?.registrationNumber}</TableCell>
                      <TableCell align="left">{moment(row.tpPolicyEndDate).format("DD/MM/YYYY")}</TableCell>
                      <TableCell align="left">{row.remarks}</TableCell>
                      <TableCell align="left">{row?.email}</TableCell>
                      <TableCell align="center">
                        <Box className="ActionIcons">
                          <Tooltip title="View" onClick={() => ViewRenewalPolicyFunction(row)}>
                            <RemoveRedEyeIcon
                            />
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
            count={filter.fn(renewalPolicy).length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
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
        {
          openDrawer ? <ViewRenewalPolicy setOpenDrawer={setOpenDrawer} selectedData={selectedData} /> : null
        }
      </Drawer>
      <Loader open={openLoader} />
    </>
  );
};
export default RenewalPolicy;
