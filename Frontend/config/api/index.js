import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.186:5000/api', // api ash
  // baseURL: 'http://192.168.226.249:5000/api', // backendc   url
  // baseURL: 'http://192.168.91.133:5000/api', // api zaryab
});

export default api;




































