import axiosClient from "./axiosClient";
const ImportInvoiceAPI = {
  GetBySupplier: (supplierId) => {
    const url = `/import-invoice/all/by-supplier/${supplierId}`;
    return axiosClient.get(url);
  },
};
export default ImportInvoiceAPI;
