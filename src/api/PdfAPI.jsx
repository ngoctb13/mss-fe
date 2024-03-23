import axiosClient from "./axiosClient";
const PdfAPI = {
  DownloadSaleInvoicePdf: (invoiceId) => {
    const url = `/pdf/sale-invoice/${invoiceId}`;
    // Note: axios' response type 'blob' is used to handle binary data like PDF
    return axiosClient.get(url, { responseType: "blob" });
  },
  DownloadSaleInvoicePdfV2: (invoiceId) => {
    const url = `/pdf/sale-invoice/v2/${invoiceId}`;
    // Note: axios' response type 'blob' is used to handle binary data like PDF
    return axiosClient.get(url, { responseType: "blob" });
  },
  DownloadTransactionsPdf: (filterParams) => {
    const url = `/pdf/transactions/by-filter`;
    // Note: axios' response type 'blob' is used to handle binary data like PDF
    return axiosClient.get(url, { responseType: "blob", params: filterParams });
  },
};
export default PdfAPI;
