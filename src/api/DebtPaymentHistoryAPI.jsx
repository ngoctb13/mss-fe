import axiosClient from "./axiosClient";
const DebtPaymentHistoryAPI = {
  GetByCustomer: (customerId) => {
    const url = `/debt-payment-history/all/by-customer/${customerId}`;
    return axiosClient.get(url);
  },
  GetByFilter: (filterParams) => {
    const url = "/debt-payment-history/all/by-customer/filter";
    return axiosClient.get(url, { params: filterParams });
  },
};
export default DebtPaymentHistoryAPI;
