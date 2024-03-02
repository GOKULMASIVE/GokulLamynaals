import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetSubBookingCode = (data) => {
  return axios
    .get(`${URL}/getSubBookingCode`,{
      headers:{
        isAscending:data.isAscending
      }
    })
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

const PostSubBookingCode = (recData) => {
  return axios
    .post(`${URL}/createSubBookingCode`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastSuccess(res.message)
        return res;
      }
    })
    .catch((error) => {
      ToastError(error.message)
    });
};

const DeleteSubBookingCode = (_id) => {
  return axios
    .delete(`${URL}/subBookingCode/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        ToastError(res.message)
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const UpdateSubBookingCode = (_id, recData) => {
  return axios
    .put(`${URL}/subBookingCode/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastSuccess(res.message)
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const FilterSubBookingCode = (recData) => {
  return axios
    .post(`${URL}/subBookingcodefilter`, recData)
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

export {
  GetSubBookingCode,
  PostSubBookingCode,
  DeleteSubBookingCode,
  UpdateSubBookingCode,
  FilterSubBookingCode
};
