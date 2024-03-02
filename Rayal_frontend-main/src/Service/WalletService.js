import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;
//user Wallet
const GetUserWallet = (type, data) => {
  return axios
    .get(`${URL}/getUserWallet/${type}`, {
      headers: {
        userRef: data.userId,
        startdate: data.startDate,
        enddate: data.endDate,
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

const GetUserWalletByUserId = (type, data) => {
  return axios
    .get(`${URL}/getUserWalletByUserId/${type}`, {
      headers: {
        startdate: data.startDate,
        enddate: data.endDate,
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

const PaidWallet = (recData) => {
  return axios.post(`${URL}/saveWallet`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

const GetBankDetailsByUserId = (type) => {
  return axios
    .get(`${URL}/getBankDetailsByUserId/${type}`)
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
//branch wallet
const GetBranchWallet = (data) => {
  return axios
    .get(`${URL}/getBranchWallet`,{
      headers:{
        startDate:data.startDate,
        endDate:data.endDate
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

const GetBranchWalletByUSerId = (id) => {
  return axios
    .get(`${URL}/getBranchWalletByUserId/${id}`)
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

//company Wallet

const GetCompanyWallet = (recData) => {

  return axios
    .get(`${URL}/getCompanyWallet`, {
      headers: {
        bookingCodeId: recData.bookingCodeId,
        subBookingCodeId: recData.subBookingCodeId,
        startDate:recData.startDate,
        endDate:recData.endDate,
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

const GetCompanyWalletBySubBookingCodeId = (id, data) => {
  return axios
    .get(`${URL}/getCompanyWalletBySubBookingCodeId/${id}`, {
      headers: {
        startdate: data.startDate,
        enddate: data.endDate,
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

const ReceivedWallet = (recData) => {
  return axios.post(`${URL}/saveCompanyWallet`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message);
      return res;
    }
  });
};

// added by gokul...
const FilterUserWallet = (recData) => {
  return axios.post(`${URL}/filterUserWallet`, recData).then((response) => {
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
  GetUserWallet,
  GetUserWalletByUserId,
  PaidWallet,
  GetBranchWallet,
  GetBranchWalletByUSerId,
  GetCompanyWallet,
  GetCompanyWalletBySubBookingCodeId,
  ReceivedWallet,
  GetBankDetailsByUserId,
  FilterUserWallet,
};
