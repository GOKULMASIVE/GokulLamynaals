
import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PostBranch, UpdateBranch, SaveComissionReceivableAmount, GetCommisionReceivableAmount } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
import { DeleteIcon, EditIcon, CloudOffIcon } from '../../../Resources/Icons/icons'
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import Button from "@mui/material/Button";
import * as Yup from "yup";


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
        label: "Entry Date",
    },
    {
        id: "policyNumber",
        placeMent: true,
        disablePadding: false,
        label: "Policy Number",
    },
    {
        id: "bankName",
        placeMent: true,
        disablePadding: false,
        label: "Bank Name",
        minWidth: "150px",
    },
    {
        id: "amount",
        placeMent: true,
        disablePadding: false,
        label: "Amount",
        minWidth: "150px",
    },
    {
        id: "remark",
        placeMent: true,
        disablePadding: false,
        label: "Remarks",
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

const ReceivedDrawer = (props) => {
    const { selectedData, formType, setOpenDrawer, title, GetData, showViewTrans , PendingFunction } =
        props;
    let formRef = useRef();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [transData, setFilterData] = useState([]);

    const initialValues = {
        entryDate: new Date(),
        bankName: "",
        remarks: "",
        receivedAmount: ''
    };

    const [filter, setFilter] = useState({
        fn: (items) => {
            return items;
        },
    });
    const visibleRows = React.useMemo(
        () =>
            stableSort(filter.fn(transData), getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filter, transData]
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transData.length) : 0;
    const UserId = localStorage.getItem("UserId");

    const userDetails = [{
        label: 'Dummy Login Id'
    }]

    const GetHistoryData = () => {
        GetCommisionReceivableAmount(selectedData._id).then((res) => {
            setFilterData(res.data)
        })
    }

    const validationSchema = Yup.object().shape({
        receivedAmount: Yup.number()
            // .min(0, 'Negative value not allowed')
            // .max(Number(selectedData?.commisionRecievable?.PendingAmount) + 0.1, 'Amount will be less than or equal to')
            .required('Enter Amount').typeError('Total must be a number')
    });


    useEffect(() => {
        GetHistoryData()
        if (formType === "edit") {
            Object.keys(initialValues).forEach((el) => {
                initialValues[el] = selectedData[el];
            });
            formRef.setFieldValue('policyNumber', selectedData?.policyNumber)
            formRef.setFieldValue('companyName', selectedData?.companyId?.companyName)
            formRef.setFieldValue('bookingCode', selectedData?.bookingCodeId?.bookingCode)
            formRef.setFieldValue('product', selectedData?.productId?.product)
            formRef.setFieldValue('policyType', selectedData?.policyTypeId?.policyType)
            formRef.setFieldValue('receivedAmount', Number(selectedData?.commisionRecievable?.PendingAmount))
        }
        formRef.setFieldValue(initialValues);
    }, []);

    const onSubmit = (e) => {
        e.policyId = selectedData?._id
        SaveComissionReceivableAmount(selectedData._id, e).then((res) => {
            ToastSuccess("Received Succesfully")
            PendingFunction()
            setOpenDrawer(false)
        }).catch((err) => {
            console.log(err)
        })
    };


    return (
        <>
            <div className="MainRenderinContainer">
                <Grid container className="DrawerHeader">
                    <Grid item xs={6} sm={6}>
                        <Typography>Received Transaction</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} className="d-flex justify-content-end">
                        <CloseIcon
                            onClick={() => setOpenDrawer(false)}
                            sx={{ cursor: "pointer" }}
                        />
                    </Grid>
                </Grid>
                <div className="container-fluid">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            onSubmit(values);
                        }}
                        innerRef={(ref) => {
                            if (ref) {
                                formRef = ref;
                            }
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form>
                                <Grid container spacing={showViewTrans ? 2 : 1}>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label="Policy Number" value={values.policyNumber}>
                                            <Field
                                                name="policyNumber"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label="Company Name" value={values.companyName}>
                                            <Field
                                                name="companyName"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled

                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label="Booking Code" value={values.bookingCode}>
                                            <Field
                                                name="bookingCode"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                                disabled
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <FloatLabel label="Entry Date" value={"React"}>
                                                <DatePicker
                                                    name="entryDate"
                                                    className="w-100 Date_Picker"
                                                    defaultValue={
                                                        dayjs()
                                                    }
                                                    onChange={(e) => setFieldValue("entryDate", e.$d)}
                                                />
                                            </FloatLabel>
                                        </LocalizationProvider>

                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label="Bank" value={values?.bankName}>
                                            <Field
                                                name="bankName"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label="Remark" value={values?.remarks}>
                                            <Field
                                                name="remarks"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />
                                        </FloatLabel>
                                    </Grid>
                                    <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                        <FloatLabel label={`Amount (${Number(selectedData?.commisionRecievable?.PendingAmount)})`} value={values.receivedAmount}>
                                            <Field
                                                name="receivedAmount"
                                                className="InputFiled"
                                                style={{ textTransform: "uppercase" }}
                                            />

                                        </FloatLabel>
                                        <div className="errorMessage">
                                            {errors.receivedAmount && touched.receivedAmount ? (
                                                <div>{errors.receivedAmount}</div>
                                            ) : (
                                                " "
                                            )}
                                        </div>
                                    </Grid>
                                    {
                                        showViewTrans ?
                                            <Grid item xs={12} sm={showViewTrans ? 4 : 12}>
                                                <button className="TabelButton w-25" style={{ border: 'none' }} type="submit">Submit</button>
                                            </Grid> :
                                            <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                                                <button onClick={() => setOpenDrawer(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit">
                                                    {selectedData?._id ? "Update" : "Save"}
                                                </button>
                                            </Grid>
                                    }
                                </Grid>
                            </Form>
                        )}
                    </Formik><hr style={{ display: showViewTrans ? 'block' : 'none' }} />
                    {
                        showViewTrans ?
                            <div>
                                <Typography mt={2} mb={2}>Transaction History</Typography>

                                <Paper sx={{ width: "100%", mb: 2 }}>
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
                                                rowCount={transData?.length}
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
                                                                sx={{ minWidth: "150px" }}
                                                            >
                                                                {moment(row.entryDate).format("L")}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ minWidth: "180px" }}>
                                                                {row?.policyNumber}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ minWidth: "180px" }}>
                                                                {row?.bankName}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ minWidth: "180px" }}>
                                                                {row?.receivedAmount}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ minWidth: "200px" }}>
                                                                {row?.remarks}
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
                                        count={visibleRows?.length || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div> : null}
                </div>


            </div>
        </>
    );
};

export default ReceivedDrawer;
