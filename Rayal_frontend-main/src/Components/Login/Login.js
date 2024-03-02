import React, { useState } from "react";
import "./Login.scss";
import { Formik, Form, Field } from "formik";
import { json, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ToastError } from "../../UiComponents/Toaster/Toast";
import { LoginService, RegisterService, GetOtp } from "../../Service/_index";
import swal from "sweetalert";
import Grid from "@mui/material/Grid";
import LoginImage from '../../Resources/Images/LoginImage.png'
import Box from "@mui/material/Box";
import Logo from '../../Resources/Images/Logo.png'
import LogoText from '../../Resources/Images/Logo-Text.png'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, TextField } from '@mui/material';
import FloatLabel from "../../UiComponents/FloatLabel/FloatLabel";
import { getLabelForValue } from '../../Shared/CommonConstant'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
const Login = () => {
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [showSignPassword, setShowSingPassword] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isRoleSelectBox, setIsRoleSelectBox] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [credentials, setCredentials] = useState({})
  const [otpValue, setOtpValue] = useState()
  const [verify, setVerify] = useState(null)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().min(6, "Too Short").required("Enter Username"),
    password: Yup.string().required("Password is Required"),
    // .min(8, 'Password must be 8 characters long')
    // .matches(/[0-9]/, 'Password requires a number')
    // .matches(/[A-Z]/, 'Password requires an uppercase letter'),
  });
  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(1, "Too Short!").required("Enter email"),
    email: Yup.string().email("Invalid email").required("Enter your emails"),
    mobileNumber: Yup.string().required("Enter your mobile Number"),
    newPassword: Yup.string().required("Password is Required"),
    // .min(8, "Password must be 8 characters long")
    // .matches(/[0-9]/, "Password requires a number")
    // .matches(/[A-Z]/, "Password requires an uppercase letter"),
    password: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      'Must match "password" field value'
    ).required("Enter Confirm Password"),
  });

  const SignInpage = () => {
    setShowSignIn(true);
    setShowForgotPassword(false);
  };

  const loginOnSubmit = (data) => {
    if (!isNaN(data.email)) {
      data.mobile = data.email
      delete data.email

    } else {
      data.email = data.email
      delete data.mobile
    }
    LoginService({ email: data.email, password: data.password, mobile: data.mobile })
      .then((res) => {

        if (res.data.userType.length > 1) {
          setIsRoleSelectBox(true)
          const isRoleValues = res.data.userType.map((e) => {
            return {
              label: getLabelForValue(e),
              value: e
            }
          })
          setRoleOptions(isRoleValues)
          setCredentials(res.data)
        } else {
          navigate("/dashboard");
          swal({ title: "Login Successfully!", text: `Welcome to ${res?.data?.name}`, icon: "success", timer: 4000, buttons: false });
          localStorage.setItem("email", res?.data?.email);
          localStorage.setItem("token", res?.data?.clientID);
          localStorage.setItem("name", res?.data?.name);
          localStorage.setItem("UserId", res?.data?.userID);
          localStorage.setItem("clientID", res?.data?.clientID);
          localStorage.setItem("userType", res?.data?.userType);
        }
      })
      .catch((err) => {
        console.log(err)
        ToastError(err?.response?.data?.error);
      });
  };

  const HandleRoleFunction = () => {
    if (selectedRole) {
      localStorage.setItem("userType", selectedRole);
      localStorage.setItem("email", credentials?.email);
      localStorage.setItem("token", credentials?.clientID);
      localStorage.setItem("name", credentials?.name);
      localStorage.setItem("UserId", credentials?.userID);
      localStorage.setItem("clientID", credentials?.clientID);
      navigate("/dashboard");
      swal({ title: "Login Successfully!", text: `Welcome to ${credentials.name}`, icon: "success", timer: 4000, buttons: false });
    } else {
      ToastError('Please Select the Role')
    }
  }



  const RegisterOnSubmit = (data) => {
    RegisterService({
      name: data.name,
      mobileNumber: data.mobileNumber,
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res?.response?.status === 500) {
        ToastError(res.response.data.message)
      } else {
        swal({
          title: "Registerd Successfully!",
          text: `Welcome to Rayal insurance`,
          icon: "success",
          timer: 4000,
          buttons: false,
        })
        window.location.reload();
      }

    }).catch((err) => ToastError('Network connection error'))
  };

  const GetOtpFunction = (values) => {
    console.log(values)
    setShowOtp(true)
    const data = {
      mobileNumber: values.mobileNumber,
      name: values.name
    }
    GetOtp(data).then((res) => {
      setOtpValue(res.otp)
    })
  }

  return (
    <div className="Login_Page_Container">
      <Grid container>
        <Grid item xs={12} sm={8} className="Left_Conteiner">
          <img src={LoginImage} alt="loginimage" />
        </Grid>
        <Grid item xs={12} sm={4} className="Right_Conteiner">
          <Box className="Login_Input_Container" sx={{ height: showSignIn ? '94%' : '70%' }}>
            <div className="Login_Special_Container" style={{ display: showSignIn ? 'none' : 'block' }}>
              <div className="Header_image">
                <img src={Logo} className="logo" alt="login" />
                <img src={LogoText} className="logoText" alt="login" />
              </div>
              <h1>Hello,</h1>
              <h2>Login to Rayal Broker india Pvt Ltd</h2>
              <div className="Login_Input_Boxes">
                <Formik
                  validationSchema={LoginSchema}
                  const
                  initialValues={{
                    email: "",
                    password: "",
                    mobile: ''
                  }}
                  onSubmit={(values) => {
                    loginOnSubmit(values);
                  }}
                >
                  {() => (
                    <Form>
                      <div className="row">
                        <span className="InputTitle">Email / Mobile </span>
                        <div className="d-flex col-12 ">
                          <Field
                            name="email"
                            className="w-100 form-control field"
                            placeholder="Email / Mobile"
                          />
                        </div>
                        <span className="InputTitle mt-4">Password </span>
                        <div className="d-flex col-12">
                          <Field
                            name="password"
                            placeholder="Password"
                            type={showPassword ? "password" : "text"}
                            className="w-100 form-control field"
                          />
                        </div>

                        <div className="d-flex mt-3 justify-content-between showPass">
                          <div className="d-flex mb-4 showPassword" style={{ gap: '4px', paddingLeft: '1px' }}>
                            <input
                              type="checkbox"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                            <span>Show Password</span>
                          </div>
                          <span onClick={() => setShowForgotPassword(true)}>
                            Forgot Password ?
                          </span>
                        </div>
                        <div className="d-flex col-12">
                          <button className="LoginButton w-100" type="submit">
                            Login
                          </button>
                        </div>
                        <div className="SignUpMessage">
                          <span>I don't have account ? </span>
                          <span onClick={() => setShowSignIn(true)}>SIGN UP</span>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="Register_Special_Container" style={{ display: showSignIn ? 'block' : 'none' }}>
              <div className="Header_image">
                <img src={Logo} className="logo" alt="login" />
                <img src={LogoText} className="logoText" alt="login" />
              </div>
              <h1>Register</h1>
              <div className="Register_Input_Boxes">
                <Formik
                  validationSchema={SignupSchema}
                  initialValues={{
                    name: "",
                    mobileNumber: "",
                    email: "",
                    newPassword: "",
                    password: "",
                  }}
                  onSubmit={(values) => {
                    RegisterOnSubmit(values);
                  }}
                >
                  {({ errors, touched, values }) => (
                    <Form>

                      <>
                        <div className="row">
                          <span className="InputTitle">Name </span>
                          <div className="col-12 d-flex">

                            <Field
                              name="name"
                              placeholder="Name"
                              type="text"
                              className="w-100 form-control field"
                            />
                          </div>


                          <span className="InputTitle ">Email </span>
                          <div className="d-flex col-12">

                            <Field
                              name="email"
                              placeholder="E Mail"
                              type="email"
                              className="w-100 form-control field"
                            />
                          </div>

                          <span className="InputTitle">Mobile Number </span>
                          <div className="d-flex col-12 get_Otp">

                            <Field
                              name="mobileNumber"
                              placeholder="Mobile Number"
                              type="number"
                              className="w-100 form-control field"
                              disabled={showOtp ? true : false}
                            />
                            {
                              showOtp ?
                                <span><EditIcon onClick={() => {
                                  setVerify(false)
                                  setShowOtp(false)
                                }} sx={{ fontSize: '20px', marginBottom: '8px' }} /></span> :
                                <button disabled={showOtp ? true : false} onClick={() => GetOtpFunction(values)}>Get Otp!</button>

                            }

                          </div>
                          {showOtp ? (
                            <>
                              <span className="InputTitle">OTP</span>
                              <div className="d-flex col-12 get_Otp">
                                <TextField
                                  placeholder="OTP"
                                  onChange={(e) => setVerify(e.target.value === otpValue)}
                                  className="w-100  InputFiled"
                                />
                                <span>{verify ? <CheckIcon sx={{ color: 'green !important' }} /> : <ClearIcon sx={{ color: 'red !important' }} />}</span>

                              </div>
                            </>

                          ) : null}
                          <span className="InputTitle">Password </span>
                          <div className="d-flex col-12">
                            <Field
                              name="newPassword"
                              placeholder="Password"
                              type={showSignPassword ? "password" : "text"}
                              className="w-100 form-control field"
                            />
                          </div>

                          <span className="InputTitle">Confirm Password</span>
                          <div className="d-flex col-12">

                            <Field
                              name="password"
                              placeholder="Confirm Password"
                              type={showSignPassword ? "password" : "text"}
                              className="w-100 form-control field"
                            />
                          </div>
                          <div className="errorMessage mt-1">
                            {errors.password && touched.password ? (
                              <div>{errors.password}</div>
                            ) : (
                              " "
                            )}
                          </div>
                          <div className="d-flex  showPass" style={{ gap: '4px' }}>
                            <input
                              type="checkbox"
                              onClick={() =>
                                setShowSingPassword(!showSignPassword)
                              }
                            />
                            <span>Show Password</span>
                          </div>

                          <div className="d-flex col-12 mt-1">

                            {/* {showOtp ? (
                              <button className="LoginButton w-100" type="submit">
                                Sign up
                              </button>
                            ) : ( */}
                            <button className="LoginButton w-100" disabled={verify ? false : true} type="submit" >
                              Register
                            </button>
                            {/* )} */}
                          </div>
                          <div className="SignUpMessage">
                            <span>back to </span>
                            <span onClick={() => {
                              setShowOtp(false)
                              setShowSignIn(false)
                            }}> LOG IN !</span>
                          </div>
                        </div>
                      </>

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
      <React.Fragment>
        <Dialog
          open={isRoleSelectBox}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            {"Select Role"}
          </DialogTitle>
          <DialogContent>
            <div id="alert-dialog-description" style={{ paddingTop: '20px' }}>
              <FloatLabel label="Select Role" value={selectedRole}>
                <Autocomplete
                  className="AutoComplete_InputBox w-100"
                  id="grouped-demo"
                  options={roleOptions}
                  onChange={(e, v) => v ? setSelectedRole(v.value) : setSelectedRole(null)}
                  renderInput={(params) => <TextField {...params} />}

                />
              </FloatLabel>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRoleSelectBox(false)} autoFocus className="Common_Button">
              Cancel
            </Button>
            <Button onClick={HandleRoleFunction} autoFocus className="Common_Button">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div >
  );
};

export default Login;



