import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_MobileCalculationUrl
const GetVehicleDetails = (id) => {
  return axios
    .get(`${URL}/categories/form/${id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const PostVehicleDetails = (data) => {
  return axios
    .post(`${URL}/calculateQuoteValues`,data)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};


const DownloadPdf = (data) => {
  return axios
    .post(`${URL}/downloadQuote`,data)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetQuoteQueryRecords=(data)=>{
  return axios.get(`${URL}/getQuoteQueryRecords`,{
    headers:{
      startDate:data.startDate,
      endDate:data.endDate,
      isWebUser:data.isWebUser
    }
  }).then((response)=>{
    const res=response.data;
    if(res.error){
      console.log(res.error);
    }else{
      return res;  
  }
  }).catch((err)=>console.log(err));
}
export {GetVehicleDetails , PostVehicleDetails , DownloadPdf,GetQuoteQueryRecords}