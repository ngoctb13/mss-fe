import axiosClient from "./axiosClient";

const AdminAPI = {
    GetAll: () => {
        const url = `users/all-user`;
        return axiosClient.get(url);
    },
    // Thêm API mới ở đây
    DeactivateUser: (userId) => {
        const url = `users/deactivate/${userId}`;
        return axiosClient.put(url);
    }
}

export default AdminAPI;