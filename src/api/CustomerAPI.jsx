import axiosClient from "./axiosClient";
const CustomerAPI = {
  Create: (customer) => {
    const url = `/customer/create`;
    return axiosClient.post(url, customer);
  },
  GetAll: () => {
    const url = `/customer/all`;
    return axiosClient.get(url);
  },
  Deactive: async (customerId) => {
    const url = `/customer/change-status/${customerId}`;
    return axiosClient.put(url);
  },
};
export default CustomerAPI;
