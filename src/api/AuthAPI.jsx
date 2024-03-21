import axiosClient from "./axiosClient";
const AuthAPI = {
  Login: (username, password) => {
    const url = `/auth/login`;
    const data = { username, password };
    return axiosClient.post(url, data);
  },
  Register: (username, email, password) => {
    const url = `/auth/register`;
    const data = { username, email, password };
    return axiosClient.post(url, data);
  },
  ForgotPassword: (email) => {
    const url = `/auth/forgot-password?email=${email}`;
    return axiosClient.post(url);
  },
  ResetPassword: (token, newPassword) => {
    const url = `/auth/reset-password?token=${token}&newPassword=${newPassword}`;
    return axiosClient.post(url);
  },
  CheckTokenValidity: (token) => {
    const url = `/auth/check-token-valid?token=${token}`;
    return axiosClient.get(url);
  },
  CheckUsername: (username) => {
    const url = `/auth/check-username?username=${username}`;
    return axiosClient.get(url);
  },
  CheckEmail: (email) => {
    const url = `/auth/check-email?email=${email}`;
    return axiosClient.get(url);
  },
};
export default AuthAPI;
