import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
interface ErrorResponse {
  message: string;
}

const authorizePost = async (
  url: string,
  data: unknown,
  config: AxiosRequestConfig = {},
) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw { message: "Login again to proceed" } as ErrorResponse;
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...((config.headers as Record<string, string>) || {}),
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;

  try {
    const response = await axios.post(baseURL, data, { headers });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      throw err.response.data;
    } else if (err.request) {
      throw { message: "Network Error" };
    } else {
      throw { message: "Something went wrong, Refresh page" };
    }
  }
};

export default authorizePost;
