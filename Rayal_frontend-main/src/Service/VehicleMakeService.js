import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError,ToastSuccess } from "../UiComponents/Toaster/Toast";
// added by gokul...
const URL = process.env.React_App_BaseUrl;
const GetVehicleMake = (data) => {
  return axios
    .get(`${URL}/vehicleMake`,{
      headers:{
        isAscending:data?.isAscending
      }
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

const PostVehicleMake = (recData) => {
  return axios
    .post(`${URL}/vehicleMake`, recData)
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

const DeleteVehicleMake = (_id) => {
  return axios
    .delete(`${URL}/vehicleMake/${_id}`)
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

const UpdateVehicleMake = (_id, recData) => {
  return axios
    .put(`${URL}/vehicleMake/${_id}`, recData)
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

const FilterVehicleMake = (recData) => {
  return axios
    .post(`${URL}/vehicleMakeFilter`, recData)
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
export { GetVehicleMake, PostVehicleMake, DeleteVehicleMake, UpdateVehicleMake , FilterVehicleMake};
