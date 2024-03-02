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
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { Transition } from "../../../UiComponents/Transition/Transition";
import {
  SearchIcon,
  EditIcon,
  DownloadIcon,
  CloudOffIcon,
  RestartAltIcon,
  DeleteIcon,
  NotInterestedIcon,
  AddIcon,
} from "../../../Resources/Icons/icons";
import moment from "moment";
import AddBranchConfig from "./AddBranchConfig";
import {
  GetUser,
  GetCompany,
  GetBookingCode,
  GetPolicyFindbyId,
  FilterPolicyList,
  DeleteBranchConfig,
  GetBranchConfigByBranchManagerId,
  DisableBranchConfig,
  GetBranchConfigById
} from "../../../Service/_index";
import Loader from "../../../UiComponents/Loader/Loader";
import { DatePicker, Radio } from "antd";
import { CSVLink } from "react-csv";
import { useEffect } from "react";
import dayjs from "dayjs";

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
    id: "issueData",
    placeMent: true,
    disablePadding: false,
    label: "User",
  },
  {
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "bookingCode",
    placeMent: true,
    disablePadding: false,
    label: "Booking Code - Sub Booking Code",
  },
  {
    id: "product",
    placeMent: true,
    disablePadding: false,
    label: "Product - Sub Product",
  },
  {
    id: "policyType",
    placeMent: true,
    disablePadding: false,
    label: "Policy Type",
  },
  {
    id: "CC",
    placeMent: true,
    disablePadding: false,
    label: "CC / GVW",
  },
  {
    id: "rtoCode",
    placeMent: true,
    disablePadding: false,
    label: "RTO Code",
  },
  {
    id: "paCover",
    placeMent: true,
    disablePadding: false,
    label: "PA Cover",
  },
  {
    id: "odPercenteage",
    placeMent: true,
    disablePadding: false,
    label: "OD %",
  },
  {
    id: "tpPercentage",
    placeMent: true,
    disablePadding: false,
    label: "TP %",
  },
  {
    id: "netPercentage",
    placeMent: true,
    disablePadding: false,
    label: "NET %",
  },
  {
    id: "activeDate",
    placeMent: true,
    disablePadding: false,
    label: "Active Date",
  },
  {
    id: "disableDate",
    placeMent: true,
    disablePadding: false,
    label: "Disable Date",
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
  rowCount: PropTypes.number.isRequired,
};

const BranchConfig = () => {
  const todayDate = new Date();
  const LastWeekDate = new Date();
  LastWeekDate.setDate(LastWeekDate.getDate() - 7);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [policyList, setPolicyList] = React.useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedComapny, setSelectedCompany] = useState(null);
  const [selectedBookingCode, setSelectedBookingCode] = useState(null);
  const [branchManagerDetails, setBranchManagerDetails] = useState([]);
  const [selectedBranchManager, setSelectedBranchManager] = useState(null);
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
  const [disabledDate, setDisabledDate] = useState("React-disable");
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = React.useState(false);
  const [reqType, setReqType] = useState(null);
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(policyList), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, policyList]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - policyList.length) : 0;

  const EditBranchConfig = (row) => {
    GetBranchConfigById(row._id).then((res) => {
      console.log(res)
      setOpenDrawer(true);
      setFormType("edit");
      setSelectedData(res.data);
    });
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.user},${el?.company},${el?.bookingCode},${el?.subBookingCode},${el?.product},${el?.subProduct},${el?.policyType},${el?.CC},${el?.PACover},${el?.OD},${el?.TP},${el?.Net},${moment(el?.disableDate).format("DD/MM/YYYY")},${moment(
              el?.activeDate
            ).format("DD/MM/YYYY")}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetBranchManagerDetails = () => {
    GetUser({ isAscending: true }).then((res) => {
      const modifiedUser = res?.data?.map((e) => {
        return {
          ...e,
          label: e.name,
          value: e._id,
        };
      });
      const FilterUserType = modifiedUser?.filter((item) =>
        item.userType.includes("branchManager") && item.isEnabled
      );
      setBranchManagerDetails(FilterUserType);
    });
  };

  const GetCompanyDetails = () => {
    GetCompany({ isAscending :true}).then((res) => {
      const modifiedCompanyDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.shortName,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setCompanyDetails(modifiedCompanyDetails);
    });
  };

  const GetBookingCodeDetails = () => {
    GetBookingCode({isAscending:true}).then((res) => {
      const modifiedBookingCode = res.data
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
      setBookingCodeDetails(modifiedBookingCode);
    });
  };

  React.useEffect(() => {
    GetCompanyDetails();
    GetBookingCodeDetails();
    GetBranchManagerDetails();
  }, []);


  const header = [
    { label: "User", key: "user" },
    { label: "Company Name", key: "company" },
    { label: "Booking Code", key: "bookingCode" },
    { label: "Sub Booking Code", key: "subBookingCode" },
    { label: "Product", key: "product" },
    { label: "Sub Product", key: "subProduct" },
    { label: "Policy Type", key: "policyType" },
    { label: "CC", key: "CC" },
    { label: "GVW", key: "GVW" },
    { label: "RTO Code", key: `location` },
    { label: "PA Cover", key: "PACover" },
    { label: "OD%", key: "OD" },
    { label: "TP%", key: "TP" },
    { label: "NET%", key: "Net" },
    { label: "Active Date", key: "ActiveDate" },
  ];
  const csvFile = {
    filename: "Branch Payable Data",
    headers: header,
    data: policyList,
  };

  const ActiveFunction = () => {
    const requestType = "ACTIVE";
    setReqType("ACTIVE");
    GetBranchConfigByBranchManagerId(selectedBranchManager?._id, requestType).then(
      (res) => {
        const data = res.data.map((e) => {
          return {
            ...e,
            ActiveDate: moment(e.activeDate).format("DD/MM/YYYY")
          }
        })
        setPolicyList(data);
      }
    );
  };

  const DisableFunction = () => {
    const requestType = "DISABLED";
    setReqType("DISABLED");
    GetBranchConfigByBranchManagerId(selectedBranchManager?._id, requestType).then(
      (res) => {
        const data = res.data.map((e) => {
          return {
            ...e,
            ActiveDate: moment(e.activeDate).format("DD/MM/YYYY")
          }
        })
        setPolicyList(data);
      }
    );
  };

  const DisableBranchConfigData = (row) => {
    setDisabledDate("React-disable");
    setOpenConfirmBox(true);
    setSelectedData(row);
  };

  const DisableBranchConfigFunction = () => {
    const requesttype = selectedData.isEnabled ? "true" : "false";
    const headers = {
      requesttype: requesttype,
      disableDate: disabledDate,
    };
    DisableBranchConfig(selectedData._id, headers).then((res) => {
      ActiveFunction();
      setOpenConfirmBox(false);
    });
  };


  const DeleteBranchConfigData = (row) => {
    setOpenDeleteConfirmBox(true);
    setSelectedData(row);
  };
  const DeleteFunction = () => {
    DeleteBranchConfig(selectedData._id).then((res) => {
      reqType === "DISABLED" ? DisableFunction() : ActiveFunction();
    });
    setOpenDeleteConfirmBox(false);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ padding: "10px 10px 0 10px" }}
        className="Master_Header_Container"
      >
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Branch Manager" value={selectedBranchManager}>
            <Autocomplete
              className="AutoComplete_InputBox"
              options={branchManagerDetails}
              onChange={(e, v) => {
                setSelectedBranchManager(v);
              }}
              name="branchManager"
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option?._id === value._id}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select Company" value={selectedComapny?.value}>
            <Autocomplete
              className="AutoComplete_InputBox"
              name="companyId"
              options={companyDetails}
              onChange={(e, v) => {
                setSelectedCompany(v);
              }}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option?._id === value._id}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Company code" value={selectedBookingCode?.value}>
            <Autocomplete
              className="AutoComplete_InputBox"
              name="companyId"
              options={bookingCodeDetails}
              onChange={(e, v) => {
                setSelectedBookingCode(v);
              }}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option?._id === value._id}
            />
          </FloatLabel>
        </Grid>

        <Grid
          item
          sm={3}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <Button
            className="Master_Header_create_Button"
            sx={{ width: { xs: "100%", sm: "48%" } }}
            onClick={() => ActiveFunction()}
          >
            Active
          </Button>
          <Button
            onClick={() => DisableFunction()}
            className="Master_Header_Reset_Button"
            sx={{ width: { xs: "100%", sm: "48%" } }}
          >
            Disable
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }} mt={2}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              Branch Configuration
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4.5}></Grid>
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
          <Grid item xs={12} sm={1.5}>
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
          <Grid item xs={12} sm={1} className="d-flex justify-content-end">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<AddIcon />}
              onClick={() => {
                setOpenDrawer(true);
                setSelectedData({})
                setFormType('add')
              }}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>

      <div className="d-flex PageContainer">
        <Paper className={"container-fluid TableBox "}>
          <>
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
                  rowCount={policyList?.length}
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
                          {row?.user}
                        </TableCell>
                        {/* Changes by Arun for alignment change */}
                        <TableCell align="left">{row?.company}</TableCell>
                        <TableCell align="left">
                          {row?.bookingCode} - {row?.subBookingCode}
                        </TableCell>
                        <TableCell align="left">
                          {row?.product} - {row?.subProduct}
                        </TableCell>
                        <TableCell align="left">{row?.policyType}</TableCell>
                        <TableCell align="left">
                          {row?.CC} / {row?.GVW}
                        </TableCell>
                        <TableCell align="left">
                          {row?.location?.join(", ")}
                        </TableCell>
                        <TableCell align="left">{row?.PACover}</TableCell>
                        <TableCell align="left">{row?.OD}</TableCell>
                        <TableCell align="left">{row?.TP}</TableCell>
                        <TableCell align="left">{row?.Net}</TableCell>
                        <TableCell align="left">
                          {moment(row.activeDate).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="left">
                          {row.disableDate
                            ? moment(row.disableDate).format("DD/MM/YYYY")
                            : null}
                        </TableCell>
                        <TableCell align="center">
                          <Box className="ActionIcons d-flex" gap={2}>
                            <Tooltip
                              title="edit"
                              onClick={() => EditBranchConfig(row)}
                            >
                              <EditIcon />
                            </Tooltip>

                            <Tooltip title="delete">
                              <DeleteIcon
                                onClick={() => DeleteBranchConfigData(row)}
                              />
                            </Tooltip>
                            <Tooltip title="disable">
                              {row.isEnabled ? (
                                <NotInterestedIcon
                                  sx={{ color: "black" }}
                                  onClick={() => {
                                    DisableBranchConfigData(row);
                                  }}
                                />
                              ) : null}
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
              count={filter.fn(policyList)?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        </Paper>
      </div>
      <Loader open={openLoader} />

      <Dialog
        open={openDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: { maxWidth: "50%" },
        }}
      >
        {openDrawer ? (
          <AddBranchConfig
            setOpenDrawer={setOpenDrawer}
            selectedBranchManager={selectedBranchManager}
            ActiveFunction={ActiveFunction}
            selectedData={selectedData}
            formType={formType}
          />
        ) : null}
      </Dialog>

      <ConfirmBox
        setDisabledDate={setDisabledDate}
        disabledDate={disabledDate}
        mode="picker"
        open={openConfirmBox}
        title="Disable"
        content={
          disabledDate === "React-disable"
            ? "Please select the date ... !"
            : "Are you sure want to disable"
        }
        confirmButton="Disable"
        setOpenConfirmBox={setOpenConfirmBox}
        Function={DisableBranchConfigFunction}
        icon={<NotInterestedIcon />}
        color="error"
      />
      <ConfirmBox
        open={openDeleteConfirmBox}
        title="Delete"
        content="Are you sure want to Delete"
        confirmButton="Delete"
        setOpenConfirmBox={setOpenDeleteConfirmBox}
        Function={DeleteFunction}
        icon={<DeleteIcon />}
        color="error"
      />
    </>
  );
};
export default BranchConfig;
