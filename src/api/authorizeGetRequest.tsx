// authorizeGetRequest.ts
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
  success?: boolean;
  [key: string]: any;
}

interface RequestParams {
  [key: string]: string | number | boolean | undefined | null;
}

const authorizeGetRequest = async <T = any,>(
  url: string,
  params?: RequestParams,
): Promise<T> => {
  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;

  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get<T>(baseURL, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      params: params || {},
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response) {
      console.error("Server Error:", axiosError.response.data);
      throw axiosError.response.data;
    } else if (axiosError.request) {
      console.error("Network Error");
      throw { message: "Network Error" } as ErrorResponse;
    } else {
      console.error("Unexpected Error");
      throw {
        message: "Something went wrong, please refresh the page",
      } as ErrorResponse;
    }
  }
};

export default authorizeGetRequest;
