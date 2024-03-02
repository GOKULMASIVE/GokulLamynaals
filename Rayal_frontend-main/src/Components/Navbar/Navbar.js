import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { AdminMenu, BranchManagerMenu, OperatorMenu, UserMenu, PTStaffMenu } from "./Menu";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Drawer from "@mui/material/Drawer";
import Profile from "../Profile/Profile";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ToastContainer, toast } from "react-toastify";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Notification from "../Notification/Notification";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Logo from '../../Resources/Images/Logo.png'
import LogoText from '../../Resources/Images/Logo-Text.png'
import { KeyboardArrowDownIcon, AddIcon, KeyboardArrowUpIcon } from '../../Resources/Icons/icons'
import ConfirmBox from '../../UiComponents/ConfirmBox/ConfirmBox';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { getLabelForValue } from '../../Shared/CommonConstant'

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  let location = useLocation();
  const [dropDown, setDropDown] = useState();
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCalendar, setOpenCalandar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [subNavDropDown, setSubNavDropDown] = useState();
  const [openSubNavDropDown, setOpenSubNavDropDown] = useState(false);
  const [UserName, setUserName] = React.useState('');
  const [Email, setEmail] = React.useState('');
  const [openConfirmBox, setOpenConfirmBox] = React.useState(false)


  const Active = (menu) => {

  };




  const [contextMenu, setContextMenu] = useState(null);
  const [path, setPath] = useState(null)

  const subDropDown = (e) => {
    setPath(e.path)
    setSubNavDropDown(e);
    setOpenSubNavDropDown(true);
  };

  const Routing = (item) => {
    if (location.pathname === item.path) {
      window.location.reload(false);
    }
    else {
      navigate(item.path);
      setMobileOpen(false);
      setOpenDropdown(false);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const navigateSubNav = (e) => {
    if (location.pathname === e) {
      window.location.reload(false);
    }
    else {
      navigate(e);
      setOpenSubNavDropDown(false);
      setOpenDropdown(false);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const handleOpenUserMenu = (menu) => {
    setDropDown(menu);
    setOpenDropdown(true);
    setOpenSubNavDropDown(false)
  };
  const MobileOpenUserMenu = (menu) => {
    setDropDown(menu);
  };



  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={
        <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "red" }} />
      }
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(0deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));


  const [contextOn, setContextOn] = useState(false)
  const menuRef = React.useRef(null);
  const handleContextMenu = (event, menu) => {
    event.preventDefault();
    setContextMenu({
      left: event.clientX,
      top: event.clientY,
    });
    setOpenDropdown(true)
    setContextOn(true)
  };

  const handleSubContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      left: event.clientX,
      top: event.clientY,
    });
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setOpenDropdown(false)
    setContextOn(false)
  };

  const HandleOpenNewLink = () => {
    window.open(`${path}`, '_blank');
    handleCloseContextMenu();
  };

  const HandleSaveThePage = (e) => {
    const saveEvent = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
  }

  const handleMouseLeave = (e) => {
    if (contextOn) {
      setOpenDropdown(true)
    } else {
      setOpenDropdown(false)
    }
  };

  useEffect(() => {
 
    const GetUserName = localStorage.getItem("name")
    const GetEmail = localStorage.getItem("email")
    if (GetUserName) {
      setUserName(GetUserName);
    }
    if (GetEmail) {
      setEmail(GetEmail);
    }
  }, [])

  const LogoutFunction = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("UserId");
    localStorage.removeItem("clientID");
    localStorage.removeItem("userType");
    navigate("/");
  }
  const UserType = localStorage.getItem('userType')
  let Menus;
  if (UserType === 'CLIENT') {
    Menus = AdminMenu;
  }
  else if (UserType === "branchManager") {
    Menus = BranchManagerMenu;
  }
  else if (UserType === "operator") {
    Menus = OperatorMenu
  }
  else if (UserType === "accountant") {
    Menus = AdminMenu
  }
  else if (UserType === "user") {
    Menus = UserMenu
  }
  else if (UserType === "ptstaff") {
    Menus = PTStaffMenu
  } else {
    Menus = []
  }


  return (
    <>
      <div
        className="MainPage"
        onClick={handleCloseContextMenu}
      >
        <AppBar component="nav" className="MainAppBar" >
          <Toolbar className="Top_Navbar_First" >
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <img src={Logo} alt="logo" style={{ height: '34px', width: '30px' }} />
              <img src={LogoText} alt="logo" style={{ height: '33px', width: '184px' }} />
            </Box>
            <Box >
              <div className="NavEndingOptions">
                <>
                  <Tooltip title="Settings" sx={{ cursor: "pointer", color: '#C4C3C7' }}>
                    <SettingsIcon className="settingsIcon" />
                  </Tooltip>
                </>
                <>
                  <Tooltip title="Notification" sx={{ cursor: "pointer", color: '#C4C3C7', fontSize: '26px' }}>
                    <NotificationsActiveIcon
                    />
                  </Tooltip>
                </>
                <><Typography sx={{ color: '#393939', fontFamily: 'Poppins' }}>{UserName} {openProfile ? <KeyboardArrowUpIcon onClick={() => setOpenProfile(false)} sx={{ cursor: 'pointer' }} /> : <KeyboardArrowDownIcon onClick={() => setOpenProfile(true)} sx={{ cursor: 'pointer' }} />}
                  <Menu
                    sx={{ mt: "42px" }}
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={openProfile}
                    onClose={() => setOpenProfile(false)}
                  >
                    <Box sx={{ width: '280px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '10px' }} >
                      <Typography>User Name : {UserName}</Typography>
                      <Typography>Email : {Email}</Typography>
                      <Typography>Role : {UserType === "CLIENT" ? "Client" : getLabelForValue(UserType)}</Typography>
                      <Button className="Common_Button w-100" onClick={() => setOpenConfirmBox(true)}>Logout</Button>
                    </Box>
                  </Menu>
                </Typography>
                </>
                <>
                  <Tooltip title="Profile">
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => setOpenProfile(true)}
                    >
                      <Avatar
                        alt={UserName}
                        sx={{ borderRadius: "10px" }}
                        src="React Js"
                      />
                    </IconButton>
                  </Tooltip>
                </>
              </div>
            </Box>
          </Toolbar>
          <Toolbar className="Top_Navbar_Second">
            <Box
              sx={{
                width: '100%',
                display: { xs: "none", md: "flex", xl: "flex" },
                justifyContent: 'space-between',
                pointerEvents: contextMenu ? 'none' : 'auto',
              }}
            >
              {Menus.map((menu, i) => {
                const uniqueId = "Header" + i
                if (menu.subMenu && menu.subMenu.length) {
                  return (
                    <React.Fragment key={uniqueId} >
                      <button
                        onMouseEnter={() => handleOpenUserMenu(menu)}
                        onMouseLeave={(e) => handleMouseLeave(e)}
                        onContextMenu={(e) => handleContextMenu(e, menu)}
                        className={
                          "NavHeading " + (Active(menu) ? "Active" : "")
                        }
                        style={{ position: "relative" }}
                      >

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ paddingTop: '4px' }}>{menu.icon}</div>
                          <div style={{ paddingTop: '6px' }}>{menu.title}</div>
                        </div>
                        {openDropdown ? (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "58px",
                            }}
                            className="NavbarDropDown"
                          >
                            {dropDown?.subMenu?.map((subMenu, i) => {
                              const secondSunNavId = "secondSubNav" + i
                              if (menu.parent === subMenu.child) {
                                return (
                                  <React.Fragment key={secondSunNavId}>
                                    <div className="ThirdHeaderMenu">
                                      <h1
                                        onClick={() => Routing(subMenu)}
                                        onMouseEnter={() =>
                                          subDropDown(subMenu)
                                        }
                                      >
                                        <div>{subMenu.title}</div>
                                        <div style={{ paddingRight: '10px' }}>{subMenu.path === '/#' ? <AddIcon sx={{ fontSize: '20px' }} /> : null}</div>
                                      </h1>
                                      <div className="ThirdHeaderSubMenu">
                                        {openSubNavDropDown ? (
                                          <>
                                            {subMenu?.subMenu?.map((e, i) => {
                                              const thirdSubNavId = "thirdSubNav" + i
                                              if (
                                                e.subChild ===
                                                subNavDropDown?.subOrder
                                              ) {
                                                return (
                                                  <h1
                                                    key={thirdSubNavId}
                                                    onClick={() =>
                                                      navigateSubNav(e.path)
                                                    }
                                                    onMouseEnter={() => setPath(e.path)}
                                                  >
                                                    {e.title}
                                                  </h1>
                                                );
                                              } else return null;
                                            })}
                                          </>
                                        ) : null}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              }
                            })}
                          </div>
                        ) : null}
                      </button>
                    </React.Fragment>
                  );
                }
                else {
                  return (
                    <button
                      onClick={() => Routing(menu)}
                      onMouseEnter={() => setPath(menu.path)}
                      onContextMenu={(e) => handleSubContextMenu(e, menu)}
                      className={
                        "NavHeading " + (Active(menu) ? "Active" : "")
                      }
                      key={uniqueId}
                    > <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ paddingTop: '4px' }}>{menu.icon}</div>
                        <div style={{ paddingTop: '6px' }}>{menu.title}</div>
                      </div>
                    </button>
                  );
                }
              })}
            </Box>



          </Toolbar>
        </AppBar >

        <div className="renderingContainer">{children}</div>
      </div >
      {/* profile Page Drawer */}
      {
        setOpenProfileDrawer ? (
          <Drawer
            open={openProfileDrawer}
            onClose={() => setOpenProfileDrawer(false)}
            PaperProps={{
              sx: { width: { md: "26%", xs: "100%" } },
            }}
            anchor="right"
          >
            <Profile setOpenProfileDrawer={setOpenProfileDrawer} />
          </Drawer>
        ) : null
      }
      {contextMenu && (
        <div
          className="Inspect_Box"
          style={{
            position: 'fixed',
            left: contextMenu.left,
            top: contextMenu.top,
            zIndex: 100000,
            color: 'black',
          }}
        >
          <ul>
            <li>
              <div onClick={HandleOpenNewLink}>Open Link in New tap</div>
            </li>
            <li>
              <div onClick={HandleOpenNewLink}>Open Link in New Window</div>
            </li>
            <li>
              <div onClick={HandleOpenNewLink}>Open Link in Incognito mode</div>
            </li>
            <li>
              <div onClick={(e) => HandleSaveThePage(e)}>Save Link as</div>
            </li><hr />
            <li>
              <div onClick={HandleOpenNewLink}>Copy Link address</div>
            </li>
            <li>
              <div onClick={HandleOpenNewLink}>Open in reading Mode</div>
            </li>
            <li>
              <div onClick={HandleOpenNewLink}>Inspect</div>
            </li>
          </ul>
        </div>
      )}
      <ToastContainer position="top-right" limit={5} />
      {
        openConfirmBox ?
          <ConfirmBox
            open={openConfirmBox}
            title={"Logout"}
            content={"Are you sure Want to Logout !"}
            confirmButton={"Logout"}
            setOpenConfirmBox={setOpenConfirmBox}
            Function={LogoutFunction}
            icon={<LogoutIcon />}
          /> : null
      }
    </>


  );
};

export default Navbar;
//   ....   Lamynaals Technologies ....     //



{/* <Box
// component="nav"
sx={{
  flexGrow: 1,
  display: { xs: "block", sm: "none", xl: "none" },
}}
>
<MenuIcon onClick={() => setMobileOpen(!mobileOpen)} />
<Drawer
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
  zIndex={1200}
  PaperProps={{
    sx: { width: "100%" },
  }}
>
  <Typography
    className="d-flex justify-content-center"
    sx={{
      color: "#313949",
      fontWeight: 600,
      fontSize: "28px",
    }}
  >
    Rayal Brokers Insurance
  </Typography>
  <Box className="MobileResponsiveBox">
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#313949",
        color: "white",
      }}
    >
      <AccordionSummary expandIcon={false}>
        <Typography sx={{ width: "100%" }} textAlign={"center"}>
          CRM
        </Typography>
      </AccordionSummary>
    </Accordion>
    {Menus.map((menu, i) => {
      const uniqueId = "Header" + i
      if (menu.subMenu && menu.subMenu.length) {
        return (
          <React.Fragment key={uniqueId}>
            <Accordion
              sx={{ width: "100%" }}
              onClick={() => MobileOpenUserMenu(menu)}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                expandIcon={menu.icon}

              >
                <Box
                  className="d-flex justify-content-between"
                  sx={{ width: "100%" }}
                >
                  <Typography
                    sx={{ marginLeft: "10px" }}
                  >
                    {menu.title}
                  </Typography>
                  <AddIcon />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                {dropDown?.subMenu?.map((subMenu) => {
                  const secondSunNavId = "secondSubNav" + i
                  return <AccordionSummary
                    expandIcon={subMenu.icon}
                    onClick={() => Routing(subMenu)}
                    key={secondSunNavId}
                  >
                    <Typography
                      sx={{ marginLeft: "10px" }}
                    >
                      {subMenu.title}
                    </Typography>
                  </AccordionSummary>
                })}
              </AccordionDetails>
            </Accordion>
          </React.Fragment>
        );
      } else {
        return (
          <Accordion
            sx={{ width: "100%" }}
            onClick={() => Routing(menu)}
            key={uniqueId}
          >
            <AccordionSummary expandIcon={menu.icon}>
              <Typography sx={{ marginLeft: "10px" }}>
                {menu.title}
              </Typography>
            </AccordionSummary>
          </Accordion>
        );
      }
    })}
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#313949",
        color: "white",
      }}
    >
      <AccordionSummary expandIcon={false}>
        <Typography
          sx={{ width: "100%" }}
          textAlign={"center"}
          onClick={() => navigate("/login")}
        >
          Log out
        </Typography>
      </AccordionSummary>
    </Accordion>
  </Box>
</Drawer>
</Box> */}