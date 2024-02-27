import axiosClient from "./axiosClient";
const UserAPI = {
  GetUserById: (userId) => {
    const url = `/users/getUserById/${userId}`;
    return axiosClient.get(url);
  },
};
export default UserAPI;
