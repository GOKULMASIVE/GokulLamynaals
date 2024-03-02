import React from 'react'
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ConfirmBox from '../../UiComponents/ConfirmBox/ConfirmBox';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


const Profile = (props) => {
    const { setOpenProfileDrawer } = props;
    const [value, setValue] = React.useState(0);
    const [openConfirmBox, setOpenConfirmBox] = React.useState(false)
    const navigate = useNavigate()
    const [UserName, setUserName] = React.useState('');
    const [Email, setEmail] = React.useState('');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    React.useEffect(() => {
        const UserName = localStorage.getItem("name")
        const Email = localStorage.getItem("email")
        if (UserName) {
            setUserName(UserName);
          }
          if (Email) {
            setEmail(Email);
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

    return <div>
        <Typography className='d-flex justify-content-end' sx={{ backgroundColor: "#313949", color: "white", padding: "10px 10px 0 0", cursor: "pointer" }}>
            <CloseIcon
                onClick={() => setOpenProfileDrawer(false)}
            /></Typography>
        <div className='d-flex justify-content-center' style={{ backgroundColor: "#313949", padding: "10px" }}>
            <div className='d-flex flex-column align-items-center'>
                <Avatar
                    sx={{ width: "100px", height: "100px", marginBottom: "20px" }}
                    icon={<AccountCircleIcon />}
                />
                <Typography sx={{ color: "white" }}>{UserName}</Typography>
                <Typography sx={{ color: "white" }}>Email : {Email}</Typography>
            </div>
        </div>
        <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                        sx={{
                            backgroundColor: "#313949",
                            borderTop: "1px solid white"
                        }}
                        indicatorColor={false}
                        textColor="inherit"
                    >
                        <Tab label="Profile" sx={{ width: "50%", color: "white", borderRight: "1px solid white" }} />
                        <Tab label="Logout" sx={{ width: "50%", color: "white" }} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    Profile Page Not to ready yet
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className='d-flex justify-content-center align-items-center flex-column'>
                        <ExitToAppIcon sx={{ fontSize: "80px", opacity: 0.4 }} />
                        <Typography>Oh no! You are Leaving...</Typography>
                        <Typography>Are you Sure ?</Typography>
                        <Button variant="contained" sx={{ marginTop: "10px", width: "80%" }} onClick={() => setOpenProfileDrawer(false)}>No</Button>
                        <Button variant="outlined" sx={{ marginTop: "10px", width: "80%" }} onClick={() => setOpenConfirmBox(true)}>Yes Log me Out</Button>
                    </div>

                    <div style={{ position: "absolute", bottom: 0, marginBottom: "10px" }}>
                        <Typography>Copyright 2023 - All rights reserved - LTS</Typography>
                    </div>
                </TabPanel>

            </Box>
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
        </div>


    </div>
}

export default Profile;