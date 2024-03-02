import React from "react";
import { Grid, Typography, Button, Divider } from "@mui/material"
import KeyboardBackspaceTwoToneIcon from '@mui/icons-material/KeyboardBackspaceTwoTone';
import './MotorCalculation.scss'
import { DownloadIcon } from "../../Resources/Icons/icons";
import { ToastError } from "../../UiComponents/Toaster/Toast";


const Calculations = (props) => {

    const { setOpen, title, resultValue } = props;

    const SectionA = [
        {
            label: "IDV",
            values: [resultValue?.iDV],
            display: 'flex',
        },
        {
            label: "Year of Manufacture",
            values: [resultValue?.yearOfManufacture],
            display: 'flex',
        },
        {
            label: "Vechicle Basic Rate",
            values: [resultValue?.vehiclebaseRate, resultValue?.vehiclebaseRateValue],
            display: (resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9) ? "flex" : "none",
        },
        {
            label: "LPG KIT",
            values: [resultValue?.lPGKit_A?.toFixed(2) || '-'],
            display: 'flex',
        },
        {
            label: "Seating Capacity",
            values: [resultValue?.seatingCapacityAmount, resultValue?.seatingCapacityvalue],
            display: resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 10 ? 'flex' : 'none',
        },
        {
            label: "Additional GVW",
            values: [resultValue?.additionalGVW || 0],
            display: resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9 || resultValue?.formId === 10 ? 'flex' : 'none',
        },
        {
            label: "IMT 23",
            values: [resultValue?.imt23, resultValue?.imt23Value || 0],
            display: resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9 || resultValue?.formId === 10 ? 'flex' : 'none',
        },
        {
            label: "OD Premium",
            values: [resultValue?.OdPremium || 0],
            display: 'flex',
        },
        {
            label: "Discount on OD Premium",
            values: [resultValue?.discountonODPremium, resultValue?.discountonODPremiumValue || 0],
            display: 'flex',
        },
        {
            label: "Basic Od Premium After Discount",
            values: [resultValue?.basicODPremiumAfterDiscount || 0],
            display: 'flex',
        },
        {
            label: "Accessories Value",
            values: [resultValue?.accessories, resultValue?.accessoriesValue || 0],
            display: 'flex',
        },
        {
            label: "Total Basic Premium",
            values: [resultValue?.totalBasicPremium || 0],
            display: 'flex',
        },
        {
            label: "No Claim Bonus",
            values: [resultValue?.noClaimBonus, resultValue?.noClaimBonusValue || 0],
            display: 'flex',
        },
        {
            label: "Net Own Damage Premium",
            values: [resultValue?.netOwnDamage || 0],
            display: 'flex',
        },
        {
            label: "Zero Dep Premium",
            values: [resultValue?.zeroDepPremium, resultValue?.zeroDepPremiumValue || 0],
            display: 'flex',
        },
        {
            label: "Total A [Od Premium]",
            values: [resultValue?.totalAodPremium?.toFixed(2) || 0],
            display: 'flex',
        }]


    const SectionB = [
        {
            label: "CC",
            values: [resultValue?.cc || '-'],
            display: (resultValue?.formId === !6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9 || resultValue?.formId === 10 ? 'flex' : 'none'),
        },
        {
            label: "Zone",
            values: [resultValue?.zone || '-'],
            display: 'flex',
        },
        {
            label: "Liapility Premium(TP)",
            values: [resultValue?.LP || 0],
            display: 'flex',
        },
        {
            label: "LPG KIT",
            values: [resultValue?.lPGKit_B || '-'],
            display: 'flex',
        },
        {
            label: "LL to Passengers",
            values: [resultValue?.llToPassengers || '-'],
            display: resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9 || resultValue?.formId === 10 ? 'flex' : 'none',
        },
        {
            label: "PA to Owner Driver",
            values: [resultValue?.pAOwnerDriver || 0],
            display: 'flex',
        },
        {
            label: "PA to Unnamed Passenger",
            values: [resultValue?.pAUnnamedPassenger || 0],
            display: !(resultValue?.formId === 6),
        },
        {
            label: "TPPD Restrict",
            values: [resultValue?.tppd || 0],
            display: (resultValue?.formId === !6 || resultValue?.formId === 8 || resultValue?.formId === 9) ? 'flex' : 'none',
        },
        {
            label: "LL to Paid Driver",
            values: [resultValue?.lLtoPaidDriver || 0],
            display: 'flex',
        },
        {
            label: "Coolies / Cleaner",
            values: [resultValue?.CooliesAndCleaner || 0],
            display: resultValue?.formId === 6 || resultValue?.formId === 7 || resultValue?.formId === 8 || resultValue?.formId === 9 || resultValue?.formId === 10 ? 'flex' : 'none',
        },
        {
            label: "Total B [Od Premium]",
            values: [resultValue?.totalBodPremium || 0],
            display: 'flex',
        },
    ];

    const ContainerStyle = {
        padding: '20px',
        display: 'flex',
        gap: 4,
        flexDirection: { sm: 'row', xs: 'column' },
        background: '#FAFAFA',
        boxShadow: '0 5px 14px 9px rgba(0, 0, 0, 0.06)',
        margin: '20px 10px 10px 10px'
    }

    const BoxStyle = {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: 1.4,
        backgroundColor: '#F3F3F3',
        padding: '14px',
        borderRadius: '20px',
        padding: '24px 20px 24px 20px'

    }

    const handleDownload = async (e) => {
        const fileUrl = e;
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'downloaded_file.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          ToastError('Error downloading file');
        }}


    return (
        <div className="MainRenderinContainer" style={{ overflow: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
            <Grid container className="Master_Header_Container" mt={2} sx={{ padding: '0 20px 0 36px' }}>
                <Grid item xs={12} sm={9.5}>
                    <Typography className="Master_Header_Heading">MotorCalculation {title}</Typography>
                </Grid>
                <Grid item xs={12} sm={1.5} className="d-flex justify-content-end">
                    <Button
                        className="Master_Header_create_Button w-100"
                        endIcon={<DownloadIcon />}
                        sx={{ width: { xs: "100%", sm: "fit-content", marginRight: '10px' } }}
                        onClick={()=>handleDownload(resultValue?.quotePath)}
                    >
                        Download PDF
                    </Button>
                </Grid>
                <Grid item xs={12} sm={1} className="d-flex justify-content-end">
                    <Button className="Common_Button w-100" onClick={() => setOpen(false)} sx={{ padding: '0 40px' }} endIcon={<KeyboardBackspaceTwoToneIcon />}>Back</Button>
                </Grid>
            </Grid>
            <div style={{ padding: '0 8px 0 26px' }}>
                <Grid item sm={12} xs={12} className="Count_Page" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} mt={2} gap={1}>
                    <Grid className="Count_1" sx={{ width: '100%' }}>
                        <Typography className="Total">{resultValue?.netPremiumAB}</Typography>
                        <Typography className="Title">Net Premium [A + B] </Typography>
                    </Grid>
                    <Grid className="Count_2" sx={{ width: '100%' }}>
                        <Typography className="Total">{resultValue?.tax} </Typography>
                        <Typography className="Title">Gst@18%</Typography>
                    </Grid>
                    <Grid className="Count_2" sx={{ width: '100%' }}>
                        <Typography className="Total">{resultValue?.finalPremium} </Typography>
                        <Typography className="Title">Final Premium</Typography>
                    </Grid>
                </Grid>
                <Grid sx={ContainerStyle} >
                    <Grid sx={BoxStyle}>
                        {
                            SectionA.map((e, index) => (<>
                                <Grid className="Calculations_Box" sx={{ display: e.display }} key={index}>
                                    <Typography className="Box_Label">{e?.label}</Typography>
                                    {e.values.length > 1 ?
                                        <>
                                            <Typography className="Box_Value" sx={{ display: e.values[0] ? 'block' : 'none' }}>{e.values[0]}</Typography>
                                            <Typography className="Box_Value" sx={{ display: e.values[1] ? 'block' : 'none' }}>{e.values[1]}</Typography>
                                        </>
                                        :
                                        <Typography className="Box_Value" sx={{ display: e.values[0] ? 'block' : 'none' }}>{e.values[0]}</Typography>
                                    }
                                </Grid >
                                <Divider sx={{ display: e.display }}  />
                            </>
                            ))
                        }
                    </Grid>
                    <Grid sx={BoxStyle}>
                        {
                            SectionB.map((e, index) => (<>
                                <Grid className="Calculations_Box" sx={{ display: e.display }} key={index}>
                                    <Typography className="Box_Label">{e?.label}</Typography>
                                    {e.values.length > 1 ?
                                        <>
                                            <Typography className="Box_Value">{e.values[0]}</Typography>
                                            <Typography className="Box_Value">{e.values[1]}</Typography>
                                        </>
                                        :
                                        <Typography className="Box_Value">{e.values[0]}</Typography>
                                    }
                                </Grid>
                                <Divider sx={{ display: e.display }} />
                            </>
                            ))
                        }
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Calculations;