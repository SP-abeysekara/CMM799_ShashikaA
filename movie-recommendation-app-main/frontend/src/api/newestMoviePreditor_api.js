import axios from 'axios';
const API_URL = 'http://localhost:8002'; // Changed to http and correct port
const newetpredict = axios.create({
    baseURL: API_URL,
});

export default newetpredict
