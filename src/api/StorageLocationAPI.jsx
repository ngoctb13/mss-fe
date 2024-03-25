import axiosClient from "./axiosClient";
const StorageLocationAPI = {
  GetAll: () => {
    const url = `/storage-locations/by-store`;
    return axiosClient.get(url);
  },
  Create: (data) => {
    const url = `/storage-locations/create`;
    return axiosClient.post(url, data);
  },
  Update: (data, storageLocationId) => {
    const url = `/storage-locations/update/${storageLocationId}`;
    return axiosClient.put(url, data);
  },
  SetStatus: (data, storageLocationId) =>{
    const url = `/storage-locations/deactivate/${storageLocationId}`;
    return axiosClient.put(url, data);
  },
  GetProductLocation: function() {
    return axiosClient.get(`/storage-locations/products/locations`);
  },
};
export default StorageLocationAPI;
