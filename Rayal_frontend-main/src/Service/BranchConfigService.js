import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;


const PostBranchConfig = (recData) => {
  return axios
    .post(`${URL}/saveBranchConfig`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message);
      } else {
        ToastSuccess(res.message);
        return res;
      }
    })
};


const GetBranchConfigByBranchManagerId = (_id, data) => {
  return axios
    .get(`${URL}/getBranchConfigByBranchManagerId/${_id}`, { headers: { requestType: data } })
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

const GetRTOLocationByCompanyID = (_id) => {
  return axios
    .get(`${URL}/getRTOLocationByCompanyID/${_id}`)
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

const DisableBranchConfig = (_id , data) => {
  return axios
    .patch(`${URL}/disableBranchConfigById/${_id}`, null, {
      headers: {
        requesttype: data.requesttype,
        disableDate: data.disableDate,
      },
    })
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message);
      } else {
        ToastSuccess(res.message);
        return res;
      }
    })
};

const DeleteBranchConfig = (_id) => {
  return axios
    .delete(`${URL}/deleteBranchConfigById/${_id}`)
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


const GetBranchConfigById = (_id, data) => {
  return (
    axios
      .get(`${URL}/getBranchConfigById/${_id}`, {
        headers: { requestType: data },
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
      })
  );
};

const UpdateBranchConfig = (recData) => {
  return axios.patch(`${URL}/updateBranchConfig`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

export { PostBranchConfig, GetBranchConfigByBranchManagerId, GetRTOLocationByCompanyID, DisableBranchConfig , DeleteBranchConfig , GetBranchConfigById , UpdateBranchConfig}