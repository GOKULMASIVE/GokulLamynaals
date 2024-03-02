import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;
const GetFuelType = () => {
  return axios
    .get(`${URL}/fuelType`)
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

const PostFuelType = (recData) => {
  return axios
    .post(`${URL}/fuelType`, recData)
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

const DeleteFuelType = (_id) => {
  return axios
    .delete(`${URL}/fuelType/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        ToastError(res.message);
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const UpdateFuelType = (_id, recData) => {
  return axios
    .put(`${URL}/fuelType/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
        console.log(res.error);
      } else {
        ToastSuccess(res.message)
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const FilterFuelType = (recData) => {
  return axios
    .post(`${URL}/fueltypefilter`, recData)
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
export { GetFuelType, PostFuelType, DeleteFuelType, UpdateFuelType , FilterFuelType};
