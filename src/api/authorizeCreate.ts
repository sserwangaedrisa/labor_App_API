import axios from "axios";

const authorizeCreate = async (url: string, data: unknown) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw { message: "Login again to proceed" };
  }

  const baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
  console.log("baseURL", baseURL);

  try {
    const response = await axios.post(baseURL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("error1", error.response.data);
      throw error.response.data;
    }

    if (error.request) {
      console.log("error2");
      throw { message: "Network Error" };
    }

    console.log("error3");
    throw { message: "Something went wrong, Refresh page" };
  }
};

export default authorizeCreate;
