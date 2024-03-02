import React, { useState } from "react";
import Logo from '../../Resources/Images/logo1.png'
import { Formik, Form, Field, ErrorMessage } from "formik";
import OTPInput, { ResendOTP } from "otp-input-react";
import * as Yup from "yup";
import { LocalPhoneIcon } from '../../Resources/Icons/icons'
import { Typography } from "@mui/material";
const ForgotPassword = () => {
    const [otpValue, setOtpValue] = useState([])
    const [submitOtp, setSumbitOtp] = useState(false)

    const ForgotPasswordSchema = Yup.object().shape({
        forgotMobileNumber: Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .required('Required'),
    });

    const GetOtp = () => {
        setSumbitOtp(true)
    }
    return <>
        <div>
            <Formik
                const initialValues={{
                    forgotMobileNumber: "",
                }}
                validationSchema={ForgotPasswordSchema}
            >
                {({ errors, touched }) => (
                    <Form>

                        <>
                            <div className="d-flex justify-content-center mb-4">
                                <img src={Logo} alt="logo" />
                            </div>

                            <div className="row">
                                {submitOtp ? null : <> <span className="InputTitle">Mobile Number</span>
                                    <div className="d-flex col-12  mb-3">
                                        <div className="icon">
                                            <LocalPhoneIcon />
                                        </div>
                                        <Field name="forgotMobileNumber" className="w-100 form-control" placeholder="Mobile Number"

                                        />
                                        {errors.forgotMobileNumber && touched.forgotMobileNumber ? (
                                            <div>{errors.forgotMobileNumber}</div>
                                        ) : ' '}
                                    </div>
                                </>

                                }
                                {submitOtp ?
                                    <div className="d-flex flex-column align-items-center mb-4">
                                        <Typography>Code hes send to</Typography>
                                        <Typography>9758499292</Typography>
                                    </div> : null
                                }
                                <div className="mb-5 d-flex justify-content-center">
                                    {
                                        submitOtp ?
                                            <OTPInput
                                                id="outlined-basic"
                                                otpType="number"
                                                // variant="outlined"
                                                onChange={(e) => setOtpValue(e)}
                                                value={otpValue}
                                                className="otp-input"
                                                OTPLength={6}

                                            /> : null
                                    }
                                </div>
                                <>
                                    {
                                        submitOtp ?
                                            <button
                                                className="LoginButton w-100"
                                            >
                                                Submit
                                            </button>
                                            :
                                            <button
                                                className="LoginButton w-100"
                                                onClick={GetOtp}
                                            >
                                                Get Otp
                                            </button>
                                    }
                                </>
                            </div>
                        </>
                    </Form>
                )}
            </Formik>
        </div>
    </>
}
export default ForgotPassword;