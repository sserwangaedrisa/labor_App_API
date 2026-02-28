import axios from 'axios';

const authorizeDeleteRequestWData = async (url, data) => {
  if (localStorage.token) {
    const a = axios.create({
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json',
      },
    });
    let baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
    
    
    return a
      .delete(baseURL, { data })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let res;
        if (error.response) {
          throw error.response.data;
        } else if (error.request) {
          res = {
            message: 'Network Error',
          };
          throw res;
        } else {
          res = {
            message: 'Something went wrong, Refresh page',
          };
          throw res;
        }
      });
  } else {
    const res = {
      message: 'Login again to proceed',
    };
    throw res;
  }
};

export default authorizeDeleteRequestWData;