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
};
export default SupplierAPI;
