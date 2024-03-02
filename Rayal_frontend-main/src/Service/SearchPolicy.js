import axios from "../AxiosInterCeptor/AxiosInterCeptor";
import { ToastError, ToastSuccess } from "../UiComponents/Toaster/Toast";

const URL = process.env.React_App_BaseUrl;

const PostCreatePolicy = (recData) => {
  return axios.post(`${URL}/createpolicy`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};


// loginPortal added by gokul....
const LoginPortalData=(recData)=>{
    return axios.get(`${URL}/getLoginPortal`,{
      headers:{
        companyUserId:recData.userId,
        companyId:recData.companyId
      }
    }).then((response)=>{
      const res= response.data;
      if(res.error){
        console.log(res.error);
      }else{
        return res;
      }
    })
}

const PostSearchPolicy = (recData) => {
  return axios
    .post(`${URL}/searchpolicy`, recData)
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
// changes by somesh
const GetFilterCCEntry = async (recData) => {
  try {
    const response = await axios.post(`${URL}/filterCCEntry`, recData);
    const res = response.data;
    if (res.error) {
      console.log(res.error);
      return null;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// changes by somesh
const unlinkTicketNumber = async (_id, recData) => {
  try {
    const response = await axios.post(
      `${URL}/unlinkTicketNumber/${_id}`,
      recData
    );
    const res = response.data;
    if (res.error) {
      ToastError(res.message)
      return null;
    } else {
      ToastError(res.message)
      console.log(res)
      return res;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// changes by somesh
const GetFilterCCEntryAll = async () => {
  try {
    const response = await axios.get(`${URL}/filterCCEntryAll`);
    const res = response.data;
    console.log(res);
    if (res.error) {
      console.log(res.error);
      return null;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// changes by somesh
const ticketAlreadyExist = async (_id, recData) => {
  try {
    const response = await axios.patch(
      `${URL}/ticketAlreadyExist/${_id}`,
      recData
    );
    const res = response.data;
    console.log(res);
    if (res.error) {
      console.log(res.error);
      return null;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const GetPolicyList = () => {
  return axios
    .get(`${URL}/createpolicy`)
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

const UpdatePolicyList = (_id, recData) => {
  // console.log("id : ", _id);
  // console.log("ticketNumber : ", recData);
  return axios.put(`${URL}/updatepolicy/${_id}`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      ToastError(res.message);
    } else {
      ToastSuccess(res.message)
      return res;
    }
  });
};

const DeletePolicyList = (_id) => {
  return axios
    .delete(`${URL}/deletepolicy/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        ToastError(res.message)
      } else {
        ToastError(res.message)
        return res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const FilterPolicyList = (recData) => {
  return axios.post(`${URL}/filterPolicyList`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};

const AutoFillPolicyDetails = (recData) => {
  return axios.post(`${URL}/verifypolicy`, recData).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};

const ReadPolicyFileByPolicyId = (_id) => {
  return axios
    .get(`${URL}/readPolicyFileByPolicyId/${_id}`)
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


const SaveComissionReceivableAmount = (_id, recData) => {
  return axios
    .put(`${URL}/saveComissionReceivableAmount/${_id}`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    });
};

const GetCommisionReceivableAmount = (_id) => {
  return axios
    .get(`${URL}/getComissionReceivableAmount/${_id}`)
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

const GetPolicyFindbyId = (_id) => {
  return axios
    .get(`${URL}/getPolicyById/${_id}`)
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

const VerifyPolicyNumber = (data) => {
  return axios.get(`${URL}/verifyPolicyNumber/${data}`).then((response) => {
    const res = response.data;
    if (res.error) {
      console.log(res.error);
    } else {
      return res;
    }
  });
};

const GetUserpayablePercentage = (_id) => {
  return axios
    .get(`${URL}/getUserpayablePercentage/${_id}`)
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

const GetBranchpayablePercentage = (_id) => {
  return axios
    .get(`${URL}/getBranchpayablePercentage/${_id}`)
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

const GetReceivablePayablePercentage = (_id) => {
  return axios
    .get(`${URL}/getReceivablePercentage/${_id}`)
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

const GetPolicyFileById = (_id) => {
  return axios
    .get(`${URL}/getPolicyFileById/${_id}`)
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

//policy maping Api

const CreatePolicyMappingService = (recData) => {
  return axios
    .put(`${URL}/createPolicyMapping`, recData)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    });
};

const GetPolicyMapping = (data , id) => {
  return axios
    .get(`${URL}/getPolicyMapping`,{headers: {requesttype: data , mappinguserid:id}})
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    });
};

const GetPolicyMappingByPolicyID = (_id) => {
  return axios
    .get(`${URL}/getPolicyMappingByPolicyID/${_id}`)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    });
};

const UpdatePolicyMapping = (data) => {
  return axios
    .patch(`${URL}/updatePolicyMapping`,data)
    .then((response) => {
      const res = response.data;
      if (res.error) {
        console.log(res.error);
      } else {
        return res;
      }
    });
};

export {
  PostSearchPolicy,
  LoginPortalData,//added by gokul..
  GetPolicyList,
  PostCreatePolicy,
  UpdatePolicyList,
  DeletePolicyList,
  FilterPolicyList,
  AutoFillPolicyDetails,
  SaveComissionReceivableAmount,
  GetCommisionReceivableAmount,
  GetPolicyFindbyId,
  VerifyPolicyNumber,
  GetUserpayablePercentage,
  GetBranchpayablePercentage,
  GetReceivablePayablePercentage,
  GetPolicyFileById,
  GetFilterCCEntry,
  unlinkTicketNumber,
  GetFilterCCEntryAll,
  ticketAlreadyExist,
  CreatePolicyMappingService,
  GetPolicyMapping,
  GetPolicyMappingByPolicyID,
  UpdatePolicyMapping,
  ReadPolicyFileByPolicyId
};
