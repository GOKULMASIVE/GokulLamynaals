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
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField"
import {
    RemoveRedEyeIcon,
    SearchIcon,
    EditIcon,
    DownloadIcon,
    CloudOffIcon,
    RestartAltIcon
} from "../../../Resources/Icons/icons";
import moment from "moment";

import {
    GetPolicyFileById,
    DeleteBranch,
    GetCompany,
    GetBookingCode,
    GetPolicyFindbyId,
    FilterPolicyList, GetReceivablePayablePercentage
} from "../../../Service/_index";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CommonPayableDrawer from "../CommonPayableDrawer/CommonPayableDrawer";
import { PolicyFilterTypes } from "../../../Shared/CommonConstant";
import Loader from '../../../UiComponents/Loader/Loader'
import { DatePicker, Radio } from 'antd';
import { CSVLink } from "react-csv";
import dayjs from "dayjs";

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
        id: "issueData",
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
        id: "product",
        placeMent: true,
        disablePadding: false,
        label: "Product",
    },
    {
        id: "policyType",
        placeMent: true,
        disablePadding: false,
        label: "Policy Type",
    },
    {
        id: "paymentMode",
        placeMent: true,
        disablePadding: false,
        label: "Payment Type",
    },
    {
        id: "receivableAmount",
        placeMent: true,
        disablePadding: false,
        label: "Receivable Amount",
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
    rowCount: PropTypes.number.isRequired,
};

const CommisionReceivable = () => {
    const todayDate = new Date()
    const LastWeekDate = new Date();
    LastWeekDate.setDate(LastWeekDate.getDate() - 7);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [openFilterDropdown, setOpenFilterDropdown] = React.useState(true);
    const [selectedData, setSelectedData] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
    const [policyList, setPolicyList] = React.useState([]);
    const [companyDetails, setCompanyDetails] = useState([]);
    const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
    const [openLoader, setOpenLoader] = useState(false)
    const [formType, setFormType] = useState('')
    const [selectedComapny, setSelectedCompany] = useState(null);
    const [selectedBookingCode, setSelectedBookingCode] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [resetValue, setResetValue] = useState(1)
    const [payableType, setPayableType] = useState('')
    const [filterType, setFilterType] = useState("PENDING")
    const [editType, setEditType] = useState('')
    const [payablePercentage, setPayablePercentage] = useState({})

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

    const ApproveFunction = (row, key) => {
        setOpenLoader(true)
        GetPolicyFindbyId(row._id).then((res) => {
            setSelectedData(res.data)
            setFormType('edit')
            setPayableType('commisionReceivable')
            setEditType(key)
        })
        GetReceivablePayablePercentage(row._id).then((res) => {
            setOpenDrawer(true);
            setOpenLoader(false)
            setPayablePercentage(res?.data)
        })
    };

    const GetPolicyFindbyIdFunction = (row) => {
        setOpenLoader(true)
        GetPolicyFindbyId(row._id).then((res) => {
            setOpenLoader(false)
            setSelectedData(res.data)
            setOpenDrawer(true);
            setFormType('view')
        })
    }



    const onSearch = (e) => {
        let target = e.target;
        setFilter({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter((el) =>
                        `${el?.policyNumber},${el?.companyId?.companyName},${el.customerName},${el?.registrationNumber},${el?.paymentMode},${el?.productId?.product},${el?.policyTypeId?.policyType},${el?.commisionRecievable?.ReceivedAmount}`
                            .toLowerCase()
                            .includes(target.value.toLowerCase())
                    );
            },
        });
    setPage(0)

    };

    const GetCompanyDetails = () => {
        GetCompany({ isAscending: true }).then((res) => {
          const modifiedCompanyDetails = res.data
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
            console.log(modifiedCompanyDetails)
          setCompanyDetails(modifiedCompanyDetails);
        });
    };
    const GetBookingCodeDetails = () => {
        GetBookingCode({ isAscending: true }).then((res) => {
          const modifiedBookingCode = res.data.map((e) => {
            return {
              ...e,
              label: e.bookingCode,
              value: e._id,
            };
          });
          setBookingCodeDetails(modifiedBookingCode);
        });
    };
    React.useEffect(() => {
        GetCompanyDetails();
        GetBookingCodeDetails();
    }, []);

    const GetData = () => {
        setOpenLoader(true)
        FilterPolicyList({
            companyId: selectedComapny?._id, bookingCodeId: selectedBookingCode?._id,
            startDate: selectedStartDate, endDate: selectedEndDate,
            type: filterType, FilterType: "UTILITES_SCREEN",
            screen: "COMMISION_RECIVABLE",
        }).then((res) => {
            setOpenLoader(false)
            const data = res.data.map((e) => {
                return {
                    ...e,
                    formateDate: moment(e.issueDate).format('DD/MM/YYYY')
                }
            })
            setPolicyList(data);
        }).catch((err) => {
            console.log("err")
        })
    };
    React.useEffect(() => {
        GetData()
    }, [])
    const ResetFilter = () => {
        setSelectedCompany(null)
        setSelectedBookingCode(null)
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setResetValue(resetValue + 1)
        GetData()
    }

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

    const header = [
        { label: "Policy Date", key: "formateDate" },
        { label: "Company Name", key: "companyId.companyName" },
        { label: "Policy Number", key: "policyNumber" },
        { label: "Customer Name", key: "customerName" },
        { label: "Mobile", key: "mobileNumber" },
        { label: "Payment Mode", key: "paymentMode" },
        { label: "Reg Number", key: "registrationNumber" },
        { label: "User Email", key: "email" },
    ];
    const csvFile = {
        filename: "Commision Receivable Data",
        headers: header,
        data: policyList
    };

    const FilterOptions = [
        {
            label: 'Pending',
            FilterType: "UTILITES_SCREEN",
            screen: "USER_PAYABLE",
            type: "PENDING"
        },
        {
            label: 'Issue Date',
            FilterType: "UTILITES_SCREEN",
            screen: "USER_PAYABLE",
            type: "ISSUE_DATE"
        },
        {
            label: 'Approve Date',
            FilterType: "UTILITES_SCREEN",
            screen: "USER_PAYABLE",
            type: "APPROVE_DATE"
        },
    ]
    const dateFormat = 'YYYY-MM-DD';

    return (
        <>

            <Grid container columnSpacing={2} rowSpacing={1} sx={{ padding: '10px 10px 0 10px' }} className="Master_Header_Container" >
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Select Company" value={selectedComapny?.value}>
                        <Autocomplete
                            name="companyId"
                            className="AutoComplete_InputBox"
                            options={companyDetails}
                            onChange={(e, v) => {
                                setSelectedCompany(v);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                            key={resetValue}
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Company code" value={selectedBookingCode?.value}>
                        <Autocomplete
                            name="companyId"
                            className="AutoComplete_InputBox"
                            options={bookingCodeDetails}
                            onChange={(e, v) => {
                                setSelectedBookingCode(v);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                            key={resetValue}
                        />
                    </FloatLabel>
                </Grid>

                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Start date & End Date" value="react">
                        <RangePicker placement='bottomLeft' className="Range_Picker w-100" style={{ borderRadius: '0px' }}
                            onChange={(e) => {
                                
                                setSelectedStartDate(e ? e[0].$d : null);
                                setSelectedEndDate(e ? e[1].$d : null);
                               
                            }}
                            format='DD/MM/YYYY'
                            key={resetValue}
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Pending" value="PENDING">
                        <Autocomplete
                            name="filterType"
                            className="AutoComplete_InputBox"
                            options={FilterOptions}
                            onChange={(e, v) => {
                                setFilterType(v?.type);
                            }}
                            defaultValue={FilterOptions.find((el) => el.type === "PENDING")}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?.label === value?.label
                            }
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={9} xs={12} />
                <Grid item sm={3} xs={12} sx={{ display: 'flex', justifyContent: 'end' }} gap={2}>
                    <Button
                        className="Master_Header_create_Button"
                        sx={{ width: { xs: "100%", sm: "30%" } }}
                        onClick={() => GetData()}
                    >
                        Search
                    </Button>
                    <Button
                        className="Master_Header_Reset_Button"
                        sx={{ width: { xs: "100%", sm: "30%" } }}
                        endIcon={<RestartAltIcon />}
                        onClick={() => ResetFilter()}
                    >
                        Reset
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1 }} mt={4}>
                <Grid container className="Master_Header_Container" spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Typography className="Master_Header_Heading">Commision Payable</Typography>
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
                        "container-fluid TableBox " + (openFilter ? "OpenTable" : "")
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
                                rowCount={policyList?.length}
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
                                                {
                                                    row.filterType === "APPROVE_DATE" ?
                                                        <>{moment(row?.commisionRecievable?.createdAt).format("DD-MM-YYYY LT")}</> : <>{moment(row?.issueDate).format("D-M-Y")}</>
                                                }
                                            </TableCell>
                                            <TableCell align="left">{row?.companyId?.shortName}</TableCell>
                                            <TableCell align="left" onClick={() => OpenPolicyFile(row)} sx={{ color: 'blue', textDecoration: 'underline' }}>
                                                {row?.policyNumber}
                                            </TableCell>
                                            <TableCell align="left">{row?.customerName}</TableCell>
                                            <TableCell align="left">{row?.productId?.product}</TableCell>
                                            <TableCell align="left">{row?.policyTypeId?.policyType}</TableCell>
                                            <TableCell align="left">{row?.paymentMode}</TableCell>
                                            <TableCell align="left">{row?.commisionRecievable?.Total}</TableCell>
                                            <TableCell align="center">
                                                <Box className="ActionIcons d-flex" gap={2}>
                                                    {
                                                        row.isCommisionRecievable ?
                                                            <Tooltip title="edit" onClick={() => ApproveFunction(row, "Edit")}>
                                                                <EditIcon />
                                                            </Tooltip> :

                                                            <Button
                                                                variant="outlined"
                                                                color="success"
                                                                sx={{
                                                                    width: {
                                                                        xs: "100%", sm: "100%", backgroundColor: 'green', fontSize: "12px", color: 'white', padding: '1px', textTransform: 'capitalize',
                                                                        '&:hover': {
                                                                            color: 'green',
                                                                        },
                                                                    }
                                                                }}
                                                                onClick={() => ApproveFunction(row, "Approve")}
                                                            >Approve</Button>
                                                    }
                                                    <Tooltip title="View" onClick={() => GetPolicyFindbyIdFunction(row)}>
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
            </div>

            <Drawer
                open={openDrawer}
                sx={{
                    zIndex: 100,
                }}
                anchor="right"
                PaperProps={{
                    sx: { width: { xs: "100%", sm: formType === 'view' ? '100%' : '50%' } },
                }}
            >{
                    openDrawer ? <CommonPayableDrawer ReceivablePayablePercentage={payablePercentage} setOpenDrawer={setOpenDrawer} formType={formType} selectedData={selectedData} path={"commisionReceivable"} GetData={GetData} payableType={payableType} editType={editType}
                    /> : null
                }
            </Drawer>
            <Loader open={openLoader} />

        </>
    );
};
export default CommisionReceivable;
