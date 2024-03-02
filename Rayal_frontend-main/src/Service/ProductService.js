import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetProduct = (data) => {
  return axios
    .get(`${URL}/product`, {
      headers: {
        isAscending: data.isAscending,
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

const PostProduct = (recData) => {
  return axios
    .post(`${URL}/product`, recData)
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
      ToastError("Please Enter All Fields")
    });
};

const DeleteProduct = (_id) => {
  return axios
    .delete(`${URL}/product/${_id}`)
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

const UpdateProduct = (_id, recData) => {
  return axios
    .put(`${URL}/product/${_id}`, recData)
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

const FilterProduct = (recData) => {
  return axios
    .post(`${URL}/productfilter`, recData)
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
  GetProduct,
  PostProduct,
  DeleteProduct,
  UpdateProduct,
  FilterProduct
};
