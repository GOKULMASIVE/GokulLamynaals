import { AnalyticsIcon } from "../../Resources/Icons/icons";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PolicyIcon from '@mui/icons-material/Policy';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MopedIcon from '@mui/icons-material/Moped';

//Admin Menu ---- usertype = client
const AdminMenu = [
  {
    parent: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    parent: 2,
    title: "Master",
    path: "/master",
    icon: <ConfirmationNumberIcon />,
    subMenu: [
      {
        title: "Insurance Company",
        path: "/company",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Our Company",
        path: "/masterCompany",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Booking Code",
        path: "/#",
        child: 2,
        subOrder: 106,
        icon: <AnalyticsIcon />,
        subMenu: [
          {
            title: "Booking Code",
            path: "/bookingcode",
            subChild: 106,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
          {
            title: "Sub Booking Code",
            path: "/subBookingCode",
            subChild: 106,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
        ],
      },
      {
        title: "Link Booking Code",
        path: "/linkbookingcode",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy Period",
        path: "/policyperiod",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy Type",
        path: "/policytype",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Product",
        path: "/#",
        child: 2,
        icon: <AnalyticsIcon />,
        subOrder: 105,
        subMenu: [
          {
            title: "Product",
            path: "/product",
            subChild: 105,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
          {
            title: "Sub Product",
            path: "/subProduct",
            subChild: 105,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
        ],
      },
      {
        title: "Fuel Type",
        path: "/fuelType",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Link RTO Code",
        path: "/rtoMapping",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Vehicle Make",
        path: "/vehicleMake",
        child: 2,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
    ],
  },
  {
    parent: 3,
    title: "User",
    path: "/users",
    icon: <AccountBoxIcon />,
    subMenu: [
      {
        title: "User",
        path: "/user",
        child: 3,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Branch",
        path: "/branch",
        icon: <AnalyticsIcon />,
        child: 3,
        subMenu: [],
      },
      {
        title: "Configuration",
        path: "/#",
        child: 3,
        subOrder: 101,
        icon: <AnalyticsIcon />,
        subMenu: [
          {
            title: "User Config",
            path: "/userConfiguration",
            subChild: 101,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
          {
            title: "Branch Config",
            path: "/branchConfiguration",
            subChild: 101,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
          {
            title: "Receivable Config",
            path: "/receivableConfiguration",
            subChild: 101,
            icon: <AnalyticsIcon />,
            subMenu: [],
          },
        ],
      },
    ],
  },
  {
    parent: 4,
    title: "Company Login",
    path: "/companyLogin",
    icon: <AddBusinessIcon />,
    subMenu: [],
  },
  {
    parent: 5,
    title: "Policy",
    path: "/policy",
    icon: <PolicyIcon />,
    subMenu: [
      {
        title: "Create Policy",
        path: "/policycreate",
        child: 5,
        icon: <AnalyticsIcon />,
      },
      {
        title: "Search Policy",
        path: "/searchPolicy",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy List",
        path: "/policyList",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "CC Entry",
        path: "/ccentry",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy Maping",
        path: "/policyMapping",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
    ],
  },
  {
    parent: 6,
    title: "Utilites",
    path: "/utilies",
    icon: <ManageAccountsIcon />,
    subMenu: [
      {
        title: "User Payable",
        path: "/userPayable",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Branch Payable",
        path: "/branchPayable",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Comission Receivable",
        path: "/commisionReceivale",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Receivable Status",
        path: "/receivaleStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },

      {
        title: "Cheque Status",
        path: "/chequeStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Log Status",
        path: "/logStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      // {
      //   title: "Office Expenses",
      //   path: "/officeExpenses",
      //   child: 6,
      //   icon: <AnalyticsIcon />,
      //   subMenu: [],
      // },
    ],
  },
  {
    parent: 7,
    title: "Report",
    path: "/product",
    icon: <SummarizeIcon />,
    subMenu: [
      {
        title: "Master Report",
        path: "/masterReport",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Payment Paid / Received",
        path: "/paymentPaidAndReceived",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "TDS Report",
        path: "/tdsReport",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Cheque Report",
        path: "/policyChequeReport",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Booking Report",
        path: "/bookingReport",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Motor Report",
        path: "/MotorReport",
        child: 7,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
    ],
  },
  {
    parent: 8,
    title: "Renewal",
    path: "/renewalPolicy",
    icon: <EventRepeatIcon />,
    subMenu: [],
  },
  {
    parent: 9,
    title: "Wallet",
    path: "/wallet",
    icon: <AccountBalanceWalletIcon />,
    subMenu: [
      {
        title: "User Wallet",
        path: "/userWallet",
        child: 9,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Branch Wallet",
        path: "/branchWallet",
        child: 9,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Company Wallet",
        path: "/companyWallet",
        child: 9,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
    ],
  },
  {
    parent: 10,
    title: "Motor Calculation",
    path: "/motorCalculation",
    icon: <MopedIcon />,
    subMenu: [],
  },
];

//Branch Manager Menu
const BranchManagerMenu = [
  {
    parent: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    parent: 3,
    title: "User",
    path: "/users",
    icon: <AccountBoxIcon />,
    subMenu: [
      {
        title: "User",
        path: "/user",
        child: 3,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "User Config",
        path: "/userConfiguration",
        icon: <AnalyticsIcon />,
        child: 3,
        subMenu: [],
      } 
    ],
  },
  {
    parent: 4,
    title: "Company Login",
    path: "/companyLogin",
    icon: <AddBusinessIcon />,
    subMenu: [],
  },
  {
    parent: 5,
    title: "Policy",
    path: "/policy",
    icon: <PolicyIcon />,
    subMenu: [
      {
        title: "Create Policy",
        path: "/policycreate",
        child: 5,
        icon: <AnalyticsIcon />,
      },
      {
        title: "Search Policy",
        path: "/searchPolicy",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy List",
        path: "/policyList",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      }
    ],
  },
  {
    parent: 6,
    title: "Utilites",
    path: "/utilies",
    icon: <ManageAccountsIcon />,
    subMenu: [
      {
        title: "User Payable",
        path: "/userPayable",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      // {
      //   title: "Office Expenses",
      //   path: "/officeExpenses",
      //   child: 6,
      //   icon: <AnalyticsIcon />,
      //   subMenu: [],
      // }
    ],
  },
  {
    parent: 7,
    title: "Report",
    path: "/masterReport",
    icon: <SummarizeIcon />,
    subMenu: [],
  },
  {
    parent: 8,
    title: "Renewal",
    path: "/renewalPolicy",
    icon: <EventRepeatIcon />,
    subMenu: [],
  },
  {
    parent: 9,
    title: "Wallet",
    path: "/wallet",
    icon: <AccountBalanceWalletIcon />,
    subMenu: [
      {
        title: "User Wallet",
        path: "/userWallet",
        child: 9,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Branch Wallet",
        path: "/branchWallet",
        child: 9,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
    ],
  },
  {
    parent: 10,
    title: "Motor Calculation",
    path: "/motorCalculation",
    icon: <MopedIcon />,
    subMenu: [],
  }
];

//Operator Menu
const OperatorMenu = [
  {
    parent: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    parent: 3,
    title: "User",
    path: "/user",
    icon: <AccountBoxIcon />,
    subMenu: [],
  
  },
  {
    parent: 4,
    title: "Company Login",
    path: "/companyLogin",
    icon: <AddBusinessIcon />,
    subMenu: [],
  },
  {
    parent: 5,
    title: "Policy",
    path: "/policy",
    icon: <PolicyIcon />,
    subMenu: [
      {
        title: "Create Policy",
        path: "/policycreate",
        child: 5,
        icon: <AnalyticsIcon />,
      },
      {
        title: "Search Policy",
        path: "/searchPolicy",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy List",
        path: "/policyList",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "CC Entry",
        path: "/ccentry",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      }
    ],
  },
  {
    parent: 6,
    title: "Utilites",
    path: "/utilies",
    icon: <ManageAccountsIcon />,
    subMenu: [

      {
        title: "Receivable Status",
        path: "/receivaleStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },

      {
        title: "Cheque Status",
        path: "/chequeStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },

    ],
  },
  {
    parent: 8,
    title: "Renewal",
    path: "/renewalPolicy",
    icon: <EventRepeatIcon />,
    subMenu: [],
  },
  {
    parent: 10,
    title: "Motor Calculation",
    path: "/motorCalculation",
    icon: <MopedIcon />,
    subMenu: [],
  }
];

//User Menu
const UserMenu = [
  {
    parent: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    parent: 4,
    title: "Company Login",
    path: "/companyLogin",
    icon: <AddBusinessIcon />,
    subMenu: [],
  },
  {
    parent: 5,
    title: "Policy",
    path: "/policy",
    icon: <PolicyIcon />,
    subMenu: [
      {
        title: "Create Policy",
        path: "/policycreate",
        child: 5,
        icon: <AnalyticsIcon />,
      },
      {
        title: "Search Policy",
        path: "/searchPolicy",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      {
        title: "Policy List",
        path: "/policyList",
        child: 5,
        icon: <AnalyticsIcon />,
        subMenu: [],
      }
    ],
  },
  {
    parent: 6,
    title: "Utilites",
    path: "/utilies",
    icon: <ManageAccountsIcon />,
    subMenu: [
      {
        title: "Cheque Status",
        path: "/chequeStatus",
        child: 6,
        icon: <AnalyticsIcon />,
        subMenu: [],
      },
      // {
      //   title: "Office Expenses",
      //   path: "/officeExpenses",
      //   child: 6,
      //   icon: <AnalyticsIcon />,
      //   subMenu: [],
      // },
    ],
  },
  {
    parent: 8,
    title: "Renewal",
    path: "/renewalPolicy",
    icon: <EventRepeatIcon />,
    subMenu: [],
  },
  {
    parent: 9,
    title: "Wallet",
    path: "/userWallet",
    icon: <AccountBalanceWalletIcon />,
    subMenu: [ ],
  },
  {
    parent: 10,
    title: "Motor Calculation",
    path: "/motorCalculation",
    icon: <MopedIcon />,
    subMenu: [],
  }
];

//PT Staff Menu
const PTStaffMenu = [
  {
    parent: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    parent: 3,
    title: "Policy",
    path: "/policy",
    icon: <AccountBoxIcon />,
    subMenu: [],
  
  },
  {
    parent: 10,
    title: "CC Entry",
    path: "/ccentry",
    icon: <MopedIcon />,
    subMenu: [],
  }
];
export  {AdminMenu,BranchManagerMenu,OperatorMenu,UserMenu , PTStaffMenu};
