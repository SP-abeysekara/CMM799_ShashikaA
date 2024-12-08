import axios from 'axios';
const API_URL = 'http://localhost:8000/recommend'; // Changed to http and correct port
const recendpoint = axios.create({
    baseURL: API_URL,
});

export default recendpoint
