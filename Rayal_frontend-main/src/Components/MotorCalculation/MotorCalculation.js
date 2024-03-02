import { useState, useRef } from 'react';
import './MotorCalculation.scss'
import { Box, Grid, Typography, Autocomplete, TextField, Button, Drawer } from '@mui/material';
import TwoWheeler from './Resources/TwoWheeler.png'
import NewTwoWheeler from './Resources/NewTwoWheeler.png'
import PrivateCar from './Resources/PrivateCar.png'
import NewPrivateCar from './Resources/NewPrivateCar.png'
import TaxiUpto6Passengers from './Resources/TaxiUpto6Passengers.png'
import BusMoreThan6Passengers from './Resources/BusMoreThan6Passengers.png'
import SchoolBus from './Resources/SchoolBus.png'
import ThreeWheelerPCV from './Resources/ThreeWheelerPCV.png'
import GoodsCarring3Wheeler from './Resources/GoodsCarring3Wheeler.png'
import GoodsCarringMoreThan3wheeler from './Resources/GoodsCarringMoreThan3wheeler.png'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { Formik, Form, Field } from "formik";
import FloatLabel from '../../UiComponents/FloatLabel/FloatLabel';
import Calculations from './Calculations';
import { GetVehicleDetails, PostVehicleDetails } from '../../Service/_index'
import { ToastError } from '../../UiComponents/Toaster/Toast';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';

const Elements = [
    {
        url: TwoWheeler,
        title: 'Two Wheeler Premium',
        id: 1
    },
    {
        url: NewTwoWheeler,
        title: 'New Two Wheeler Vechicle',
        id: 2
    },
    {
        url: PrivateCar,
        title: 'Private Car',
        id: 3
    },
    {
        url: NewPrivateCar,
        title: 'New Private Car',
        id: 4
    },
    {
        url: TaxiUpto6Passengers,
        title: 'Taxi (upto 6 Passengers)',
        id: 5
    },
    {
        url: BusMoreThan6Passengers,
        title: 'Bus (More than 6 Passengers)',
        id: 6
    },
    {
        url: SchoolBus,
        title: 'School Bus',
        id: 7
    },
    {
        url: ThreeWheelerPCV,
        title: 'Three Wheeler PCV',
        id: 8
    },
    {
        url: GoodsCarring3Wheeler,
        title: 'Goods Carrying Vehicle (3 Wheeler)',
        id: 9
    },
    {
        url: GoodsCarringMoreThan3wheeler,
        title: 'Goods Carrying Vehicle (More than 3 Wheeler)',
        id: 10
    }
]


const initialValues = {
    "policyType": "",
    "IDV": "",
    "yearOfManufacture": "",
    "zone": "",
    "cc": "",
    "discOnOD": "",
    "accessoriesValue": "",
    "noclaimBonus": "",
    "zerodeprecation": "",
    "PAownerDriver": "",
    "PAunnamedPass": "",
    "TPPDRestrict": "",
    "seatingCapacity": "",
    "LLtoPaidDriver": "",
    "premiumYear": "",
    "imt23": true,
    "cooliesOrCleaner": "",
    "GVW": "",
    "quoteId": ""
}

const MotorCalculation = () => {
    let formRef = useRef();
    const [selected, setSelected] = useState(0)
    const [selectedBox, setSelectedBox] = useState(null)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [bundles, setBundels] = useState([])
    const [open, setOpen] = useState(false)
    const [resultValue, setResultValue] = useState({})
    const tLength = Elements.length

    const HandleSelectVehicle = (elements) => {
        setSelectedVehicle(elements)
        console.log(elements)
        GetVehicleDetails(elements.id).then((res) => {
            setBundels(res.data)
        })
    }

    const getItemKey = (data) => {
        return data.charAt(0).toLowerCase() + data.slice(1);
    }

    const LoginUserId = localStorage.getItem('UserId')
    const onSubmit = (values) => {
        const data = {
            ...values,
            formId: selectedVehicle.id,
            quoteId: String(LoginUserId),
             isWebUser:true
        }
        PostVehicleDetails(data).then((res) => {
            if (res) {
                setResultValue(res.data)
                setOpen(true)
            }
            else{
                ToastError('Network Connection Error !')
            }
    
        })
    }


    return (
        <div className="PageContainer" >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container className="Master_Header_Container" spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography className="Master_Header_Heading">Motor Calculation</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} >
                <Grid item xs={12} sm={3} sx={{ height: '220px' }} onClick={() => {
                    HandleSelectVehicle(Elements[selected])
                    setSelectedBox(1)
                }}>
                    <Box className={`Vehicle-Box ${selectedBox === 1 ? 'SelectedBox' : ''}`} >
                        <img src={Elements[selected]?.url} alt={Elements[selected]?.title} />
                        <Typography className='Vehicle-title'>{Elements[selected]?.title}</Typography>
                    </Box>

                </Grid>
                <Grid item xs={12} sm={3} sx={{ height: '220px' }} onClick={() => {
                    HandleSelectVehicle(Elements[(selected + 1) % tLength])
                    setSelectedBox(2)
                }}>
                    <Box className={`Vehicle-Box ${selectedBox === 2 ? 'SelectedBox' : ''}`}>
                        <img src={Elements[(selected + 1) % tLength]?.url} alt={Elements[(selected + 1) % tLength]?.title} />
                        <Typography className='Vehicle-title'>{Elements[(selected + 1) % tLength]?.title}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ height: '220px' }} onClick={() => {
                    HandleSelectVehicle(Elements[(selected + 2) % tLength])
                    setSelectedBox(3)
                }}>
                    <Box className={`Vehicle-Box ${selectedBox === 3 ? 'SelectedBox' : ''}`} >
                        <img src={Elements[(selected + 2) % tLength]?.url} alt={Elements[(selected + 2) % tLength]?.title} />
                        <Typography className='Vehicle-title'>{Elements[(selected + 2) % tLength]?.title}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ height: '220px' }} onClick={() => {
                    HandleSelectVehicle(Elements[(selected + 3) % tLength])
                    setSelectedBox(4)
                }}>
                    <Box className={`Vehicle-Box ${selectedBox === 4 ? 'SelectedBox' : ''}`}>
                        <img src={Elements[(selected + 3) % tLength]?.url} alt={Elements[(selected + 3) % tLength]?.title} />
                        <Typography className='Vehicle-title'>{Elements[(selected + 3) % tLength]?.title}</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: '#b8bcc1' }} >
                <ArrowCircleLeftOutlinedIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        setSelected((prev) => (prev - 1 + tLength) % tLength)
                        setSelectedBox(null)
                        setSelectedVehicle(null)
                        setBundels([])
                        formRef.resetForm()
                    }} />
                <ArrowCircleRightOutlinedIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        setSelected((prev) => (prev + 1) % tLength);
                        setSelectedBox(null)
                        setSelectedVehicle(null)
                        setBundels([])
                        formRef.resetForm()
                    }} />
            </Grid>
            <Typography mt={2} mb={2}
                sx={{ textAlign: selectedVehicle?.title ? 'start' : 'center' }}
            >
                {selectedVehicle?.title ? selectedVehicle?.title : 'Select the Vechicle'}
            </Typography>
            <Box sx={{ display: selectedVehicle ? 'block' : 'none' }} >
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => onSubmit(values)}
                    innerRef={(ref) => {
                        if (ref) {
                            formRef = ref
                        }
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
                                {
                                    bundles ? (
                                        bundles.map((item, index) => {
                                            if (getItemKey(item.placeholder.trim().replaceAll(' ', '')) !== 'policyType' && !item.isTP && values.policyType == 'TP') {
                                                return null;
                                            }

                                            return <Grid item xs={12} sm={3} key={index}>
                                                <FloatLabel label={item.placeholder} value={values[getItemKey(item.placeholder.trim().replaceAll(' ', ''))]}>
                                                    {item.elementType === 'input' ? (
                                                        <Field name={getItemKey(item.placeholder.trim().replaceAll(' ', ''))} className="InputFiled" />
                                                    ) : (
                                                        <Autocomplete
                                                            name={getItemKey(item.placeholder.trim().replaceAll(' ', ''))}
                                                            className="AutoComplete_InputBox w-100"
                                                            options={item.values}
                                                            onChange={(option, value) => setFieldValue(getItemKey(item.placeholder.trim().replaceAll(' ', '')), value?.id)}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    )}
                                                </FloatLabel>
                                            </Grid>
                                        })
                                    ) : (
                                        <p style={{ textAlign: 'center', width: '100%', padding: '40px' }}>Loading the data ...</p>
                                    )
                                }
                                <Grid item xs={12} sm={3} sx={{ display: bundles ? 'block' : 'none' }}>
                                    <Button className='Common_Button w-100' type='submit'>
                                        Calculate
                                    </Button>
                                </Grid>
                            </Grid>

                        </Form>
                    )}
                </Formik>
            </Box>
            <Drawer
                open={open}
                sx={{ zIndex: 100 }}
                anchor="right"
                PaperProps={{ sx: { width: '100%' } }}
            >
                {open ? (
                    <Calculations
                        setOpen={setOpen}
                        title={` -> ${selectedVehicle.title}`}
                        resultValue={resultValue}
                    />
                ) : null}
            </Drawer>
        </div>
    )
};

export default MotorCalculation;


















{/* <Grid container spacing={2} >
{
    Elements.map((el, index) => (
        <Grid item xs={12} sm={3} key={index} sx={{ height: '220px' }}>
            <Box className='Vehicle-Box' onClick={() => console.log(el.title)}>
                <img src={el.url} alt={el.title} />
                <Typography className='Vehicle-title'>{el.title}</Typography>
            </Box>
        </Grid>
    ))
}
</Grid> */}