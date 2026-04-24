const BASE_URL = 'https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs';

export const api = {
  async getSongs() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Error fetching songs');
    }
    return response.json();
  },

  async getSongById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error fetching song');
    }
    return response.json();
  },

  async searchSongs(query) {
    const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Error searching songs');
    }
    return response.json();
  },
};

export default api;