import axiosClient from "./axiosClient";
const StoreAPI = {
  Create: (storeName, address, phoneNumber) => {
    const url = `/stores/create`;
    const data = { storeName, address, phoneNumber };
    return axiosClient.post(url, data);
  },
  createImportProductInvoiceRequest: (
    supplierId,
    productDetails,
    pricePaid
  ) => {
    return {
      supplierId,
      productDetails,
      pricePaid,
    };
  },
  createSaleInvoiceRequest: (customerId, productDetails, pricePaid) => {
    return {
      customerId,
      productDetails,
      pricePaid,
    };
  },
  createImportProductInvoice: (importInvoiceRequest) => {
    const url = `stores/import-invoice`;
    return axiosClient.post(url, importInvoiceRequest);
  },
  createSaleInvoice: (saleInvoiceRequest) => {
    const url = `stores/create-sale-invoice`;
    return axiosClient.post(url, saleInvoiceRequest);
  },
};
export default StoreAPI;
