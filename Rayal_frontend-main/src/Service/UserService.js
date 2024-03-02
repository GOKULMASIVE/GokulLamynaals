import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;

const GetUser = (data) => {
  return axios
    .get(`${URL}/user`, { headers: { requesttype: data.requesttype,isAscending:data.isAscending } })
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

const GetLogin = () => {
  return axios
    .get(`${URL}/getlogin`)
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

const PostUser = (recData) => {
  return axios.post(`${URL}/user`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

const UpdateUser = (_id, recData) => {
  return axios
    .put(`${URL}/user/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message);
      } else {
        ToastSuccess(res.message);
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetUserFindbyId = (_id) => {
  return axios
    .get(`${URL}/userById/${_id}`)
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

//common getFileFromAWSS3BucketByKey

const GetFileFromAWSS3BucketByKey = (data) => {
  return axios
    .get(`${URL}/getFileFromAWSS3BucketByKey`, { headers: { key: data } })
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

// written by gokul
const verifyMobileNumber = (data) => {
  return axios.get(`${URL}/verifyMobileNumber/${data}`).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};

const verifyEmailAddress = (data) => {
  return axios.get(`${URL}/verifyEmailAddress/${data}`).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};

export {
  PostUser,
  GetUser,
  GetLogin,
  UpdateUser,
  GetUserFindbyId,
  GetFileFromAWSS3BucketByKey,
  verifyMobileNumber,
  verifyEmailAddress,
};
