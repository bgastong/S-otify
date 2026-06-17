const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function unwrapApiData(payload) {
  return payload?.data ?? payload;
}

async function handleResponse(response, fallbackMessage) {
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || fallbackMessage);
  }

  const payload = await response.json();
  return unwrapApiData(payload);
}

function encodeQueryParam(value) {
  return encodeURIComponent(value);
}

function buildSongsQuery({ page = 1, limit = 20, search = "", genre = "" } = {}) {
  const params = [];
  const trimmedSearch = search.trim();
  const trimmedGenre = genre.trim();

  if (trimmedSearch) {
    params.push(`search=${encodeQueryParam(trimmedSearch)}`);
  }

  params.push(`page=${encodeQueryParam(String(page))}`);
  params.push(`limit=${encodeQueryParam(String(limit))}`);

  if (trimmedGenre) {
    params.push(`genre=${encodeQueryParam(trimmedGenre)}`);
  }

  return params.join("&");
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

  async getSongById(id) {
    const response = await fetch(`${API_URL}/songs/${id}`);

    return handleResponse(
      response,
      "No pudimos cargar la cancion seleccionada.",
    );
  },

  async searchSongs(search, options = {}) {
    return this.getSongs({
      ...options,
      search,
    });
  },

  async getFavorites(userId = "anonymous", page = 1, limit = 20) {
    const params = new URLSearchParams();

    params.set("userId", userId);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const response = await fetch(`${API_URL}/favorites?${params.toString()}`);

    return handleResponse(
      response,
      "No pudimos cargar tus canciones favoritas.",
    );
  },

  async isFavorite(songId, userId = "anonymous") {
    const params = new URLSearchParams();

    params.set("userId", userId);

    const response = await fetch(
      `${API_URL}/songs/${songId}/favorites?${params.toString()}`,
    );

    return handleResponse(
      response,
      "No pudimos verificar si la cancion esta en favoritos.",
    );
  },

  async addFavorite(songId, userId = "anonymous") {
    const response = await fetch(`${API_URL}/songs/${songId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    return handleResponse(
      response,
      "No pudimos agregar la cancion a favoritos.",
    );
  },

  async removeFavorite(songId, userId = "anonymous") {
    const response = await fetch(`${API_URL}/songs/${songId}/favorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    return handleResponse(
      response,
      "No pudimos quitar la cancion de favoritos.",
    );
  },
};

export default songsService;
