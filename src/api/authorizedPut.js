import axios from 'axios';

const authorizePut = async (url, data, config = {}) => {
  if (!localStorage.token) {
    throw { message: 'Login again to proceed' };
  }

  const headers = {
    Authorization: `Bearer ${localStorage.token}`,
    ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...config.headers,
  };


  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/${url}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('error1', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.log('error2');
      throw { message: 'Network Error' };
    } else {
      console.log('error3');
      throw { message: 'Something went wrong, Refresh page' };
    }
  }
};

export default authorizePut;

