import axios from "./axios";

export const getSalesRequest = async () => axios.get(`/sale`);
export const createSalesRequest = async (sale) => axios.post(`/sale`, sale);
export const deleteSaleRequest = async (id) => axios.delete(`/sale/${id}`);
export const getSaleRequest = async (id) => axios.get(`/sale/${id}`);