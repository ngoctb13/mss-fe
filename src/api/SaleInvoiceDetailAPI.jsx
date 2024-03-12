import axiosClient from "./axiosClient";
const SaleInvoiceDetailAPI = {
  GetProductExportReport: (filterParams) => {
    const url = "/sale-invoice-detail/stock-export";
    return axiosClient.get(url, { params: filterParams });
  },
};
export default SaleInvoiceDetailAPI;
