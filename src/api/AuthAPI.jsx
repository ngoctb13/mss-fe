import axiosClient from "./axiosClient";
const AuthAPI = {
  Login: (username, password) => {
    const url = `/auth/login`;
    const data = { username, password };
    return axiosClient.post(url, data);
  },
  Register: (username, password) => {
    const url = `/auth/register`;
    const data = { username, password };
    return axiosClient.post(url, data);
  },
};
export default AuthAPI;
