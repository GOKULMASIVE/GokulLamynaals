import React from "react";
import './Loader.scss'
import Box from "@mui/material/Box";
import Backdrop from '@mui/material/Backdrop';
const Loader = (props) => {
    const { open } = props

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <div className="loader">
                <div className="loader-text">
                    Loading
                </div>
                <div className="spinner-box">
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <div className="spinner-grow text-danger" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <div className="spinner-grow text-warning" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                </div>
        </Backdrop>
    )
}

export default Loader;