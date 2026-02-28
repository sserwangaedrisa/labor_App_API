import axios, { AxiosError } from "axios";

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

const authorizePostRequest = async <T = unknown>(
  url: string,
  formData: unknown,
): Promise<T> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject({
      success: false,
      message: "Login again",
    });
  }

  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;

  try {
    const response = await instance.post<T>(baseURL, formData);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      console.log("error1");
      throw err.response.data;
    } else if (err.request) {
      console.log("error2");
      throw err.request;
    } else {
      console.log("error3");
      throw err.message;
    }
  }
};

export default authorizePostRequest;
