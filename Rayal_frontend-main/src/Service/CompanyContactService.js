import axios from '../AxiosInterCeptor/AxiosInterCeptor'
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";


const URL = process.env.React_App_BaseUrl;
const GetCompanyContact = () => {
  return axios
    .get(`${URL}/companyContact`)
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

const PostCompanyContact = (recData) => {
  return axios
    .post(`${URL}/companyContact`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        ToastSuccess(res.message);
        return res;
      }
    })
 
};

const DeleteCompanyContact = (_id) => {
  return axios
    .delete(`${URL}/companyContact/${_id}`)
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

const UpdateCompanyContact = (_id, recData) => {
  return axios
    .put(`${URL}/companyContact/${_id}`, recData)
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

const FilterCompanyContact=(recData)=>{
  return axios.post(`${URL}//searchcompanycontact`,recData).then((response)=>{
    const res=response.data;
    if(res.error){
      console.log(res.error);
    }else{
      return res;
    }
  }).catch((error)=>{
    console.log(error);
  })
}

export {
  GetCompanyContact,
  PostCompanyContact,
  DeleteCompanyContact,
  UpdateCompanyContact,
  FilterCompanyContact
};
