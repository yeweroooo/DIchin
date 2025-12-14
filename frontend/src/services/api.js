import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend Proxy
    timeout: 600000,
});

export const getTrending = () => api.get('/home/trending');
export const getForYou = () => api.get('/home/foryou');
export const getNew = () => api.get('/home/new');
export const getPopularSearch = () => api.get('/search/popular');
export const search = (query) => api.get(`/search?query=${query}`);
export const getEpisodes = (bookId) => api.get(`/drama/episodes?bookId=${bookId}`);
export const getDramaDetail = (bookId) => api.get(`/drama/detail?bookId=${bookId}`);

export default api;
