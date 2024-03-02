import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import './ConfirmBox.scss'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const ConfirmBox = (props) => {
    const { open, title, content, confirmButton, setOpenConfirmBox, Function, icon, color, mode, setDisabledDate , disabledDate} = props;
    
    return <>
        <Dialog
            open={open}
            // onClose={() => setOpenConfirmBox(false)}
            maxWidth="sm"  
            fullWidth 

            className="DialogBox"
        >
            <Box
                className="d-flex align-items-center"
            >
                <Box >
                    <ErrorOutlineIcon sx={{ fontSize: "80px", color: "#f62447", padding: "10px" }} />
                </Box>
                <Box sx={{ width: "100%" }}>
                    <Box className='d-flex justify-content-between'>
                        <DialogTitle >
                            {title}
                        </DialogTitle>
                        <CloseIcon
                            onClick={() => {
                                setOpenConfirmBox(false)
                            }}
                            sx={{ margin: "10px", color: "gray", cursor: 'pointer' }} />
                    </Box>
                    <DialogContent
                        sx={{ padding: '0 0 10px 24px' }}
                    >
                        <DialogContentText>
                            {content}
                        </DialogContentText>
                    </DialogContent>
                    <Box sx={{ display: mode ? 'block' : 'none', padding: '0 0 10px 24px' }} mb={2} className="w-75">
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker className="Date_Picker w-100" onChange={(e) => setDisabledDate(e.$d)} format="DD/MM/YYYY" disablePast/>
                        </LocalizationProvider>
                    </Box >
                </Box>

            </Box>

            <Divider sx={{ backgroundColor: "Gray", height: "1px" }} />
            <DialogActions>
                <Button variant="contained" color="error" onClick={() => setOpenConfirmBox(false)}>Cancel</Button>
                <Button onClick={Function} color={color} variant="contained" endIcon={icon} disabled={disabledDate === 'React-disable' ? true : false}>
                    {confirmButton}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}

export default ConfirmBox;