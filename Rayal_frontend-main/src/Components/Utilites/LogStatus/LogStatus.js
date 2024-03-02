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
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import TextField from '@mui/material/TextField';
import {
    SearchIcon,
    DeleteIcon,
    CloudOffIcon,
} from "../../../Resources/Icons/icons";
import UpdateLoginStatus from "./UpdateLoginStatus";

import {
    GetPolicyList,
    DeleteBranch,
    GetCompany,
} from "../../../Service/_index";
import moment from "moment";
import { DatePicker } from 'antd';
import Autocomplete from "@mui/material/Autocomplete";

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
        id: "policyListName",
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
        id: "registerationNumber",
        placeMent: true,
        disablePadding: false,
        label: "Reg Number",
    },
    {
        id: "paymentMode",
        placeMent: true,
        disablePadding: false,
        label: "Payment Mode",
    },
    {
        id: "email",
        placeMent: true,
        disablePadding: false,
        label: "User Email",
    },
    {
        id: "action",
        placeMent: false,
        disablePadding: false,
        label: "Approve",
    }
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

const LogStatus = () => {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedData, setSelectedData] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
    const [policyList, setPolicyList] = React.useState([]);
    const [companyDetails, setCompanyDetails] = useState([]);

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
            setPolicyList(res.data);
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
                        `${el.companyId?.shortName},${el.policyNumber},${el.customerName},,${el.registrationNumber},${el.paymentMode},${el.userId?.email} ,${moment(el?.issueDate).format("D-M-Y")}`
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


    React.useEffect(() => { GetCompanyDetails()}, []);

    const UpdateLoginIdFunction = (row) => {
        setSelectedData(row)
        setOpenDrawer(true)
    }
    return (
        <>
            <Grid container spacing={2} sx={{ padding: '10px 10px 0 10px' }} >
                <Grid item sm={3} xs={12} >
                    <TextField className="textField w-100" placeholder="Policy Number" />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Select Company" >
                        <Autocomplete
                            name="companyId"
                            className="AutoComplete_InputBox"
                            options={companyDetails}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Start date & End Date" value="react">
                        <RangePicker placement='bottomLeft' className="Range_Picker w-100" style={{ borderRadius: '0px' }}
                            // onChange={(e) => {
                            //     if (e && e[0] && e[1]) {
                            //         setSelectedStartDate(e[0].$d)
                            //         setSelectedEndDate(e[1].$d)
                            //     }
                            // }}
                            format='DD/MM/YYYY'
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FloatLabel label="Pending currently disabled">
                    <Autocomplete
                            name="companyId"
                            className="AutoComplete_InputBox"
                            options={companyDetails}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                option?._id === value._id
                            }
                            disabled
                        />
                    </FloatLabel>
                </Grid>
                <Grid item sm={9} xs={12}/>
                <Grid item sm={3} xs={12} sx={{display:'flex' , justifyContent:'end'}}>
                    <Button
                        className="Common_Button"
                        sx={{ width: { xs: "100%", sm: "30%" } }}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1 }} mt={2}>
                <Grid container className="Master_Header_Container" spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Typography className="Master_Header_Heading">Log Status</Typography>
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
                <Paper className="container-fluid TableBox" >
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
                                            key={index}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell component="th" scope="row" padding="normal">
                                                {moment(row?.issueDate).format("D-M-Y")}
                                            </TableCell>
                                            <TableCell align="left">{row?.companyId?.shortName}</TableCell>
                                            <TableCell align="left">{row?.policyNumber}</TableCell>
                                            <TableCell align="left">{row?.customerName}</TableCell>
                                            <TableCell align="left">{row?.registrationNumber}</TableCell>
                                            <TableCell align="left">{row?.paymentMode}</TableCell>
                                            <TableCell align="left">{row?.userId?.email}</TableCell>

                                            <TableCell align="center">
                                                <Button className="TabelButton w-100" onClick={() => UpdateLoginIdFunction(row)}>Update</Button>
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
                    sx: { width: { xs: "100%", sm: "50%" } },
                }}
            >
                {
                    openDrawer ?
                        <UpdateLoginStatus setOpenDrawer={setOpenDrawer} selectedData={selectedData} formType={selectedData?._id ? 'edit' : 'add'} /> : null
                }
            </Drawer>

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
export default LogStatus;
