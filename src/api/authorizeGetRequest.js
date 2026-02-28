import axios from "axios";

const authorizeGetRequest = async (url, params, query = {}) => {
  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
  
 
  const queryParams = typeof params === 'object' && !Array.isArray(params) ? params : query;

  try {
    const response = await axios.get(baseURL, {
      headers: { "Content-Type": "application/json" },
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error("Network Error");
      throw { message: "Network Error" };
    } else {
      console.error("Unexpected Error");
      throw { message: "Something went wrong, please refresh the page" };
    }
  }
};

export default authorizeGetRequest;
