import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;

const GetMasterCompany = () => {
  return axios
    .get(`${URL}/mastercompany`)
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

const PostMasterCompany = (recData) => {
  return axios
    .post(`${URL}/mastercompany`, recData)
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

const DeleteMasterCompany = (_id) => {
  return axios
    .delete(`${URL}/mastercompany/${_id}`)
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

const UpdateMasterCompany = (_id, recData) => {
  return axios
    .put(`${URL}/mastercompany/${_id}`, recData)
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

const FilterMasterCompany = (recData) => {
  return axios
    .post(`${URL}/mastercompanyfilter`, recData)
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
  GetMasterCompany,
  PostMasterCompany,
  DeleteMasterCompany,
  UpdateMasterCompany,
  FilterMasterCompany
};
