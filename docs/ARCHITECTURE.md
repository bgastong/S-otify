# Arquitectura del proyecto

## Vision general

S-otify es una SPA con React Router. La app sigue una estructura por responsabilidades:

- pages: define pantallas
- components: piezas visuales reutilizables
- services: comunicacion con APIs
- hooks: logica compartida de estado
- constants: configuraciones y valores globales
- utils: helpers puros o utilidades transversales

## Mapa de carpetas

- src/main.jsx
  - Arranque de React y render del arbol principal.
- src/App.jsx
  - Define rutas y estructura global (Header, contenido, Footer).
- src/pages/home
  - Listado de canciones, busqueda y filtros.
- src/pages/details
  - Detalle de cancion por id y exportacion PDF.
- src/pages/favorites
  - Vista de favoritos (placeholder para evolucion futura).
- src/components/Header
  - Navegacion superior.
- src/components/Footer
  - Pie de pagina con enlaces y datos del equipo.
- src/components/LayoutShell
  - Contenedor de layout para mantener ancho/espaciados coherentes.
- src/components/SearchBar
  - Input de busqueda reutilizable.
- src/components/FilterSong
  - Filtro por genero.
- src/services/songsService.js
  - Unico punto de acceso a MockAPI para canciones.
- src/hooks/useAsyncStatus.js
  - Manejo reutilizable de loading/error para operaciones async.
- src/constants/appConfig.js
  - Nombre de app y enlaces de navegacion.
- src/utils/exportPDF.js
  - Exportacion a PDF de una cancion.

## Flujo de datos

1. La pagina invoca un servicio (songsService).
2. El servicio consulta MockAPI y devuelve datos normalizados.
3. La pagina usa useAsyncStatus para loading/error.
4. Los componentes renderizan datos sin conocer detalles de API.

## Reglas de mantenimiento

- Toda llamada HTTP nueva debe ir en src/services.
- Ninguna pagina debe usar fetch directo.
- Evitar logica duplicada de loading/error; usar useAsyncStatus.
- Reutilizar constants para textos/config compartida.
- Si un archivo crece demasiado, dividir por responsabilidad.

## Scripts operativos

- scripts/upload-songs.js: carga dataset inicial en MockAPI.
- Ejecutar con: npm run seed:songs