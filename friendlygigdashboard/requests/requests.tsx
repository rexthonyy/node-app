import axios from "axios";
import { API_URL, NEXT_URL } from "../config";

export const apiRequest = async (
  url: string,
  method: any,
  data: any,
  token?: string,
  params?: any
) => {
  return axios(`${API_URL}/${url}`, {
    method: method,
    params: params && params,
    data: data && data,
    headers: {
      Accept: "application/json",
      "Content-Type":
        url === "upload" ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const nextRequest = async (
  url: string,
  method: any,
  data?: any,
  params?: any
) => {
  return axios(`${NEXT_URL}/${url}`, {
    params: params && params,
    method: method,
    data: data && data,
    headers: {
      Accept: "application/json",
      "Content-Type":
        url === "upload" ? "multipart/form-data" : "application/json",
    },
  });
};
