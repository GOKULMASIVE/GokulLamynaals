import * as React from "react";
import { Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import dashboard from "../../Dashboard/Dashboard";
import Navbar from "../../Navbar/Navbar";
import Branch from "../../Master/Branch/Branch";
import BookingCode from "../../Master/CreateBookingCode/BookingCode";
import Company from "../../Master/CreateCompany/Company";
import LinkBookingCode from "../../Master/LinkBookingCode/LinkBookingCode";
import PolicyPeriod from "../../Master/PolicyPeriod/PolicyPeriod";
import PolicyType from "../../Master/PolicyType/PolicyType";
import Product from "../../Master/Product/Product";
import MasterCompany from "../../Master/MasterCompany/MasterCompany";
import ManageUser from "../../User/ManageUser";
import RenewalPolicy from "../../RenewalPolicy/RenewalPolicy";
import CompanyLogin from "../../CompanyLogin/CompanyLogin";
import CommisionReceivable from "../../Utilites/CommisionReceivable/CommisionReceivable";
import ReceivableStatus from "../../Utilites/ReceivableStatus/ReceivableStatus";
import UserPayable from "../../Utilites/UserPayable/UserPayable";
import BranchPayable from "../../Utilites/BranchPayable/BranchPayable";
import ChequeStatus from "../../Utilites/ChequeStatus/ChequeStatus";
import LogStatus from "../../Utilites/LogStatus/LogStatus";
import OfficeExpenses from "../../Utilites/OfficeExpenses/OfficeExpenses";
import MasterReport from "../../Report/MasterReport/MasterReport";
import PaymentPaidAndReceived from "../../Report/PaymentPaidandReceived/PaymentPaidandReceived";
import PolicyChequeReport from "../../Report/PolicyChequeStatus/PolicyChequeStatus";
import Policycreate from "../../Policy/CreatePolicy/CretePolicy";
import SearchPolicy from "../../Policy/SearchPolicy/SearchPolicy";
import ReceivableStatusNew from "../../Utilites/ReceivableStatusNew/ReceivableStatusNew";
import PolicyList from "../../Policy/PolicyList/PolicyList";
import CCEntry from "../../Policy/CCEntry/CCEntry";
import PolicyMapping from "../../Policy/PolicyMapping/PolicyMapping";
import MotorCalculation from "../../MotorCalculation/MotorCalculation";
import UserConfig from '../../Configuration/UserConfig/UserConfig'
import AllPolicy from "../../Master/OldPolicyList/AllPolicy/AllPolicy";
import ApprovedPolicy from "../../Master/OldPolicyList/ApprovedPolicy/ApprovedPolicy";
import PendingPolicy from "../../Master/OldPolicyList/PendingPolicy/PendingPolicy";
import EntryPending from "../../Master/OldPolicyList/EntryPending/EntryPending";
import RejectedPolicy from "../../Master/OldPolicyList/RejectedPolicy/RejectedPolicy";
import ChequePending from "../../Master/OldPolicyList/ChequePending/ChequePending";
import Client from "../../Client/Client";
import SubProduct from "../../Master/SubProduct/SubProduct";
import SubBookingCode from "../../Master/SubBookingCode/SubBookingCode";
import FuelType from "../../Master/FuelType/FuelType";
import Payout from "../../Master/Payout/Payout";
import UserWallet from "../../UserWallet/Wallet";
import BranchWallet from "../../BranchWallet/BranchWallet";
import CompanyWallet from "../../CompanyWallet/CompanyWallet";
import ReceivableConfig from "../../Configuration/ReceivableConfig/ReceivableConfig";
import BranchConfig from "../../Configuration/BranchConfig/BranchConfig";
import RTOMapping from "../../Configuration/RTOMapping/RTOMapping";
import TdsReport from "../../Report/TdsReport/TdsReport";
import BookingReport from "../../Report/BookingReport/BookingReport";
import VehicleMake from "../../Master/VehicleMake/VehicleMake";
import MotorReport from "../../Report/MotorReport/MotorReport";

const elements = {
  "/dashboard": dashboard,
  "/branch": Branch,
  "/bookingcode": BookingCode,
  "/company": Company,
  "/linkbookingcode": LinkBookingCode,
  "/policyperiod": PolicyPeriod,
  "/policytype": PolicyType,
  "/product": Product,
  "/masterCompany": MasterCompany,
  "/user": ManageUser,
  "/renewalPolicy": RenewalPolicy,
  "/companyLogin": CompanyLogin,
  "/commisionReceivale": CommisionReceivable,
  "/receivaleStatus": ReceivableStatus,
  "/userPayable": UserPayable,
  "/branchPayable": BranchPayable,
  "/chequeStatus": ChequeStatus,
  "/logStatus": LogStatus,
  "/officeExpenses": OfficeExpenses,
  "/masterReport": MasterReport,
  "/paymentPaidAndReceived": PaymentPaidAndReceived,
  "/policyChequeReport": PolicyChequeReport,
  "/policycreate": Policycreate,
  "/searchPolicy": SearchPolicy,
  "/receivableStatusNew": ReceivableStatusNew,
  "/policyList": PolicyList,
  "/ccentry": CCEntry,
  "/policyMapping": PolicyMapping,
  "/motorCalculation": MotorCalculation,
  "/userConfiguration": UserConfig,
  "/receivableConfiguration": ReceivableConfig,
  "/branchConfiguration": BranchConfig,
  "/allPolicy": AllPolicy,
  "/approvedPolicy": ApprovedPolicy,
  '/pendingPolicy': PendingPolicy,
  '/entryPending': EntryPending,
  '/rejectedPolicy': RejectedPolicy,
  '/chequePending': ChequePending,
  '/client': Client,
  '/subProduct': SubProduct,
  '/subBookingCode': SubBookingCode,
  '/fuelType': FuelType,
  '/payout': Payout,
  '/userWallet': UserWallet,
  '/branchWallet': BranchWallet,
  '/companyWallet': CompanyWallet,
  '/rtoMapping': RTOMapping,
  '/tdsReport': TdsReport,
  '/bookingReport': BookingReport,
  '/vehicleMake':VehicleMake,
  '/MotorReport':MotorReport
};

export default function Dashboard() {
  const [currentEl, setCurrentEl] = React.useState();
  const location = useLocation();

  React.useEffect(() => {
    if (
      location.pathname &&
      Object.keys(elements).includes(location.pathname)
    ) {
      setCurrentEl(location.pathname);
    }
  }, [location]);

  React.useEffect(() => {
    if (currentEl)
      window.history.replaceState(null, currentEl.split("/")[1], currentEl);
  }, [currentEl]);


  const Element = elements[currentEl] && elements[currentEl];

  return (
    <>
      <Navbar
      // setcurrentmenu={setCurrentEl}
      >
        <Grid container p={{ xs: 0, md: 0 }}>
          <Grid item xs={12}>
            {Element && <Element />}
          </Grid>
        </Grid>
      </Navbar>
    </>
  );
}
