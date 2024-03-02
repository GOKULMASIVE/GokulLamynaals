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
import { DatePicker } from 'antd';
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import CreatePolicyMapping from "./CreatePolicyMapping";

import {
  RemoveRedEyeIcon,
  SearchIcon,
  DeleteIcon,
  CloudOffIcon,
  AddIcon,
} from "../../../Resources/Icons/icons";

import {
  GetUser,
  GetBranch,
  DeleteBranch,
  GetCompany,
  GetBookingCode,
  GetPolicyMapping,
  GetPolicyMappingByPolicyID,
} from "../../../Service/_index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from '@mui/material/TextField';
import Autocomplete from "@mui/material/Autocomplete";
import MappingDone from "./MapingDone";
import moment from "moment";

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
    id: "issueDate",
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
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Total Premium",
  },
  {
    id: "user",
    placeMent: true,
    disablePadding: false,
    label: "Creating User",
  },
  {
    id: "policyTableUser",
    placeMent: true,
    disablePadding: false,
    label: "Policy Table User",
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

const PolicyMapping = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openMapingDoneDrawer, setOpenMapingDonedrawer] = useState(false)
  const [mappingData, setMappingData] = React.useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState()

  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(mappingData), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, mappingData]
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



  const CreatePolicyMappingData = () => {
    setSelectedData({});
    setOpenDrawer(true);
  };


  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el.company},${el.policyNumber},${el.totalPremium},${el.creatingUser},${el.policyTableUser},${moment(el?.policyDate).format("DD-MM-YYYY")}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData).then((res) => {
      const FilteredData = res.data.map((e) => {
        if (e.isEnabled && e?.userType.includes('user')) {
          return {
            ...e,
            label: e.name + " - " + e.mobileNumber + ' - ' + e.email,
            value: e._id,
          }
        } else {
          return null
        }
      })
      setUserDetails(FilteredData.filter(Boolean))
    })
  }

  const GetData = () => {
    const requesttype = "Pending"
    GetPolicyMapping(requesttype).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          FomateDate: moment(e?.policyDate).format('DD/MM/YYYY')
        }
      })
      setMappingData(data)
    })
  }
  React.useEffect(() => {
    GetData()
    GetUserDetails()
  }, []);

  const FilterFunction = (key) => {
    const requesttype = (key === "Pending") ? "Pending" : "Approved"
    const mappinguserid = selectedUser ? selectedUser : null
    GetPolicyMapping(requesttype, mappinguserid).then((res) => {
      const data = res.data.map((e) => {
        return {
          ...e,
          FomateDate: moment(e?.policyDate).format('DD/MM/YYYY')
        }
      })
      setMappingData(data)
    })
  }

  const MappingFunction = (row) => {
    setOpenMapingDonedrawer(true)
    GetPolicyMappingByPolicyID(row._id).then((res) => {
      setSelectedData(res.data)
    })
  }
  return (
    <>

      <Grid container spacing={2} sx={{ padding: "10px 10px 0 10px" }}>
        <Grid item sm={3} xs={12}>
          <FloatLabel label="Select User" value={selectedUser}>
            <Autocomplete
              className="AutoComplete_InputBox"
              disablePortal
              id="combo-box-demo"
              options={userDetails}
              clearIcon={false}
              onChange={(option, value) => setSelectedUser(value._id)}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
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
                        <RangePicker placement='bottomLeft' className="Range_Picker w-100" style={{ borderRadius: '0px' }}
                            format='DD/MM/YYYY'
                        />
                    </FloatLabel>
                </Grid>
        <Grid item sm={3} xs={12} className="d-flex" gap={1}>
          <Button
            className="Common_Button"
            sx={{ width: { xs: "100%", sm: "50%" } }}
            onClick={() => FilterFunction("Pending")}
          >
            Pending
          </Button>
          <Button
            sx={{ width: { xs: "100%", sm: "50%" } }}
            className="Common_Button"
            onClick={() => FilterFunction("Approved")}
          >
            Approved
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }} mt={4}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Policy Mapping</Typography>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
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
          <Grid item xs={12} sm={1} className="d-flex justify-content-end">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<AddIcon />}
              onClick={CreatePolicyMappingData}
            >
              Create
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
                      key={row?._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        {moment(row?.policyDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row?.company}</TableCell>
                      <TableCell align="left">{row?.policyNumber}</TableCell>
                      <TableCell align="left">{row?.totalPremium}</TableCell>
                      <TableCell align="left">{row?.creatingUser}</TableCell>
                      <TableCell align="left">{row?.policyTableUser}</TableCell>
                      <TableCell align="center">
                        <Button className="TabelButton" onClick={() => MappingFunction(row)}>{row?.policyMappingStatus}</Button>
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
            count={filter.fn(mappingData)?.length || 0}
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
        {openDrawer ? (
          <CreatePolicyMapping setOpenDrawer={setOpenDrawer} GetData={GetData} />
        ) : null}
      </Drawer>

      <Drawer
        open={openMapingDoneDrawer}
        sx={{
          zIndex: 100,
        }}
        anchor="right"
        PaperProps={{
          sx: { width: { xs: "100%", sm: "100%" } },
        }}
      >
        {openMapingDoneDrawer ? (
          <MappingDone setOpenMapingDonedrawer={setOpenMapingDonedrawer} selectedData={selectedData} GetData={GetData} />
        ) : null}
      </Drawer>

    </>
  );
};
export default PolicyMapping;
