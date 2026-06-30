const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function unwrapApiData(payload) {
  return payload?.data ?? payload;
}

async function handleResponse(response, fallbackMessage) {
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || fallbackMessage);
  }

  const payload = await response.json();
  return unwrapApiData(payload);
}

function buildSongsQuery({
  page = 1,
  limit = 20,
  search = "",
  genre = "",
} = {}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (genre.trim()) {
    params.set("genre", genre.trim());
  }

  return params.toString();
}

export const songsService = {
  async getSongs(options = {}) {
    const query = buildSongsQuery(options);
    const response = await fetch(`${API_URL}/songs?${query}`);

    return handleResponse(
      response,
      "No pudimos cargar las canciones en este momento.",
    );
  },

  async getSongsByArtist(options = {}) {
    const query = buildSongsQuery({
      ...options,
      search: options.artist || options.search || "",
    });

    const response = await fetch(`${API_URL}/songs?${query}`);

    return handleResponse(
      response,
      "No pudimos completar la búsqueda por artista.",
    );
  },

  async getSongById(id) {
    const response = await fetch(`${API_URL}/songs/${id}`);

    return handleResponse(
      response,
      "No pudimos cargar la canción seleccionada.",
    );
  },

  async searchSongs(search, options = {}) {
    return this.getSongs({
      ...options,
      search,
    });
  },

  async getFavorites(page = 1, limit = 20) {
    const token = localStorage.getItem("token");

    if (!token) {
      return [];
    }

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    const response = await fetch(`${API_URL}/favorites?${params.toString()}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    const result = await handleResponse(
      response,
      "No pudimos cargar tus canciones favoritas.",
    );

    if (Array.isArray(result)) {
      return result.map((favorite) => favorite.song || favorite).filter(Boolean);
    }

    if (Array.isArray(result?.songs)) {
      return result.songs;
    }

    if (Array.isArray(result?.favorites)) {
      return result.favorites
        .map((favorite) => favorite.song || favorite)
        .filter(Boolean);
    }

    return [];
  },

  async isFavorite(songId) {
    const token = localStorage.getItem("token");

    if (!token) {
      return { isFavorite: false };
    }

    const favorites = await this.getFavorites();

    return {
      isFavorite: favorites.some((song) => String(song.id) === String(songId)),
    };
  },

  async addFavorite(songId) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Tenés que iniciar sesión para agregar favoritos.");
    }

    const response = await fetch(`${API_URL}/favorites/${songId}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    });

    return handleResponse(
      response,
      "No pudimos agregar la canción a favoritos.",
    );
  },

  async removeFavorite(songId) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Tenés que iniciar sesión para quitar favoritos.");
    }

    const response = await fetch(`${API_URL}/favorites/${songId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });

    return handleResponse(
      response,
      "No pudimos quitar la canción de favoritos.",
    );
  },
};

export default songsService;