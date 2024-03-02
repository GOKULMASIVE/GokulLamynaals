import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;

const PostReceivableConfig = (recData) => {
  return axios.post(`${URL}/saveReceivableConfig`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

const GetReceivableConfigByCompanyId = (_id, data) => {
  return axios
    .get(`${URL}/getReceivableConfigByCompanyId/${_id}`, {
      headers: {
        requestType: data.requestType,
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

const DisableReceivableConfig = (_id, data) => {
  return axios
    .patch(`${URL}/disableReceivableConfigById/${_id}`, null, {
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

const DeleteReceivableConfigById = (_id) => {
  return axios
    .delete(`${URL}/deleteReceivableConfigById/${_id}`)
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

const GetReceivableConfigById = (_id, data) => {
  return axios
    .get(`${URL}/getReceivableConfigById/${_id}`, {
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

const UpdateReceivableConfig = (recData) => {
  return axios
    .patch(`${URL}/updateReceivableConfig`, recData)
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

export {
  PostReceivableConfig,
  GetReceivableConfigByCompanyId,
  GetRTOLocationByCompanyID,
  DisableReceivableConfig,
  DeleteReceivableConfigById,
  GetReceivableConfigById,
  UpdateReceivableConfig,
};
