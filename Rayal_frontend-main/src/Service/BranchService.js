import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;
const GetBranch = () => {
  return axios
    .get(`${URL}/branch`)
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

const PostBranch = (recData) => {
  return axios
    .post(`${URL}/branch`, recData)
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

const DeleteBranch = (_id) => {
  return axios
    .delete(`${URL}/branch/${_id}`)
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

const UpdateBranch = (_id, recData) => {
  return axios
    .put(`${URL}/branch/${_id}`, recData)
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

const FilterBranch = (recData) => {
  return axios
    .post(`${URL}/branchfilter`, recData)
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
export { GetBranch, PostBranch, DeleteBranch, UpdateBranch , FilterBranch};
