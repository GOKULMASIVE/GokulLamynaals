import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetCompanyLogin = () => {
  return axios
    .get(`${URL}/companyLogin`)
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

const PostCompanyLogin = (recData) => {
  return axios
    .post(`${URL}/companyLogin`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        // ToastError(res.message)
        console.log(res.error)
      } else {
       ToastSuccess(res.message)
        return res;
      }
    })
    .catch((error) => {
      ToastError(error.response.data.message)
    });
};

const DeleteCompanyLogin = (_id) => {
  return axios
    .delete(`${URL}/companyLogin/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const UpdateCompanyLogin = (_id, recData) => {
  return axios
    .put(`${URL}/companyLogin/${_id}`, recData)
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

const FilterCompanyLogin = (recData) => {
  return axios
    .post(`${URL}/searchCompanyLogin`, recData)
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

const VerifyLoginId = (recData) => {
  return axios
    .post(`${URL}/verifyLoginId`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        return res;
      }
    })
    .catch((error) => {
      return error

    });
};

export { GetCompanyLogin, PostCompanyLogin, DeleteCompanyLogin, UpdateCompanyLogin , FilterCompanyLogin , VerifyLoginId};
