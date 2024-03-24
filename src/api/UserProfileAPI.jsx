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
    const url = `/profile/current-user/change-password?newPassword=${newPassword}`;
    return axiosClient.post(url);
  },
};
export default UserProfileAPI;
