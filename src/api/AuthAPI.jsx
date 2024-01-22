import axiosClient from "./axiosClient";
const AuthAPI = {
  Login: (username, password) => {
    const url = `/v1/auth/authenticate`;
    const data = { username, password };
    return axiosClient.post(url, data);
  },
  Register: (email, password, fullName) => {
    const url = `/common/register`;
    const data = { email, password, fullName };
    return axiosClient.post(url, data);
  },
};
export default AuthAPI;
