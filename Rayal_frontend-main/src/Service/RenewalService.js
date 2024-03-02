import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";
const URL = process.env.React_App_BaseUrl;

const GetRenewalData = (recData) => {
    return axios
      .post(`${URL}/renewalList`, recData)
      .then((response) => {
        const res = response.data;
        if (res.error) {
          ToastError(res.message);
        } else {
          // ToastSuccess(res.message);
          return res;
        }
      })
  };


  export {GetRenewalData}

