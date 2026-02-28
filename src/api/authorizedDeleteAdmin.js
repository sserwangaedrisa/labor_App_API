import axios from 'axios';

const authorizedDeleteAdmin = async (url, data) => {
    if (localStorage.token) {
      const a = axios.create({
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
      });
      let baseURL = `${import.meta.env.VITE_API_URL}/${url}`;
      
      console.log('Request URL:', baseURL);
      console.log('Request Data:', data);
  
      return a
        .delete(baseURL, { data })
        .then((response) => {
          console.log('Response Data:', response.data);
          return response.data;
        })
        .catch((error) => {
          let res;
          if (error.response) {
            console.log('Error Response Data:', error.response.data);
            throw error.response.data;
          } else if (error.request) {
            console.log('Error Request Data:', error.request);
            res = {
              message: 'Network Error',
            };
            throw res;
          } else {
            console.log('Error Message:', error.message);
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
  
  export default authorizedDeleteAdmin;
  