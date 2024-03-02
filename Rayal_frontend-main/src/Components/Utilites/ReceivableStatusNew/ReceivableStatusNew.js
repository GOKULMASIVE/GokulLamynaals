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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from '@mui/material/TextField';
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import {
    RemoveRedEyeIcon,
    SearchIcon,
    DeleteIcon,
    DownloadIcon,
} from "../../../Resources/Icons/icons";

import {
    GetBranch,
    DeleteBranch,
    GetCompany,
    GetBookingCode,
} from "../../../Service/_index";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
        id: "address",
        placeMent: true,
        disablePadding: false,
        label: "Product",
    },
    {
        id: "remarks",
        placeMent: true,
        disablePadding: false,
        label: "Policy Number",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Customer Name",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Mobile",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Reg Number",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Expiry Date",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Old Premium",
    },
    {
        id: "action",
        placeMent: false,
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

const bookingCodeDetails = [
    {
        valuue: "w",
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

const ReceivableStatusNew = () => {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [openFilterDropdown, setOpenFilterDropdown] = React.useState(true);
    const [selectedData, setSelectedData] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
    const [branch, setBranch] = React.useState();
    const [openSound, setOpenSound] = React.useState(false);
    const [companyDetails, setCompanyDetails] = useState();
    const [bookingCodeDetails, setBookingCodeDetails] = useState();

    const [filter, setFilter] = useState({
        fn: (items) => {
            return items;
        },
    });

    const visibleRows = React.useMemo(
        () =>
            stableSort(filter.fn(branch), getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filter, branch]
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - branch.length) : 0;

    const GetData = () => {
        GetBranch().then((res) => {
            setBranch(res.data);
        });
    };

    React.useEffect(() => {
        GetData();
    }, []);

    const EditBranchData = (row) => {
        setSelectedData(row);
        setOpenDrawer(true);
    };

    const CreateBranchData = () => {
        setSelectedData({});
        setOpenDrawer(true);
    };

    const DeleteBranchData = (e) => {
        setOpenConfirmBox(true);
        setSelectedData(e);
    };

    const offAlertSound = () => {
        setTimeout(() => setOpenSound(false), 1500);
    };
    const DeleteFunction = async () => {
        await DeleteBranch(selectedData?._id)
            .then((res) => {
                GetData();
                setOpenConfirmBox(false);
                ToastError(res.message);
                setOpenSound(true);
                offAlertSound();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSearch = (e) => {
        let target = e.target;
        setFilter({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter((el) =>
                        `${el.branchName},${el.address},${el.remarks}`
                            .toLowerCase()
                            .includes(target.value.toLowerCase())
                    );
            },
        });
    };

    const GetCompanyDetails = () => {
        GetCompany({ isAscending: true })
          .then((res) => {
            setCompanyDetails(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
    };
    const GetBookingCodeDetails = () => {
        GetBookingCode({ isAscending: true })
          .then((res) => {
            setBookingCodeDetails(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
    };
    React.useEffect(() => {
        GetCompanyDetails();
        GetBookingCodeDetails();
    }, []);

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
                        <Grid container rowSpacing={1}>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    display: { xs: "block", sm: "flex" },
                                    justifyContent: { xs: "start", sm: "end" },
                                }}
                            >
                                <Button
                                    className="TabelButton"
                                    endIcon={<DownloadIcon />}
                                    sx={{ width: { xs: "100%", sm: "20%" } }}
                                >
                                    Download Excel
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>

            <div className="d-flex PageContainer">
                <Paper
                    className={
                        "container-fluid TableBox " + (openFilter ? "OpenTable" : "")
                    }
                >
                    <Grid container spacing={1} sx={{ padding: '20px 0 0 0', mt: 2 }} >

                        <Grid item sm={3} xs={12} >
                            <TextField className="textField w-100" placeholder="Policy Number" />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FloatLabel label="Select Company">

                                <Select
                                    className="w-100 DropdownField InputFiled"
                                    name="companyId"
                                >
                                    {companyDetails?.map((e) => {
                                        return (
                                            <MenuItem value={e._id} key={e._id}>
                                                {e.bookingCode}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FloatLabel>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FloatLabel label="Company code">
                                <Select
                                    className="w-100 DropdownField InputFiled"
                                    name="companyId"
                                >
                                    {bookingCodeDetails?.map((e) => {
                                        return (
                                            <MenuItem value={e._id} key={e._id}>
                                                {e.bookingCode}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FloatLabel>
                        </Grid>

                        <Grid item sm={3} xs={12} className="datePicker">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={["SingleInputDateRangeField"]} sx={{ width: { xs: '100%', sm: '100%' } }}>
                                    <DateRangePicker
                                        slots={{ field: SingleInputDateRangeField }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item sm={3} xs={12}>
                            <Button
                                className="TabelButton"
                                sx={{ width: { xs: "100%", sm: "50%" }, }}
                            >
                                List
                            </Button>&nbsp;
                            <Button
                                className="TabelButton"
                                sx={{ width: { xs: "100%", sm: "48%" } }}
                            >
                                Score
                            </Button>
                        </Grid>
                    </Grid>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            mt: 5
                        }}
                    >
                        <Typography
                            sx={{ flex: "1 1 100%" }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Commision Receivable Approved
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
                                aria-label="sticky table"
                                sx={{ minWidth: 750 }}
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={branch?.length}
                                />
                                <TableBody>
                                    {visibleRows?.map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                
                                                tabIndex={-1}
                                                key={row.branchName}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                <TableCell component="th" scope="row" padding="normal">
                                                    {row.branchName}
                                                </TableCell>
                                                <TableCell align="left">{row.address}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>

                                                <TableCell align="center">
                                                    <Box className="ActionIcons">
                                                        <Tooltip title="View">
                                                            <RemoveRedEyeIcon />
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
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={branch?.length}
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
            ></Drawer>

            <ConfirmBox
                open={openConfirmBox}
                title={"Delete"}
                content={"Are you sure Want to Delete !"}
                confirmButton={"Delete"}
                setOpenConfirmBox={setOpenConfirmBox}
                Function={DeleteFunction}
                icon={<DeleteIcon />}
            />
        </>
    );
};
export default ReceivableStatusNew;
