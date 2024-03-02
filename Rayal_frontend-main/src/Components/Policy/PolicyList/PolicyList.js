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
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import EditPolicyList from "./EditPolicyList";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import moment from "moment";
import {
  RemoveRedEyeIcon,
  SearchIcon,
  CloudOffIcon,
  DownloadIcon,
  EditIcon,
  DeleteIcon,
} from "../../../Resources/Icons/icons";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FileUploader } from "react-drag-drop-files";
import {
  AWS_DIRECTORY_NAME,
  PolicyFilterTypes,
  FilterOption,
  checkUserType
} from "../../../Shared/CommonConstant";
import Loader from "../../../UiComponents/Loader/Loader";
import {
  GetPolicyFileById,
  GetCompany,
  GetPolicyList,
  GetProduct,
  FilterPolicyList,
  UpdatePolicyList,
  GetPolicyFindbyId,
  DeletePolicyList
} from "../../../Service/_index";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DatePicker } from "antd";
import ConfirmBox from "../../../UiComponents/ConfirmBox/ConfirmBox";

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
    id: "registrationNumber",
    placeMent: true,
    disablePadding: false,
    label: "Reg Number",
  },
  {
    id: "product",
    placeMent: true,
    disablePadding: false,
    label: "Product",
  },
  {
    id: "odPremium",
    placeMent: true,
    disablePadding: false,
    label: "OD Pre",
  },
  {
    id: "netPremium",
    placeMent: true,
    disablePadding: false,
    label: "Net Pre",
  },
  {
    id: "totalPremium",
    placeMent: true,
    disablePadding: false,
    label: "Total Pre",
  },
  {
    id: "email",
    placeMent: true,
    disablePadding: false,
    label: "User Email",
  },
  {
    id: "policyStatus",
    placeMent: true,
    disablePadding: false,
    label: "Policy Status",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
  },
];

const RejectedCells = [
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
    id: "email",
    placeMent: true,
    disablePadding: false,
    label: "User Email",
  },
  {
    id: "policyStatus",
    placeMent: true,
    disablePadding: false,
    label: "Policy Status",
  },
  {
    id: "rejectedReason",
    placeMent: true,
    disablePadding: false,
    label: "Rejected Reason",
  },
  {
    id: "action",
    placeMent: false,
    disablePadding: false,
    label: "Action",
  },
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, rejectedPolicy } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const celltoMap = rejectedPolicy ? RejectedCells : headCells;

  return (
    <TableHead>
      <TableRow>
        {celltoMap?.map((headCell) => (
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

const PolicyList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedData, setSelectedData] = React.useState({});
  const [policyList, setPolicyList] = React.useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [openEditPolictDrawer, setOpenEditPolicyDrawer] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedComapny, setSelectedCompany] = useState(null);
  const [selectedproduct, setSelectedProduct] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [openUploadFileBox, setOpenUploadFileBox] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({});
  const [policyCount, setPolicyCount] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [editType, setEditType] = useState();
  const [isEditRejectPopup, setIsEditRejectPopup] = useState(false);
  const [rejectedPolicyNumber, setRejectdPolicyNumber] = useState(null);
  const [showRejectedPolicyTable, setShowRejectedPolicyTable] = useState(false);
  const [formType, setFormType] = useState();
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = React.useState(false);
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

  const getLabelForValue = (value) => {
    const option = PolicyFilterTypes.find((option) => option.value === value);
    return option ? option.label : null;
  };

  const GetData = () => {
    setOpenLoader(true);
    GetPolicyList().then((res) => {
      setOpenLoader(false);
      const FilteredData = res.data.filter((item) => item.status === PolicyFilterTypes[2].value)
      const totalPremiumValues = FilteredData.map((e) => e.totalPremium);
      setPolicyList(FilteredData);
      setPolicyCount(totalPremiumValues);
    });
  };

  const EditPolicyListData = (row, value) => {
    setOpenLoader(true);
    GetPolicyFindbyId(row._id).then((res) => {
      setOpenLoader(false);
      setOpenEditPolicyDrawer(true);
      setSelectedData(res?.data);
      setEditType(value);
      setFormType("edit");
    });
  };

  const EditRejectedPolicyData = (row) => {
    setIsEditRejectPopup(true);
    setSelectedData(row);
  };

  const EditRejectedPolicyFunction = () => {
    setOpenLoader(true);
    const data = {};
    data.policyNumber = rejectedPolicyNumber;
    data.status = PolicyFilterTypes[1].value;
    data.rejectedReason = "";
    UpdatePolicyList(selectedData?._id, data)
      .then(() => {
        setOpenLoader(false);
        setIsEditRejectPopup(false);
        UniversalSearch();
        ToastSuccess("Retrived Succesfully");
      }).catch((err) => {
        setOpenLoader(false);
        ToastError("NetWork Error");
      });
  };

  const OpenPolicyFile = (row) => {
    setOpenLoader(true);
    GetPolicyFileById(row?._id)
      .then((res) => {
        const pdfUrl = res?.data?.policyFile?.downloadURL;
        return pdfUrl;
      })
      .then((pdfUrl) => {
        setOpenLoader(false);
        const pdfWindow = window.open("", "_blank");
        pdfWindow?.document?.write(`<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`);
      });
  };

  const ViewPolicyFunction = (row) => {
    setOpenLoader(true);
    GetPolicyFindbyId(row._id).then((res) => {
      setOpenLoader(false);
      setOpenEditPolicyDrawer(true);
      setSelectedData(res?.data);
      setFormType("view");
    });
  };

  const onSearch = (e) => {
    let target = e.target;
    setFilter({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((el) =>
            `${el?.companyId?.companyName},${el?.policyNumber},${el?.customerName},${el?.registrationNumber},${el?.productId?.product},${el?.odPremium},${el?.netPremium},${el?.totalPremium},${el?.userId?.email},${el?.status},${moment(el.issueDate).format("D-M-Y")}`
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

  const GetProductDetails = () => {
    GetProduct({ isAscending: true }).then((res) => {
      const modifiedproduct = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.product,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setProductDetails(modifiedproduct);
    });
  };

  const calculateSum = (arr) => {
    return arr?.reduce((total, current) => {
      return Number(total) + Number(current);
    }, 0);
  };


  const UniversalSearch = () => {
    FilterPolicyList({
      companyId: selectedComapny?._id,
      productId: selectedproduct?._id,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      status: selectedStatus,
    })
      .then((res) => {
        setPolicyList(res?.data);
        setShowRejectedPolicyTable(
          selectedStatus === PolicyFilterTypes[6].value ? true : false
        );
        const totalPremiumValues = res?.data?.map((e) => e.totalPremium);
        setPolicyCount(totalPremiumValues);
      })
      .catch((err) => {
        console.log("err");
      });
  };


  React.useEffect(() => {
    GetCompanyDetails();
    GetProductDetails();
    GetData()
  }, []);

  const UploadFilesFunction = () => {
    let formData = new FormData();
    for (var key in uploadFiles) {
      formData.append(key, uploadFiles[key]);
    }
    formData.append(
      AWS_DIRECTORY_NAME.AWS_POLICY_FILE_DIRECTORY_NAME,
      uploadFiles.policyFile
    );
    formData.append(
      AWS_DIRECTORY_NAME.AWS_OTHER_FILE_DIRECTORY_NAME,
      uploadFiles.otherFile
    );
    UpdatePolicyList(selectedData?._id, formData)
      .then((res) => {
        setOpenUploadFileBox(false);
      })
      .catch((err) => {
        console.log(err);
        ToastError("Something Went error");
        setOpenUploadFileBox(false);
      });
  };

  const UserType = localStorage.getItem('userType')
  const isRemoveFields = [PolicyFilterTypes[1].value, PolicyFilterTypes[2].value, PolicyFilterTypes[3].value, PolicyFilterTypes[4].value, PolicyFilterTypes[5].value]
  const UserFilterOption = PolicyFilterTypes.filter((item) => isRemoveFields.includes(item.value))
  const PolicyFilterOption = UserType === FilterOption[3].value ? UserFilterOption : PolicyFilterTypes
  const [isAllow, setIsAllow] = useState({})

  React.useEffect(() => {
    const isallowObj = checkUserType(UserType)
    setIsAllow(isallowObj)
  }, [])


  const DownloadFileFunction = (row) => {
    setOpenLoader(true)
    GetPolicyFileById(row?._id).then((res) => {
      const pdfUrl = res?.data?.policyFile?.downloadURL
      return pdfUrl
    }).then((pdfUrl) => {
      setOpenLoader(false)
      const base64PDFUrl = pdfUrl
      const byteCharacters = atob(base64PDFUrl);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'downloaded_pdf.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
  };

  const DeletePolicyData = (row) => {
    setOpenDeleteConfirmBox(true);
    setSelectedData(row);
  };
  const DeleteFunction = () => {
    DeletePolicyList(selectedData._id).then(() => {
      UniversalSearch()
    })
    setOpenDeleteConfirmBox(false)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} px={1} className="Master_Header_Container">
          <Grid item xs={12} sm={3}>
            <FloatLabel label="Filter Policy Types" value={selectedStatus}>
              <Autocomplete
                className="AutoComplete_InputBox"
                onChange={(option, value) => setSelectedStatus(value?.value)}
                options={PolicyFilterOption}
                renderInput={(params) => <TextField {...params} />}
              />
            </FloatLabel>
          </Grid>
          <Grid item sm={3} xs={12}>
            <FloatLabel label="Select Company" value={selectedComapny?.value}>
              <Autocomplete
                className="AutoComplete_InputBox"
                options={companyDetails}
                onChange={(e, v) => { setSelectedCompany(v) }}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) => option?._id === value._id}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.shortName}
                  </li>
                )}
              />
            </FloatLabel>
          </Grid>
          <Grid item sm={3} xs={12}>
            <FloatLabel label="Select Product" value={selectedproduct?.value}>
              <Autocomplete
                className="AutoComplete_InputBox"
                options={productDetails}
                onChange={(e, v) => { setSelectedProduct(v) }}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
            </FloatLabel>
          </Grid>
          <Grid item sm={3} xs={12} className="datePicker">
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
          <Grid item xs={12} sm={2}>
            <Typography className="Master_Header_Heading" sx={{ paddingLeft: '4px' }}>Policy List</Typography>
          </Grid>
          <Grid item xs={12} sm={7} />
          <Grid item sm={3} xs={12} sx={{ display: "flex", justifyContent: 'end' }} gap={2}>
            <Button
              className="Master_Header_create_Button"
              sx={{ width: { xs: "100%", sm: "30%" } }}
              endIcon={<SearchIcon />}
              onClick={() => UniversalSearch()}
            >
              Search
            </Button>
          </Grid>

          <Grid item sm={10} xs={12} className="Count_Page" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} mt={2} gap={1}>
            <Grid className="Count_1" sx={{ width: '24%' }}>
              <Typography className="Total">{policyList?.length}</Typography>
              <Typography className="Title">Policy Count </Typography>
            </Grid>
            <Grid className="Count_2" sx={{ width: '24%' }}>
              <Typography className="Total">
                {calculateSum(
                  policyCount.map((value) => value.replace(/,/g, ""))
                )}
              </Typography>
              <Typography className="Title">Total Premium</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={2} mt={4}>
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
              size="medium"
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 750 }}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rejectedPolicy={showRejectedPolicyTable}
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
                        {moment(row.issueDate).format("D-M-Y")}
                      </TableCell>
                      <TableCell align="left">
                        {row?.companyId?.shortName}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "blue" }}>
                        <label
                          onClick={() => OpenPolicyFile(row)}
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >{row?.policyNumber}</label>
                      </TableCell>
                      {showRejectedPolicyTable ? null : (
                        <>
                          <TableCell align="left">
                            {row?.customerName}
                          </TableCell>
                          <TableCell align="left">
                            {(row?.registrationNumber) ? row?.registrationNumber : ''}
                          </TableCell>
                          <TableCell align="left" sx={{ minWidth: "160px" }}>
                            {row?.productId?.product}
                          </TableCell>
                          <TableCell align="left">{row?.odPremium}</TableCell>
                          <TableCell align="left">
                            {row?.netPremium}
                          </TableCell>
                          <TableCell align="left">
                            {row?.totalPremium}
                          </TableCell>
                        </>
                      )}
                      <TableCell align="left">{row?.userId?.email}</TableCell>
                      <TableCell align="left">
                        {row.status === PolicyFilterTypes[1].value ||
                          row.status === PolicyFilterTypes[2].value ? (
                          <Button
                            className="TabelButton w-100"
                            sx={{ fontSize: "10px" }}
                            onClick={() =>
                              EditPolicyListData(row, "EntryPending")
                            }
                          >
                            {getLabelForValue(row.status)}
                          </Button>
                        ) : (
                          <label>{getLabelForValue(row.status)}</label>
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showRejectedPolicyTable ? "block" : "none",
                        }}
                      >
                        {row?.rejectedReason}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: 0 }}>
                        <Box className="ActionIcons">
                          <Tooltip title="upload">
                            <FileUploadIcon
                              onClick={() => {
                                setSelectedData(row);
                                setOpenUploadFileBox(true);
                              }}
                            />
                          </Tooltip>
                          {row.status === PolicyFilterTypes[6].value ? (
                            <Tooltip title="edit">
                              <EditIcon
                                onClick={() =>
                                  EditRejectedPolicyData(row, "CommonEdit")
                                }
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="edit">
                              <EditIcon
                                onClick={() =>
                                  EditPolicyListData(row, "CommonEdit")
                                }
                                sx={{ display: isAllow.isOperator && PolicyFilterTypes[4].value ? 'none' : 'block' }}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="download">
                            <DownloadIcon
                              onClick={() => DownloadFileFunction(row)}
                            />
                          </Tooltip>
                          {row?.status === PolicyFilterTypes[4].value ? (
                            <Tooltip title="view">
                              <RemoveRedEyeIcon
                                onClick={() => ViewPolicyFunction(row)}
                              />
                            </Tooltip>
                          ) : null}
                          {/* {
                            isAllow.isClient ? (
                              <Tooltip title="download">
                                <DeleteIcon onClick={() => DeletePolicyData(row)} />
                              </Tooltip>
                            ) : null
                          } */}

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
      </div>

      <Drawer
        open={openEditPolictDrawer}
        sx={{ zIndex: 100 }}
        anchor="right"
        PaperProps={{ sx: { width: { xs: "100%", sm: "100%" } } }}
      >
        {openEditPolictDrawer ? (
          <EditPolicyList
            editType={editType}
            GetData={UniversalSearch}
            setOpenEditPolicyDrawer={setOpenEditPolicyDrawer}
            openEditPolictDrawer={openEditPolictDrawer}
            selectedData={selectedData}
            formType={formType}
          />
        ) : null}
      </Drawer>
      <div>
        <Dialog
          open={openUploadFileBox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Upload Policy Documents"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid container rowGap={2}>
                <Grid item className="File-Upload" xs={12} sm={12}>
                  <span>Policy File :</span>
                  <FileUploader
                    name="OtherFile"
                    label="Upload Your Policy File"
                    dropMessageStyle={{
                      color: "red",
                      border: "none",
                      borderRadius: "0px",
                    }}
                    handleChange={(e) =>
                      setUploadFiles({ ...uploadFiles, policyFile: e })
                    }
                  />
                </Grid>
                <Grid item className="File-Upload" xs={12} sm={12}>
                  <span>Other Document File :</span>
                  <FileUploader
                    name="OtherFile"
                    label="Upload Your Other Document"
                    dropMessageStyle={{
                      color: "red",
                      border: "none",
                      borderRadius: "0px",
                    }}
                    handleChange={(e) =>
                      setUploadFiles({ ...uploadFiles, otherFile: e })
                    }
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUploadFileBox(false)}>Close</Button>
            <Button autoFocus onClick={() => UploadFilesFunction()}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
        <Loader open={openLoader} />
      </div>

      <React.Fragment>
        <Dialog
          open={isEditRejectPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Rejected Policy Update
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" mt={2}>
              <FloatLabel label="Policy Number" value="s">
                <TextField
                  className="w-100"
                  onChange={(e) => setRejectdPolicyNumber(e.target.value)}
                />
              </FloatLabel>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditRejectPopup(false)}>Close</Button>
            <Button autoFocus onClick={() => EditRejectedPolicyFunction()}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <ConfirmBox
        open={openDeleteConfirmBox}
        title="Delete"
        content="Are you sure want to Delete"
        confirmButton="Delete"
        setOpenConfirmBox={setOpenDeleteConfirmBox}
        Function={DeleteFunction}
        icon={<DeleteIcon />}
        color="error"
      />
    </>
  );
};
export default PolicyList;
