import axios from 'axios';

const authorizeUpdateRequest = async (url, data) => {
  if (localStorage.token) {
    const a = axios.create({
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json',
      },
    });
    let baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
    return a
      .put(baseURL, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let res;
        if (error.response) {
          console.log('error1', error.response.data);
          throw error.response.data;
        } else if (error.request) {
          console.log('error2');
          res = {
            message: 'Network Error',
          };
          throw res;
        } else {
          console.log('error3');
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

export default authorizeUpdateRequest;
