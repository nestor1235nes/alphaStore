import axios from "./axios";

export const getProductsRequest = () => axios.get(`/store`);
export const createProductRequest = (product) => axios.post(`/store`, product);
export const updateProductRequest = (product) => axios.get(`/store/${product._id}`, product);
export const daleteProductRequest = (id) => axios.delete(`/store/${id}`);
export const getProductRequest = (id) => axios.get(`/store/${id}`);