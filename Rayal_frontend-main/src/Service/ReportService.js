import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;

const GetMasterReport = (requestType, reqBody) => {
  return axios
    .post(`${URL}/getMasterReport`, reqBody, {
      headers: { requestType: requestType },
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

const GetMasterReportExcelFormat = (data) => {
  return axios
    .post(`${URL}/getMasterReportExcelFormat`, data)
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

const GetPaidReceivedReport = (requestType, reqBody) => {
  // console.log("reqBody ", reqBody);
  return axios
    .post(`${URL}/getPaidReceivedReport`, reqBody, {
      headers: { requestType: requestType },
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

const GetTDSReport = (requestType, selectedDate) => {
  return axios
    .get(`${URL}/getTDSReport`, {
      headers: {
        requestType: requestType,
        selectedDate: selectedDate,
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

// Changes by Gokul
const DeletePolicyReportData = (_id) => {
  return axios
    .delete(`${URL}/deletePaidRecievedReport/${_id}`)
    .then((response) => {
      const resp = response.data;
      if (resp.error) {
        console.log(resp.error);
      } else {
        ToastError(resp.message);
        return resp;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Changes by Gokul
const UpdatePolicyReportData = (_id, updatedData) => {
  return axios
    .put(`${URL}/updatePaidRecievedReport/${_id}`, updatedData)
    .then((response) => {
      const resp = response.data;
      if (resp.error) {
        ToastError(resp.error);
      } else {
        ToastSuccess(resp.message);
        return resp;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetPolicyChequeReport = (reqBody) => {
  
  return axios
    .post(`${URL}/getPolicyChequeReport`, reqBody)
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

const GetDashboard = (dateData) => {
  return axios
    .get(`${URL}/getDashboard`, {
      headers: {
        startdate: dateData.startDate,
        enddate: dateData.endDate,
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

const GetBookingReport = (reqBody) => {
  return axios
    .post(`${URL}/getBookingReport`, reqBody)
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
  GetMasterReport,
  GetPaidReceivedReport,
  GetTDSReport,
  GetPolicyChequeReport,
  GetBookingReport,
  UpdatePolicyReportData,
  DeletePolicyReportData,
  GetDashboard,
  GetMasterReportExcelFormat,
};
