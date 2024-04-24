import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.226.249:5000/api', // backendc   url
  // baseURL: 'http://192.168.91.133:5000/api', // api zaryab
  // baseURL: 'http://192.168.100.56:5000/api', // api ash
});

export default api;




































