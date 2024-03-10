import axiosClient from "./axiosClient";
const SaleInvoiceAPI = {
  GetByCustomer: (customerId) => {
    const url = `/sale-invoice/all/by-customer/${customerId}`;
    return axiosClient.get(url);
  },
  GetByFilter: (filterParams) => {
    const url = "/sale-invoice/filter";
    return axiosClient.get(url, { params: filterParams });
  },
};
export default SaleInvoiceAPI;
