# API Documentation - Sñotify

## Base URL

```
https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify
```

## Endpoints

### Obtener todas las canciones

```javascript
GET /songs
```

**Respuesta:**
```json
[
  {
    "id": "1",
    "name": "Buenos Tiempos",
    "artist": "Dillom",
    "image": "https://...",
    "youtubeId": "kYvM-iR6FpQ",
    "album": "Por cesárea",
    "duration": "3:03"
  },
  ...
]
```

---

### Obtener una canción por ID

```javascript
GET /songs/:id
```

**Ejemplo:**
```javascript
GET /songs/1
```

**Respuesta:**
```json
{
  "id": "1",
  "name": "Buenos Tiempos",
  "artist": "Dillom",
  "image": "https://cdns-images.dzcdn.net/...",
  "youtubeId": "kYvM-iR6FpQ",
  "album": "Por cesárea",
  "duration": "3:03"
}
```

---

### Buscar canciones

```javascript
GET /songs?name=texto
```

**Ejemplo:**
```javascript
GET /songs?name=buenos
```

---

## Estructura de los datos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único de la canción |
| `name` | string | Nombre de la canción |
| `artist` | string | Nombre del artista |
| `image` | string | URL de la imagen/portada |
| `youtubeId` | string | ID del video de YouTube |
| `album` | string | Nombre del álbum |
| `duration` | string | Duración (formato MM:SS) |

---

## Ejemplo de uso en React

### Consumir la API desde un componente

```javascript
import { useState, useEffect } from 'react';

const API_URL = 'https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs';

function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return { songs, loading, error };
}

export default useSongs;
```

### Obtener una canción específica

```javascript
const fetchSongById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};
```

---

## YouTube Embed (Reproductor)

Para reproducir una canción, usá el ID de YouTube:

```javascript
const youtubeUrl = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
```

Parámetros recomendados:
- `autoplay=1` - Reproducción automática
- `iv_load_policy=3` - Ocultar controles
- `modestbranding=1` - Ocultar logo
- `rel=0` - No mostrar videos relacionados
- `controls=1` - Mostrar controles
- `fs=0` - Ocultar botón pantalla completa

---

##MockAPI vs Deezer

Este proyecto usa **MockAPI** para los datos, pero también podés usar **Dezer API** directamente para obtener datos adicionales:

### Buscar en Deezer

```javascript
const DEEZER_API = 'https://api.deezer.com/search';

// Buscar por artista y canción
const search = await fetch(
  `${DEEZER_API}?q=${artist}%20${trackName}`
);
```

### Obtener datos adicionales de Deezer

```javascript
// Deezer devuelve:
{
  "id": 123456,
  "title": "Nombre de la canción",
  "duration": 183,  // segundos
  "preview": "https://...mp3",  // 30 segundos preview
  "artist": { "name": "Artista" },
  "album": { 
    "title": "Álbum",
    "cover_big": "https://...jpg"
  }
}
```

---

## Notas

- La API de Deezer no requiere autenticación para búsquedas públicas
- Los previews de audio son de 30 segundos máximo
- rate limit: aproximadamente 2/segundos
