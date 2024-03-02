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
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import Switch from "@mui/material/Switch";
import {
  EditIcon,
  AddIcon,
  DeleteIcon,
  SearchIcon,
  NotInterestedIcon,
  CloudOffIcon,
  DoneOutlineIcon,
} from "../../../Resources/Icons/icons";
import {
  GetCompanyRTO,
  UpdateBranch,
  DeleteRTO,
  GetCompanyRTOByID,
  UpdateCompanyRTO,
} from "../../../Service/_index";
import Loader from "../../../UiComponents/Loader/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AddRTOMapping from "./AddRTOMapping";

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
    value: "All",
    key: 1,
  },
  {
    label: "ActiveData",
    isEnabled: "true",
    value: "ACTIVE",
    key: 2,
  },
  {
    label: "In ActiveData",
    isEnabled: "false",
    value: "INACTIVE",
    key: 3,
  },
];

const headCells = [
  {
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "location",
    placeMent: true,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "remarks",
    placeMent: true,
    disablePadding: false,
    label: "Remarks",
  },
  {
    id: "rtoCode",
    placeMent: true,
    disablePadding: false,
    label: "RTO Code",
  },
  {
    id: "status",
    placeMent: true,
    disablePadding: false,
    label: "Status",
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

const RTOMapping = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedData, setSelectedData] = React.useState({});
  const [openBranchDrawer, setOpenBranchDrawer] = React.useState(false);
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [activeBoolean, setActiveBoolean] = useState();
  const [openLoader, setOpenLoader] = useState(false);
  const [pageView, setPageView] = useState(2);
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

  const GetData = () => {
    setOpenLoader(true);
    GetCompanyRTO().then((res) => {
      setOpenLoader(false);
      setData(res?.data);
    });
  };
  const GetActiveData = () => {
    GetCompanyRTO().then((res) => {
      setData(res?.data?.filter((item) => item.isEnabled === true));
    });
  };
  const GetInActiveData = () => {
    GetCompanyRTO().then((res) => {
      setData(res?.data?.filter((item) => item.isEnabled === false));
    });
  };

  React.useEffect(() => {
    GetActiveData();
  }, []);

  const EditRtoData = (row) => {
    GetCompanyRTOByID(row._id)
      .then((res) => {
        setSelectedData(res.data);
      })
      .then(() => {
        setOpenBranchDrawer(true);
      });
  };

  const CreateRtoMapingData = () => {
    setSelectedData({});
    setOpenBranchDrawer(true);
  };

  const ActiveBranchData = (row, active) => {
    setOpenConfirmBox(true);
    setSelectedData(row);
    setActiveBoolean(!active);
  };
  const ActiveFunction = (event) => {
    UpdateCompanyRTO(selectedData._id, { isEnabled: activeBoolean }).then(
      (res) => {
        console.log(pageView);
        switch (pageView) {
          case 1:
            GetData();
            break;
          case 2:
            GetActiveData();
            break;
          case 3:
            GetInActiveData();
            break;
          default:
            break;
        }
      }
    );

    setOpenConfirmBox(false);
  };

  const DeleteBranchData = (row) => {
    setOpenDeleteConfirmBox(true);
    setSelectedData(row);
  };
  const DeleteFunction = () => {
    DeleteRTO(selectedData._id).then((res) => {
      switch (pageView) {
        case 1:
          GetData();
          break;
        case 2:
          GetActiveData();
          break;
        case 3:
          GetInActiveData();
          break;
        default:
          break;
      }
      setOpenDeleteConfirmBox(false);
    });
  };
  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el.company},${el.location}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0);
  };

  const FilterRTOFunction = (e) => {
    setPageView(e?.key);
    let data = e?.isEnabled;
    console.log(e);
    let requesttype = e.value;
    let apiMethod =
      data === "all"
        ? GetData()
        : GetCompanyRTO(requesttype).then((res) => {
            setData(res?.data);
            console.log(res);
          });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">
              RTO Mapping
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}></Grid>
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
          <Grid item xs={12} sm={2}>
            <Autocomplete
              className="w-100 Master_Header_Filter"
              onChange={(option, value) => {
                FilterRTOFunction(value);
              }}
              clearIcon={false}
              defaultValue={FilterOption.find(
                (option) => option.label === "ActiveData"
              )}
              options={FilterOption}
              renderInput={(params) => (
                <TextField {...params} focused={false} />
              )}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
            />
          </Grid>
          <Grid item xs={12} sm={1} className="d-flex justify-content-end">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<AddIcon />}
              onClick={() => CreateRtoMapingData()}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>

      <div className="d-flex PageContainer">
        <Paper className={"container-fluid TableBox "}>
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
                    <TableRow hover tabIndex={-1} key={row._id}>
                      <TableCell align="left" sx={{ minWidth: "160px" }}>
                        {row?.company}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal">
                        {row?.location}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal">
                        {row?.remarks}
                      </TableCell>
                      <TableCell align="left">
                        {(row?.RTOCode?.slice(0, 4) || [])?.join(" , ")}{" "}
                        {row?.RTOCode?.length > 4 ? (
                          <label
                            style={{
                              backgroundColor: "gray",
                              padding: "2px 4px 2px 4px",
                              borderRadius: "5px",
                            }}
                          >
                            +{row?.RTOCode?.length - 4}
                          </label>
                        ) : null}
                      </TableCell>
                      <TableCell align="left">
                        {row.isEnabled ? (
                          <div className="Active_Container">
                            <div />
                            <span className="ActiveLabel">Active</span>
                          </div>
                        ) : (
                          <div className="InActive_Container">
                            <div />
                            <span className="InActiveLabel">Inactive</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box className="ActionIcons">
                          <Tooltip title="edit">
                            <EditIcon onClick={() => EditRtoData(row)} />
                          </Tooltip>

                          <Tooltip title="Active">
                            {row.isEnabled ? (
                              <Switch
                                onClick={() =>
                                  ActiveBranchData(row, row.isEnabled)
                                }
                                checked={true}
                                color="warning"
                              />
                            ) : (
                              <Switch
                                onClick={() =>
                                  ActiveBranchData(row, row.isEnabled)
                                }
                                checked={false}
                              />
                            )}
                          </Tooltip>
                          <Tooltip title="delete">
                            <DeleteIcon onClick={() => DeleteBranchData(row)} />
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filter.fn(data)?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      <Drawer
        open={openBranchDrawer}
        sx={{
          zIndex: 100,
        }}
        anchor="right"
        PaperProps={{
          sx: { width: { xs: "100%", sm: "25%" } },
        }}
      >
        {openBranchDrawer ? (
          <AddRTOMapping
            title={selectedData._id ? "Edit" : "Create"}
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            setOpenBranchDrawer={setOpenBranchDrawer}
            GetActiveData={GetActiveData}
            GetData={GetData}
            setSelectedData={setSelectedData}
          />
        ) : null}
      </Drawer>

      <ConfirmBox
        open={openConfirmBox}
        title={selectedData.isEnabled ? "Inactive" : "Active"}
        content={`Are you sure want to ${
          selectedData.isEnabled ? "Inactive" : "Active"
        }`}
        confirmButton={selectedData.isEnabled ? "Inactive" : "Active"}
        setOpenConfirmBox={setOpenConfirmBox}
        Function={ActiveFunction}
        icon={
          selectedData.isEnabled ? <NotInterestedIcon /> : <DoneOutlineIcon />
        }
        color={selectedData.isEnabled ? "error" : "success"}
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
      <Loader open={openLoader} />
    </>
  );
};
export default RTOMapping;
