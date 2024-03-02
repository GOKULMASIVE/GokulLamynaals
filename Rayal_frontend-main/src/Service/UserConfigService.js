import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;

const PostUserConfig = (recData) => {
  return axios.post(`${URL}/saveUserConfig`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

// Changes by Arun
const UpdateUserConfig = (recData) => {
  return axios.patch(`${URL}/updateUserConfig`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

const GetUserConfigByUserId = (_id, data) => {
  // console.log(data);
  return (
    axios.get(`${URL}/getUserConfigByUserId/${_id}`, {
        headers: {
          requestType: data.requestType,
          companyId: data.companyId,
          bookingCodeId: data.bookingCodeId,
          subBookingCodeId: data.subBookingCodeId,
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
      })
  );
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

const DisableUserConfig = (_id, data) => {
  return axios
    .patch(`${URL}/disableUserConfigById/${_id}`, null, {
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
    });
};

const GetUserConfigById = (_id, data) => {
  return axios
    .get(`${URL}/getUserConfigById/${_id}`, {
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
    });
};

const DeleteUserConfig = (_id) => {
  return axios
    .delete(`${URL}/deleteUserConfigById/${_id}`)
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

export {
  PostUserConfig,
  GetUserConfigByUserId,
  UpdateUserConfig,
  GetRTOLocationByCompanyID,
  DisableUserConfig,
  GetUserConfigById,
  DeleteUserConfig,
};
