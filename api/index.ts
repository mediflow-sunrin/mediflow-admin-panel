import axios, { AxiosError } from "axios";

export const apiInstance = (credentials?: boolean) => {
  credentials = credentials ?? true;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: credentials,
    headers: {
      "Content-Type": `${
        !credentials ? "multipart/form-data" : "application/json"
      }`,
    },
  });

  instance.interceptors.response.use(
    (config) => config,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        return {
          status: error.response?.status,
          message: (error.response as any)?.data.message,
        };
      }
      return error;
    }
  );

  return instance;
};

export const authInstance = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  });

  instance.interceptors.response.use(
    (config) => config,
    async (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        !window.location.href.includes("/login")
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return error;
    }
  );

  return instance;
};
