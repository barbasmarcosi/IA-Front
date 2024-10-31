import axios from "axios";

import { API_KEY, API_URL } from "./global";

export const defaultErrorHandler = (axiosError) => {
  let error;
  try {
    error = axiosError.response.data.message;
  } finally {
    error = error ? error : "Error interno.";
  }
  return Promise.reject(error);
};

export const defaultSuccessHandler = (response) => {
  return Promise.resolve(response.data);
};

export function createApi({
  baseURL = API_URL,
  timeout = 20000000000,
  headers = {
    "Authorization": API_KEY,
    "Content-Type": "application/json",
  },
  errorHandler = defaultErrorHandler,
  successHandler = defaultSuccessHandler,
  instance = axios.create(),
}) {
  instance.defaults.baseURL = baseURL;
  instance.defaults.timeout = timeout;
  instance.defaults.headers = { ...headers };
  instance.defaults.validateStatus = (status) => {
    return status < 300;
  };
  instance.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error)
  );
  return instance;
}

export const userApi = createApi({
  baseURL: `http://localhost:8000/`,
});
