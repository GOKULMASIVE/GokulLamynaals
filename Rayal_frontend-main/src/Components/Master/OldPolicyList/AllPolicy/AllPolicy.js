import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../../UiComponents/FloatLabel/FloatLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { visuallyHidden } from "@mui/utils";
import Drawer from "@mui/material/Drawer";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  EditIcon,
  SearchIcon,
  DeleteIcon,
} from "../../../../Resources/Icons/icons";
import AppBar from "@mui/material/AppBar";
import {  GetCompany } from "../../../../Service/_index";
import moment from "moment";
import { useEffect } from "react";
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


const initialValues = {
  companyId:''
}
const headCells = [
  {
    id: "issueDate",
    placeMent: true,
    disablePadding: false,
    label: "Policy Date",
    minWidth: "150px",
  },
  {
    id: "remarks",
    placeMent: true,
    disablePadding: false,
    label: "Company",
    minWidth: "150px",
  },
  {
    id: "status",
    placeMent: false,
    disablePadding: false,
    label: "Policy Number",
    minWidth: "150px",
  },
  {
    id: "customerName",
    placeMent: false,
    disablePadding: false,
    label: "Customer Name",
    minWidth: "150px",
  },
  {
    id: "regnumber",
    placeMent: false,
    disablePadding: false,
    label: "Registeration Number",
    minWidth: "150px",
  },
  {
    id: "ODpremium",
    placeMent: false,
    disablePadding: false,
    label: "Od Premium",
    minWidth: "150px",
  },
  {
    id: "netPremium",
    placeMent: false,
    disablePadding: false,
    label: "Net Premium",
    minWidth: "150px",
  },
  {
    id: "totalPremium",
    placeMent: false,
    disablePadding: false,
    label: "Total Premium",
    minWidth: "150px",
  },
  {
    id: "email",
    placeMent: false,
    disablePadding: false,
    label: "User Email",
    minWidth: "150px",
  },
  {
    id: "policyStatus",
    placeMent: false,
    disablePadding: false,
    label: "Policy Status",
    minWidth: "150px",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
    minWidth: "150px",
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

const AllPolicy = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterData, setFilterData] = useState();
  const [openSearchPolicyEditDrawer, setOpenSearchPolicyEditDrawer] =
    useState(false);
  const [selectedData, setSelectedData] = React.useState({});
  const [companyDetails, setCompanyDetails] = useState();



  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });
  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(filterData), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, filterData]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterData.length) : 0;


    const GetCompanyDetails = () => {
        GetCompany({ isAscending: true }).then((res) => {
          setCompanyDetails(res.data);
        });
      };

 useEffect(()=>{
    GetCompanyDetails()
 },[])
  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el.product}${el.remarks}`.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const EditPolicyListData = (row) => {
    setOpenSearchPolicyEditDrawer(true);
    setSelectedData(row);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            padding: { xs: "8px 0 8px 0px", sm: "0" },
          }}
        >
          <Toolbar>
            <Grid container>
              <Grid item xs={12} sm={12}>
                <Typography className="HeaderTittle">All Policy</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper sx={{ m: 1.4, boxShadow: "none", border: "1px solid #b7becc" }}>
        <Formik
        initialValues={initialValues}
          onSubmit={(values) => {
            // same shape as initial values
          }}
        >
          {({ errors, touched ,values, setFieldValue }) => (
            <Form>
              <Typography
                sx={{ flex: "1 1 100%", py: 2, ml: 2 }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                All Policy List
              </Typography>
              <Grid container sx={{ p: 2 }} spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FloatLabel label="Select Company" value={values?.companyId}>
                  <Autocomplete
                        name="companyId"
                        disablePortal
                        id="combo-box-demo"
                        options={companyDetails}
                        onChange={(e, v) => setFieldValue("companyId", v._id)}
                        clearIcon={false}
                        getOptionLabel={(option) => option.companyName}
                        renderInput={(params) => <TextField {...params} />}
                      />
                  </FloatLabel>
                </Grid>
                <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FloatLabel label="Select Date" value="Reactjs">
                        <DatePicker
                          name="issueDate"
                          className="w-100"
                          // defaultValue={
                          //   formType === "edit"
                          //     ? dayjs(selectedData?.issueDate)
                          //     : null
                          // }
                          onChange={(e) => setFieldValue("issueDate", e.$d)}
                        />
                      </FloatLabel>
                    </LocalizationProvider>
 
                </Grid>
                <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FloatLabel label="Select Date" value="Reactjs">
                        <DatePicker
                          name="issueDate"
                          className="w-100"
                          // defaultValue={
                          //   formType === "edit"
                          //     ? dayjs(selectedData?.issueDate)
                          //     : null
                          // }
                          onChange={(e) => setFieldValue("issueDate", e.$d)}
                        />
                      </FloatLabel>
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    className="TabelButton"
                    sx={{ width: { xs: "100%", sm: "100%" } }}
          
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

        <div className="d-flex PageContainer">
          <Paper
            className={
              "container-fluid TableBox"
            }
          >
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                All Policy Table
              </Typography>

              <FormControl sx={{ m: 1, width: "40ch" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Search
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  onChange={onSearch}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Toolbar>

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
                    rowCount={filterData?.length}
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
                            sx={{ minWidth: "150px" }}
                          >
                            {moment(row.issueDate).format("L")}
                          </TableCell>
                          <TableCell align="left" sx={{ minWidth: "180px" }}>
                            {row?.companyId?.companyName}
                          </TableCell>
                          <TableCell align="left" sx={{ minWidth: "180px" }}>
                            {row?.policyNumber}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "200px" }}>
                            {row?.customerName}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "220px" }}>
                            {row?.registrationNumber}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {row?.odPremium}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {row?.netPremium}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {row?.totalPremium}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {row?.email}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {row.status}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: "150px" }}>
                            <Box className="ActionIcons">
                              <Tooltip title="edit">
                                <EditIcon
                                  onClick={() => EditPolicyListData(row)}
                                />
                              </Tooltip>
                              <Tooltip title="delete">
                                <DeleteIcon onClick={() => console.log(row)} />
                              </Tooltip>
                            </Box>
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
                  </TableBody>
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
                          No Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filterData?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Paper>
        </div>

      <Drawer
        open={openSearchPolicyEditDrawer}
        sx={{
          zIndex: 100,
        }}
        anchor="right"
        PaperProps={{
          sx: { width: { xs: "100%", sm: "100%" } },
        }}
      >
        {/* {openSearchPolicyEditDrawer ? (
          <EditSearchPolicy
            setOpenSearchPolicyEditDrawer={setOpenSearchPolicyEditDrawer}
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            GetData={GetData}
          />
        ) : null} */}
      </Drawer>
    </>
  );
};

export default AllPolicy;
