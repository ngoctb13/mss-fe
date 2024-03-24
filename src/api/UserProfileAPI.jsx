import axiosClient from "./axiosClient";
const UserProfileAPI = {
  GetCurrentUserProfile: () => {
    const url = `/profile/current-user`;
    return axiosClient.get(url);
  },
  UpdateCurrentUserProfile: (request) => {
    const url = `/profile/current-user/update`;
    return axiosClient.post(url, request);
  },
  ChangeCurrentUserPassword: (newPassword) => {
    const url = "/profile/current-user/change-password";
    return axiosClient.post(url, { newPassword });
  },
};
export default UserProfileAPI;
