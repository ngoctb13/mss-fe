import axiosClient from "./axiosClient";
const DebtPaymentHistoryAPI = {
  GetByCustomer: (customerId) => {
    const url = `/debt-payment-history/all/by-customer/${customerId}`;
    return axiosClient.get(url);
  },
};
export default DebtPaymentHistoryAPI;
