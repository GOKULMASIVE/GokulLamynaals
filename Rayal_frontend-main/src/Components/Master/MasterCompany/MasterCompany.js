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
import AddMasterCompany from "./AddMasterCompany";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  EditIcon,
  AddIcon,
  CloudOffIcon,
  SearchIcon,
  NotInterestedIcon,
  DoneOutlineIcon,
  DeleteIcon,
  RemoveRedEyeIcon
} from "../../../Resources/Icons/icons";
import { GetMasterCompany, DeleteMasterCompany, UpdateMasterCompany, FilterMasterCompany } from "../../../Service/_index";
import Dialog from '@mui/material/Dialog';
import { Transition } from "../../../UiComponents/Transition/Transition";

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
    value:1
  },
  {
    label: "ActiveData",
    isEnabled: "true",
    value:2
  },
  {
    label: "In ActiveData",
    isEnabled: "false",
    value:3
  },
];


const headCells = [
  {
    id: "masterCompanyName",
    placeMent: true,
    disablePadding: false,
    label: "Master Company Name",
  },
  {
    id: "gstNumber",
    placeMent: true,
    disablePadding: false,
    label: "GST Number",
  },
  {
    id: "panNumber",
    placeMent: true,
    disablePadding: false,
    label: "Pan Number",
  },
  {
    id: "remarks",
    placeMent: true,
    disablePadding: false,
    label: "Remark",
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

const MasterCompany = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = React.useState(false);
  const [masterCompany, setMasterCompany] = React.useState([]);
  const [activeBoolean, setActiveBoolean] = useState();
  const [pageView,setPageView] = useState(2)
  const [formType,setFormType] = useState("")
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(masterCompany), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, masterCompany]
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



  const GetData = () => {
    GetMasterCompany().then((res) => {
        setMasterCompany(res?.data);
    });
  };

  const GetActiveData = () => {
    GetMasterCompany().then((res) => {
      setMasterCompany(res.data.filter((item) => item.isEnabled === true));
    });
  };
  const GetInActiveData = () => {
    GetMasterCompany().then((res) => {
      setMasterCompany(res.data.filter((item) => item.isEnabled === false));
    });
  };

  React.useEffect(() => {
    GetActiveData();
  }, []);

  const EditMasterCompanyData = (row) => {
    setSelectedData(row);
    setOpenDrawer(true);
    setFormType("edit")

  };

  const CreateMasterCompanyData = () => {
    setSelectedData({});
    setOpenDrawer(true);
    setFormType("add")

  };
  const ActiveMasterCompanyData = (row, active) => {
    setOpenConfirmBox(true);
    setSelectedData(row);
    setActiveBoolean(!active);
  };

  const ViewMasterCompanyData = (row) => {
    setSelectedData(row);
    setOpenDrawer(true);
    setFormType("view")
  }
  const ActiveFunction = () => {
    UpdateMasterCompany(selectedData._id, { isEnabled: activeBoolean }).then((res) => {
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
    });
    setOpenConfirmBox(false);
  };

  
  const DeleteMasterCompanyData = (row) => {
    setOpenDeleteConfirmBox(true);
    setSelectedData(row);
  };
  const DeleteFunction = () => {
    DeleteMasterCompany(selectedData._id).then((res) => {
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
            `${el?.masterCompanyName},${el?.panNumber},${el?.gstNumber},${el?.remarks}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const FilterMasterCompanyFunction = (e) => {
    setPageView(e?.value)
    let data = e?.isEnabled;
    let apiMethod =
      (data === "all")
        ? GetData()
        : FilterMasterCompany({ isEnabled: data }).then((res) => {
            setMasterCompany(res?.data);
          });
  };

  return (
    <>
    
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Our Company</Typography>
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
          <Grid item xs={12} sm={2} >
            <Autocomplete
              className="w-100 Master_Header_Filter"
              onChange={(option, value) => {FilterMasterCompanyFunction(value)}}
              clearIcon={false}
              defaultValue={FilterOption.find((option) => option.label === "ActiveData")}
              options={FilterOption}
              renderInput={(params) => <TextField {...params} focused={false} />}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
            />
          </Grid>
          <Grid item xs={12} sm={1} className="d-flex justify-content-end">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<AddIcon />}
              onClick={() => CreateMasterCompanyData()}
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
                        key={row._id}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {row.masterCompanyName}
                        </TableCell>
                        <TableCell align="left">{row.gstNumber}</TableCell>
                        <TableCell align="left">{row.panNumber}</TableCell>
                        <TableCell align="left">{row.remarks}</TableCell>
                        <TableCell align="left">
                        {row.isEnabled ? (
                          <div className="Active_Container">
                            <div />
                            <span className="ActiveLabel">Active</span>
                          </div>
                        ) : (
                          <div className="InActive_Container">
                            <div/>
                            <span className="InActiveLabel">Inactive</span>
                          </div>
                        )}
                      </TableCell>
                        <TableCell align="center">
                          <Box className="ActionIcons">
                            <Tooltip title="edit">
                              <EditIcon onClick={() => EditMasterCompanyData(row)} />
                            </Tooltip>
                            <Tooltip title="view">
                              <RemoveRedEyeIcon onClick={() => ViewMasterCompanyData(row)} />
                            </Tooltip>
                            <Tooltip title="Active">
                              {row.isEnabled ? (
                                <Switch
                                  onClick={() =>
                                    ActiveMasterCompanyData(row, row.isEnabled)
                                  }
                                  checked={true}
                                  color="warning"
                                />
                              ) : (
                                <Switch
                                  onClick={() =>
                                    ActiveMasterCompanyData(row, row.isEnabled)
                                  }
                                  checked={false}
                                />
                              )}
                            </Tooltip>
                            <Tooltip title="delete">
                              <DeleteIcon
                                onClick={() => DeleteMasterCompanyData(row)}
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
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filter.fn(masterCompany).length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        
        </Paper>
      </div>

      <Dialog
        open={openDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            maxWidth: '50%',
          },
        }}
      >
       {openDrawer ? (
          <AddMasterCompany
            title={(formType === 'edit') ? "Edit" : (formType === "view") ? "View" : "Create"}
            selectedData={selectedData}
            formType={formType}
            setOpenDrawer={setOpenDrawer}
            GetActiveData={GetActiveData}
          />
        ) : null}
      </Dialog>

      <ConfirmBox
        open={openConfirmBox}
        title={selectedData.isEnabled ? 'Inactive' : 'Active'}
        content={`Are you sure want to ${selectedData.isEnabled ? 'Inactive' : 'Active'}`}
        confirmButton={selectedData.isEnabled ? 'Inactive' : 'Active'}
        setOpenConfirmBox={setOpenConfirmBox}
        Function={ActiveFunction}
        icon={selectedData.isEnabled ? <NotInterestedIcon /> : <DoneOutlineIcon/>}
        color={selectedData.isEnabled ? 'error' : 'success'}
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
export default MasterCompany;
