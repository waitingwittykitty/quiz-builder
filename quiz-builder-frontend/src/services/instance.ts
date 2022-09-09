import axios from 'axios';

import config from '../config';

const instance = axios.create({
  baseURL: config.apiUrl,
  timeout: 1000,
});

instance.interceptors.request.use(function (request) {
  const token = localStorage.getItem('token');

  if (token) {
    const Authorization = 'Bearer ' + token;

    if (request.headers) {
      request.headers.Authorization = Authorization;
    } else {
      request.headers = { Authorization };
    }
  }

  return request;
});

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === '401') {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
