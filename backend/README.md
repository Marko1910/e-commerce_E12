# Backend — API Ecommerce (Express + PostgreSQL)

API RESTful para gestión de productos con consumo de API externa para imágenes.

## Scripts

| Comando          | Acción                                            |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Servidor en modo watch (recarga automática)       |
| `npm start`      | Servidor en producción                            |
| `npm run migrate`| Crea la tabla `products` (`src/db/schema.sql`)    |
| `npm run seed`   | Carga 5 productos de ejemplo                      |

## Variables de entorno

Copia `env.example` a `.env`:

```
PORT=4000
DATABASE_URL=postgres://usuario:password@localhost:5432/ecommerce
```

`DATABASE_URL` activa SSL automáticamente cuando no apunta a `localhost` (necesario en Render).

## Estructura

```
src/
├── config/db.js              Pool de conexiones pg
├── middleware/               logger, validate (Joi), errorHandler, notFound
├── validators/               esquemas Joi de productos
├── services/                 image.service (API externa), product.service (negocio + SQL)
├── controllers/              capa HTTP delgada
├── routes/                   definición de endpoints
├── db/                       schema.sql, migrate.js, seed.js
└── app.js                    construcción de la app Express
```

Consulta el [README principal](../README.md) para endpoints, ejemplos y despliegue.
