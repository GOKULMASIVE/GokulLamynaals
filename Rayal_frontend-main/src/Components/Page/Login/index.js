
import * as React from "react";
import { Grid } from "@mui/material";
import login from "../../Login/Login";
import { useLocation } from "react-router-dom";

const elements = {
    "/login": login
};

export default function Login() {
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
        if (currentEl) window.history.replaceState(null, currentEl.split('/')[1], currentEl);
    }, [currentEl]);

    React.useEffect(() => { }, [currentEl]);

    const Element = elements[currentEl] && elements[currentEl];

    return (
        <div
        // setcurrentmenu={setCurrentEl}
        >
            <Grid container p={{ xs: 0, md: 0 }}>
                <Grid item xs={12}>
                    {Element && <Element />}
                </Grid>
            </Grid>
        </div>
    );
}