# softnova-react

Stack: React 19 + Vite · Express 5 · MongoDB · Node ≥ 20

---

## Cómo correr el proyecto

### Requisitos previos
- Node.js 20 o superior
- MongoDB corriendo localmente en el puerto 27017

### 1 · Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd softnova-react

# backend
cd backend
npm install

# frontend (en otra terminal)
cd ../frontend
npm install
```

### 2 · Configurar variables de entorno del backend

Copia el archivo de ejemplo y edítalo si es necesario:

```bash
cd backend
copy .env.example .env
```

Contenido por defecto (funciona sin cambios para desarrollo local):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/productosNova
JWT_SECRET=super-secret-key
FRONTEND_URL=http://localhost:5173
UPLOADS_DIR=uploads
```

### 3 · Levantar el proyecto

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Corre en `http://localhost:3000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Corre en `http://localhost:5173`

---

## Estructura del proyecto

```
softnova-react/
├── backend/
│   ├── server.js                  # Entry point: carga .env, conecta MongoDB, inicia Express
│   ├── app.js                     # Configura la app: CORS, rutas, middlewares, Swagger UI
│   ├── config/
│   │   ├── db.js                  # Conexión Mongoose con MONGODB_URI
│   │   └── swagger.json           # Especificación OpenAPI 3.x (visible en /doc)
│   ├── controllers/
│   │   ├── albumController.js     # CRUD completo de álbumes: filtros, paginación, stats
│   │   ├── authController.js      # Login, register, logout, perfil (/me) + JWT
│   │   └── userController.js      # CRUD de usuarios con validación de edad y rol
│   ├── middlewares/
│   │   ├── auth.js                # verifyToken + requireRole(...roles)
│   │   └── error.js               # Manejo centralizado de errores (Mongoose, JWT, 404)
│   ├── models/
│   │   ├── Album.js               # Schema: nombre, artista, versión, precio, stock, foto…
│   │   └── User.js                # Schema: nombre, correo, rol, contraseña (hash bcrypt)
│   ├── routes/
│   │   ├── albumRoutes.js         # /api/albums — con Multer para subida de fotos
│   │   ├── authRoutes.js          # /api/auth — login, register, logout, me
│   │   └── userRoutes.js          # /api/users — Admin+Gerente, delete solo Admin
│   ├── validators/
│   │   └── album.js               # Middlewares de validación y sanitización de álbumes
│   ├── .env.example               # Plantilla de variables de entorno
│   └── package.json
│
└── frontend/
    └── src/
        ├── main.jsx               # Entry point React: monta <App> en #root
        ├── App.jsx                # Raíz del árbol de componentes, renderiza <AppRouter>
        ├── api/
        │   └── client.js          # Axios configurado: base URL, token en headers, logout en 401
        ├── constants/
        │   └── navigation.js      # HOME_BY_ROLE y NAVIGATION (fuente de verdad de rutas)
        ├── providers/
        │   └── AppProviders.jsx   # QueryClientProvider + BrowserRouter + Devtools
        ├── router/
        │   ├── AppRouter.jsx      # Todas las rutas de la app (públicas + protegidas)
        │   └── ProtectedRoute.jsx # Guard: redirige si no autenticado o sin el rol correcto
        ├── layouts/
        │   ├── DashboardLayout.jsx  # Shell autenticado: Topbar + Sidebar + Outlet
        │   └── DashboardLayout.css
        ├── styles/
        │   ├── global.css         # Design tokens, reset, tipografía base
        │   └── marketing.css      # Estilos de la landing: navbar, hero, modales, botones
        ├── components/
        │   ├── navigation/
        │   │   ├── Sidebar.jsx    # Menú lateral con links filtrados por rol
        │   │   ├── Sidebar.css
        │   │   ├── Topbar.jsx     # Barra superior: logo, búsqueda, logout
        │   │   └── Topbar.css
        │   └── ui/
        │       ├── Loader.jsx           # Spinner animado (3 puntos)
        │       ├── EmptyState.jsx       # Pantalla vacía sin resultados
        │       ├── ErrorState.jsx       # Pantalla de error con botón de retry
        │       ├── PageHeader.jsx       # Encabezado de página con slot de acciones
        │       └── ConfirmDialog.jsx    # Modal de confirmación para acciones destructivas
        ├── features/
        │   ├── auth/
        │   │   ├── api.js          # login, logout, register, profile (/me)
        │   │   ├── hooks.js        # useAuthSession — sincroniza sesión al montar
        │   │   ├── store.js        # Zustand + localStorage: token, user, expiresAt
        │   │   └── pages/
        │   │       └── LoginPage.jsx   # Página /login con redirect a home según rol
        │   ├── albums/
        │   │   ├── api.js          # CRUD + búsqueda + stats de álbumes
        │   │   ├── hooks.js        # useAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum
        │   │   ├── pages/
        │   │   │   └── AlbumsPage.jsx  # Catálogo con búsqueda, tarjetas y modales
        │   │   └── components/
        │   │       ├── AlbumCard.jsx         # Tarjeta de álbum con badge de stock
        │   │       ├── AlbumDetailModal.jsx  # Modal de detalle (editar/eliminar para Admin)
        │   │       └── AlbumFormModal.jsx    # Formulario crear/editar álbum
        │   ├── users/
        │   │   ├── api.js          # CRUD de usuarios
        │   │   ├── hooks.js        # useUsers, useCreateUser, useUpdateUser, useDeleteUser
        │   │   ├── pages/
        │   │   │   └── UsersPage.jsx   # Tabla de usuarios con badges de rol
        │   │   └── components/
        │   │       └── UserFormModal.jsx  # Formulario crear/editar usuario
        │   └── dashboard/
        │       └── pages/
        │           ├── AdminHomePage.jsx    # Home para Admin: acceso a Álbumes y Usuarios
        │           ├── GerenteHomePage.jsx  # Home para Gerente: acceso a Álbumes y Usuarios
        │           ├── CajeroHomePage.jsx   # Home para Usuario/Cajero: solo Álbumes
        │           └── RoleHomePage.css     # Estilos compartidos del hero y banda de marcas
        └── pages/public/
            ├── LandingPage.jsx    # Página pública /: modales de login y registro integrados
            └── NotFoundPage.jsx   # Página 404 para rutas no encontradas
```

---

## Elementos universales — listos para usar tal cual

Estos archivos no necesitan modificarse para nuevas pantallas o features. Se pueden importar directamente.

### Estilos globales

| Archivo | Qué contiene |
|---------|-------------|
| `frontend/src/styles/global.css` | Reset, variables CSS, tipografía base, scroll, utilidades |
| `frontend/src/styles/marketing.css` | Navbar, hero, modales, botones de la landing page |
| `frontend/src/features/dashboard/pages/RoleHomePage.css` | Hero y banda de marcas del dashboard (`.rh-hero`, `.rh-brands`) |

### Componentes UI reutilizables

Todos están en `frontend/src/components/ui/` y cada uno ya tiene su propio CSS:

| Componente | Cuándo usarlo |
|------------|--------------|
| `<Loader />` | Spinner de carga mientras llega data de la API |
| `<EmptyState />` | Pantalla vacía cuando no hay resultados |
| `<ErrorState />` | Pantalla de error cuando falla una petición |
| `<PageHeader />` | Encabezado de página con título, descripción y botón de acción |
| `<ConfirmDialog />` | Modal de confirmación para acciones destructivas (ej. eliminar) |

Ejemplo de uso:
```jsx
import PageHeader from '@/components/ui/PageHeader.jsx'
import Loader from '@/components/ui/Loader.jsx'

// dentro del componente:
<PageHeader title="Mis Productos" description="Gestiona el catálogo." />
{isLoading && <Loader />}
```

### Infraestructura de auth y rutas

| Archivo | Qué hace |
|---------|----------|
| `frontend/src/features/auth/store.js` | Estado global de sesión (Zustand + localStorage) |
| `frontend/src/router/ProtectedRoute.jsx` | Bloquea rutas según autenticación o rol |
| `frontend/src/constants/navigation.js` | `HOME_BY_ROLE` y `NAVIGATION` — fuente de verdad de rutas por rol |

### Middleware backend

| Archivo | Qué hace |
|---------|----------|
| `backend/middlewares/auth.js` | `verifyToken` y `requireRole(...roles)` listos para proteger cualquier ruta |
| `backend/middlewares/errorHandler.js` | Manejo centralizado de errores para todos los endpoints |
