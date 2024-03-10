import axiosClient from "./axiosClient";
const SupplierAPI = {
  Create: (supplier) => {
    const url = `/suppliers/create`;
    return axiosClient.post(url, supplier);
  },
  GetAll: () => {
    const url = `/suppliers/all`;
    return axiosClient.get(url);
  },
  Deactive: async (supplierId) => {
    const url = `/suppliers/deactivate/${supplierId}`;
    return axiosClient.put(url);
  },
  Update: (supplier) => {
    const url = `/suppliers/update/${supplier.id}`;
    return axiosClient.put(url);
  },
  GetSupplierHaveDebt: () => {
    const url = `/suppliers/all/supplier-have-debt`;
    return axiosClient.get(url);
  },
};
export default SupplierAPI;
