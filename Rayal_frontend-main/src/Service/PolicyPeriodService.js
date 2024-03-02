import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetPolicyPeriod = () => {
  return axios
    .get(`${URL}/policyperiod`)
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

const PostPolicyPeriod = (recData) => {
  return axios
    .post(`${URL}/policyperiod`, recData)
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

const DeletePolicyPeriod = (_id) => {
  return axios
    .delete(`${URL}/policyperiod/${_id}`)
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

const UpdatePolicyPeriod = (_id, recData) => {
  return axios
    .put(`${URL}/policyperiod/${_id}`, recData)
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
const FilterPolicyPeriod = (recData) => {
  return axios
    .post(`${URL}/policyperiodfilter`, recData)
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
  GetPolicyPeriod,
  PostPolicyPeriod,
  DeletePolicyPeriod,
  UpdatePolicyPeriod,
  FilterPolicyPeriod
};
