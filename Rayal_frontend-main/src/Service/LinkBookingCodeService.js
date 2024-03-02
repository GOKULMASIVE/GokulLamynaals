import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetLinkBookingCode = () => {
  return axios
    .get(`${URL}/linkbookingcode`)
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

const PostLinkBookingCode = (recData) => {
  return axios
    .post(`${URL}/linkbookingcode`, recData)
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
      ToastError("Enter all Filelds...!")
    });
};

const DeleteLinkBookingCode = (_id) => {
  return axios
    .delete(`${URL}/linkbookingcode/${_id}`)
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

const UpdateLinkBookingCode = (_id, recData) => {
  return axios
    .put(`${URL}/linkbookingcode/${_id}`, recData)
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

const FilterLinkBookingCode = (recData) => {
  return axios
    .post(`${URL}/linkbookingcodefilter`, recData)
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
  GetLinkBookingCode,
  PostLinkBookingCode,
  DeleteLinkBookingCode,
  UpdateLinkBookingCode,
  FilterLinkBookingCode
};
