import React, { useState, useEffect } from "react";
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
import ConfirmBox from "../../UiComponents/ConfirmBox/ConfirmBox";
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import CreateCompanyLogin from "./CreateCompanyLogin";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CSVLink } from "react-csv";
import CreateCompanyContact from "./CreateCompanyContact";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import AddCompany from "../Master/CreateCompany/AddCompany";
import AddBookingCode from "../Master/CreateBookingCode/AddBookingCode";
import {
  SearchIcon,
  DeleteIcon,
  EditIcon,
  DownloadIcon,
  NotInterestedIcon,
  DoneOutlineIcon,
  VisibilityIcon,
  LaunchIcon,
} from "../../Resources/Icons/icons";
import Dialog from "@mui/material/Dialog";
import { Transition } from "../../UiComponents/Transition/Transition";
import { checkUserType } from '../../Shared/CommonConstant'

import {
  GetCompanyContact,
  GetCompany,
  GetBookingCode,
  GetSubBookingCode,
  GetCompanyLogin,
  UpdateCompanyLogin,
  GetUser,
  FilterCompanyLogin,
  FilterCompanyContact,
} from "../../Service/_index";

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


const CompanyLoginHeadcells = [
  {
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  // Changes by Arun
  {
    id: "bookingCode",
    placeMent: true,
    disablePadding: false,
    label: "Booking Code - Sub Booking Code",
  },
  {
    id: "userIdNumber",
    placeMent: true,
    disablePadding: false,
    label: "Login Id",
  },
  {
    id: "password",
    placeMent: true,
    disablePadding: false,
    label: "Password",
  },
  {
    id: "name",
    placeMent: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "url",
    placeMent: false,
    disablePadding: false,
    label: "Url",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
  }

];

const CompanyContactcells = [
  {
    id: "companyName",
    placeMent: true,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "bookingCode",
    placeMent: true,
    disablePadding: false,
    label: "Booking Code - Sub Booking Code",
  },
  {
    id: "name",
    placeMent: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",
    placeMent: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "mobileNumber",
    placeMent: true,
    disablePadding: false,
    label: "Mobile",
  },
  {
    id: "branch",
    placeMent: true,
    disablePadding: false,
    label: "Branch",
  },
  {
    id: "Desigination",
    placeMent: true,
    disablePadding: false,
    label: "Designation",
  },
];

function CompanyLoginEnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, isAllow } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const Headcells = isAllow?.isUser || isAllow?.isBranchManager ? CompanyLoginHeadcells.filter((e) => e.label !== 'Action') : CompanyLoginHeadcells
  return (
    <TableHead>
      <TableRow>
        {Headcells?.map((headCell) => (
          <TableCell
            className="TableHeader"
            key={headCell.id}
            align={headCell.placeMent ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: "16px", fontWeight: 400 }}
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

CompanyLoginEnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function CompanyContactEnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {CompanyContactcells?.map((headCell) => (
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

CompanyContactEnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};
const CompanyLogin = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowsPerPageInActiveCLdata, setRowsPerPageInActiveCLdata] =
    React.useState(10);
  const [pageInActiveCompanyLogin, setPageInactiveCompanyLogin] = useState(0);
  const [rowsPerPageCompanyContact, setRowsPerPageCompanyContact] =
    useState(10);
  const [pageCompanyContact, setPageCompanyContact] = useState(0);
  const [selectedData, setSelectedData] = React.useState({});
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false);
  const [openActiveConfirmBox, setOpenActiveConfirmBox] = useState(false);
  const [companyLogin, setCompanyLogin] = React.useState([]);
  const [inActiveCompanyLogin, setInActiveCompanyLogin] = React.useState([]);
  const [companyContact, setCompanyContact] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [activeBoolean, setActiveBoolean] = useState();
  const [showCompanyLoginTable, setShowCompanyLoginTable] = useState(true);
  const [showCompanyContactTable, setShowCompanyContactTable] = useState(false);
  const [showdisabledTable, setShowDisabledTable] = useState(false);
  const [selectedComapny, setSelectedCompany] = useState("");
  const [selectedUser, setSelecteduser] = useState("");
  const [selectedBookingCode, setSelectedBookingCode] = useState("");
  const [selectedSubBookingCode, setSelectedSubBookingCode] = useState("");
  const [openCompanyDrawer, setOpenCompanyDrawer] = React.useState(false);
  const [createCompanyLoginDrawer, setCreateCompanyLoginDrawer] =
    useState(false);
  const [createCompanyContactDrawer, setCreateCompanyContactDrawer] =
    useState(false);
  const [isAllow, setIsAllow] = useState({})
  const [filter, setFilter] = useState({
    fn: (items) => {
      return items;
    },
  });



  const visibleRowsActiveCompanyLogin = React.useMemo(
    () =>
      stableSort(filter.fn(companyLogin), getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filter, companyLogin]
  );

  const visibleRowsInActiveCompanyLogin = React.useMemo(
    () =>
      stableSort(
        filter.fn(inActiveCompanyLogin),
        getComparator(order, orderBy)
      )?.slice(
        pageInActiveCompanyLogin * rowsPerPageInActiveCLdata,
        pageInActiveCompanyLogin * rowsPerPageInActiveCLdata +
        rowsPerPageInActiveCLdata
      ),
    [
      order,
      orderBy,
      pageInActiveCompanyLogin,
      rowsPerPageInActiveCLdata,
      filter,
      inActiveCompanyLogin,
    ]
  );
  const visibleRowsCompanyContact = React.useMemo(
    () =>
      stableSort(
        filter.fn(companyContact),
        getComparator(order, orderBy)
      )?.slice(
        pageCompanyContact * rowsPerPageCompanyContact,
        pageCompanyContact * rowsPerPageCompanyContact +
        rowsPerPageCompanyContact
      ),
    [
      order,
      orderBy,
      pageCompanyContact,
      rowsPerPageCompanyContact,
      filter,
      companyContact,
    ]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangePageCompanyContact = (event, newPage) => {
    setPageCompanyContact(newPage);
  };

  const handleChangePageInActiveCompanyLogin = (event, newPage) => {
    setPageInactiveCompanyLogin(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRowsPerPageInActiveCLdata = (event) => {
    setRowsPerPageInActiveCLdata(parseInt(event.target.value, 10));
    setPageInactiveCompanyLogin(0);
  };

  const handleChangeRowsPerPageCompanyContact = (event) => {
    setRowsPerPageCompanyContact(parseInt(event.target.value, 10));
    setPageCompanyContact(0);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - companyLogin.length) : 0;

  const GetCompanyLoginData = () => {
    GetCompanyLogin().then((res) => {
      setCompanyLogin(res?.data);
    });
  };
  
  // added by gokul...
  // useEffect(() => {
  //   if (isAllow.isClient || isAllow.isOperator) {
  //     FilterCompanyLogin({
  //       userId: selectedUser,
  //       companyId: selectedComapny,
  //       bookingCodeId: selectedBookingCode,
  //       subBookingCodeId: selectedSubBookingCode,
  //     }).then((res) => {
  //       setCompanyLogin(res?.data);
  //     });
  //   }
  // }, [
  //   selectedUser,
  //   selectedComapny,
  //   selectedBookingCode,
  //   selectedSubBookingCode,
  // ]);

  const GetCompanyContactData = () => {
    GetCompanyContact().then((res) => {
      setCompanyContact(res?.data);
    });
  };

  const GetActiveCompanyLoginData = () => {
    GetCompanyLogin().then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };

  const GetInActiveCompanyLoginData = () => {
    GetCompanyLogin().then((res) => {

      setInActiveCompanyLogin(
        res.data.filter((item) => item.isEnabled === false)
      );
    });
  };

  const [linkBookingCode, setLinkBookingCode] = useState([]);
  const GetLinkBookingCodeDetails = () => {
    GetBookingCode({ isAscending: false }).then((res) => {
      const modifiedBookingCode = res.data.map((e) => {
        return {
          ...e,
          label: e.bookingCode,
          value: e._id,
        };
      });
      const extraOption = {
        label: "Add BookingCode",
        value: 0,
      };
      setLinkBookingCode([extraOption, ...modifiedBookingCode]);
    });
  };

  React.useEffect(() => {
    // if (isAllow.isClient || isAllow.isOperator) {
    //   GetActiveCompanyLoginData();
    // }
    GetCompanyContactData();
    GetLinkBookingCodeDetails();
  }, []);

  const CreateCompanyLoginData = () => {
    setSelectedData({});
    setCreateCompanyLoginDrawer(true);
  };

  const CreateCompanyContactData = () => {
    setSelectedData({});
    setCreateCompanyContactDrawer(true);
  };


  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.companyId?.shortName},${el?.branch},${el?.bookingCodeId?.bookingCode},${el?.subBookingCodeId?.subBookingCode},${el?.userIdNumber},${el?.password},${el?.remarks},${el?.Desigination},${el?.url}`
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    setPage(0)

  };

  const GetCompanyDetails = async () => {
    try {
      const res = await GetCompany({isAscending:true});
      const modifiedCompany = res.data.map((e) => {
        if (e.isEnabled) {
          return {
            ...e,
            label: e.shortName,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      // console.log(companyLogin);
      const FilterTableReleted = companyLogin?.map(
        (e) => e?.companyId?.shortName
      );
      const FilteredCompanyDetails = modifiedCompany.filter((e) =>
        FilterTableReleted?.includes(e?.shortName)
      );
      setCompanyDetails(FilteredCompanyDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const GetBookingCodeDetails = async () => {
    try {
      const res = await GetBookingCode({isAscending:true});
      const modifiedBookingCode = res.data.map((e) => {
        return {
          ...e,
          label: e.bookingCode,
          value: e._id,
        };
      });
      const FilterTableReleted = companyLogin?.map(
        (e) => e?.bookingCodeId?.bookingCode
      );
      const FilteredBookingCodeDetails = modifiedBookingCode.filter((e) =>
        FilterTableReleted?.includes(e.bookingCode)
      );
      setBookingCodeDetails(FilteredBookingCodeDetails);
    } catch (error) {
      console.error(error);
    }
  };

  // getSubBooking Code details added by gokul...
  const GetSubBookingCodeDetails = async () => {
    try {
      const res = await GetSubBookingCode({ isAscending: true });

      const modifiedSubBookingCode = res.data.map((e) => {
        return {
          ...e,
          label: e.subBookingCode,
          value: e._id,
        };
      });

      // const FilterTableRelated = companyLogin.map(
      //   (e) => e?.subBookingCodeId?.subBookingCode
      // );
      //changes by gokul...
      const FilterSubBookingCodeDetails = modifiedSubBookingCode
        .filter((e) => e?.bookingCodeId === selectedBookingCode)

      setSubBookingCodeDetails(FilterSubBookingCodeDetails);
    
    } catch (err) {
      console.log(err);
    }
  };


  const GetUserDetails = () => {
    const bodyData = {
      requesttype: "TABLE",
      isAscending: true
    }
    GetUser(bodyData).then((res) => {
      const ModifiedUserDetails = res.data.map((e) => {
        return {
          ...e,
          label: e.name + ' - ' + e.mobileNumber + ' - ' + e.email,
          value: e._id,
        };
      });
      const FilterTableReleted = companyLogin?.map((e) => e.userId.name);
      const filteredUserDetails = ModifiedUserDetails.filter((e) =>
        FilterTableReleted?.includes(e.name)
      );
      setUserDetails(filteredUserDetails);
    });
  }

  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
  //   // if (callCount < 3) {
  //     GetCompanyDetails();
      GetCompanyLoginData()
  //     GetUserDetails();
  //     // setCallCount(callCount + 1);
  //   // }
  }, []);

  React.useEffect(() => {
    GetCompanyDetails();
    GetUserDetails();
    GetBookingCodeDetails();
  }, [companyLogin]);

  useEffect(() => {
    GetSubBookingCodeDetails();
  }, [selectedBookingCode]); //added by gokul...

  const EditCompanyLoginData = (row) => {
    setSelectedData(row);
    setCreateCompanyLoginDrawer(true);
  };

  const ActiveBranchData = (row, active) => {
    setOpenActiveConfirmBox(true);
    setSelectedData(row);
    setActiveBoolean(!active);
  };

  const ActiveFunction = () => {
    UpdateCompanyLogin(selectedData._id, { isEnabled: activeBoolean }).then(
      (res) => {
        activeBoolean ? GetInActiveCompanyLoginData() : GetCompanyLoginData();
      }
    );
    setOpenActiveConfirmBox(false);
  };

  const CompanyLoginIdTableFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: selectedUser,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };
  const CompanyContactTableFunction = () => {
    setShowCompanyContactTable(true);
    setShowCompanyLoginTable(false);
    setShowDisabledTable(false);
  };

  const DisabledTableFunction = () => {
    GetInActiveCompanyLoginData();
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(false);
    setShowDisabledTable(true);
  };

  const LoginUserId = localStorage.getItem('UserId')
  const MyLoginIdFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: LoginUserId,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      requestType: "USER_ID"
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };

  const OtherLoginIdFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: LoginUserId,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      requestType: "OTHER_ID"
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };


  const AllLoginIdFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: selectedUser,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      requestType: "ALL"
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };

  const AdminLoginIdFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: selectedUser,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      requestType: "ADMIN"
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };

  const AllUserLoginIdFunction = () => {
    setShowCompanyContactTable(false);
    setShowCompanyLoginTable(true);
    setShowDisabledTable(false);
    FilterCompanyLogin({
      userId: selectedUser,
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      requestType: "ALL_USER_ID"
    }).then((res) => {
      setCompanyLogin(res?.data?.filter((item) => item.isEnabled === true));
    });
  };

  const headersOfComLogin = [
    // Changes by Arun (For table alignment)
    { label: "Company Name", key: "companyId.shortName" },
    { label: "Branch", key: "branch" },
    { label: "Booking Code", key: "bookingCodeId.bookingCode" },
    { label: "Sub Booking Code", key: "subBookingCodeId.subBookingCode" },
    { label: "Login Id", key: "userIdNumber" },
    { label: "Password", key: "password" },
    { label: "UserName", key: "userId.name" },
    { label: "Remarks", key: "remarks" },
    { label: "Url", key: "url" },
  ];
  const headersOfComContact = [
    { label: "Company Name", key: "companyId.shortName" },
    { label: "Booking Code", key: "bookingCodeId.bookingCode" },
    { label: "Sub Booking Code", key: "subBookingCodeId.subBookingCode" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobileNumber" },
    { label: "Branch", key: "branch" },
    { label: "Desigination", key: "Desigination" },
  ];
  const csvFile = {
    filename:
      showCompanyLoginTable && companyLogin
        ? "Company Login"
        : showCompanyContactTable
          ? "Company Contact"
          : "",
    headers:
      showCompanyLoginTable && companyLogin
        ? headersOfComLogin
        : showCompanyContactTable
          ? headersOfComContact
          : "",
    data:
      showCompanyLoginTable && companyLogin
        ? companyLogin
        : showCompanyContactTable
          ? companyContact
          : "",
  };

  let tableTitle;
  if (showCompanyLoginTable) {
    tableTitle = "Company Login";
  } else if (showCompanyContactTable) {
    tableTitle = "Company Contact";
  } else {
    tableTitle = "Disabled Company Login";
  }


  // filterContact added dy gokul...
  const GetFilterCompanyContactData = () => {
    FilterCompanyContact({
      companyId: selectedComapny,
      bookingCodeId: selectedBookingCode,
      subBookingCodeId: selectedSubBookingCode,
    }).then((res) => {
      setCompanyContact(res?.data);
    })
  }

  useEffect(() => GetFilterCompanyContactData(), [selectedComapny, selectedBookingCode, selectedSubBookingCode]);

  const UserType = localStorage.getItem('userType')
  React.useEffect(() => {
    const isallowObj = checkUserType(UserType)
    setIsAllow(isallowObj)
  }, [UserType])

  return (
    <>
      <Box>
        <Grid container spacing={1} sx={{ padding: "20px 10px 0 10px" }}>
          <Grid item sm={3} xs={12}  sx={{display:isAllow.isUser ? 'none' : 'block'}}>
            <FloatLabel label="Select User" value={selectedUser} >
              <Autocomplete
                className="AutoComplete_InputBox"
                id="combo-box-demo"
                options={userDetails}
                onChange={(e, v) => setSelecteduser(v?._id)}
                renderInput={(params) => <TextField {...params} />}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.name + ' - ' + option.mobileNumber + ' - ' + option.email}
                  </li>
                )}
              />
            </FloatLabel>
          </Grid>
          <Grid item sm={3} xs={12} >
            <FloatLabel label="Select Company" value={selectedComapny}>
              <Autocomplete
                className="AutoComplete_InputBox"
                id="combo-box-demo"
                options={companyDetails}
                onChange={(e, v) => setSelectedCompany(v?._id) }
                renderInput={(params) => <TextField {...params} />}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.shortName}
                  </li>
                )}
              />
            </FloatLabel>
          </Grid>
          <Grid item sm={3} xs={12} >
            <FloatLabel label="Select BookingCode" value={selectedBookingCode} >
              <Autocomplete
                className="AutoComplete_InputBox"
                options={bookingCodeDetails}
                getOptionLabel={(option) => option.label}
                onChange={(e, v) => { setSelectedBookingCode(v?._id) }}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </FloatLabel>
          </Grid>
          {/* SubBooking code added by gokul */}
          <Grid item sm={3} xs={12} >
            <FloatLabel label="Select SubBooking Code" value={selectedSubBookingCode}>
              <Autocomplete
                className="AutoComplete_InputBox"
                options={subBookingCodeDetails}
                getOptionLabel={(option) => option.label}
                onChange={(e, v) => { setSelectedSubBookingCode(v?._id) }}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </FloatLabel>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ padding: "20px 10px 0 10px" , display:'flex' , justifyContent:'end' }}>
          <Grid item sm={1} xs={12} sx={{ display: isAllow?.isUser ? 'block' : 'none' }}>
            <Button className="Common_Button w-100" onClick={MyLoginIdFunction}> My Login Ids</Button>
          </Grid>
          <Grid item sm={2} xs={12} sx={{ display: isAllow?.isUser ? 'block' : 'none' }}>
            <Button className="Common_Button w-100" onClick={OtherLoginIdFunction}>Other Login Ids</Button>
          </Grid>
          <Grid item sm={2} xs={12} sx={{ display: isAllow?.isBranchManager ? 'block' : 'none' }}>
            <Button className="Common_Button w-100" onClick={AllLoginIdFunction}>All Login Ids</Button>
          </Grid>
          <Grid item sm={2} xs={12} sx={{ display: isAllow?.isBranchManager ? 'block' : 'none' }}>
            <Button className="Common_Button w-100" onClick={AdminLoginIdFunction}>Admin Login Ids</Button>
          </Grid>
          <Grid item sm={2} xs={12} sx={{ display: isAllow?.isBranchManager ? 'block' : 'none' }}>
            <Button className="Common_Button w-100" onClick={AllUserLoginIdFunction}>User Login Ids</Button>
          </Grid>
          <Grid item sm={1} xs={12} sx={{ display: isAllow?.isUser || isAllow.isBranchManager ? 'none' : 'block' }}>
            <Button className="Common_Button w-100" onClick={CompanyLoginIdTableFunction}>Login Id</Button>
          </Grid>
          <Grid item sm={2} xs={12}>
            <Button className="Common_Button w-100" onClick={CompanyContactTableFunction}>Company Contact</Button>
          </Grid>
          <Grid item sm={1} xs={12} sx={{ display: isAllow?.isUser || isAllow.isBranchManager ? 'none' : 'block' }}>
            <Button className="Common_Button w-100" onClick={DisabledTableFunction}>Disable</Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} mt={2}>
        <Grid container className="Master_Header_Container" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography className="Master_Header_Heading">{tableTitle}</Typography>
          </Grid>
          <Grid item xs={12} sm={2} />
          <Grid item xs={12} sm={3.5} sx={{ display: isAllow?.isUser || isAllow.isBranchManager ? 'block' : 'none' }} />
          <Grid item xs={12} sm={1.5} sx={{ display: isAllow?.isUser ? 'block' : 'none' }} />
          <Grid item xs={12} sm={2}>
            <Input
              focused="false"
              className="w-100 Master_Header_Input"
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
          <Grid item xs={12} sm={1.5} sx={{display:isAllow.isUser ? 'none' : 'block'}}>
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<DownloadIcon />}
              sx={{ width: { xs: "100%", sm: "fit-content" } }}
            >
              <CSVLink className="Download_Excel_Button" {...csvFile}>
                Download Excel
              </CSVLink>
            </Button>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              className="Common_Button w-100"
              onClick={() => CreateCompanyLoginData()}
              sx={{ display: isAllow?.isUser || isAllow.isBranchManager ? 'none' : 'block' }}
            >
              Create
            </Button>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <Button
              className="Common_Button w-100"
              sx={{ display: isAllow?.isUser || isAllow.isBranchManager ? 'none' : 'block' }}
              onClick={() => CreateCompanyContactData()}
            >
              Create Company Contact
            </Button>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: "flex", gap: 1 }}></Grid>
        </Grid>
      </Box>
      <div className="d-flex PageContainer">
        <Paper className="container-fluid TableBox">
          {/* company Login Table */}
          {showCompanyLoginTable ? (
            <>
              <TableContainer className="TableContainer">
                <Table
                  aria-labelledby="tableTitle"
                  size="small"
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 750 }}
                >
                  <CompanyLoginEnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    isAllow={isAllow}
                  />
                  <TableBody>
                    {visibleRowsActiveCompanyLogin?.map((row, index) => {
                      return (
                        <>
                          {row.isEnabled ? (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={index}
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell align="left">
                                {row?.companyId?.shortName}
                              </TableCell>
                              <TableCell align="left">{row?.branch}</TableCell>
                              <TableCell align="left">
                                {row?.bookingCodeId?.bookingCode} -  {row?.subBookingCodeId?.subBookingCode}
                              </TableCell>
                              <TableCell align="left">
                                {row?.userIdNumber ? "'" : null}{row?.userIdNumber}
                              </TableCell>
                              <TableCell align="left">{row.password}</TableCell>
                              <TableCell align="left">
                                {row?.userId?.name}
                              </TableCell>
                              <TableCell align="left">
                                <Box className="ActionIcons">
                                  <Tooltip title="View url">
                                    <VisibilityIcon
                                      sx={{ fontSize: "28px" }}
                                      onClick={() => alert(row.url)}
                                    />
                                  </Tooltip>
                                  <Tooltip title="Visit url">
                                    <LaunchIcon
                                      sx={{
                                        fontSize: "22px",
                                      }}
                                      onClick={() => window.open(row.url)}
                                    />
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell align="center" sx={{ display: isAllow.isUser || isAllow.isBranchManager ? 'none' : 'block' }}>
                                <Box className="ActionIcons">
                                  <Tooltip title="edit">
                                    <EditIcon
                                      onClick={() => EditCompanyLoginData(row)}
                                      sx={{ fontSize: "28px" }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="Active" >
                                    {row.isEnabled ? (
                                      <Switch
                                        onClick={() =>
                                          ActiveBranchData(row, row.isEnabled)
                                        }
                                        checked={true}
                                      />
                                    ) : (
                                      <Switch
                                        onClick={() =>
                                          ActiveBranchData(row, row.isEnabled)
                                        }
                                        checked={false}
                                      />
                                    )}
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </>
                      );
                    })}
                    {visibleRowsActiveCompanyLogin?.length < 1 ? (
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
                count={filter.fn(companyLogin)?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : null}

          {/* companyContact Table */}
          {showCompanyContactTable ? (
            <>
              <TableContainer className="TableContainer">
                <Table
                  aria-labelledby="tableTitle"
                  size="medium"
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 750 }}
                >
                  <CompanyContactEnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {visibleRowsCompanyContact?.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell align="left">{row?.companyId?.shortName}</TableCell>
                          <TableCell align="left">
                            {row?.bookingCodeId?.bookingCode} -{" "}
                            {row?.subBookingCodeId?.subBookingCode}
                          </TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell align="left">{row?.email}</TableCell>
                          <TableCell align="left">{row?.mobileNumber ? "'" : null}{row?.mobileNumber}</TableCell>
                          <TableCell align="left">{row?.branch}</TableCell>
                          <TableCell align="left">{row?.Desigination}</TableCell>
                        </TableRow>
                      );
                    })}
                    {visibleRowsCompanyContact?.length < 1 ? (
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filter.fn(companyContact)?.length || 0}
                rowsPerPage={rowsPerPageCompanyContact}
                page={pageCompanyContact}
                onPageChange={handleChangePageCompanyContact}
                onRowsPerPageChange={handleChangeRowsPerPageCompanyContact}
              />
            </>
          ) : null}

          {showdisabledTable ? (
            <>
              <TableContainer className="TableContainer">
                <Table
                  aria-labelledby="tableTitle"
                  size="small"
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 750 }}
                >
                  <CompanyLoginEnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {visibleRowsInActiveCompanyLogin?.map((row, index) => {
                      return (
                        <>
                          {row.isEnabled ? null : (
                            <>
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell align="left">{row?.companyId?.shortName}</TableCell>
                                <TableCell align="left">{row?.userId?.name}</TableCell>
                                <TableCell align="left">{row?.branch}</TableCell>
                                <TableCell align="left">{row?.bookingCodeId?.bookingCode}</TableCell>
                                <TableCell align="left">{row?.userIdNumber}</TableCell>
                                <TableCell align="left">{row?.userIdNumber}</TableCell>
                                <TableCell align="left">{row?.userId?.userType}</TableCell>
                                <TableCell align="left">{row?.password}</TableCell>
                                <TableCell align="center">
                                  <Box className="ActionIcons">
                                    <Tooltip title="View url">
                                      <VisibilityIcon
                                        sx={{ fontSize: "28px" }}
                                        onClick={() => alert(row.url)}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Visit url">
                                      <LaunchIcon
                                        sx={{
                                          fontSize: "22px",
                                        }}
                                        onClick={() => window.open(row.url)}
                                      />
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Box className="ActionIcons">
                                    <Tooltip title="Active">
                                      {row.isEnabled ? (
                                        <Switch
                                          onClick={() =>
                                            ActiveBranchData(row, row.isEnabled)
                                          }
                                          checked={true}
                                        />
                                      ) : (
                                        <Switch
                                          onClick={() =>
                                            ActiveBranchData(row, row.isEnabled)
                                          }
                                          checked={false}
                                        />
                                      )}
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </>
                      );
                    })}
                    {visibleRowsInActiveCompanyLogin?.length < 1 ? (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          sx={{ textAlign: "center", border: "none" }}
                        >
                          <CloudOffIcon sx={{ fontSize: "100px", color: "#c5c3c3" }} />
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filter.fn(inActiveCompanyLogin)?.length || 0}
                rowsPerPage={rowsPerPageInActiveCLdata}
                page={pageInActiveCompanyLogin}
                onPageChange={handleChangePageInActiveCompanyLogin}
                onRowsPerPageChange={handleChangeRowsPerPageInActiveCLdata}
              />
            </>
          ) : null}
        </Paper>
      </div>

      <Dialog
        open={createCompanyLoginDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ style: { maxWidth: "50%" } }}
      >
        {createCompanyLoginDrawer ? (
          <CreateCompanyLogin
            setCreateCompanyLoginDrawer={setCreateCompanyLoginDrawer}
            GetActiveCompanyLoginData={CompanyLoginIdTableFunction}
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            title={selectedData._id ? "Update" : "Create & Exit"}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={createCompanyContactDrawer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ style: { maxWidth: "50%" } }}
      >
        {createCompanyContactDrawer ? (
          <CreateCompanyContact
            setCreateCompanyContactDrawer={setCreateCompanyContactDrawer}
            GetCompanyContactData={GetCompanyContactData}
            selectedData={selectedData}
            formType={selectedData._id ? "edit" : "add"}
            title={selectedData._id ? "Update" : "Create & Exit"}
          />
        ) : null}
      </Dialog>

      <ConfirmBox
        open={openActiveConfirmBox}
        title={selectedData.isEnabled ? "Disable" : "Active"}
        content={`Are you sure want to ${selectedData.isEnabled ? "Disable" : "Active"}`}
        confirmButton={selectedData.isEnabled ? "Disable" : "Active"}
        setOpenConfirmBox={setOpenActiveConfirmBox}
        Function={ActiveFunction}
        icon={selectedData.isEnabled ? <NotInterestedIcon /> : <DoneOutlineIcon />}
        color={selectedData.isEnabled ? "error" : "success"}
      />
      {openCompanyDrawer ? (
        <Drawer
          open={openCompanyDrawer}
          sx={{ zIndex: 1000 }}
          anchor="right"
          PaperProps={{ sx: { width: { xs: "100%", sm: "25%" } } }}
        >
          <AddCompany
            title={"Create & Exit"}
            formType={"add"}
            setOpenCompanyDrawer={setOpenCompanyDrawer}
            GetActiveData={GetCompanyDetails}
          />
        </Drawer>
      ) : null}
    </>
  );
};
export default CompanyLogin;
