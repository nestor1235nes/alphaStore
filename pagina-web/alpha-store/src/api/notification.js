import axios from "./axios";

export const getMessageRequest = () => axios.get(`/notification`);

export const sendMessageRequest = async (message) => axios.post(`/notification`, message);



export const daleteMessageRequest = (id) => axios.delete(`/notification/${id}`);
