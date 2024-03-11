import axiosClient from "./axiosClient";
const ImportInvoiceAPI = {
  GetBySupplier: (supplierId) => {
    const url = `/import-invoice/all/by-supplier/${supplierId}`;
    return axiosClient.get(url);
  },
  GetByFilter: (filterParams) => {
    const url = "/import-invoice/filter";
    return axiosClient.get(url, { params: filterParams });
  },
};
export default ImportInvoiceAPI;
