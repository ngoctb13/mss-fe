import axiosClient from "./axiosClient";
const CustomerAPI = {
  Create: (customerName, phoneNumber, address) => {
    const url = `/customer/create`;
    const data = { customerName, phoneNumber, address };
    return axiosClient.post(url, data);
  },
  GetAll: () => {
    const url = `/customer/all`;
    return axiosClient.get(url);
  },
};
export default CustomerAPI;
