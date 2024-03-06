import axiosClient from "./axiosClient";
const StorageLocationAPI = {
  GetAll: () => {
    const url = `/storage-locations/by-store`;
    return axiosClient.get(url);
  },
};
export default StorageLocationAPI;
