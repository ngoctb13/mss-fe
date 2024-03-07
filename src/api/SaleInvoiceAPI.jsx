import axiosClient from "./axiosClient";
const SaleInvoiceAPI = {
  GetByCustomer: (customerId) => {
    const url = `/sale-invoice/all/by-customer/${customerId}`;
    return axiosClient.get(url);
  },
};
export default SaleInvoiceAPI;
