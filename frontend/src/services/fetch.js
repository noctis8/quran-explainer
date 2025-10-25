import axios from 'axios'

export default async function fetch(url, params = {}) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (err) {
        console.error('API fetch error:', err);
        throw err;
    }
}
