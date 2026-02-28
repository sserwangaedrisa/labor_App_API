import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const authorizePatchRequestWOT = async <T = unknown>(
  url: string,
  formData: unknown,
): Promise<T> => {
  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;

  try {
    const response = await instance.patch<T>(baseURL, formData);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      console.log("error1", err.response.data);
      throw err.response.data;
    } else if (err.request) {
      console.log("error2");
      const res: ErrorResponse = {
        message: "Network Error",
      };
      throw res;
    } else {
      console.log("error3");
      const res: ErrorResponse = {
        message: "Something went wrong, Refresh page",
      };
      throw res;
    }
  }
};

export default authorizePatchRequestWOT;
