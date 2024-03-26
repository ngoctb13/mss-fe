import axiosClient from "./axiosClient";
const AdminApi = {
    GetAll: () => {
        const url = '/api/users/all-user'
        return axiosClient.get(url);
    }
}