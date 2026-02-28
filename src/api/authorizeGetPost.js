import axios from "axios";

const authorizeGetRequest = async (url) => {
  const axiosInstance = axios.create({
    headers: {
      Authorization: localStorage.token ? `Bearer ${localStorage.token}` : "",
      "Content-Type": "application/json",
    },
  });

  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;

  try {
    const response = await axiosInstance.get(baseURL);
    return response.data;
  } catch (error) {
    let res;
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
      res = { message: "Network Error" };
      throw res;
    } else {
      console.error("Error setting up request:", error.message);
      res = { message: "Something went wrong, please refresh the page" };
      throw res;
    }
  }
};

export default authorizeGetRequest;
