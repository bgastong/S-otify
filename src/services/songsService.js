const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function handleResponse(response, fallbackMessage) {
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || fallbackMessage);
  }

  const payload = await response.json();

  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }

  return payload;
}
function buildSongsQuery({ page = 1, limit = 20, search = '', genre = '' } = {}) {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (genre.trim()) {
    params.set('genre', genre.trim());
  }

  return params.toString();
}

export const songsService = {
  async getSongs(options = {}) {
    const query = buildSongsQuery(options);

    const response = await fetch(`${API_URL}/songs?${query}`);

    return handleResponse(
      response,
      'No pudimos cargar las canciones en este momento.'
    );
  },

  async getSongsByArtist(options = {}) {
    const query = buildSongsQuery({
      ...options,
      search: options.artist || options.search || '',
    });

    const response = await fetch(`${API_URL}/songs?${query}`);

    return handleResponse(
      response,
      'No pudimos completar la busqueda por artista.'
    );
  },

  async getSongById(id) {
    const response = await fetch(`${API_URL}/songs/${id}`);

    return handleResponse(
      response,
      'No pudimos cargar la cancion seleccionada.'
    );
  },

  async searchSongs(search, options = {}) {
    return this.getSongs({
      ...options,
      search,
    });
  },

async getFavorites(userId = 'anonymous', page = 1, limit = 20) {
  const params = new URLSearchParams();

  params.set('userId', userId);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(`${API_URL}/favorites?${params.toString()}`);

  const favorites = await handleResponse(
    response,
    'No pudimos cargar tus canciones favoritas.'
  );

  return Array.isArray(favorites)
    ? favorites.map((favorite) => favorite.song || favorite).filter(Boolean)
    : [];
},
  async isFavorite(songId, userId = 'anonymous') {
    const params = new URLSearchParams();

    params.set('userId', userId);

    const response = await fetch(
      `${API_URL}/songs/${songId}/favorites?${params.toString()}`
    );

    return handleResponse(
      response,
      'No pudimos verificar si la cancion esta en favoritos.'
    );
  },

  async addFavorite(songId, userId = 'anonymous') {
    const response = await fetch(`${API_URL}/songs/${songId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    return handleResponse(
      response,
      'No pudimos agregar la cancion a favoritos.'
    );
  },

  async removeFavorite(songId, userId = 'anonymous') {
    const response = await fetch(`${API_URL}/songs/${songId}/favorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    return handleResponse(
      response,
      'No pudimos quitar la cancion de favoritos.'
    );
  },
};

export default songsService;