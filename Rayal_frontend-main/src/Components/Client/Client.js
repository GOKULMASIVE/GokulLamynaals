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
import Drawer from "@mui/material/Drawer";
import AddClient from "./AddClient";
import ConfirmBox from "../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../UiComponents/Toaster/Toast";

import {
  EditIcon,
  AddIcon,
  DeleteIcon,
  SearchIcon,
  CloudOffIcon,
} from "../../Resources/Icons/icons";
import { GetClient , DeleteClient} from "../../Service/_index";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
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



const headCells = [
  {
    id: "client",
    placeMent: true,
    disablePadding: false,
    label: "Client Name",
  },
  {
    id: "clientId",
    placeMent: true,
    disablePadding: false,
    label: "Client Id",
  },
  {
    id: "remarks",
    placeMent: true,
    disablePadding: false,
    label: "Remark",
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

const Client = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState({});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
  const [client, setClient] = React.useState();
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filter.fn(client), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, client]
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - client.length) : 0;

  const GetData = () => {
    GetClient().then((res) => {
      setClient(res?.data);
    });
  };

  useEffect(() => {
    GetData();
  }, []);

  const EditClientData = (row) => {
    setSelectedData(row);
    setOpenDrawer(true);
  };

  const CreateBranchData = () => {
    setSelectedData({});
    setOpenDrawer(true);
  };

  const DeleteClientData = (row) => {
    setOpenConfirmBox(true);
    setSelectedData(row)
  };

  const DeleteFunction = () => {
    DeleteClient(selectedData._id).then((res)=>{
      GetData()
      setOpenConfirmBox(false)
    })
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el.client},${el.remarks}`.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "white" }}>
          <Toolbar>
            <Grid container rowSpacing={1} columnSpacing={2} mt={1}>
              <Grid item xs={12} sm={3}></Grid>
              <Grid item xs={12} sm={7} />
              <Grid item xs={12} sm={2} className="d-flex justify-content-end">
                <Button
                  className="CreateButton TabelButton w-100 "
                  endIcon={<AddIcon />}
                  onClick={() => CreateBranchData()}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>

      {/* filter Page starting */}
      <div className="d-flex PageContainer">

        <Paper
          className={
            "container-fluid TableBox " + (openFilter ? "OpenTable" : "")
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
              Client
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
                      <TableRow hover tabIndex={-1} key={row.client}>
                        <TableCell component="th" scope="row" padding="normal">
                          {row.client}
                        </TableCell>
                        <TableCell align="left">{row.clientId}</TableCell>
                        <TableCell align="left">{row.remarks}</TableCell>
                        <TableCell align="center">
                          <Box className="ActionIcons">
                            <Tooltip title="edit">
                              <EditIcon onClick={() => EditClientData(row)} />
                            </Tooltip>
                            <Tooltip title="edit">
                              <DeleteIcon
                                onClick={() => DeleteClientData(row)}
                              />
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
                        Oops! No Data Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={client?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Paper>
      </div>

      <Drawer
        open={openDrawer}
        sx={{
          zIndex: 100,
        }}
        anchor="right"
        PaperProps={{
          sx: { width: { xs: "100%", sm: "25%" } },
        }}
      >
        {openDrawer ? (
          <AddClient
            title={selectedData._id ? "Edit" : "Create"}
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            setOpenDrawer={setOpenDrawer}
            GetData={GetData}
          />
        ) : null}
      </Drawer>

      <ConfirmBox
        open={openConfirmBox}
        title="Delete"
        content={"Are you sure want to delete"}
        confirmButton={"Delete"}
        setOpenConfirmBox={setOpenConfirmBox}
        Function={DeleteFunction}
        icon={<DeleteIcon />}
        color={"error"}
      />
    </>
  );
};
export default Client;
