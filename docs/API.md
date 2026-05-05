# API de S-otify

## Base URL

https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs

## Contrato de datos

Cada cancion incluye:

- id: string
- name: string
- artist: string
- image: string
- youtubeId: string
- album: string
- duration: string (MM:SS)

## Endpoints usados por la app

1. Listado paginado

GET /songs?page=1&limit=10

2. Busqueda por nombre

GET /songs?page=1&limit=10&name=buenos

3. Detalle por id

GET /songs/:id

## Mapeo al codigo

La capa de acceso se centraliza en src/services/songsService.js:

- getSongs({ page, limit, search })
  - Construye query params y retorna array de canciones.
- getSongById(id)
  - Retorna la cancion cuando existe.
  - Retorna null cuando el backend responde 404.
  - Lanza Error en otros estados no exitosos.
- searchSongs(search, options)
  - Atajo de getSongs con parametro search.

## Regla de arquitectura

No usar fetch directo desde pages/components.
Toda llamada HTTP debe pasar por src/services.# API de S-otify

## Base URL

https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs

## Contrato de datos

Cada cancion incluye:

- id: string
- name: string
- artist: string
- image: string
- youtubeId: string
- album: string
- duration: string (MM:SS)

## Endpoints usados por la app

1. Listado paginado

GET /songs?page=1&limit=10

2. Busqueda por nombre

GET /songs?page=1&limit=10&name=buenos

3. Detalle por id

GET /songs/:id

## Mapeo al codigo

La capa de acceso se centraliza en src/services/songsService.js:

- getSongs({ page, limit, search })
  - Construye query params y retorna array de canciones.
- getSongById(id)
  - Retorna la cancion cuando existe.
  - Retorna null cuando el backend responde 404.
  - Lanza Error en otros estados no exitosos.
- searchSongs(search, options)
  - Atajo de getSongs con parametro search.

## Regla de arquitectura

No usar fetch directo desde pages/components.
Toda llamada HTTP debe pasar por src/services.
