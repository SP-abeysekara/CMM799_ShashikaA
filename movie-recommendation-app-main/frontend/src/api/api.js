import axios from 'axios';
const API_URL = 'http://localhost:3002/api'; // Changed to http and correct port
const endpoint = axios.create({
    baseURL: API_URL,
});
export default endpoint
