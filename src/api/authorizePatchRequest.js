import axios from "axios";

const authorizePatchRequest = async (url, formData) => {
  if (localStorage.token) {
    const a = axios.create({
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        "Content-Type": "application/json",
      },
    });
    let baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
    return a
      .patch(baseURL, formData)
      .then((response) => {
        // handle success
        return response.data;
      })
      .catch((error) => {
        let res;
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log("error1", error.response.data);
          throw error.response.data;
        } else if (error.request) {
          // The request was made but no response was received
          console.log("error2");
          res = {
            message: "Network Error",
          };
          throw res;
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("error3");
          res = {
            message: "Something went wrong, Refresh page",
          };
          throw res;
        }
      });
  } else {
    const res = {
      message: "Login again to proceed",
    };
    throw res;
  }
};

export default authorizePatchRequest;
