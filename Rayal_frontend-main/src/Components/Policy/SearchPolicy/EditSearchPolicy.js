import React, { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {
  GetUser,
  GetCompany,
  GetProduct,
  GetPolicyType,
  GetSubProduct,
  GetBookingCode,
  GetSubBookingCode,
  GetFuelType,
  GetUserpayablePercentage,
  GetBranchpayablePercentage,
  GetReceivablePayablePercentage,
  GetPolicyFileById,
  ReadPolicyFileByPolicyId,
  GetVehicleMake,
  LoginPortalData
} from "../../../Service/_index";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import moment from "moment/moment";
import dayjs from "dayjs";
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik, Form, Field } from "formik";
import { UpdatePolicyList } from "../../../Service/_index";
import { ToastError } from "../../../UiComponents/Toaster/Toast";
import { PolicyFilterTypes } from '../../../Shared/CommonConstant'
import { CalculateIcon } from "../../../Resources/Icons/icons";
import Loader from '../../../UiComponents/Loader/Loader'

const PaymentDetails = [
  {
    label: "Cash",
    value: 1,
  },
  {
    label: "Online",
    value: 2,
  },
  {
    label: "Cheque",
    value: 3,
  },
  {
    label: "DD",
    value: 4,
  },
];

const OdPolicyPeriodController = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
];

const validationSchema = Yup.object().shape({
  bookingCodeId: Yup.string().required('Bookingcode Required'),
  policyTypeId: Yup.string().required('Policytype Required'),
  productId: Yup.string().required('Product Required'),
  customerName: Yup.string().required('CustomerName Required'),
  mobileNumber: Yup.string().required('Mobile Number Required'),
  email: Yup.string().required('Email Required'),
  registrationNumber: Yup.string().required('Reg Number Required'),
  make: Yup.string().required('Make  Required'),
  model: Yup.string().required('Model Required'),
  cc: Yup.string().required('CC Required'),
  gvw: Yup.string().required('GVW Required'),
  seatingCapacity: Yup.string().required('Seating Capacity Required'),
  registrationYear: Yup.string().required('Registeration Year Required'),
  fuelType: Yup.string().required('Fuel type Required'),
  odPolicyStartDate: Yup.string().required('OD Policy Startdate Required'),
  odPolicyPeriod: Yup.string().required('OD Policy Period Required'),
  // odDisc: Yup.string().required('OD Disc Required'),
  // odPremium: Yup.string().required('OD Premium Required'),
  // tpPremium: Yup.string().required('TP Premium Required'),
  // netPremium: Yup.string().required('Net Premium Required'),
  // totalPremium: Yup.string().required('Total Premium Required'),
  paCover: Yup.string().required('PA Cover Required')
});

const initialValues = {
  userId: "",
  loginIdFull: '',
  companyId: "",
  productId: "",
  subProductId: "",
  policyTypeId: "",
  bookingCodeId: "",
  subBookingCodeId: "",
  policyNumber: "",
  customerName: "",
  mobileNumber: "",
  email: "",
  registrationNumber: "",
  make: "",
  model: "",
  seatingCapacity: "",
  cc: "",
  gvw: "",
  registrationYear: "",
  odDisc: '',
  odPremium: '',
  tpPremium: '',
  netPremium: '',
  totalPremium: '',
  paCover: "",
  paymentMode: "",
  fuelType: "",
  odPolicyStartDate: new Date(),
  odPolicyPeriod: "",
  odPolicyEndDate: new Date(),
  tpPolicyStartDate: new Date(),
  tpPolicyPeriod: "",
  tpPolicyEndDate: new Date(),
  issueDate: new Date(),
  chequeDate: new Date(),
  bankName: "",
  chequeNumber: "",
  checkedNumber: "", //it is a entry pending checking number
  rejectedReason: "",
  userOdPercentage: '',
  userTpPercentage: '',
  userNetPercentage: '',
  userOdAmount: '',
  userTpAmount: '',
  userNetAmount: '',
  userTotalPayable: '',
  branchOdPercentage: '',
  branchTpPercentage: '',
  branchNetPercentage: '',
  branchOdAmount: '',
  branchTpAmount: '',
  branchNetAmount: '',
  branchTotalPayabl: '',
  receivableOdPercentage: '',
  receivableTpPercentage: '',
  receivableNetPercentage: '',
  receivableOdAmount: '',
  receivableTpAmount: '',
  receivableNetAmount: '',
  receivableTotalPayabl: ''
};


const EditSearchPolicy = (props) => {

  let formRef = useRef();
  const { setOpenEditPolicyDrawer, selectedData, formType, GetData, editType, openEditPolictDrawer , type , input } = props;
  const [userDetails, setUserDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [subProductDetails, setSubProductDetails] = useState([]);
  const [subBookingCodeDetails, setSubBookingCodeDetails] = useState([]);
  const [policyTypeDetails, setPolicyTypeDetails] = useState([]);
  const [bookingCodeDetails, setBookingCodeDetails] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [openLoader, setOpenLoader] = useState(false)
  const [showPaymentMethod, setShowPaymentMethod] = useState(selectedData?.paymentMode === 'cheque' ? 3 : null);
  const [disableOne, setDisableOne] = useState(true)

  const [userValue, setUserValue] = useState(
    formType === "edit" ? selectedData?.userId?.name : null
  );
  const [companyValue, setCompanyValue] = useState(
    formType === "edit" ? selectedData?.companyId?.shortName : null
  );
  const [productValue, setProductValue] = useState(
    formType === "edit" ? selectedData?.productId?.product : null
  );
  const [subProductValue, setSubProductValue] = useState(
    formType === "edit" ? selectedData?.subProductId?.subProduct : null
  );
  const [policyTypeValue, setPolicyTypeValue] = useState(
    formType === "edit" ? selectedData?.policyTypeId?.policyType : null
  );
  const [bookingCodeValue, setBookingCodeValue] = useState(
    formType === "edit" ? selectedData?.bookingCodeId?.bookingCode : null
  );
  const [fuelTypeValue, setFuelTypeValue] = useState(
    formType === "edit" ? selectedData?.fuelType?.fuelType : null
  );
  const [subBookingCodeValue, setSubBookingCodeValue] = useState(
    formType === "edit" ? selectedData?.subBookingCodeId?.subBookingCode : null
  );

  const [odPolicyEndDateValue, setOdPolicyEndDateValue] = React.useState(
    formType === "edit" ? dayjs(selectedData?.odPolicyEndDate) : null
  );
  const [tpPolicyDate, settpPolicyDate] = React.useState(
    formType === "edit" ? dayjs(selectedData?.tpPolicyEndDate) : null
  );
  const [editableData, setEditableData] = useState(selectedData.status === PolicyFilterTypes[2].value ? true : false)
  const [value, setValue] = React.useState(1);
  const [showPolUpTable, setShowPolUpTable] = useState(false)
  const [showRejectField, setShowRejectField] = useState(false)
  const [approveKey, setApproveKey] = useState(null)
  const [openViewCal, setOpenViewCal] = useState(false)
  const [fillIssueDate, setFillIssueDate] = useState(dayjs(selectedData?.issueDate))
  const [selectedCompany, setSelectedCompany] = useState(companyValue);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePerTap = (e, newValue) => {
    setValue(Number(newValue) + 1);
  }

  const GetUserDetails = () => {
    GetUser({ isAscending: true }).then((res) => {
      const modifiedUserDetails = res.data.map((e) => {
        return {
          ...e,
          label: e.name,
          value: e._id,
        };
      });
      setUserDetails(modifiedUserDetails);
    });
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

  const GetPolicyDetails = () => {
    GetPolicyType({ isAscending: true }).then((res) => {
      const modifiedPolicyTypeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.policyType,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setPolicyTypeDetails(modifiedPolicyTypeDetails);
    });
  };

  const GetBookingCodeDetails = () => {
    GetBookingCode({ isAscending: true }).then((res) => {
      const modifiedBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.bookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setBookingCodeDetails(modifiedBookingCodeDetails);
    });
  };


  const GetFuelTypeDetails = () => {
    GetFuelType().then((res) => {
      const modifiedFuelTypeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.fuelType,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setFuelType(modifiedFuelTypeDetails);
    });
  };

  const GetProductDetails = () => {
    GetProduct({ isAscending: true }).then((res) => {
      const modifiedProductDetails = res.data
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
      setProductDetails(modifiedProductDetails);
    });
  };

  const GetSubProductDetails = () => {
    GetSubProduct({ isAscending: true }).then((res) => {
      const modifiedSubProductDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.subProduct,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      const FilterSubProductDetails = modifiedSubProductDetails.filter((item) => item.product === productValue)
      setSubProductDetails(FilterSubProductDetails);
    });
  };

  //vehicleMake added by gokul..

  const [productIdValue, setProductIdValue] = useState(formType === "edit" ? selectedData?.productId?._id : null);
  const [subProductIdValue, setSubProductIdValue] = useState(formType === "edit" ? selectedData?.subProductId?._id : null);
  const [vehicleMakeDetails, setVehicleMakeDetails] = useState([]);
  const [vehicleValue, setVehicleValue] = useState(
    formType === "edit" ? selectedData?.make?.vehicleMake : null
  );


  const GetVehicleMakeDetails = () => {
    GetVehicleMake({ isAscending: true }).then((res) => {
      const modifiedVehicleMakeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.vehicleMake,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      const data = modifiedVehicleMakeDetails.filter((n) => {
        if (n.productID === productIdValue) {
          return n;
        }
      });
      setVehicleMakeDetails(data);
    });
  }

  // loginPortal added by gokul...

  const [selectedUserId, setSelectedUserId] = useState(formType === "edit" ? selectedData?.userId?._id : null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(formType === "edit" ? selectedData?.companyId?._id : null);
  const [selectedLoginPortal, setSelectedLoginPortal] = useState(formType === "edit" ? selectedData?.loginIdFull : null)
  const [loginPortalDetails, setLoginPortalDetails] = useState([]);

  const GetLoginPortalData = () => {
    LoginPortalData({
      userId: selectedUserId,
      companyId: selectedCompanyId,
    }).then((res) => {
      const filterData1 = res?.data.filter((item) => {
        if (item?.userId === selectedUserId) {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }

      });
      const UserAllData = res?.data.filter((item) => {
        if (item?.userId === "All") {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }
      });

      const UserAdminData = res?.data.filter((item) => {
        if (item?.userId === "Admin") {
          if (item?.companyId === selectedCompanyId) {
            return item;
          }
        }
      });
      setLoginPortalDetails([...filterData1, ...UserAllData, ...UserAdminData]);
    });
  }

  useEffect(() => {
    console.log('use effect 3')

    if (selectedUserId) GetLoginPortalData();
    else setLoginPortalDetails([]);
  }, [selectedUserId, selectedCompanyId]);


  useEffect(() => {
    console.log('use effect 5')

    GetVehicleMakeDetails();
  }, [productIdValue]);
  useEffect(() => {
    console.log('use effect 6')

    GetSubProductDetails()
  }, [productValue])

  const GetSubBookingCodeDetails = () => {
    GetSubBookingCode({ isAscending: true }).then((res) => {
      const modifiedSubBookingCodeDetails = res.data
        .map((e) => {
          if (e.isEnabled) {
            return {
              ...e,
              label: e.subBookingCode,
              value: e._id,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      const FilterSubBookingCodeDetails = modifiedSubBookingCodeDetails.filter((item) => item.bookingCode === bookingCodeValue)
      setSubBookingCodeDetails(FilterSubBookingCodeDetails);
    });
  };

  useEffect(() => {
    console.log('use effect 1')
    GetSubBookingCodeDetails()

  }, [bookingCodeValue])

  useEffect(() => {
    console.log('use effect 2')

    GetUserDetails();
    GetCompanyDetails();
    GetProductDetails();
    GetPolicyDetails();
    GetBookingCodeDetails();
    GetFuelTypeDetails();
    if (formType === "edit") {
      console.log("Data:", selectedData);
      formRef.setFieldValue("userId", selectedData?.userId?._id);
      formRef.setFieldValue("loginIdFull", selectedData?.loginIdFull);
      formRef.setFieldValue("companyId", selectedData?.companyId?._id);
      formRef.setFieldValue("productId", selectedData?.productId?._id);
      formRef.setFieldValue("policyTypeId", selectedData?.policyTypeId?._id);
      formRef.setFieldValue("bookingCodeId", selectedData?.bookingCodeId?._id);
      formRef.setFieldValue("subProductId", selectedData?.subProductId?._id);
      formRef.setFieldValue("subBookingCodeId", selectedData?.subBookingCodeId?._id);
      formRef.setFieldValue("policyNumber", selectedData?.policyNumber);
      formRef.setFieldValue("customerName", selectedData?.customerName);
      formRef.setFieldValue("mobileNumber", selectedData?.mobileNumber);
      formRef.setFieldValue("email", selectedData?.email);
      formRef.setFieldValue("make", selectedData?.make?._id);
      formRef.setFieldValue("model", selectedData?.model);
      formRef.setFieldValue("seatingCapacity", selectedData?.seatingCapacity);
      formRef.setFieldValue("cc", selectedData?.cc);
      formRef.setFieldValue("gvw", selectedData?.gvw);
      formRef.setFieldValue("registrationYear", selectedData?.registrationYear);
      formRef.setFieldValue("odDisc", selectedData?.odDisc);
      formRef.setFieldValue("odPremium", selectedData?.odPremium);
      formRef.setFieldValue("tpPremium", selectedData?.tpPremium);
      formRef.setFieldValue("netPremium", selectedData?.netPremium);
      formRef.setFieldValue("fuelType", selectedData?.fuelType?._id);
      formRef.setFieldValue("totalPremium", selectedData?.totalPremium);
      formRef.setFieldValue("paCover", selectedData?.paCover);
      formRef.setFieldValue("paymentMode", selectedData?.paymentMode);
      formRef.setFieldValue("issueDate", selectedData?.issueDate);
      formRef.setFieldValue("chequeNumber", selectedData?.chequeNumber);
      formRef.setFieldValue("bankName", selectedData?.bankName);
      formRef.setFieldValue("chequeDate", selectedData?.chequeDate);
      formRef.setFieldValue("status", selectedData?.status);
      formRef.setFieldValue("odPolicyStartDate", selectedData?.odPolicyStartDate);
      formRef.setFieldValue("odPolicyEndDate", selectedData?.odPolicyEndDate);
      formRef.setFieldValue("odPolicyPeriod", selectedData?.odPolicyPeriod);
      formRef.setFieldValue("tpPolicyStartDate", selectedData?.tpPolicyStartDate);
      formRef.setFieldValue("tpPolicyEndDate", selectedData?.tpPolicyEndDate);
      formRef.setFieldValue("tpPolicyPeriod", selectedData?.tpPolicyPeriod);
      formRef.setFieldValue("registrationNumber", selectedData?.registrationNumber);
    }
  }, []);

  const PaymentFunction = (e) => {
    setShowPaymentMethod(e.value);
    formRef.setFieldValue("paymentMode", e.label);
  };
  const UserName = localStorage.getItem('UserId')
  const onSubmit = (data) => {
    console.log(data)
    if (true) {
      const CurrentDate = new Date()
      data.policyNumber = data?.policyNumber.replace(/[^a-zA-Z0-9]/g, "");
      ['totalPremium', 'registrationNumber', 'cc', 'gvw'].forEach((item) => data[item] = data[item]?.replace(/-/g, ""))
      if (editType === "CommonEdit") {
        data.status = data.status
      }
      else {
        if (data?.paymentMode === "Cheque" && approveKey) {
          data.status = PolicyFilterTypes[5].value;
        } else if (approveKey && !(data?.paymentMode === "Cheque")) {
          data.status = PolicyFilterTypes[2].value;
          data.isCloseDrawer = true
          data.verifyPendingBy = UserName;
          data.verifyPendingAt = CurrentDate;
        } else if (data?.status === PolicyFilterTypes[2].value) {
          if (editableData) {
            if (data.userTotalPayable > 0) {
              data.isUserPayable = true
              data.status = PolicyFilterTypes[4].value;
              data.userPayable = {
                ODPercentage: data?.userOdPercentage,
                TPPercentage: data?.userTpPercentage,
                NETPercentage: data?.userNetPercentage,
                ODAmount: data?.userOdAmount,
                TPAmount: data?.userTpAmount,
                NETAmount: data?.userNetAmount,
                Total: data?.userTotalPayable.replace(/,/g, ""),
                createdBy: UserName,
                createdAt: CurrentDate,
                updatedAt: CurrentDate,
                updatedBy: UserName
              }
            }
            else {
              data.status = PolicyFilterTypes[3].value;
              data.approvePendingBy = UserName
              data.approvePendingAt = CurrentDate
            }
            data.isBranchPayable = data.branchTotalPayabl > 0 ? true : false
            data.branchPayable = {
              ODPercentage: data?.branchOdPercentage,
              TPPercentage: data?.branchTpPercentage,
              NETPercentage: data?.branchNetPercentage,
              ODAmount: data?.branchOdAmount,
              TPAmount: data?.branchTpAmount,
              NETAmount: data?.branchNetAmount,
              Total: data?.branchTotalPayabl.replace(/,/g, ""),
              createdBy: UserName,
              createdAt: CurrentDate,
              updatedAt: CurrentDate,
              updatedBy: UserName
            }
            data.isCommisionRecievable = data.receivableTotalPayabl > 0 ? true : false
            data.commisionRecievable = {
              ODPercentage: data?.receivableOdPercentage,
              TPPercentage: data?.receivableTpPercentage,
              NETPercentage: data?.receivableNetPercentage,
              ODAmount: data?.receivableOdAmount,
              TPAmount: data?.receivableTpAmount,
              NETAmount: data?.receivableNetAmount,
              Total: data?.receivableTotalPayabl.replace(/,/g, ""),
              createdBy: UserName,
              createdAt: CurrentDate,
              updatedAt: CurrentDate,
              updatedBy: UserName
            }
          } else {
            data.status = data.status
          }
        } else {
          data.status = data?.status;
        }
      }
      data.updatedBy = UserName
      data.updatedAt = CurrentDate
      UpdatePolicyList(selectedData?._id, data).then((res) => {
        GetData(({ searchType: type, textField: input }));

        if (editableData) {
          setOpenEditPolicyDrawer(false);
        } else {
          if (res) {
            data.status === PolicyFilterTypes[2].value ? setEditableData(true) : setEditableData(false)
            data.status === (PolicyFilterTypes[2].value) ? setOpenEditPolicyDrawer(true) : setOpenEditPolicyDrawer(false);
            data.isCloseDrawer ? setOpenEditPolicyDrawer(false) : setOpenEditPolicyDrawer(true)
          } else {
            setOpenEditPolicyDrawer(true);

          }


        }
      });
    }
    else {
      ToastError("Enter All Fields")
    }
  };

  const GetPayablePercentFunction = () => {
    setOpenViewCal(!openViewCal)
    GetUserpayablePercentage(selectedData?._id).then((res) => {
      formRef.setFieldValue('userOdPercentage', res.data.OD)
      formRef.setFieldValue('userTpPercentage', res.data.TP)
      formRef.setFieldValue('userNetPercentage', res.data.Net)
    })
    GetBranchpayablePercentage(selectedData?._id).then((res) => {
      formRef.setFieldValue('branchOdPercentage', res.data.OD)
      formRef.setFieldValue('branchTpPercentage', res.data.TP)
      formRef.setFieldValue('branchNetPercentage', res.data.Net)
    })
    GetReceivablePayablePercentage(selectedData?._id).then((res) => {
      formRef.setFieldValue('receivableOdPercentage', res.data.OD)
      formRef.setFieldValue('receivableTpPercentage', res.data.TP)
      formRef.setFieldValue('receivableNetPercentage', res.data.Net)
    })
  }

  const AutoFillFunction = () => {
    setOpenLoader(true)
    ReadPolicyFileByPolicyId(selectedData?._id).then((res) => {
      setOpenLoader(false)
      formRef.setFieldValue('cc', res?.data?.cc)
      formRef.setFieldValue('gvw', res?.data?.gvw)
      formRef.setFieldValue('policyNumber', res?.data?.policyNumber)
      formRef.setFieldValue('registrationNumber', res?.data?.registrationNumber)
      formRef.setFieldValue('registrationYear', res?.data?.registrationYear)
      formRef.setFieldValue('seatingCapacity', res?.data?.seatingCapacity)
      formRef.setFieldValue('totalPremium', String(res?.data?.totalPremium)?.replace(/,/g, ""))

      const ResCompany = (res.data.companyName) ? res.data.companyName : ''
      const foundCompany = companyDetails.find(company => company.companyName === ResCompany.toUpperCase());
      if (res?.data?.issueDate) {
        const dateStr = res.data.issueDate;
        const daysjsDate = dayjs(dateStr, 'DD/MM/YYYY');
        formRef.setFieldValue("issueDate", daysjsDate.$d)
        setFillIssueDate(daysjsDate)
      }
      if (foundCompany) {
        formRef.setFieldValue("companyId", foundCompany?.value)
        setSelectedCompany(foundCompany?.companyName)
      }
      else {
        formRef.setFieldValue("companyId", null)
        setSelectedCompany('')
        ToastError(`" ${ResCompany.toUpperCase()} "  Not added yet, Please add that Company !`)
      }
    })
  }
  const policyNumberChecking = (data) => {
    if (selectedData.policyNumber === data.checkedNumber) {
      setShowPolUpTable(true)
      setShowRejectField(false)
      setApproveKey("key_01")
    }
    else {
      ToastError("Policy Number Missmatching")
      setShowRejectField(true)
      setShowPolUpTable(false)
      setApproveKey(null)
    }
  }
  const RejectedFunction = (data) => {
    data.status = PolicyFilterTypes[6].value
    data.rejectedReason = data?.rejectedReason
    UpdatePolicyList(selectedData?._id, data).then((res) => {
      GetData(({ searchType: type, textField: input }));
      setOpenEditPolicyDrawer(false);
      ToastError('Rejected Succesfully')
    })
  }
  const ViewPdfFunction = () => {
    setOpenLoader(true)
    GetPolicyFileById(selectedData?._id).then((res) => {
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

  const [odPolicyStartDate, setOdPolicyStartDate] = useState(formType === "edit" ? dayjs(selectedData?.odPolicyStartDate) : null)
  const OdPolicyStDateFunction = (e) => {
    setOdPolicyStartDate(e.$d)
    setTpPolicyStartDate(e.$d)
    formRef.setFieldValue('odPolicyStartDate', e.$d)
    formRef.setFieldValue('tpPolicyStartDate', e.$d)
  }

  const OdPolicyPeriodFunction = (event) => {
    formRef.setFieldValue("odPolicyPeriod", event.target.value);
    const odPolicyEndDate = moment(odPolicyStartDate).add(event.target.value, "Y").subtract(1, 'days');
    formRef.setFieldValue('odPolicyEndDate', odPolicyEndDate?._d)
    setOdPolicyEndDateValue(odPolicyEndDate)
  };

  const [tpPolicyStartDate, setTpPolicyStartDate] = useState(formType === "edit" ? dayjs(selectedData?.tpPolicyStartDate) : null)

  const TPPolicyStDateFunction = (e) => {
    setTpPolicyStartDate(e.$d)
    formRef.setFieldValue('tpPolicyStartDate', e.$d)
  }

  const TpPolicyPeriodFunction = (event) => {
    formRef.setFieldValue("tpPolicyPeriod", event.target.value);
    const tpPolicyEndDate = moment(tpPolicyStartDate).add(event.target.value, "Y").subtract(1, 'days');
    formRef.setFieldValue('tpPolicyEndDate', tpPolicyEndDate?._d)
    settpPolicyDate(tpPolicyEndDate)
  };

  const EditableFunction = () => {
    setEditableData(false)
  }

  const CalaculteFunction = (e) => {
    const UserODAmountValue = (e?.odPremium * e.userOdPercentage) / 100
    const UserTPAmountValue = (e?.tpPremium * e.userTpPercentage) / 100
    const UserNETAmountValue = (e?.netPremium * e.userNetPercentage) / 100
    const BranchODAmountValue = (e?.odPremium * e.branchOdPercentage) / 100
    const BranchTPAmountValue = (e?.tpPremium * e.branchTpPercentage) / 100
    const BranchNETAmountValue = (e?.netPremium * e.branchNetPercentage) / 100
    const ReceivableODAmountValue = (e?.odPremium * e.receivableOdPercentage) / 100
    const ReceivableTPAmountValue = (e?.tpPremium * e.receivableTpPercentage) / 100
    const ReceivableNetAmountValue = (e?.netPremium * e.receivableNetPercentage) / 100
    const UserTotalValue = ((UserODAmountValue ? UserODAmountValue : 0) + (UserTPAmountValue ? UserTPAmountValue : 0) + (UserNETAmountValue ? UserNETAmountValue : 0)).toFixed(2)
    const BranchTotalValue = ((BranchODAmountValue ? BranchODAmountValue : 0) + (BranchTPAmountValue ? BranchTPAmountValue : 0) + (BranchNETAmountValue ? BranchNETAmountValue : 0)).toFixed(2)
    const ReceivableTotalValue = ((ReceivableODAmountValue ? ReceivableODAmountValue : 0) + (ReceivableTPAmountValue ? ReceivableTPAmountValue : 0) + (ReceivableNetAmountValue ? ReceivableNetAmountValue : 0)).toFixed(2)
    formRef.setFieldValue('userOdAmount', UserODAmountValue ? UserODAmountValue : 0)
    formRef.setFieldValue('userTpAmount', UserTPAmountValue ? UserTPAmountValue : 0)
    formRef.setFieldValue('userNetAmount', UserNETAmountValue ? UserNETAmountValue : 0)
    formRef.setFieldValue('branchOdAmount', BranchODAmountValue ? BranchODAmountValue : 0)
    formRef.setFieldValue('branchTpAmount', BranchTPAmountValue ? BranchTPAmountValue : 0)
    formRef.setFieldValue('branchNetAmount', BranchNETAmountValue ? BranchNETAmountValue : 0)
    formRef.setFieldValue('receivableOdAmount', ReceivableODAmountValue ? ReceivableODAmountValue : 0)
    formRef.setFieldValue('receivableTpAmount', ReceivableTPAmountValue ? ReceivableTPAmountValue : 0)
    formRef.setFieldValue('receivableNetAmount', ReceivableNetAmountValue ? ReceivableNetAmountValue : 0)
    formRef.setFieldValue('userTotalPayable', UserTotalValue)
    formRef.setFieldValue('branchTotalPayabl', BranchTotalValue)
    formRef.setFieldValue('receivableTotalPayabl', ReceivableTotalValue)
  }

  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>
              {formType === "view" ? "View Policy List" : "Edit Policy List"}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenEditPolicyDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>

        {formType === "view" ? (
          <div className="container-fluid" style={{ padding: "20px" }}>
            <Typography className="EditPageHeadingTittle">
              Policy Files
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex" sx={{ gap: 2 }}>
                <Button
                  className="w-50 TabelButton"
                  variant="contained"
                  endIcon={<PictureAsPdfIcon />}
                  onClick={() => ViewPdfFunction()}
                >
                  View PDF
                </Button>
                <Button
                  className="w-50 TabelButton"
                  variant="contained"
                  endIcon={<DescriptionSharpIcon />}
                >
                  Other Documents
                </Button>
              </Grid>
              <Grid item xs={12} sm={8} />

              <Grid item xs={12} sm={4} className="d-flex" mt={3}>
                <Typography className="CCHeading">User Name</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.userId?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Branch</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.userId?.name}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              Policy Details
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Issue Date</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.issueDate).format("L")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Company Name</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.companyId?.companyName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Product</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.productId?.product}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Sub Product</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.subProductId?.subProduct}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Booking Code</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.bookingCodeId?.bookingCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Sub Booking Code</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.subBookingCodeId?.subBookingCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Policy Type</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.policyTypeId?.policyType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Policy Number</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.policyNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">LoginId</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.loginIdFull}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              Customer Details
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Customer Name</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.customerName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Mobile</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.mobileNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Email</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.email}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              Vehicle Details
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Reg Number</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.registrationNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Make</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.make?.vehicleMake}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Model</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.model}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">CC</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.cc}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Seating Capacity</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.seatingCapacity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">GVW</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.gvw}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              OD Policy Date
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  OD Policy Start Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.odPolicyStartDate).format("L")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">OD Policy Period</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.odPolicyPeriod}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  OD Policy End Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.odPolicyEndDate).format("L")}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              TP Policy Date
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  TP Policy Start Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.tpPolicyStartDate).format("L")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">TP Policy Period</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.tpPolicyPeriod}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">
                  TP Policy End Date
                </Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {moment(selectedData?.tpPolicyEndDate).format("L")}
                </Typography>
              </Grid>
            </Grid>
            <hr />

            <Typography className="EditPageHeadingTittle">Premium</Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">OD Disc</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.odDisc}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">OD Premium</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.odPremium}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">TP Premium</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.tpPremium}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">NET Premium</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.netPremium}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Total Premium</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.totalPremium}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">PA Cover</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.paCover}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography className="EditPageHeadingTittle">
              Payment Details
            </Typography>
            <Grid container rowGap={2} p={2} className="CCEntryForm">
              <Grid item xs={12} sm={4} className="d-flex">
                <Typography className="CCHeading">Payment Mode</Typography>
                <Typography className="CCdivider">:</Typography>
                <Typography className="CCContent">
                  {selectedData?.paymentMode}
                </Typography>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className="container-fluid">
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                onSubmit(values);
              }}
              innerRef={(ref) => {
                if (ref) {
                  if (value === 1) {
                    setDisableOne(
                      ref?.errors?.bookingCodeId?.length ||
                        ref?.errors?.policyTypeId?.length ||
                        ref?.errors?.productId?.length
                        ? true
                        : false
                    );
                  } else if (value === 2) {
                    setDisableOne(
                      ref?.errors?.customerName?.length ||
                      ref?.errors?.mobileNumber?.length ||
                      ref?.errors?.email?.length
                    );
                  } else if (value === 3) {
                    setDisableOne(
                      ref?.errors?.registrationNumber?.length ||
                      ref?.errors?.make?.length ||
                      ref?.errors?.model?.length ||
                      ref?.errors?.cc?.length ||
                      ref?.errors?.gvw?.length ||
                      ref?.errors?.seatingCapacity?.length ||
                      ref?.errors?.registrationYear?.length ||
                      ref?.errors?.fuelType?.length
                    );
                  } else if (value === 4) {
                    setDisableOne(
                      ref?.errors?.odPolicyStartDate?.length ||
                      ref?.errors?.odPolicyPeriod?.length ||
                      ref?.errors?.odPolicyEndDate?.length ||
                      ref?.errors?.tpPolicyEndDate?.length ||
                      ref?.errors?.odPolicyPeriod?.length ||
                      ref?.errors?.tpPolicyPeriod?.length
                    );
                  } else if (value === 5) {
                    setDisableOne(
                      ref?.errors?.odDisc?.length ||
                      ref?.errors?.odPremium?.length ||
                      ref?.errors?.tpPremium?.length ||
                      ref?.errors?.netPremium?.length ||
                      ref?.errors?.totalPremium?.length ||
                      ref?.errors?.paCover?.length
                    );
                  }
                  formRef = ref;
                }
              }}
            // validationSchema={
            //   editType === "CommonEdit" ? null : validationSchema
            // }
            >
              {({ values, setFieldValue }) => (
                <Form>{console.log(values)}
                  <Typography sx={{ ml: 2 }} className="EditPageHeadingTittle">
                    Policy Files
                  </Typography>
                  <Grid container sx={{ p: 2 }} spacing={2}>
                    <Grid item xs={12} sm={2}>
                      <Button
                        className="w-100 TabelButton"
                        variant="contained"
                        endIcon={<PictureAsPdfIcon />}
                        onClick={() => ViewPdfFunction()}
                      >
                        View PDF
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      sx={{ display: approveKey ? "block" : "none" }}
                    >
                      <Button
                        className="w-100 TabelButton"
                        variant="contained"
                        endIcon={<PictureAsPdfIcon />}
                        onClick={() => AutoFillFunction()}
                      >
                        Auto Fill
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      sx={{
                        display:
                          selectedData?.status === PolicyFilterTypes[1].value
                            ? "none"
                            : "block",
                      }}
                    >
                      <Button
                        className="w-100 TabelButton"
                        variant="contained"
                        endIcon={<DescriptionSharpIcon />}
                      >
                        Other Documents
                      </Button>
                    </Grid>
                    {showPolUpTable ||
                      selectedData.status ===
                      PolicyFilterTypes[2].value ? null : (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          sx={{
                            display:
                              !PolicyFilterTypes[1].value ||
                                editType === "CommonEdit"
                                ? "none"
                                : "block",
                          }}
                        >
                          <FloatLabel
                            label="Policy Number"
                            value={values?.checkedNumber}
                          >
                            <Field
                              className="textField w-100"
                              name="checkedNumber"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          sx={{
                            display:
                              !(
                                selectedData?.status ===
                                PolicyFilterTypes[1].value
                              ) || editType === "CommonEdit"
                                ? "none"
                                : "block",
                          }}
                        >
                          <Button
                            className="Common_Button"
                            onClick={() => policyNumberChecking(values)}
                          >
                            Check
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <hr />
                  <Grid
                    container
                    sx={{ p: 2, display: showRejectField ? "flex" : "none" }}
                    spacing={2}
                  >
                    <Grid item xs={12} sm={3}>
                      <FloatLabel label="Reason" value={values?.rejectedReason}>
                        <Autocomplete
                          className="AutoComplete_InputBox"
                          options={[
                            { label: "Policy Number Mismatching", id: 1 },
                            { label: "Other Agent Policy", id: 2 },
                          ]}
                          onChange={(e, v) =>
                            setFieldValue("rejectedReason", v.label)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        ></Autocomplete>
                      </FloatLabel>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        onClick={() => RejectedFunction(values)}
                        variant="outlined"
                        color="error"
                        sx={{
                          width: {
                            xs: "100%",
                            sm: "40%",
                            backgroundColor: "red",
                            height: "43px",
                            borderRadius: "22px",
                            color: "white",
                            "&:hover": {
                              color: "red",
                            },
                          },
                        }}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                  {showPolUpTable ? (
                    <Box sx={{ width: "100%", typography: "body1" }}>
                      <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                          >
                            <Tab label="Policy Details" value={1} />
                            <Tab label="Customer Details" value={2} />
                            <Tab label="Vehicle Details" value={3} />
                            <Tab label="Policy Date" value={4} />
                            <Tab label="Premium" value={5} />
                          </TabList>
                        </Box>
                        <TabPanel value={1}>
                          <Grid container sx={{ p: 1 }} spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="User Name"
                                value={values?.userId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="userId"
                                  options={userDetails}
                                  value={userValue}
                                  onInputChange={(e, v) => setUserValue(v)}
                                  onChange={(e, v) => {
                                    setFieldValue("userId", v?._id);
                                    setSelectedUserId(v?._id);
                                    setUserValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option?.label === value
                                  }
                                  renderOption={(props, option) => (
                                    <li {...props} key={option._id}>
                                      {option.name}
                                    </li>
                                  )}
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Login Id"
                                value={values?.loginIdFull}
                              >
                                <Autocomplete
                                  name="loginIdFull"
                                  disablePortal
                                  className="AutoComplete_InputBox"
                                  id="combo-box-demo"
                                  value={selectedLoginPortal}
                                  options={loginPortalDetails}
                                  onChange={(e, v) => {
                                    setSelectedLoginPortal(v?.loginPortal);
                                    // setFieldValue("loginId.companyId", v?.companyId)
                                    // setFieldValue("loginId.userId", v?.userId)
                                    setFieldValue("loginIdFull", v?.loginPortal);
                                  }}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option._id}>
                                      {option.loginPortal}
                                    </li>
                                  )}
                                  isOptionEqualToValue={(e, v) => e.loginPortal === v}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </FloatLabel>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Policy Number"
                                value={values?.policyNumber}
                              >
                                <Field
                                  name="policyNumber"
                                  className="textField w-100"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4} className="datePicker">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FloatLabel label="Issue Date" value="Reactjs">
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="issueDate"
                                    className="Date_Picker w-100"
                                    value={fillIssueDate}
                                    onChange={(e) =>
                                      setFieldValue("issueDate", e.$d)
                                    }
                                  />
                                </FloatLabel>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Select Company"
                                value={values?.companyId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="companyId"
                                  options={companyDetails}
                                  value={selectedCompany}
                                  onChange={(e, v) => {
                                    setFieldValue("companyId", v?._id);
                                    setSelectedCompanyId(v?._id);
                                    setCompanyValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option?.label === value
                                  }
                                  renderOption={(props, option) => (
                                    <li {...props} key={option._id}>
                                      {option.shortName}
                                    </li>
                                  )}
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Policy Type"
                                value={values?.policyTypeId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="policyTypeId"
                                  options={policyTypeDetails}
                                  value={policyTypeValue}
                                  onInputChange={(e, v) =>
                                    setPolicyTypeValue(v)
                                  }
                                  onChange={(e, v) => {
                                    setFieldValue("policyTypeId", v?._id);
                                    setPolicyTypeValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.policyType === value
                                  }
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Product"
                                value={values?.productId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="productId"
                                  options={productDetails}
                                  value={productValue}
                                  onInputChange={(e, v) => setProductValue(v)}
                                  onChange={(e, v) => {
                                    setFieldValue("productId", v?._id);
                                    setProductIdValue(v?._id);
                                    setProductValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.product === value
                                  }
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Sub Product"
                                value={values?.subProductId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="subProductId"
                                  options={subProductDetails}
                                  value={subProductValue}
                                  onInputChange={(e, v) =>
                                    setSubProductValue(v)
                                  }
                                  onChange={(e, v) => {
                                    setFieldValue("subProductId", v?._id);
                                    setSubProductIdValue(v?._id);
                                    setSubProductValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.subProduct === value
                                  }
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4} />
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Booking Code"
                                value={values?.bookingCodeId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="bookingCodeId"
                                  options={bookingCodeDetails}
                                  value={bookingCodeValue}
                                  onInputChange={(e, v) =>
                                    setBookingCodeValue(v)
                                  }
                                  onChange={(e, v) => {
                                    setFieldValue("bookingCodeId", v?._id);
                                    setBookingCodeValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.bookingCode === value
                                  }
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Sub Bookingcode"
                                value={values?.subBookingCodeId}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="subBookingCodeId"
                                  options={subBookingCodeDetails}
                                  value={subBookingCodeValue}
                                  onInputChange={(e, v) =>
                                    setSubBookingCodeValue(v)
                                  }
                                  onChange={(e, v) => {
                                    setFieldValue("subBookingCodeId", v?._id);
                                    setSubBookingCodeValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.subBookingCode === value
                                  }
                                />
                              </FloatLabel>
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={2}>
                          <Grid container sx={{ p: 2 }} spacing={2}>
                            <Grid item xs={12} sm={4} className="datePicker">
                              <FloatLabel
                                label="Customer Name"
                                value={values?.customerName}
                              >
                                <Field
                                  className="textField w-100"
                                  name="customerName"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Mobile"
                                value={values?.mobileNumber}
                              >
                                <Field
                                  className="textField w-100"
                                  name="mobileNumber"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel label="Email" value={values?.email}>
                                <Field
                                  className="textField w-100"
                                  name="email"
                                />
                              </FloatLabel>
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={3}>
                          <Grid container sx={{ p: 2 }} spacing={2}>
                            <Grid item xs={12} sm={4} className="datePicker">
                              <FloatLabel
                                label="Registeration Number"
                                value={values?.registrationNumber}
                              >
                                <Field
                                  className="textField w-100"
                                  name="registrationNumber"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel label="Make" value={values?.make}>

                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="make"
                                  options={vehicleMakeDetails}
                                  value={vehicleValue}
                                  onChange={(e, v) => {
                                    setFieldValue("make", v?._id);
                                    setVehicleValue(v?.label);
                                  }}
                                  clearIcon={false}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionalEqualToValue={(option, value) =>
                                    option.vehicleMake === value
                                  }
                                  disabled={editableData ? true : false}
                                />

                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel label="Model" value={values?.model}>
                                <Field
                                  className="textField w-100"
                                  name="model"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Grid container spacing={1}>
                                <Grid item sx={{ width: "30%" }}>
                                  <FloatLabel label="CC" value={values?.cc}>
                                    <Field
                                      className="textField w-100"
                                      name="cc"
                                    />
                                  </FloatLabel>
                                </Grid>
                                <Grid item sx={{ width: "30%" }}>
                                  <FloatLabel label="GVW" value={values?.gvw}>
                                    <Field
                                      className="textField w-100"
                                      name="gvw"
                                    />
                                  </FloatLabel>
                                </Grid>
                                <Grid item sx={{ width: "40%" }}>
                                  <FloatLabel
                                    label="Seating Capacity"
                                    value={values?.seatingCapacity}
                                  >
                                    <Field
                                      className="textField w-100"
                                      name="seatingCapacity"
                                    />
                                  </FloatLabel>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Registeration Year"
                                value={values?.registrationYear}
                              >
                                <Field
                                  className="textField w-100"
                                  name="registrationYear"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Fuel Type"
                                value={values?.fuelType}
                              >
                                <Autocomplete
                                  className="AutoComplete_InputBox"
                                  name="fuelType"
                                  options={fuelType}
                                  value={fuelTypeValue}
                                  onInputChange={(e, v) => setFuelTypeValue(v)}
                                  onChange={(e, v) => {
                                    setFieldValue("fuelType", v?._id);
                                    setFuelTypeValue(v?.label);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                  isOptionEqualToValue={(option, value) =>
                                    option.fuelType === value
                                  }
                                  disabled={editableData ? true : false}
                                />
                              </FloatLabel>
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={4}>
                          <Grid container sx={{ p: 2 }} spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FloatLabel
                                  label="OD Policy Start Date"
                                  value="Reactjs"
                                >
                                  <DatePicker
                                    name="odPolicyStartDate"
                                    format="DD/MM/YYYY"
                                    className="Date_Picker w-100"
                                    onChange={(e) => OdPolicyStDateFunction(e)}
                                    value={dayjs(odPolicyStartDate)}
                                  />
                                </FloatLabel>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="OD Policy Period"
                                value={values.odPolicyPeriod}
                              >
                                <Select
                                  className="AutoComplete_InputBox w-100"
                                  name="odPolicyPeriod"
                                  value={values?.odPolicyPeriod}
                                  onChange={OdPolicyPeriodFunction}
                                >
                                  {OdPolicyPeriodController.map((e) => (
                                    <MenuItem value={e.value} key={e.value}>
                                      {e.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FloatLabel
                                  label="OD Policy End Date"
                                  value="Reactjs"
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="odPolicyEndDate"
                                    className="Date_Picker w-100"
                                    value={dayjs(odPolicyEndDateValue)}
                                    onChange={(e) =>
                                      setFieldValue("odPolicyEndDate", e?.$d)
                                    }
                                  />
                                </FloatLabel>
                              </LocalizationProvider>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ p: 2 }} spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FloatLabel
                                  label="TP Policy Start Date"
                                  value="Reactjs"
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="tpPolicyStartDate"
                                    className="Date_Picker w-100"
                                    onChange={(e) => TPPolicyStDateFunction(e)}
                                    value={dayjs(tpPolicyStartDate)}
                                  />
                                </FloatLabel>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="TP Policy Period"
                                value={values.tpPolicyPeriod}
                              >
                                <Select
                                  className="AutoComplete_InputBox w-100"
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  name="tpPolicyPeriod"
                                  value={values?.tpPolicyPeriod}
                                  onChange={TpPolicyPeriodFunction}
                                >
                                  {OdPolicyPeriodController.map((e) => (
                                    <MenuItem value={e.value} key={e.value}>
                                      {e.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FloatLabel
                                  label="TP Policy End Date"
                                  value="Reactjs"
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="tpPolicyEndDate"
                                    className="Date_Picker w-100"
                                    value={dayjs(tpPolicyDate)}
                                    onChange={(e) =>
                                      setFieldValue("tpPolicyEndDate", e?.$d)
                                    }
                                  />
                                </FloatLabel>
                              </LocalizationProvider>
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={5}>
                          <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="OD Disc"
                                value={values?.odDisc}
                              >
                                <Field
                                  className="textField w-100"
                                  name="odDisc"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="OD Premium"
                                value={values?.odPremium}
                              >
                                <Field
                                  className="textField w-100"
                                  name="odPremium"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="TP Premium"
                                value={values?.tpPremium}
                              >
                                <Field
                                  className="textField w-100"
                                  name="tpPremium"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Net Premium"
                                value={values?.netPremium}
                              >
                                <Field
                                  className="textField w-100"
                                  name="netPremium"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Total Premium"
                                value={values?.totalPremium}
                              >
                                <Field
                                  className="textField w-100"
                                  name="totalPremium"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="PA Cover"
                                value={values?.paCover}
                              >
                                <Field
                                  className="textField w-100"
                                  name="paCover"
                                />
                              </FloatLabel>
                            </Grid>
                          </Grid>
                        </TabPanel>
                      </TabContext>

                      <Grid container spacing={1} sx={{ p: 3 }}>
                        {/* <Grid item xs={12} sm={2}>
                            <button className="w-100 TabelButton" onClick={() => setOpenEditPolicyDrawer(false)}>
                              Cancel
                            </button>
                          </Grid> */}
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          sx={{
                            display: value === 5 ? "none" : "flex",
                            justifyContent: "end",
                          }}
                        >
                          <Button
                            disabled={disableOne}
                            sx={{ display: disableOne ? "none" : "block" }}
                            className="Common_Button"
                            onClick={(e) => handleChangePerTap(e, value)}
                          >
                            Next
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          sx={{
                            display:
                              value === 5 && !disableOne ? "flex" : "none",
                            justifyContent: "end",
                          }}
                        >
                          <button
                            className="w-25 Common_Button"
                            type="submit"
                          // onClick={() => onSubmit(values)}
                          >
                            Update
                          </button>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : null}

                  {!(selectedData?.status === PolicyFilterTypes[1].value) ||
                    editType === "CommonEdit" ? (
                    <>
                      <hr />
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Policy Details
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="User Name" value={values?.userId}>
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="userId"
                              options={userDetails}
                              value={userValue}
                              onInputChange={(e, v) => setUserValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("userId", v?._id);
                                setSelectedUserId(v?._id);
                                setUserValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option?.label === value
                              }
                              renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                  {option.name}
                                </li>
                              )}
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Login Id "
                            value={values?.loginIdFull}
                          >
                            <Autocomplete
                              name="loginIdFull"
                              disablePortal
                              className="AutoComplete_InputBox"
                              id="combo-box-demo"
                              value={selectedLoginPortal}
                              options={loginPortalDetails}
                              onChange={(e, v) => {
                                setSelectedLoginPortal(v?.loginPortal);

                                setFieldValue("loginIdFull", v?.loginPortal);
                              }}
                              renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                  {option.loginPortal}
                                </li>
                              )}
                              isOptionEqualToValue={(e, v) => e.loginPortal === v}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Policy Number"
                            value={values?.policyNumber}
                          >
                            <Field
                              name="policyNumber"
                              className="textField w-100"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4} className="datePicker">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FloatLabel label="Issue Date" value="Reactjs">
                              <DatePicker
                                format="DD/MM/YYYY"
                                name="issueDate"
                                className="Date_Picker w-100"
                                defaultValue={
                                  formType === "edit"
                                    ? dayjs(selectedData?.issueDate)
                                    : null
                                }
                                onChange={(e) =>
                                  setFieldValue("issueDate", e.$d)
                                }
                                disabled={editableData ? true : false}
                              />
                            </FloatLabel>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Select Company"
                            value={values?.companyId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="companyId"
                              options={companyDetails}
                              value={companyValue}
                              onChange={(e, v) => {
                                setFieldValue("companyId", v?._id);
                                setSelectedCompanyId(v?._id);
                                setCompanyValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option?.label === value
                              }
                              renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                  {option.shortName}
                                </li>
                              )}
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Policy Type"
                            value={values?.policyTypeId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="policyTypeId"
                              options={policyTypeDetails}
                              value={policyTypeValue}
                              onInputChange={(e, v) => setPolicyTypeValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("policyTypeId", v?._id);
                                setPolicyTypeValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.policyType === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="Product" value={values?.productId}>
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="productId"
                              options={productDetails}
                              value={productValue}
                              onInputChange={(e, v) => setProductValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("productId", v?._id);
                                setProductIdValue(v?._id);
                                setProductValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.product === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Sub Product"
                            value={values?.subProductId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="subProductId"
                              options={subProductDetails}
                              value={subProductValue}
                              onInputChange={(e, v) => setSubProductValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("subProductId", v?._id);
                                setSubProductIdValue(v?._id);
                                setSubProductValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.subProduct === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>{" "}
                        <Grid item xs={12} sm={3} />
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Booking Code"
                            value={values?.bookingCodeId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="policyTypeId"
                              options={bookingCodeDetails}
                              value={bookingCodeValue}
                              onInputChange={(e, v) => setBookingCodeValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("bookingCodeId", v?._id);
                                setBookingCodeValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.bookingCode === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Sub Bookingcode"
                            value={values?.subBookingCodeId}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="subBookingCodeId"
                              options={subBookingCodeDetails}
                              value={subBookingCodeValue}
                              onInputChange={(e, v) =>
                                setSubBookingCodeValue(v)
                              }
                              onChange={(e, v) => {
                                setFieldValue("subBookingCodeId", v?._id);
                                setSubBookingCodeValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.subBookingCode === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr></hr>
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Customer Details
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4} className="datePicker">
                          <FloatLabel
                            label="Customer Name"
                            value={values?.customerName}
                          >
                            <Field
                              className="textField w-100"
                              name="customerName"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Mobile"
                            value={values?.mobileNumber}
                          >
                            <Field
                              className="textField w-100"
                              name="mobileNumber"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="Email" value={values?.email}>
                            <Field
                              className="textField w-100"
                              name="email"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr></hr>
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Vehicle Details
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4} className="datePicker">
                          <FloatLabel
                            label="Registeration Number"
                            value={values?.registrationNumber}
                          >
                            <Field
                              className="textField w-100"
                              name="registrationNumber"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="Make" value={values?.make}>
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="make"
                              options={vehicleMakeDetails}
                              value={vehicleValue}
                              onChange={(e, v) => {
                                setFieldValue("make", v?._id);
                                setVehicleValue(v?.label);
                              }}
                              clearIcon={false}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionalEqualToValue={(option, value) =>
                                option.vehicleMake === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="Model" value={values?.model}>
                            <Field
                              className="textField w-100"
                              name="model"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container spacing={1}>
                            <Grid item sx={{ width: "30%" }}>
                              <FloatLabel label="CC" value={values?.cc}>
                                <Field
                                  className="textField w-100"
                                  name="cc"
                                  disabled={editableData ? true : false}
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item sx={{ width: "30%" }}>
                              <FloatLabel label="GVW" value={values?.gvw}>
                                <Field
                                  className="textField w-100"
                                  name="gvw"
                                  disabled={editableData ? true : false}
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item sx={{ width: "40%" }}>
                              <FloatLabel
                                label="Seating Capacity"
                                value={values?.seatingCapacity}
                              >
                                <Field
                                  className="textField w-100"
                                  name="seatingCapacity"
                                  disabled={editableData ? true : false}
                                />
                              </FloatLabel>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Registeration Year"
                            value={values?.registrationYear}
                          >
                            <Field
                              className="textField w-100"
                              name="registrationYear"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Fuel Type"
                            value={values?.fuelType}
                          >
                            <Autocomplete

                              className="AutoComplete_InputBox"
                              name="fuelType"
                              options={fuelType}
                              value={fuelTypeValue}
                              onInputChange={(e, v) => setFuelTypeValue(v)}
                              onChange={(e, v) => {
                                setFieldValue("fuelType", v?._id);
                                setFuelTypeValue(v?.label);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              isOptionEqualToValue={(option, value) =>
                                option.fuelType === value
                              }
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr />
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        OD Policy Date
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FloatLabel
                              label="OD Policy Start Date"
                              value="Reactjs"
                            >
                              <DatePicker
                                name="odPolicyStartDate"
                                format="DD/MM/YYYY"
                                className="Date_Picker w-100"
                                onChange={(e) => OdPolicyStDateFunction(e)}
                                value={dayjs(odPolicyStartDate)}
                                disabled={editableData ? true : false}
                              />
                            </FloatLabel>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Policy Period"
                            value={values.odPolicyPeriod}
                          >
                            <Select
                              className="AutoComplete_InputBox w-100"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="odPolicyPeriod"
                              value={values?.odPolicyPeriod}
                              onChange={OdPolicyPeriodFunction}
                              disabled={editableData ? true : false}
                            >
                              {OdPolicyPeriodController.map((e) => (
                                <MenuItem value={e.value} key={e.value}>
                                  {e.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FloatLabel
                              label="OD Policy End Date"
                              value="Reactjs"
                            >
                              <DatePicker
                                format="DD/MM/YYYY"
                                name="odPolicyEndDate"
                                className="Date_Picker w-100"
                                value={dayjs(odPolicyEndDateValue)}
                                onChange={(e) =>
                                  setFieldValue("odPolicyEndDate", e?.$d)
                                }
                                disabled={editableData ? true : false}
                              />
                            </FloatLabel>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>

                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        TP Policy Date
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FloatLabel
                              label="TP Policy Start Date"
                              value="Reactjs"
                            >
                              <DatePicker
                                format="DD/MM/YYYY"
                                name="tpPolicyStartDate"
                                className="Date_Picker w-100"
                                onChange={(e) => TPPolicyStDateFunction(e)}
                                value={dayjs(tpPolicyStartDate)}
                                disabled={editableData ? true : false}
                              />
                            </FloatLabel>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Policy Period"
                            value={values.tpPolicyPeriod}
                          >
                            <Select
                              className="AutoComplete_InputBox w-100"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="tpPolicyPeriod"
                              value={values?.tpPolicyPeriod}
                              onChange={TpPolicyPeriodFunction}
                              disabled={editableData ? true : false}
                            >
                              {OdPolicyPeriodController.map((e) => (
                                <MenuItem value={e.value} key={e.value}>
                                  {e.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FloatLabel
                              label="TP Policy End Date"
                              value="Reactjs"
                            >
                              <DatePicker
                                format="DD/MM/YYYY"
                                name="tpPolicyEndDate"
                                className="Date_Picker w-100"
                                value={dayjs(tpPolicyDate)}
                                onChange={(e) =>
                                  setFieldValue("tpPolicyEndDate", e?.$d)
                                }
                                disabled={editableData ? true : false}
                              />
                            </FloatLabel>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                      <hr />
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Premium
                      </Typography>
                      <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="OD Disc" value={values?.odDisc}>
                            <Field
                              className="textField w-100"
                              name="odDisc"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Premium"
                            value={values?.odPremium}
                          >
                            <Field
                              className="textField w-100"
                              name="odPremium"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Premium"
                            value={values?.tpPremium}
                          >
                            <Field
                              className="textField w-100"
                              name="tpPremium"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Net Premium"
                            value={values?.netPremium}
                          >
                            <Field
                              className="textField w-100"
                              name="netPremium"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Total Premium"
                            value={values?.totalPremium}
                          >
                            <Field
                              className="textField w-100"
                              name="totalPremium"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel label="PA Cover" value={values?.paCover}>
                            <Field
                              className="textField w-100"
                              name="paCover"
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr />
                      <Typography
                        sx={{ ml: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Payment Details
                      </Typography>
                      <Grid container sx={{ p: 2 }} spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="Payment Mode"
                            value={values?.paymentMode}
                          >
                            <Autocomplete
                              className="AutoComplete_InputBox"
                              name="paymentMode"
                              disablePortal
                              value={values?.paymentMode}
                              id="combo-box-demo"
                              options={PaymentDetails}
                              isOptionEqualToValue={(option, value) =>
                                option?.label === value
                              }
                              onChange={(e, v) => PaymentFunction(v)}
                              clearIcon={false}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              disabled={editableData ? true : false}
                            />
                          </FloatLabel>
                        </Grid>
                        {showPaymentMethod === 3 ? (
                          <>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Cheque Number"
                                value={values?.chequeNumber}
                              >
                                <Field
                                  name="chequeNumber"
                                  className="textField w-100"
                                />
                              </FloatLabel>
                            </Grid>
                            <Grid item xs={12} sm={4} className="datePicker">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  name="chequeDate"
                                  className="Date_Picker w-100"
                                  defaultValue={dayjs()}
                                  onChange={(e) => {
                                    setFieldValue("chequeDate", e.$d);
                                  }}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FloatLabel
                                label="Bank Name"
                                value={values?.bankName}
                              >
                                <Field
                                  className="textField w-100"
                                  name="bankName"
                                />
                              </FloatLabel>
                            </Grid>
                          </>
                        ) : null}
                      </Grid>
                      <Grid container spacing={1} sx={{ p: 2 }}>
                        {selectedData.status === PolicyFilterTypes[2].value ? (
                          <Grid
                            item
                            xs={12}
                            sm={2}
                            sx={{
                              display: editableData ? "flex" : "none",
                              justifyContent: "end",
                            }}
                          >
                            <Button
                              variant="outlined"
                              className="w-100 TabelButton"
                              size="large"
                              onClick={() => EditableFunction()}
                            >
                              Edit Policy
                            </Button>
                          </Grid>
                        ) : null}
                        <Grid item xs={12} sm={2}>
                          <button
                            className="w-100 TabelButton"
                            type="submit"
                            style={{ border: "none" }}
                          >
                            {editableData ? "Verify Policy" : "Update"}
                          </button>
                        </Grid>
                      </Grid>
                    </>
                  ) : null}
                  {selectedData?.status === PolicyFilterTypes[2].value ? (
                    <Grid container>
                      <Grid
                        item
                        sx={{ p: 2, display: editableData ? "block" : "none" }}
                        xs={12}
                        sm={12}
                      >
                        {openViewCal ? (
                          <Button
                            className="Common_Button w-100"
                            variant="contained"
                            onClick={() => {
                              setOpenViewCal(!openViewCal);
                            }}
                            endIcon={<CalculateIcon />}
                          >
                            Close Calculations
                          </Button>
                        ) : (
                          <Button
                            className="Common_Button w-100"
                            variant="contained"
                            onClick={() => GetPayablePercentFunction()}
                            endIcon={<CalculateIcon />}
                          >
                            View Calculations
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  ) : null}
                  {openViewCal ? (
                    <Grid
                      sx={{ p: 2, transition: "2s" }}
                      className={
                        openViewCal
                          ? "OpenCalculationsBox"
                          : "CloseCalculationsBox"
                      }
                    >
                      <Typography
                        sx={{ pb: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        User Approved %
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Percentage"
                            value={values?.userOdPercentage}
                          >
                            <Field
                              name="userOdPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Percentage"
                            value={values?.userTpPercentage}
                          >
                            <Field
                              name="userTpPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Percentage"
                            value={values?.userNetPercentage}
                          >
                            <Field
                              name="userNetPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Amount"
                            value={values?.userOdAmount}
                          >
                            <Field
                              name="userOdAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Amount"
                            value={values?.userTpAmount}
                          >
                            <Field
                              name="userTpAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Amount"
                            value={values?.userNetAmount}
                          >
                            <Field
                              name="userNetAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TOTAL Payable"
                            value={values?.userTotalPayable}
                          >
                            <Field
                              name="userTotalPayable"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr />
                      <Typography
                        sx={{ pb: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Receivable %
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Percentage"
                            value={values?.receivableOdPercentage}
                          >
                            <Field
                              name="receivableOdPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Percentage"
                            value={values?.receivableTpPercentage}
                          >
                            <Field
                              name="receivableTpPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Percentage"
                            value={values?.receivableNetPercentage}
                          >
                            <Field
                              name="receivableNetPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Amount"
                            value={values?.receivableOdAmount}
                          >
                            <Field
                              name="receivableOdAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Amount"
                            value={values?.receivableTpAmount}
                          >
                            <Field
                              name="receivableTpAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Amount"
                            value={values?.receivableNetAmount}
                          >
                            <Field
                              name="receivableNetAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TOTAL Payable"
                            value={values?.receivableTotalPayabl}
                          >
                            <Field
                              name="receivableTotalPayabl"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                      </Grid>
                      <hr />

                      <Typography
                        sx={{ pb: 2 }}
                        className="EditPageHeadingTittle"
                      >
                        Branch %
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Percentage"
                            value={values?.branchOdPercentage}
                          >
                            <Field
                              name="branchOdPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Percentage"
                            value={values?.branchTpPercentage}
                          >
                            <Field
                              name="branchTpPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Percentage"
                            value={values?.branchNetPercentage}
                          >
                            <Field
                              name="branchNetPercentage"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="OD Amount"
                            value={values?.branchOdAmount}
                          >
                            <Field
                              name="branchOdAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TP Amount"
                            value={values?.branchTpAmount}
                          >
                            <Field
                              name="branchTpAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="NET Amount"
                            value={values?.branchNetAmount}
                          >
                            <Field
                              name="branchNetAmount"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FloatLabel
                            label="TOTAL Payable"
                            value={values?.branchTotalPayabl}
                          >
                            <Field
                              name="branchTotalPayabl"
                              className="textField w-100"
                            />
                          </FloatLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            endIcon={<CalculateIcon />}
                            sx={{ height: "44px", borderRadius: "0px" }}
                            className="Common_Button w-25"
                            variant="contained"
                            onClick={() => CalaculteFunction(values)}
                          >
                            Calculate
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                </Form>
              )}
            </Formik>
          </div>
        )}
        <Loader open={openLoader} />
      </div>
    </>
  );
};

export default EditSearchPolicy;




// && data.odDisc && data.odPremium && data.tpPremium && data.netPremium && data.totalPremium