
import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const OtpURL = process.env.React_App_MobileCalculationUrl;


const LoginService = (recData) => {
    return axios
      .post(`${URL}/login`, recData)
      .then((response) => {
        const res = response.data;
        if (res.error) {
          console.log(res.error);
        } else {
          return res;
        }
      })
  };
  const RegisterService = (recData) => {
    return axios
      .post(`${URL}/register`, recData)
      .then((response) => {
        const res = response.data;
        if (res.error) {
          console.log(res.error);
          return res.error
        } else {
          console.log(res)
          return res;
        }
      }).catch((err)=>{
        return err
      })
  };

  const GetOtp = (recData) => {
    return axios
      .post(`${OtpURL}/getOtp`, recData)
      .then((response) => {
        const res = response.data;
        if (res.error) {
          console.log(res.error);
        } else {
          console.log(res)
          return res;
        }
      }).catch((err)=>{
        console.log(err)
      })
  };
  

  export {LoginService , RegisterService , GetOtp}