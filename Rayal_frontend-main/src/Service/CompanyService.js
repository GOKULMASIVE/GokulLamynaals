import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetCompany = (data) => {
  return axios
    .get(`${URL}/company`, {
      headers: {
        isAscending:data.isAscending,
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

const PostCompany = (recData) => {
  return axios
    .post(`${URL}/company`, recData)
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

const DeleteCompany = (_id) => {
  return axios
    .delete(`${URL}/company/${_id}`)
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

const UpdateCompany = (_id, recData) => {
  return axios
    .put(`${URL}/company/${_id}`, recData)
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
const FilterCompany = (recData) => {
  return axios
    .post(`${URL}/companyfilter`, recData)
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
export { GetCompany, PostCompany, DeleteCompany, UpdateCompany, FilterCompany };
