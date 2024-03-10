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
  GetCustomerHaveDebt: () => {
    const url = `/customer/all/customer-have-debt`;
    return axiosClient.get(url);
  },
  Deactive: async (customerId) => {
    const url = `/customer/change-status/${customerId}`;
    return axiosClient.put(url);
  },
  GetAllByStore: () => {
    const url = `/customer/all/by-store`;
    return axiosClient.get(url);
  },
};
export default CustomerAPI;
