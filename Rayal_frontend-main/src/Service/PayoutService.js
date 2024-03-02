import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;
const GetPayout = () => {
  return axios
    .get(`${URL}/payoutCycle`)
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

const PostPayout = (recData) => {
  return axios
    .post(`${URL}/payoutCycle`, recData)
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

const DeletePayout = (_id) => {
  return axios
    .delete(`${URL}/payoutCycle/${_id}`)
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

const UpdatePayout = (_id, recData) => {
  return axios
    .put(`${URL}/payoutCycle/${_id}`, recData)
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

const FilterPayout = (recData) => {
  return axios
    .post(`${URL}/payoutcyclefilter`, recData)
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
export { GetPayout, PostPayout, DeletePayout, UpdatePayout , FilterPayout};
