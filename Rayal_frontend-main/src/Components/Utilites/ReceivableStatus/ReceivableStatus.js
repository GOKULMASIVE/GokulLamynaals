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
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import {
    RemoveRedEyeIcon,
    SearchIcon,
    CloudOffIcon
} from "../../../Resources/Icons/icons";
import moment from "moment";
import ReceivedDrawer from "./ReceivedDrawer";
import {
    GetPolicyList,
    GetPolicyFileById,
    GetCompany,
    GetBookingCode,
    FilterPolicyList,
} from "../../../Service/_index";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField"
import { DatePicker } from 'antd';
import Loader from '../../../UiComponents/Loader/Loader'

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
        id: "regNumber",
        placeMent: true,
        disablePadding: false,
        label: "Reg Number",
    },
    {
        id: "totalReceivable",
        placeMent: true,
        disablePadding: false,
        label: "Total Receivable",
    },
    {
        id: "receivedAmount",
        placeMent: true,
        disablePadding: false,
        label: "Received Amount",
    },
    {
        id: "pendingReceivable",
        placeMent: true,
        disablePadding: false,
        label: "Pending Receivable",
    },
    {
        id: "action",
        placeMent: true,
        disablePadding: false,
        label: "Action",
    },
    {
        id: "viewTransaction",
        placeMent: false,
        disablePadding: false,
        label: "View Transaction",
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

const ReceivableStatus = () => {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedData, setSelectedData] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [policyList, setPolicyList] = React.useState([]);
    const [companyDetails, setCompanyDetails] = useState([]);
    const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
    const [showViewTrans, setShowViewTrans] = useState(false)
    const [totalReceivableAmount, setTotalReceivableAmount] = useState([])
    const [totalReceivedAmount, setTotalReceivedAmount] = useState([])
    const [pendingReceivableAmount, setPendingReceivableAmount] = useState([])
    const [receivedButton, setReceivedButton] = useState(null)
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedBookingCode, setSelectedBookingCode] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [openLoader, setOpenLoader] = useState(false)
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
            const FilterPolicy = res.data.filter((item) => item.isCommisionRecievable === true)
            setPolicyList([]);

        });
    };



    const onSearch = (e) => {
        let target = e.target;
        setFilter({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter((el) =>
                        `${el?.policyNumber},${el?.companyId?.shortName},${el.customerName},${el?.registrationNumber},${el?.commisionRecievable?.Total},${el?.commisionRecievable?.ReceivedAmount},${el?.commisionRecievable?.PendingAmount}`
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

    const ReceivedDrawerFunction = (row) => {
        setSelectedData(row)
        setOpenDrawer(true)
        setShowViewTrans(false)

    }

    const ViewTransFunction = (row) => {
        setSelectedData(row)
        setOpenDrawer(true)
        setShowViewTrans(true)
    }

    const calculateSum = (arr) => {
        return arr?.reduce((total, current) => {
            return Number(total) + Number(current);
        }, 0);
    }



    const ReceivedFunction = () => {
        setOpenLoader(true)
        FilterPolicyList({
            companyId: selectedCompany?._id, bookingCodeId: selectedBookingCode?._id,
            startDate: selectedStartDate, endDate: selectedEndDate
        }).then((res) => {
            setOpenLoader(false)
            const FilterPolicy = res.data.filter((item) => item.isCommisionRecievable === true && Number(item?.commisionRecievable?.PendingAmount) === 0)
            setPolicyList(FilterPolicy);
            const TotalReceivable = FilterPolicy.map((e) => e.commisionRecievable.Total);
            setTotalReceivableAmount(TotalReceivable)
            setTotalReceivedAmount(['0'])
            setPendingReceivableAmount(['0'])
            setReceivedButton(false)
        }).catch((err) => {
            console.log("err")
        })
    };

    const PendingFunction = () => {
        setOpenLoader(true)
        FilterPolicyList({
            companyId: selectedCompany?._id, bookingCodeId: selectedBookingCode?._id,
            startDate: selectedStartDate, endDate: selectedEndDate
        }).then((res) => {
            setOpenLoader(false)
            const FilterPolicy = res.data.filter((item) => item.isCommisionRecievable === true && !(Number(item?.commisionRecievable?.PendingAmount) === 0))
            setPolicyList(FilterPolicy);
            const TotalReceivable = FilterPolicy.map((e) => e.commisionRecievable.Total);
            const TotalReceived = FilterPolicy.map((e) => e.commisionRecievable?.ReceivedAmount);
            const PendingReceivable = FilterPolicy.map((e) => e.commisionRecievable?.PendingAmount);
            setTotalReceivableAmount(TotalReceivable)
            setTotalReceivedAmount(TotalReceived)
            setPendingReceivableAmount(PendingReceivable)
            setReceivedButton(true)
        }).catch((err) => {
            console.log("err")
        })
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

    return (
        <>
            <Grid container spacing={2} sx={{ padding: '20px 10px 0 10px' }} >
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Select Company" value={selectedCompany?.value}>
                        <Autocomplete
                            className="AutoComplete_InputBox"
                            options={companyDetails}
                            onChange={(e, v) => {
                                setSelectedCompany(v);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Company code" value={selectedBookingCode?.value}>
                        <Autocomplete
                            className="AutoComplete_InputBox"
                            options={bookingCodeDetails}
                            onChange={(e, v) => {
                                setSelectedBookingCode(v);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Start date & End Date" value="react">
                        <RangePicker placement='bottomLeft' className="textField w-100" style={{ borderRadius: '0px' }}
                            onChange={(e) => {
                                if (e && e[0] && e[1]) {
                                    setSelectedStartDate(e[0].$d)
                                    setSelectedEndDate(e[1].$d)
                                }
                            }}
                            format='DD/MM/YYYY'
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12} sx={{ display: 'flex' }} gap={2}>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "30%" } }}
                        onClick={() => PendingFunction()}
                    >
                        Pending
                    </Button>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "30%" } }}
                        onClick={() => ReceivedFunction()}
                    >
                        Received
                    </Button>
                </Grid>
            </Grid>
            <Grid className="Count_Page" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} mt={2} mb={2} gap={1}>
                <Grid className="Count_1" sx={{ width: '100%' }}>
                    <Typography className="Total">{policyList?.length || 0}</Typography>
                    <Typography className="Title">Policy Count </Typography>
                </Grid>
                <Grid className="Count_2" sx={{ width: '100%' }}>
                    <Typography className="Total">{calculateSum(totalReceivableAmount.map(value => value?.replace(/,/g, ''))) || 0}</Typography>
                    <Typography className="Title">Total Receivable</Typography>

                </Grid>
                <Grid className="Count_3" sx={{ width: '100%' }}>
                    <Typography className="Total">{calculateSum(totalReceivedAmount.map(value => value?.replace(/,/g, ''))) || 0}</Typography>
                    <Typography className="Title">Total Received Amount</Typography>

                </Grid>
                <Grid className="Count_1" sx={{ width: '100%' }}>
                    <Typography className="Total">{calculateSum(pendingReceivableAmount.map(value => value?.replace(/,/g, ''))) || 0}</Typography>
                    <Typography className="Title">Pending Receivable </Typography>

                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1 }} mt={2}>
                <Grid container className="Master_Header_Container" spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Typography className="Master_Header_Heading">Commision Receivable Approval</Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}></Grid>
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
                </Grid>
            </Box>
           

            <div className="d-flex PageContainer">
                <Paper className="container-fluid TableBox">
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
                                                {moment(row?.issueDate).format("D-M-Y")}
                                            </TableCell>
                                            <TableCell align="left">{row?.companyId?.shortName}</TableCell>
                                            <TableCell align="left" onClick={() => OpenPolicyFile(row)} sx={{ color: 'blue', textDecoration: 'underline' }}>
                                                {row?.policyNumber}
                                            </TableCell>
                                            <TableCell align="left">{row?.customerName}</TableCell>
                                            <TableCell align="left">{row?.registrationNumber}</TableCell>
                                            <TableCell align="left">{Number(row?.commisionRecievable?.Total).toFixed(2)}</TableCell>
                                            <TableCell align="left">{Number(row?.commisionRecievable?.ReceivedAmount).toFixed(2)}</TableCell>
                                            <TableCell align="left">{Number(row?.commisionRecievable?.PendingAmount).toFixed(2)}</TableCell>
                                            <TableCell align="left">
                                                {
                                                    receivedButton ? <Button className="TabelButton w-100" onClick={() => ReceivedDrawerFunction(row)}>Received</Button> : <RemoveRedEyeIcon />
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button className="TabelButton w-100" onClick={() => ViewTransFunction(row)}>View Trans</Button>
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
                    sx: { width: { xs: "100%", sm: showViewTrans ? '100%' : '25%' } },
                }}
            >
                {
                    openDrawer ? <ReceivedDrawer setOpenDrawer={setOpenDrawer} selectedData={selectedData} formType={selectedData?._id ? 'edit' : 'add'} showViewTrans={showViewTrans} GetData={GetData} PendingFunction={PendingFunction} /> : null
                }
            </Drawer>
            <Loader open={openLoader} />

        </>
    );
};
export default ReceivableStatus;
