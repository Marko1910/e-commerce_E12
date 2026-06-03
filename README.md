# 🛍️ Ecommerce — Express.js + PostgreSQL + Next.js

Sistema básico de ecommerce con backend RESTful en **Express.js**, base de datos **PostgreSQL** y frontend en **Next.js**. Al registrar un producto, la imagen se obtiene automáticamente desde una **API externa** (Lorem Picsum).

> **Nota sobre la base de datos:** la rúbrica menciona MySQL; este proyecto usa **PostgreSQL**, que es el motor relacional gratuito que ofrece Render. El modelo de datos, las operaciones CRUD y el SQL son equivalentes. El esquema (`backend/src/db/schema.sql`) respeta exactamente los campos pedidos: `id`, `name`, `description`, `price`, `stock`, `image_url`.

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Stack tecnológico](#-stack-tecnológico)
- [Instalación local](#-instalación-local)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Ejemplos de llamadas](#-ejemplos-de-llamadas-a-la-api)
- [Despliegue en Render](#-despliegue-en-render)
- [URLs del proyecto en línea](#-urls-del-proyecto-en-línea)

---

## 📝 Descripción

Aplicación full‑stack que permite gestionar un catálogo de productos (crear, listar, ver, actualizar y eliminar). Características clave:

- **API RESTful** `/api/products` con operaciones CRUD completas.
- **Consumo de API externa**: al crear un producto sin imagen, el backend consulta **Lorem Picsum** y guarda una URL real en `image_url`.
- **Validación** de datos de entrada con **Joi**.
- **Manejo de errores** centralizado con respuestas HTTP consistentes.
- **Middleware de logging** de cada petición (método, ruta, status, duración).
- **Frontend** con grid de productos, formulario de alta/edición y borrado con confirmación.

---

## 🏗️ Arquitectura

```
examen_12/
├── backend/                  # API Express + PostgreSQL
│   ├── src/
│   │   ├── config/db.js          # Pool de conexiones (pg)
│   │   ├── middleware/
│   │   │   ├── logger.js          # Logging de requests
│   │   │   ├── validate.js        # Ejecuta esquemas Joi
│   │   │   ├── errorHandler.js    # Manejo central de errores + AppError
│   │   │   └── notFound.js        # 404
│   │   ├── validators/product.schema.js   # Esquemas Joi
│   │   ├── services/
│   │   │   ├── image.service.js   # Consumo de API externa (Picsum)
│   │   │   └── product.service.js # Lógica de negocio + queries
│   │   ├── controllers/product.controller.js
│   │   ├── routes/product.routes.js
│   │   ├── db/ (schema.sql, migrate.js, seed.js)
│   │   └── app.js
│   └── server.js
├── frontend/                 # Next.js (App Router, TS, Tailwind)
│   └── src/
│       ├── lib/ (api.ts, types.ts)
│       ├── components/ (ProductCard, ProductForm)
│       └── app/ (page.tsx, layout.tsx)
└── render.yaml               # Blueprint de despliegue
```

El backend sigue una arquitectura por capas con **módulos profundos**: las rutas solo enrutan, los controladores solo traducen HTTP, y los servicios concentran la lógica de negocio y el acceso a datos. Los detalles (HTTP externo, SQL, manejo de fallos) quedan ocultos tras interfaces simples.

---

## 🧰 Stack tecnológico

| Capa      | Tecnología                                   |
| --------- | -------------------------------------------- |
| Backend   | Node.js, Express.js, pg, Joi, Axios, CORS    |
| Base datos| PostgreSQL                                   |
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind 4 |
| API ext.  | Lorem Picsum (`https://picsum.photos`)       |
| Hosting   | Render (BD + backend + frontend)             |

---

## 💻 Instalación local

### Requisitos

- Node.js 18+
- Una base de datos PostgreSQL. Opciones:
  - PostgreSQL instalado localmente, **o**
  - Un contenedor Docker: `docker run -d -e POSTGRES_PASSWORD=test -e POSTGRES_DB=ecommerce -p 5432:5432 postgres:16-alpine`, **o**
  - La **External Database URL** de una BD gratuita en Render.

### 1) Backend

```bash
cd backend
npm install
cp env.example .env          # edita DATABASE_URL con tu conexión
npm run migrate              # crea la tabla products
npm run seed                 # (opcional) carga 5 productos de ejemplo
npm run dev                  # arranca en http://localhost:4000
```

### 2) Frontend

```bash
cd frontend
npm install
cp env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # arranca en http://localhost:3000
```

Abre <http://localhost:3000> 🎉

---

## 🔌 Endpoints de la API

Base: `/api/products`

| Método | Ruta                | Descripción                              |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/api/products`     | Lista todos los productos                |
| GET    | `/api/products/:id` | Obtiene un producto por ID               |
| POST   | `/api/products`     | Crea un producto (imagen automática)     |
| PUT    | `/api/products/:id` | Actualiza un producto                    |
| DELETE | `/api/products/:id` | Elimina un producto                      |
| GET    | `/api/health`       | Healthcheck                              |

**Formato de respuesta:** las respuestas exitosas devuelven `{ data: ... }` (y `count` en el listado). Los errores devuelven `{ error: { message, status, details? } }`.

---

## 📡 Ejemplos de llamadas a la API

> Reemplaza `localhost:4000` por la URL de Render en producción.

### Listar productos

```bash
curl http://localhost:4000/api/products
```

```json
{
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "Laptop Pro 15",
      "description": "Portatil de 15 pulgadas, 16GB RAM.",
      "price": 3499.9,
      "stock": 12,
      "image_url": "https://picsum.photos/id/231/600/400",
      "created_at": "2026-06-03T20:44:36.011Z",
      "updated_at": "2026-06-03T20:44:36.011Z"
    }
  ]
}
```

### Crear un producto (imagen automática desde la API externa)

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam HD","description":"1080p","price":159.9,"stock":20}'
```

```json
{
  "data": {
    "id": 6,
    "name": "Webcam HD",
    "price": 159.9,
    "stock": 20,
    "image_url": "https://picsum.photos/id/135/600/400"
  }
}
```

### Obtener por ID

```bash
curl http://localhost:4000/api/products/1
```

### Actualizar

```bash
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":2999.0,"stock":5}'
```

### Eliminar

```bash
curl -X DELETE http://localhost:4000/api/products/1
```

### Ejemplo de error de validación (Joi)

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" -d '{"name":"x","price":-5}'
```

```json
{
  "error": {
    "message": "Datos de entrada invalidos",
    "details": [
      { "field": "name", "message": "El nombre debe tener al menos 2 caracteres" },
      { "field": "price", "message": "El precio no puede ser negativo" }
    ],
    "status": 400
  }
}
```

---

## 🚀 Despliegue en Render

El archivo [`render.yaml`](./render.yaml) es un **Blueprint** que crea los tres servicios automáticamente.

### Opción A — Blueprint (recomendada)

1. Sube este repo a GitHub.
2. En Render: **New +** → **Blueprint** → conecta el repositorio.
3. Render detecta `render.yaml` y crea: la base de datos, el backend y el frontend.
4. Tras el primer deploy, copia la URL pública del **backend** (ej. `https://ecommerce-backend.onrender.com`).
5. En el servicio **frontend**, edita la variable `NEXT_PUBLIC_API_URL` con esa URL y vuelve a desplegar (la variable se hornea en el build).

### Opción B — Manual

1. **PostgreSQL**: New + → PostgreSQL (plan free). Copia la *Internal Database URL*.
2. **Backend**: New + → Web Service, root `backend`, build `npm install && npm run migrate`, start `npm start`, variable `DATABASE_URL`.
3. **Frontend**: New + → Web Service, root `frontend`, build `npm install && npm run build`, start `npm start`, variable `NEXT_PUBLIC_API_URL` con la URL del backend.

> El plan gratuito de Render "duerme" los servicios tras inactividad; la primera petición puede tardar ~30 s en despertar.

---

## 🌐 URLs del proyecto en línea

| Servicio  | URL                                                |
| --------- | -------------------------------------------------- |
| Frontend  | https://ecommerce-frontend-6f7t.onrender.com       |
| Backend   | https://ecommerce-backend-cjrt.onrender.com        |

> El backend expone los endpoints bajo `/api` (ej. <https://ecommerce-backend-cjrt.onrender.com/api/products>).

---

## 📄 Licencia

MIT — Marco Nurena.
