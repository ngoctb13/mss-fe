import axiosClient from "./axiosClient";
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
};
export default ProductAPI;
