# 🎵 S-otify

Single Page Application inspirada en Spotify desarrollada para la materia **Programación Web Avanzada** de la **Facultad de Informática - UNCo**.

S-otify permite explorar un catálogo de canciones, reproducirlas, filtrarlas por nombre, artista o género, visualizar información detallada y administrar favoritos persistentes mediante autenticación de usuarios.

---

# 👥 Integrantes

- Gastón Berhau
- Fabrizio Brollo
- Valentín Bustamante
- Lucas Ortiz

---

# 🚀 Características

La aplicación implementa las siguientes funcionalidades:

- 🎵 Catálogo de canciones
- 🔍 Búsqueda por nombre o artista
- 🎼 Filtro por género
- ❤️ Favoritos persistentes
- 🔐 Registro e inicio de sesión
- 🚪 Cierre de sesión
- 👤 Persistencia de usuario mediante JWT
- 📄 Vista de detalle de canciones
- ▶️ Reproductor integrado
- 🌎 Internacionalización (Español / Inglés)
- 📱 Diseño Responsive
- 🎨 Interfaz inspirada en Spotify
- 🧪 Testing automático con Vitest

---

# 🛠 Tecnologías utilizadas

## Frontend

- React 19
- Vite 8
- React Router DOM
- Tailwind CSS
- i18next
- jsPDF

## Testing

- Vitest
- React Testing Library
- jest-dom
- user-event
- jsdom

## Backend consumido

La aplicación consume una API REST propia desarrollada con:

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

# 📂 Estructura del proyecto

```
src
│
├── components
│
├── pages
│
├── context
│
├── hooks
│
├── services
│
├── constants
│
├── i18n
│
├── utils
│
├── assets
│
├── App.jsx
│
└── main.jsx
```

### Componentes principales

- Header
- Footer
- LayoutShell
- Player
- SongCard
- SongDetails
- AsyncState

### Páginas

- Home
- Favorites
- Login
- Register

---

# 🔐 Autenticación

La autenticación utiliza **JWT (JSON Web Token)**.

El flujo implementado es:

```
Registro
      │
      ▼
Inicio de sesión
      │
      ▼
JWT
      │
      ▼
AuthContext
      │
      ▼
Peticiones autenticadas
```

El usuario permanece autenticado hasta cerrar sesión.

---

# ❤️ Favoritos

Los favoritos son persistentes.

Cada usuario posee su propia lista de favoritos almacenada en la base de datos del backend.

No se utiliza LocalStorage para almacenar favoritos.

---

# 🌎 Internacionalización

Idiomas soportados:

- Español
- Inglés

Implementado mediante **i18next**.

---

# 🌐 API

El frontend consume la API REST del proyecto backend.

Variable de entorno:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# ⚙️ Instalación

Clonar el repositorio

```bash
git clone https://github.com/bgastong/S-otify.git
```

Entrar al proyecto

```bash
cd S-otify
```

Instalar dependencias

```bash
npm install
```

Crear archivo `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecutar

```bash
npm run dev
```

La aplicación estará disponible en

```
http://localhost:5173
```

---

# 📦 Scripts disponibles

Desarrollo

```bash
npm run dev
```

Build

```bash
npm run build
```

Vista previa

```bash
npm run preview
```

Testing interactivo

```bash
npm run test
```

Testing CI

```bash
npm run test:run
```

---

# 🧪 Testing

El proyecto incluye pruebas automáticas para los principales componentes.

Actualmente se encuentran testeados:

- Home
- Header
- Footer
- LayoutShell
- Player
- SongCard
- SongDetails
- AsyncState
- useAsyncStatus

Todos los tests deben pasar correctamente ejecutando:

```bash
npm run test
```

---

# 📱 Responsive

La interfaz fue desarrollada utilizando Tailwind CSS siguiendo un diseño responsive inspirado en Spotify.

Se adapta correctamente a:

- Desktop
- Tablet
- Mobile

---

# 📌 Requisitos

- Node.js 20+
- npm 10+

---

# 🚀 Deploy

Frontend:

Vercel

Backend:

API REST propia desplegada en Vercel.

---

# 📖 Materia

Programación Web Avanzada

Facultad de Informática

Universidad Nacional del Comahue

---

# © Licencia

Proyecto académico desarrollado con fines educativos.