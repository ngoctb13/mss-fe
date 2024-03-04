import axiosClient from "./axiosClient";
const UserAPI = {
  GetUserById: (userId) => {
    const url = `/users/getUserById/${userId}`;
    return axiosClient.get(url);
  },
  GetAllStaffs: () => {
    const url = `/users/all-staff`;
    return axiosClient.get(url);
  },
  CreateStaffAccount: (staff) => {
    const url = `/users/createStaff`;
    return axiosClient.post(url, staff);
  },
};
export default UserAPI;
