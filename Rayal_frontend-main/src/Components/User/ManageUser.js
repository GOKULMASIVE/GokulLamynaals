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
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../UiComponents/ConfirmBox/ConfirmBox";
import { GetUser, GetUserFindbyId } from "../../Service/_index";
import Switch from "@mui/material/Switch";
import AddUser from "./AddUser";
import { getLabelForValue } from "../../Shared/CommonConstant";
import {
  RemoveRedEyeIcon,
  SearchIcon,
  DeleteIcon,
  CloudOffIcon,
  AddIcon,
  NotInterestedIcon,
  DoneOutlineIcon,
  EditIcon,
} from "../../Resources/Icons/icons";
import Loader from "../../UiComponents/Loader/Loader";
import { checkUserType } from "../../Shared/CommonConstant";
import { DeleteBranch, UpdateUser } from "../../Service/_index";

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

const FilterOption = [
  {
    label: "All Data",
    isEnabled: "all",
  },
  {
    label: "ActiveData",
    isEnabled: "true",
  },
  {
    label: "In ActiveData",
    isEnabled: "false",
  },
];
const headCells = [
  {
    id: "name",
    placeMent: true,
    disablePadding: false,
    label: "Name",
    minWidth: "150px",
  },
  {
    id: "mobile",
    placeMent: true,
    disablePadding: false,
    label: "Mobile",
    minWidth: "150px",
  },
  {
    id: "email",
    placeMent: true,
    disablePadding: false,
    label: "Email",
    minWidth: "150px",
  },
  {
    id: "password",
    placeMent: true,
    disablePadding: false,
    label: "Password",
    minWidth: "150px",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
    minWidth: "150px",
  },
  {
    id: "usertype",
    placeMent: true,
    disablePadding: false,
    label: "User Type",
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
};

const ManageUser = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [openActiveConfirmBox, setOpenActiveConfirmBox] = useState(false);
  const [activeBoolean, setActiveBoolean] = useState();
  const [viewUserDetails, setViewUserDetails] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(user), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, user]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.length) : 0;

  const GetData = () => {
    const requesttype = "TABLE";
    setOpenLoader(true);
    GetUser({ isAscending: false, requesttype }).then((res) => {
      setOpenLoader(false);
      setUser(res?.data);
    });
  };
  React.useEffect(() => {
    GetData();
  }, []);

  const UserType = localStorage.getItem("userType");
  const [isAllow, setIsAllow] = useState({});
  React.useEffect(() => {
    const isallowObj = checkUserType(UserType);
    setIsAllow(isallowObj);
  }, []);

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.name},${el?.email},${el?.mobileNumber},${el?.password},${el?.userType},${el?.branchManager?.branchId?.branchName}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
  };

  const GetActiveData = () => {
    GetUser({ isAscending: false }).then((res) => {
      setUser(res.data.filter((item) => item.isEnabled === true));
    });
  };
  const GetInActiveData = () => {
    GetUser({ isAscending: false }).then((res) => {
      setUser(res.data.filter((item) => item.isEnabled === false));
    });
  };

  const CreateUserData = () => {
    setSelectedData({});
    setOpenDrawer(true);
    setViewUserDetails(false);
  };
  const EditUserData = (row) => {
    setOpenLoader(true);
    GetUserFindbyId(row._id).then((res) => {
      setOpenLoader(false);
      setSelectedData(res.data);
      setViewUserDetails(false);
      setOpenDrawer(true);
    });
  };

  const ViewUserData = (row) => {
    setOpenLoader(true);
    GetUserFindbyId(row._id).then((res) => {
      setOpenLoader(false);
      setSelectedData(res.data);
      setViewUserDetails(true);
      setOpenDrawer(true);
    });
  };
  const ActiveUserData = (row, active) => {
    setOpenActiveConfirmBox(true);
    setSelectedData(row);
    setActiveBoolean(!active);
  };

  const ActiveFunction = (event) => {
    UpdateUser(selectedData._id, { isEnabled: activeBoolean }).then((res) => {
      // activeBoolean ? GetInActiveData() : GetActiveData();
      GetData();
    });
    setOpenActiveConfirmBox(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">User</Typography>
          </Grid>
          <Grid item xs={12} sm={6} />
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
              onClick={() => CreateUserData()}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>

      <div className="d-flex PageContainer">
        <Paper className="container-fluid TableBox">
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
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      {/* <TableCell component="th" scope="row" padding="normal" sx={{ minWidth: "160px" }}>
                          {row.clientId}
                        </TableCell> */}
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row.name}
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row.mobileNumber}
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row.email}
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row.password}
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {/* Changes by Arun */}
                        {row?.branchManager
                          ? row.branchManager?.branchId?.branchName
                          : row?.branchId?.branchName}
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row.userType
                          .map((item, index) => getLabelForValue(item))
                          .join(", ")}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: "200px" }}>
                        <Box className="ActionIcons">
                          <Tooltip title="View">
                            <RemoveRedEyeIcon
                              onClick={() => ViewUserData(row)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit">
                            <EditIcon onClick={() => EditUserData(row)} />
                          </Tooltip>
                          <div
                            style={{
                              display: isAllow.isOperator ? "none" : "block",
                            }}
                          >
                            <Tooltip title="Active">
                              {row.isEnabled ? (
                                <Switch
                                  onClick={() =>
                                    ActiveUserData(row, row.isEnabled)
                                  }
                                  checked={true}
                                  color="warning"
                                />
                              ) : (
                                <Switch
                                  onClick={() =>
                                    ActiveUserData(row, row.isEnabled)
                                  }
                                  checked={false}
                                />
                              )}
                            </Tooltip>
                          </div>
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
            count={filter.fn(user)?.length || 0}
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
          <AddUser
            setOpenDrawer={setOpenDrawer}
            title={selectedData._id ? "Update" : "Create"}
            GetData={GetData}
            selectedData={selectedData}
            formType={
              viewUserDetails ? "view" : selectedData._id ? "edit" : "add"
            }
          />
        ) : null}
      </Drawer>

      <ConfirmBox
        open={openActiveConfirmBox}
        title={selectedData.isEnabled ? "Inactive" : "Active"}
        content={`Are you sure want to ${
          selectedData.isEnabled ? "Inactive" : "Active"
        }`}
        confirmButton={selectedData.isEnabled ? "Inactive" : "Active"}
        setOpenConfirmBox={setOpenActiveConfirmBox}
        Function={ActiveFunction}
        icon={
          selectedData.isEnabled ? <NotInterestedIcon /> : <DoneOutlineIcon />
        }
        color={selectedData.isEnabled ? "error" : "success"}
      />
      <Loader open={openLoader} />
    </>
  );
};
export default ManageUser;
