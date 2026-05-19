# S-otify

## Catedra

- Facultad de Informatica - Programacion Web Avanzada
- Trabajo Practico: React Parte II

## Integrantes

- Gaston Berhau
- Fabrizio Brollo
- Valentin Bustamante
- Lucas Ortiz

## Descripcion

S-otify es una SPA de musica desarrollada con React, React Router y Tailwind CSS. La aplicacion consume una API simulada en MockAPI para listar canciones, buscar por cancion o artista, aplicar filtros por genero y visualizar detalles por elemento.

## Funcionalidades principales

- Home con cards de canciones.
- Busqueda letra a letra por cancion y artista.
- Filtro por genero.
- Navegacion entre Home, Details y Favorites.
- Vista de detalle con informacion ampliada por id.
- Exportacion a PDF desde details.
- Estilo visual inspirado en Spotify.

## Tecnologias

- React 19
- Vite 8
- Tailwind CSS 4
- React Router DOM
- jsPDF

## Estructura del proyecto

- src/main.jsx: entrada de la app.
- src/App.jsx: layout global y rutas.
- src/pages: vistas principales.
- src/components: componentes reutilizables.
- src/services: acceso a MockAPI.
- src/hooks: logica compartida de estado.
- src/constants: configuraciones globales.
- src/utils: utilidades auxiliares.
- docs: documentacion tecnica.
- scripts: scripts de carga de datos.

Mas detalle en docs/ARCHITECTURE.md.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Instalacion y ejecucion

1. Clonar repositorio:

	git clone <URL_DEL_REPO>

2. Entrar al proyecto:

	cd S-otify

3. Instalar dependencias:

	npm install

4. Iniciar entorno de desarrollo:

	npm run dev

5. Verificar calidad:

	npm run lint

6. Build de produccion:

	npm run build

## Scripts

- npm run dev
- npm run build
- npm run preview
- npm run lint
- npm run seed:songs
- npm run test
- npm run test:run

## API

Base URL utilizada:

https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs

Documentacion de endpoints y contrato: docs/API.md.

## Testing automático

Este proyecto incorpora testing automático para validar componentes, páginas, hooks y funcionalidades principales de la aplicación.

### Librerías utilizadas

- Vitest
- React Testing Library
- jest-dom
- user-event
- jsdom

### Comandos de testing

Ejecutar tests en modo desarrollo:

```bash
npm run test

## Notas de diseno

- Se centralizo todo acceso HTTP en src/services/songsService.js.
- Se reutiliza src/hooks/useAsyncStatus.js para estados async.
- Se aplico una estetica visual tipo Spotify manteniendo componentes modulares.

