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
  GetById: (saleInvoiceId) => {
    const url = `/sale-invoice/find-by-id/${saleInvoiceId}`;
    return axiosClient.get(url);
  },
  GetRecentInvoices: () => {
    const url = `/sale-invoice/recent-invoice`;
    return axiosClient.get(url);
  },
};
export default SaleInvoiceAPI;
