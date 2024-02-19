import axios from "./axios";

export const getProductsRequest = async () => axios.get(`/store`);
export const createProductRequest = (product) => axios.post(`/store`, product);
export const updateProductRequest = (product) => axios.get(`/store/${product}`, product);
export const deleteProductRequest = (id) => axios.delete(`/store/${id}`);
export const getProductRequest = (productCode) => axios.get(`/store/${productCode}`);