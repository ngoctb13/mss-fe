import axiosClient from "./axiosClient";
const AuthAPI = {
  Login: (username, password) => {
    const url = `/v1/auth/authenticate`;
    const data = { username, password };
    return axiosClient.post(url, data);
  },
  Register: (username, password, storeName, storeAddress) => {
    const url = `/v1/auth/register`;
    const data = { username, password, storeName, storeAddress };
    return axiosClient.post(url, data);
  },
};
export default AuthAPI;
