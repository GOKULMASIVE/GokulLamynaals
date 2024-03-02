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
import { ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Autocomplete from "@mui/material/Autocomplete";
import moment from "moment";
import TextField from "@mui/material/TextField";
import ViewCCentry from "./ViewCCentry";
import {
  CloudOffIcon,
  SearchIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ReportProblemIcon,
} from "../../../Resources/Icons/icons";
import {
  GetCompany,
  GetBookingCode,
  GetSubBookingCode,
} from "../../../Service/_index";
import {
  GetFilterCCEntry,
  GetFilterCCEntryAll,
  unlinkTicketNumber,
} from "../../../Service/SearchPolicy";
import { CSVLink } from "react-csv";
import { Dialog } from "@mui/material";
import { DatePicker } from "antd";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import {  checkUserType} from "../../../Shared/CommonConstant";

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

const FilterCCOption = [
  {
    label: "Pending Policy",
    value: "approvePending",
  },
  {
    label: "Entry Done",
    value: "entryDone",
  },
  {
    label: "Already Exist",
    value: "alreadyExist",
  },
  {
    label: "Entry Date",
    value: 'entryDate',
  },
  {
    label: "Approve Date",
    value: 'approveDate',
  },
];
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
    id: "customerName",
    placeMent: true,
    disablePadding: false,
    label: "Customer Name",

  },
  {
    id: "registrationNumber",
    placeMent: true,
    disablePadding: false,
    label: "Reg Number",

  },
  {
    id: "odPremium",
    placeMent: true,
    disablePadding: false,
    label: "OD Premium",

  },
  {
    id: "netPremium",
    placeMent: true,
    disablePadding: false,
    label: "Net Premium",

  },
  {
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Total Premium",

  },
  {
    id: "email",
    placeMent: true,
    disablePadding: false,
    label: "User Email",

  },
  {
    id: "ticketNumber",
    placeMent: true,
    disablePadding: false,
    label: "Ticket Number",

  },
  {
    id: "ticketStatus",
    placeMent: true,
    disablePadding: false,
    label: "Ticket Status",

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

const CCEntry = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [policyList, setPolicyList] = React.useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [openViewCC, setOpenViewCC] = useState(false);
  const [resetValue, setResetValue] = useState(1);
  const [selectedData, setSelectedData] = useState({});
  const [edit, setEdit] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndtDate, setSelectedEndDate] = useState();
  const [filterBy, setFilterBy] = useState({})
  const [openConfirmBox, setOpenConfirmBox] = useState(false)
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

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.companyId?.companyName},${el.policyNumber},${el.customerName},${el.registrationNumber},${el.odPremium},${el.netPremium},${el.totalPremium},${el?.email},${el.ticketNumber},${moment(el.issueDate).format("D-M-Y")}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetCompanyDetails = () => {
    GetCompany({ isAscending: true }).then((res) => {
      const modifiedCompany = res.data
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
      setCompanyDetails(modifiedCompany);
    });
  };

  const GetSubBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: "combineData" }).then((res) => {
      const SubBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled && e.cc === "Yes") {
            return {
              ...e,
              label: e.bookingCode + " - " + e.subBookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setSubBookingCodeDetails(SubBookingCodeDetails);
    });
  };



  const UniversalSearch = () => {
    GetFilterCCEntry(filterBy).then((res) => {
      const FilteredData = res.data.map((e) => {
        return {
          ...e,
          InformatDate: moment(e.issueDate).format('DD/MM/YYYY')
        }
      })
      setPolicyList(FilteredData)
    })
  }

  const CCEntryFunction = (row, data) => {
    setEdit(data);
    setOpenViewCC(true);
    setSelectedData(row);
  };

  const DeleteCCdata = async (row) => {
    setOpenConfirmBox(true)
    setSelectedData(row)

  };

  const DeleteFunction = () => {
    unlinkTicketNumber(selectedData._id).then((res) => {
      UniversalSearch()
      setOpenConfirmBox(false)
    })
  }

  let totalPremium = 0;
  visibleRows?.forEach((row) => {
    const premiumWithoutCommas = row?.totalPremium.replace(/,/g, "");
    let totPremium = parseFloat(premiumWithoutCommas);
    totalPremium += totPremium;
  });



  const header = [
    { label: "Policy Date", key: "InformatDate" },
    { label: "Company Name", key: "companyId.companyName" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Reg Number", key: "registrationNumber" },
    { label: "OD Premium", key: "userId.mobileNumber" },
    { label: "Net Premium", key: "odPremium" },
    { label: "Total Premium", key: "registrationNumber" },
    { label: "User Email", key: "email" },
    { label: "Ticket Number", key: "ticketNumber" },
  ];

  const csvFile = { filename: "CC Entry Data", headers: header, data: policyList }

  React.useEffect(() => {
    GetCompanyDetails();
    GetSubBookingCodeDetails()
  }, []);

  const UserType = localStorage.getItem('userType')

  const [isAllow, setIsAllow] = useState({})
  React.useEffect(() => {
    const isallowObj = checkUserType(UserType)
    setIsAllow(isallowObj)
  }, [])

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          padding: "10px 10px 0 10px",
        }}
        className="Master_Header_Container"
      >
        <Grid item sm={2.6} xs={12}>
          <FloatLabel
            label="Select Company"
            value={filterBy?.companyId}
          >
            <Autocomplete
              disablePortal
              className="AutoComplete_InputBox"
              id="combo-box-demo"
              options={companyDetails}
              onChange={(option, value) => setFilterBy({ ...filterBy, companyId: value?._id })}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option?._id === value._id
              }
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={2.6} xs={12}>
          <FloatLabel
            label="Booking Code & Sub Booking Code"
            value={filterBy?.subBookingCodeId}
          >
            <Autocomplete
              className="AutoComplete_InputBox"
              name="companyId"
              options={subBookingCodeDetails}
              onChange={(option, value) => setFilterBy({ ...filterBy, subBookingCodeId: value?._id, bookingCodeId: value?.bookingCodeId })}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) =>
                option._id === value._id
              }
              key={resetValue}
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={2.6} xs={12} className="datePicker">
          <FloatLabel label="Start date & End Date" value="react">
            <RangePicker
              placement="bottomLeft"
              className="textField w-100"
              style={{ borderRadius: "0px" }}
              onChange={(e) => {
                setSelectedStartDate(e ? e[0].$d : null);
                setSelectedEndDate(e ? e[1].$d : null);

              }}
              format="DD/MM/YYYY"
            />
          </FloatLabel>
        </Grid>
        <Grid item sm={2.6} xs={12}>
          <FloatLabel
            label="Filter"
            value={filterBy?.status}
          >
            <Autocomplete
              className="AutoComplete_InputBox"
              options={FilterCCOption}
              onChange={(option, value) => setFilterBy({ ...filterBy, status: value?.value })}
              renderInput={(params) => <TextField {...params} />}
              isOptionEqualToValue={(option, value) => option.value === value.value}
            />
          </FloatLabel>
        </Grid>

        <Grid
          item
          sm={1.6}
          xs={12}
        >
          <Button
            className="Master_Header_create_Button w-100"
            sx={{ width: { xs: "100%", sm: "30%" }, marginBottom: '8px' }}
            endIcon={<SearchIcon />}
            onClick={UniversalSearch}
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} />
      </Grid>
      <Box sx={{ flexGrow: 1 }} >
        <Grid container className="Master_Header_Container" spacing={2} mt={4}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">CC Entry</Typography>
          </Grid>
          <Grid item xs={12} sm={1.5} />
          <Grid item xs={12} sm={2}>
            <Typography>Policy Count : {policyList ? policyList.length : 0}</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography>Total : {totalPremium.toLocaleString()}</Typography>
          </Grid>
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
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        padding="normal"
                      >
                        {moment(row.issueDate).format("D-M-Y")}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.companyId?.shortName}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.policyNumber}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.customerName}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.registrationNumber}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.odPremium}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.netPremium}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.totalPremium}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.email}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.ticketNumber}
                      </TableCell>
                      <TableCell align="left" >
                        {row?.ticketStatus}
                      </TableCell>
                      <TableCell align="center">
                        <Box className="ActionIcons">
                          {!row?.ticketNumber  ? (
                            <Tooltip title="ccEntry">
                              <Button
                                className="Common_Button"
                                onClick={() =>
                                  CCEntryFunction(row, "ccEntry")
                                }
                               sx={{padding:'0px 40px' , fontSize:'10px' , display:isAllow?.isUser ? 'none' : 'block'}}
                              >
                              CC Entry
                              </Button>
                            </Tooltip>
                          ) : (
                            <>
                              <Tooltip title="edit">
                                <EditIcon
                                  onClick={() => CCEntryFunction(row, "edit")}
                                />
                              </Tooltip>
                              <Tooltip title="View">
                                <ReportProblemIcon
                                  onClick={() =>
                                    CCEntryFunction(row, "Warning")
                                  }
                                />
                              </Tooltip>
                              <Tooltip title="delete">
                                <DeleteIcon
                                  onClick={() => DeleteCCdata(row)}
                                />
                              </Tooltip>
                            </>
                          )}
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
            count={filter.fn(policyList)?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {edit === "ccEntry" ? (
          <Drawer
            open={openViewCC}
            sx={{
              zIndex: 100,
            }}
            anchor="right"
            PaperProps={{
              sx: { width: { xs: "100%", sm: "100%" } },
            }}
          >
            <ViewCCentry
              edit={edit}
              selectedData={selectedData}
              setOpenViewCC={setOpenViewCC}
              setPolicyList={setPolicyList}
            />
          </Drawer>
        ) : (
          <Dialog open={openViewCC}>
            <ViewCCentry
              edit={edit}
              selectedData={selectedData}
              setOpenViewCC={setOpenViewCC}
              setPolicyList={setPolicyList}
            />
          </Dialog>
        )}
        <ConfirmBox
          open={openConfirmBox}
          title="Delete"
          content="Are you sure want to Delete"
          confirmButton="Delete"
          setOpenConfirmBox={setOpenConfirmBox}
          Function={DeleteFunction}
          icon={<DeleteIcon />}
          color="error"
        />
      </div>
    </>
  );
};
export default CCEntry;
