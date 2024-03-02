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
import Drawer from "@mui/material/Drawer";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import moment from "moment";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from '@mui/material/TextField';
import { PolicyFilterTypes, AWS_DIRECTORY_NAME } from '../../../Shared/CommonConstant'
import Loader from '../../../UiComponents/Loader/Loader'
import {
    RemoveRedEyeIcon,
    SearchIcon,
    DeleteIcon,
    DownloadIcon,
    CloudOffIcon, RestartAltIcon
} from "../../../Resources/Icons/icons";
import { CSVLink } from "react-csv"
import {
    GetPolicyList,
    UpdatePolicyList,
    GetPolicyFileById,
    FilterPolicyList
} from "../../../Service/_index";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, Radio } from 'antd';
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



function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, viewActionIcon } = props;

    const headCells = [
        {
            id: "issueDate",
            placeMent: "left",
            disablePadding: false,
            label: "Policy Date",
        },
        {
            id: "policyListName",
            placeMent: "left",
            disablePadding: false,
            label: "Company Name",
        },
        {
            id: "policyNumber",
            placeMent: "left",
            disablePadding: false,
            label: "Policy Number",
        },
        {
            id: "customerName",
            placeMent: "left",
            disablePadding: false,
            label: "Customer Name",
        },
        {
            id: "register",
            placeMent: "left",
            disablePadding: false,
            label: "Reg Number",
        },
        {
            id: "chequeNumber",
            placeMent: "left",
            disablePadding: false,
            label: "Cheque Number",
        },
        {
            id: "bankName",
            placeMent: "left",
            disablePadding: false,
            label: "Bank Name",
        },
        {
            id: "email",
            placeMent: "left",
            disablePadding: false,
            label: "User Email",
        },
        {
            id: "policyList",
            placeMent: "left",
            disablePadding: false,
            label: "Branch",
        },
        {
            id: "clear",
            placeMent: "center",
            disablePadding: false,
            label: "Clear",
        },
        {
            id: "bounce",
            placeMent: "center",
            disablePadding: false,
            label: "Status",
        },
        ...(props.viewActionIcon
            ? [
                {
                    id: "action",
                    placeMent: "right",
                    disablePadding: false,
                    label: "Action",
                },
            ]
            : []),
    ];

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
                        align={headCell.placeMent}
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

const ChequeStatus = () => {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
    const [policyList, setPolicyList] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [resetValue, setResetValue] = useState(1)
    const [openLoader, setOpenLoader] = useState(false)
    const [showAction, setShowAction] = useState(false)
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

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - policyList.length) : 0;

    const GetData = () => {
        GetPolicyList().then((res) => {
            const data = res.data.map((e) => {
                return {
                    ...e,
                    formateData:moment(e.issueDate).format('DD/MM/YYYY')
                }
            })
            const FilterData = data.filter((res) => res.paymentMode === "Cheque" && res.status === PolicyFilterTypes[5].value)
            setPolicyList(FilterData)
        });
    };

    React.useEffect(() => {
        GetData();
    }, []);

    const onSearch = (e) => {
        let target = e.target;
        setFilter({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter((el) =>
                        `${el.policyNumber},${el.companyId?.shortName},${el.customerName},${el.registrationNumber},${el.chequeNumber},${el.bankName},${el.email},${el.remarks}`
                            .toLowerCase()
                            .includes(target.value.toLowerCase())
                    );
            },
        });
    setPage(0)

    };
  
    const OpenPolicyFile = (row) => {
        setOpenLoader(true)
        GetPolicyFileById(row?._id).then((res) => {
            const pdfUrl = res.data.policyFile.downloadURL
            return pdfUrl
        }).then((pdfUrl) => {
            setOpenLoader(false)
            const pdfWindow = window.open("", "_blank");
            pdfWindow?.document?.write(
                `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
            );
        })
    };

    const PendingFunction = () => {
        setOpenLoader(true)
        setShowAction(false)
        FilterPolicyList({
            startDate: selectedStartDate, endDate: selectedEndDate
        }).then((res) => {
            setOpenLoader(false)
            const data = res.data.map((e) => {
                return {
                    ...e,
                    formateData:moment(e.issueDate).format('DD/MM/YYYY')
                }
            })
            const FilterPolicy = data.filter((res) => res.status === PolicyFilterTypes[5].value && res.paymentMode === "Cheque")
            setPolicyList(FilterPolicy);
        }).catch((err) => {
            console.log("err")
        })
    };

    const CelaredFunction = () => {
        setOpenLoader(true)
        setShowAction(true)
        FilterPolicyList({
            startDate: selectedStartDate, endDate: selectedEndDate
        }).then((res) => {
            setOpenLoader(false)
            const data = res.data.map((e) => {
                return {
                    ...e,
                    formateData:moment(e.issueDate).format('DD/MM/YYYY')
                }
            })
            const FilterPolicy = data.filter((res) => res.status === PolicyFilterTypes[2].value && res.paymentMode === "Cheque" && res.chequeStatus === 'Cleared')
            setPolicyList(FilterPolicy);
        }).catch((err) => {
            console.log("err")
        })
    };

    const BouncedFunction = () => {
        setShowAction(true)
        setOpenLoader(true)
        FilterPolicyList({
            startDate: selectedStartDate, endDate: selectedEndDate
        }).then((res) => {
            setOpenLoader(false)
            const data = res.data.map((e) => {
                return {
                    ...e,
                    formateData:moment(e.issueDate).format('DD/MM/YYYY')
                }
            })
            const FilterPolicy = data.filter((res) => res.status === PolicyFilterTypes[6].value && res.paymentMode === "Cheque" && res.chequeStatus === 'Bounced')
            setPolicyList(FilterPolicy);
        }).catch((err) => {
            console.log("err")
        })
    };


    const header = [
        { label: "Policy Date", key: "formateData" },
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
        data: policyList
    };
    const ResetFunction = (row) => {
        let stringWithQuotes = row?.policyNumber;
        let stringWithoutQuotes = stringWithQuotes.replace(/'/g, '');
        row.policyNumber = stringWithoutQuotes
        row.status = PolicyFilterTypes[5].value
        row.rejectedReason = ""
        row.chequeStatus = ""
        UpdatePolicyList(row?._id, row).then((res) => {
            setOpenLoader(false)
            PendingFunction()
            setShowAction(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    const ChequeMangeFunction = (data, key) => {
        setOpenLoader(true)

        if (key === "Clear") {
            data.status = PolicyFilterTypes[2].value
            data.rejectedReason = "Suspend"
            data.chequeStatus = 'Cleared'
            data.status === PolicyFilterTypes[4].value ? (data.rejectedReason = "Approved") : (data.rejectedReason = "Suspend")
        }
        else {
            data.status = PolicyFilterTypes[6].value
            data.rejectedReason = "Cheque Bounced"
            data.chequeStatus = 'Bounced'
        }
        let stringWithQuotes = data?.policyNumber;
        let stringWithoutQuotes = stringWithQuotes.replace(/'/g, '');
        data.policyNumber = stringWithoutQuotes
        data.userId = data?.userId?._id
        data.companyId = data?.companyId?._id
        data.bookingCodeId = data?.bookingCodeId?._id
        data.productId = data?.productId?._id
        data.policyTypeId = data?.policyTypeId?._id
        data.subBookingCodeId = data?.subBookingCodeId?._id
        data.subProductId = data?.subProductId?._id
        UpdatePolicyList(data?._id, data).then((res) => {
            setOpenLoader(false)

            
            PendingFunction()
        }).catch((err) => {
            console.log(err)
            ToastError("Something Went error")
        })
    }
    return (
        <>
            <Grid container spacing={1} sx={{ padding: '10px 0 0 10px' }} >
                <Grid item sm={3} xs={12} className="datePicker">
                    <FloatLabel label="Start date & End Date" value="react">
                        <RangePicker placement='bottomLeft' className="textField w-100" style={{ borderRadius: '0px' }} onChange={(e) => {
                            setSelectedStartDate(e ? e[0].$d : null);
                            setSelectedEndDate(e ? e[1].$d : null);
                        }}
                            format='DD/MM/YYYY'
                            key={resetValue}

                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={1} xs={12}>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "100%" } }}
                        onClick={() => PendingFunction()}
                    >
                        Pending
                    </Button>
                </Grid>
                <Grid item sm={1} xs={12}>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "100%" } }}
                        onClick={() => CelaredFunction()}
                    >
                        Cleared
                    </Button>
                </Grid>
                <Grid item sm={1} xs={12}>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "100%" } }}
                        onClick={() => BouncedFunction()}
                    >
                        Bounced
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1 }}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">Cheque Status</Typography>
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
                                size="small"
                                stickyHeader
                                aria-label="sticky table"
                                sx={{ minWidth: 750 }}
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={policyList?.length}
                                    viewActionIcon={showAction}
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
                                                    {moment(row?.issueDate).format("D-M-Y")}
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="normal">
                                                    {row?.companyId?.shortName}
                                                </TableCell>
                                                <TableCell align="left" onClick={() => OpenPolicyFile(row)} sx={{ color: 'blue', textDecoration: 'underline' }}>
                                                    {row?.policyNumber}
                                                </TableCell>
                                                <TableCell align="left">{row?.customerName}</TableCell>
                                                <TableCell align="left">{row?.registrationNumber}</TableCell>
                                                <TableCell align="left">{row?.chequeNumber}</TableCell>
                                                <TableCell align="left">{row?.bankName}</TableCell>
                                                <TableCell align="left">{row?.email}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.status === PolicyFilterTypes[5].value ?
                                                            <Button
                                                                variant="outlined"
                                                                color="success"
                                                                sx={{
                                                                    width: {
                                                                        xs: "100%", sm: "100%", backgroundColor: 'green', color: 'white',
                                                                        '&:hover': {
                                                                            color: 'green',
                                                                        },
                                                                    }
                                                                }}
                                                                onClick={() => ChequeMangeFunction(row, "Clear")}
                                                            >Clear</Button> :
                                                            <label>{row?.chequeStatus}</label>

                                                    }</TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.status === PolicyFilterTypes[5].value ?
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                sx={{
                                                                    width: {
                                                                        xs: "100%", sm: "100%", backgroundColor: 'red', color: 'white',
                                                                        '&:hover': {
                                                                            color: 'red',
                                                                        },
                                                                    }
                                                                }}
                                                                onClick={() => ChequeMangeFunction(row, "Bounce")}
                                                            >Bounce</Button> :
                                                            <label>{row?.rejectedReason}</label>
                                                    }
                                                </TableCell>
                                                {
                                                    showAction ?
                                                        <TableCell align="right">
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                sx={{
                                                                    width: {
                                                                        xs: "100%", sm: "100%", backgroundColor: 'red', color: 'white',
                                                                        '&:hover': {
                                                                            color: 'red',
                                                                        },
                                                                    }
                                                                }}
                                                                endIcon={<RestartAltIcon />}
                                                                onClick={() => ResetFunction(row)}
                                                            >
                                                                Reset
                                                            </Button>
                                                        </TableCell> : null}
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
                            count={filter.fn(policyList).length || 0}
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
            <Loader open={openLoader} />

            <ConfirmBox
                open={openConfirmBox}
                title={"Delete"}
                content={"Are you sure Want to Delete !"}
                confirmButton={"Delete"}
                setOpenConfirmBox={setOpenConfirmBox}
                icon={<DeleteIcon />}
            />
        </>

    );
};
export default ChequeStatus;
