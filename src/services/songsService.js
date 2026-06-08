const BASE_URL = `${import.meta.env.VITE_API_URL}/api/songs`;

function unwrapApiData(payload) {
  return payload?.data ?? payload;
}

// Punto unico de acceso HTTP para datos de canciones.
function buildSongsUrl({ page = 1, limit = 10, search = "", genre = "" } = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (search.trim()) {
    url.searchParams.set("name", search.trim());
  }
  if (genre.trim()) {
    url.searchParams.set("genre", genre.trim());
  }
  return url.toString();
}

function buildArtistSearchUrl({
  page = 1,
  limit = 10,
  artist = "",
  genre = "",
} = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (artist.trim()) {
    url.searchParams.set("artist", artist.trim());
  }
  if (genre.trim()) {
    url.searchParams.set("genre", genre.trim());
  }
  return url.toString();
}

function mergeUniqueSongs(...collections) {
  const byId = new Map();
  collections.flat().forEach((song) => {
    byId.set(song.id, song);
  });
  return Array.from(byId.values());
}

export const songsService = {
  async getSongs(options = {}) {
    const response = await fetch(buildSongsUrl(options));
    if (!response.ok) {
      throw new Error("No pudimos cargar las canciones en este momento.");
    }
    const payload = await response.json();
    return unwrapApiData(payload);
  },

  async getSongsByArtist(options = {}) {
    const response = await fetch(buildArtistSearchUrl(options));
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw new Error("No pudimos completar la busqueda por artista.");
    }
    const payload = await response.json();
    return unwrapApiData(payload);
  },

  async getSongById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error("No pudimos cargar la cancion seleccionada.");
    }
    const payload = await response.json();
    return unwrapApiData(payload);
  },

  async searchSongs(search, options = {}) {
    const normalizedSearch = search.trim();
    if (!normalizedSearch) {
      return this.getSongs(options);
    }

    const [byName, byArtist] = await Promise.all([
      this.getSongs({ ...options, search: normalizedSearch }),
      this.getSongsByArtist({ ...options, artist: normalizedSearch }),
    ]);

    return mergeUniqueSongs(byName, byArtist);
  },
};

export default songsService;
