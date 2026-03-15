# SoftNova Backend

Implementación Express/Mongo migrada desde `productosNova/api` para que el workspace `softnova-react` sea autónomo.

## Requisitos

- Node.js 20+
- MongoDB local o URI compatible

## Configuración

1. Copia `.env.example` a `.env` y ajusta los valores:
	```env
	PORT=3000
	MONGODB_URI=mongodb://localhost:27017/productosNova
	JWT_SECRET=super-secret-key
	FRONTEND_URL=http://localhost:5173
	```
2. Instala dependencias:
	```bash
	cd backend
	npm install
	```
3. Ejecuta en desarrollo:
	```bash
	npm run dev
	```

La API expone las mismas rutas que el proyecto original (`/api/auth`, `/api/users`, `/api/albums`, `/uploads`, `/doc`).
