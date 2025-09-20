

import axios from 'axios';
import { getFromStorage } from '../utils/storage';

// export const API_URL = 'http://10.0.2.2:8000/api';
export const API_URL = 'http://192.168.8.116:8000/api';

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Async token injection
$api.interceptors.request.use(
  async (config) => {
    // const token = await SecureStore.getItemAsync('token');
    const token = await getFromStorage('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default $api;











// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api', // Replace with your FastAPI base URL
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;




// import axios from 'axios';

// export const API_URL = 'http://localhost:8000/api';


// const $api = axios.create({
//     withCredentials: true,
//     baseURL: API_URL
// });

// $api.interceptors.request.use((config)=>{
//     config.headers.Authorization = `Bearear ${localStorage.getItem('token')}`
//     return config;
// });

// export default $api;


