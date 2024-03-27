import axiosClient from "./axiosClient";
import data from "bootstrap/js/src/dom/data";
const ProductAPI = {
  GetAll: () => {
    const url = `/products/all`;
    return axiosClient.get(url);
  },
  Create: (product) => {
    const url = `/products/create`;
    return axiosClient.post(url, product);
  },
  Update: (product) => {
    const url = `/products/update/${product.id}`;
    return axiosClient.put(url, product);
  },
  GetByNameContain: (nameInput) => {
    const url = `/products/by-name/${nameInput}`;
    return axiosClient.get(url);
  },
  SetStatus: (productId) => {
    const url = `/products/change-status/${productId}`;
    return axiosClient.put(url); // Sử dụng PUT thay vì GET
  },
  AddLocationForProduct : (productId, selectedLocations) => {
    const url = `/storage-locations/add-location-for-product`;
    const requestBody = {
      productId: productId,
      storageLocationIds: selectedLocations
    };
    return axiosClient.post(url, requestBody);
  },
  AddOrUpdateLocationForProduct : (productId, selectedLocations) => {
    const url = `/storage-locations/add-or-update-location-for-product`;
    const requestBody = {
      productId: productId,
      storageLocationIds: selectedLocations
    };
    return axiosClient.post(url, requestBody);
  }
};
export default ProductAPI;
