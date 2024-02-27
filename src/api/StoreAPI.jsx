import axiosClient from "./axiosClient";
const StoreAPI = {
  Create: (storeName, address, phoneNumber) => {
    const url = `/stores/create`;
    const data = { storeName, address, phoneNumber };
    return axiosClient.post(url, data);
  },
};
export default StoreAPI;
