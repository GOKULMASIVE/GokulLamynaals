
import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { GetBranchWalletByUSerId, GetPolicyFileById } from "../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { DeleteIcon, EditIcon, CloudOffIcon } from '../../Resources/Icons/icons'
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import ButtonGroup from '@mui/material/ButtonGroup';
import { DatePicker } from 'antd';
import Loader from '../../UiComponents/Loader/Loader'
import { ToastError } from "../../UiComponents/Toaster/Toast";

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
        id: "policyDate",
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
        id: "paymentMode",
        placeMent: true,
        disablePadding: false,
        label: "Payment Mode",
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
        label: "User email",
    },
    {
        id: "branchAmount",
        placeMent: true,
        disablePadding: false,
        label: "Branch Amount",
    },
    {
        id: "userAmount",
        placeMent: true,
        disablePadding: false,
        label: "User Amount",
    },
    {
        id: "pendingBalance",
        placeMent: true,
        disablePadding: false,
        label: "Pending Balance",
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

const ManageBranchWallet = (props) => {
    const { selectedData, formType, setOpenDrawer } =
        props;
    let formRef = useRef();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [data, setData] = useState([]);
    const [openLoader, setOpenLoader] = useState(false)

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
    const UserId = localStorage.getItem("UserId");


    const onSearch = (e) => {
        let target = e.target;
        setFilter({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter((el) =>
                        `${el?.policyNumber},${el?.companyId?.companyName},${el.customerName},${el?.registrationNumber},${el?.paymentMode},${el?.email}`
                            .toLowerCase()
                            .includes(target.value.toLowerCase())
                    );
            },
        });
    };
    const GetBranchWalletByUSerIdDetails = () => {
        GetBranchWalletByUSerId(selectedData?._id).then((res) => {
            setData(res?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        GetBranchWalletByUSerIdDetails()
    }, [])

    const OpenPolicyFile = (row) => {
        setOpenLoader(true)
        GetPolicyFileById(row?.policyId).then((res) => {
            const pdfUrl = res.data.policyFile.downloadURL
            return pdfUrl
        }).then((pdfUrl) => {
            setOpenLoader(false)
            const pdfWindow = window.open("", "_blank");
            pdfWindow?.document?.write(
                `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
            );
        }).catch((err) => {
            ToastError("Something went wrong")
            setOpenLoader(false)
        })
    };
    return (
        <>
            <div className="MainRenderinContainer">
                <Grid container className="DrawerHeader">
                    <Grid item xs={6} sm={6}>
                        <Typography>Branch Payable</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                        <CloseIcon
                            onClick={() => setOpenDrawer(false)}
                            sx={{ cursor: "pointer" }}
                        />
                    </Grid>
                </Grid>
                <div className="container-fluid">

                    <div>
                        <Typography mt={2} mb={4}>Transactions of {selectedData?.branchManager}</Typography>
                        <Grid container mb={4} >
                            <Grid item sm={3} xs={12}>
                                <FloatLabel label="Start date & End Date" value="react">
                                    <RangePicker placement='bottomLeft' className="textField w-100" style={{ borderRadius: '0px' }} onChange={(e) => {

                                    }}
                                        format='DD/MM/YYYY'
                                    />
                                </FloatLabel>
                            </Grid>
                        </Grid>
                        <Paper sx={{ width: "100%", mb: 2 }} >
                            <TableContainer className="TableContainer">
                                <Table
                                    aria-labelledby="tableTitle"
                                    size="medium"
                                    stickyHeader
                                    sx={{ minWidth: 750 }}
                                >
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={data?.length}
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
                                                        {moment(row?.approvedDate).format("DD-MM-YYYY LT")}
                                                    </TableCell>

                                                    <TableCell align="left" >
                                                        {row?.companyName}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ color: 'blue' }}>
                                                        <label onClick={() => OpenPolicyFile(row)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{row?.policyNumber}</label>
                                                    </TableCell><TableCell align="left" >
                                                        {row?.customerName}
                                                    </TableCell>
                                                    <TableCell align="left" >
                                                        {row?.paymentMode}
                                                    </TableCell><TableCell align="left" >
                                                        {row?.netPremium}
                                                    </TableCell><TableCell align="left" >
                                                        {row?.totalPremium}
                                                    </TableCell><TableCell align="left" >
                                                        {row?.userEmail}
                                                    </TableCell><TableCell align="left" >
                                                        {row?.branchAmount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="left" >
                                                        {row?.userAmount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="left" >
                                                        {row?.pendingBalance.toFixed(2)}
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
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={data?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
                <Loader open={openLoader} />

            </div>
        </>
    );
};

export default ManageBranchWallet;
