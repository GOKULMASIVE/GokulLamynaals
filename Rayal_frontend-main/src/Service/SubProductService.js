import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetSubProduct = (data) => {
  return axios
    .get(`${URL}/getSubProduct`, {
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

const PostSubProduct = (recData) => {
  return axios
    .post(`${URL}/createSubProduct`, recData)
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
      ToastError("Please Enter all fields")
    });
};

const DeleteSubProduct = (_id) => {
  return axios
    .delete(`${URL}/subProduct/${_id}`)
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

const UpdateSubProduct = (_id, recData) => {
  return axios
    .put(`${URL}/subProduct/${_id}`, recData)
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

const FilterSubProduct = (recData) => {
  return axios
    .post(`${URL}/subProductfilter`, recData)
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
  GetSubProduct,
  PostSubProduct,
  DeleteSubProduct,
  UpdateSubProduct,
  FilterSubProduct
};
