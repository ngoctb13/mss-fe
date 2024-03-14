import axiosClient from "./axiosClient";
const SaleInvoiceDetailAPI = {
  GetProductExportReport: (filterParams) => {
    const url = "/sale-invoice-detail/stock-export";
    return axiosClient.get(url, { params: filterParams });
  },
  GetBySaleInvoice: (invoice) => {
    const url = `/sale-invoice-detail/all/by-sale-invoice/${invoice.id}`;
    return axiosClient.get(url);
  },
};
export default SaleInvoiceDetailAPI;
