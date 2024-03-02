import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";
import { useSelector, useDispatch } from 'react-redux';
const URL = process.env.React_App_BaseUrl;
const GetBookingCode = (data) => {

  return axios
    .get(`${URL}/bookingcode`, {
      headers: {
        isAscending:data.isAscending
      },
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

const PostBookingCode = (recData) => {
  return axios
    .post(`${URL}/bookingcode`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error)
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

const DeleteBookingCode = (_id) => {
  return axios
    .delete(`${URL}/bookingcode/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        ToastError(res.message)
        return res;
      }
    })
};

const UpdateBookingCode = (_id, recData) => {
  return axios
    .put(`${URL}/bookingcode/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastSuccess(res.message)
        return res;
      }
    })
};

const FilterBookingCode = (recData) => {
  return axios
    .post(`${URL}/bookingcodefilter`, recData)
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
  GetBookingCode,
  PostBookingCode,
  DeleteBookingCode,
  UpdateBookingCode,
  FilterBookingCode
};
