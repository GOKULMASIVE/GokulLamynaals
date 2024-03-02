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
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import {
    RemoveRedEyeIcon,
    SearchIcon,
    DeleteIcon,
    DownloadIcon,
    CloudOffIcon
} from "../../../Resources/Icons/icons";
import { CSVLink } from "react-csv"
import {
    GetBranch,
    DeleteBranch,
} from "../../../Service/_index";


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
        id: "companyName",
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
        placeMent: false,
        disablePadding: false,
        label: "Customer Name",
    },
    {
        id: "mobile",
        placeMent: false,
        disablePadding: false,
        label: "Mobile",
    },
    {
        id: "regnumber",
        placeMent: false,
        disablePadding: false,
        label: "Reg Number",
    },
    {
        id: "expiryDate",
        placeMent: false,
        disablePadding: false,
        label: "Expiry Date",
    },
    {
        id: "oldpremium",
        placeMent: false,
        disablePadding: false,
        label: "Old Premium",
    },
    {
        id: "user",
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

const OfficeExpenses = () => {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedData, setSelectedData] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
    const [branch, setBranch] = React.useState([]);
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


    const DeleteFunction = async () => {
        await DeleteBranch(selectedData?._id)
            .then((res) => {
                GetData();
                setOpenConfirmBox(false);
                ToastError(res.message);
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
    setPage(0)

    };

    const header = [
        { label: "Policy Date", key: "issueDate" },
        { label: "Company Name", key: "companyId.companyName" },
        { label: "Policy Number", key: "policyNumber" },
        { label: "Customer Name", key: "customerName" },
        { label: "Mobile", key: "mobileNumber" },
        { label: "Payment Mode", key: "paymentMode" },
        { label: "Reg Number", key: "registrationNumber" },
        { label: "User Email", key: "email" },
    ];
    const csvFile = {
        filename: "Cheque Status Data",
        headers: header,
        data: []
    };
    return (
        <>
            <Grid container className="Master_Header_Container" spacing={2}>
                <Grid item xs={12} sm={3}>
                    <Typography className="Master_Header_Heading">Office Expenses</Typography>
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
                        sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                        <CSVLink className="Download_Excel_Button" {...csvFile} >
                            Download Excel
                        </CSVLink>
                    </Button>
                </Grid>
            </Grid>

            <div className="d-flex PageContainer">
                <Paper className="container-fluid TableBox ">
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
                        count={filter.fn(branch).length || 0}
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
export default OfficeExpenses;
