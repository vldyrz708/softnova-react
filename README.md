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
