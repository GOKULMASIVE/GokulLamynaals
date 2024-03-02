import axios from "axios";

axios.interceptors.request.use(function (config) {
  config.headers["ClientId"] = localStorage.getItem("clientID")
  config.headers["UserId"] = localStorage.getItem("UserId")
  config.headers["UserType"] = localStorage.getItem("userType")
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  response.headers["ClientId"] = localStorage.getItem("token")
  return response;
}, function (error) {

  return Promise.reject(error);
});

export default axios;