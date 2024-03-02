import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;

const GetRTO = () => {
  return axios
    .get(`${URL}/RTO`)
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

const PostRTO = (recData) => {
  return axios
    .post(`${URL}/saveCompanyRTO`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastSuccess(res.message)
        return res;
      }
    }).catch((err) => {
      ToastError(err.response.data.message)

    })
};

const GetCompanyRTO = (data) => {
  return axios
    .get(`${URL}/getCompanyRTO`,{
      headers: { requesttype: data },
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

const GetCompanyRTOByID = (_id) => {
  return axios
    .get(`${URL}/getCompanyRTOByID/${_id}`)
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

const UpdateCompanyRTO = (_id, recData) => {
  return axios
    .put(`${URL}/updateCompanyRTO/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastSuccess(res.message)
        return res;
      }
    })
};

const DeleteRTO = (id) => {
  return axios.delete(`${URL}/deleteRTO/${id}`,).then((response) => {
    const res = response.data;
    if(res){
      ToastError(res.message)
      return res
    }else{
      ToastError(res.message)
    }
  })
}


export { GetRTO , PostRTO ,GetCompanyRTO , GetCompanyRTOByID , UpdateCompanyRTO , DeleteRTO }