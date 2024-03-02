import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetPolicyType = (data) => {
  return axios
    .get(`${URL}/policytype`, {
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

const PostPolicyType = (recData) => {
  return axios
    .post(`${URL}/policytype`, recData)
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
      console.log(error);
    });
};

const DeletePolicyType = (_id) => {
  return axios
    .delete(`${URL}/policytype/${_id}`)
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

const UpdatePolicyType = (_id, recData) => {
  return axios
    .put(`${URL}/policytype/${_id}`, recData)
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

const FilterPolicyType = (recData) => {
  return axios
    .post(`${URL}/policytypefilter`, recData)
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
  GetPolicyType,
  PostPolicyType,
  DeletePolicyType,
  UpdatePolicyType,
  FilterPolicyType
};
