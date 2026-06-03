# Frontend — Ecommerce (Next.js)

Interfaz del catálogo de productos. Consume la API del backend.

## Scripts

| Comando         | Acción                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Servidor de desarrollo (`:3000`)        |
| `npm run build` | Build de producción                     |
| `npm start`     | Sirve el build de producción            |

## Variables de entorno

Copia `env.example` a `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> Esta variable se hornea en el build. En Render debe apuntar a la URL pública del backend.

## Estructura

```
src/
├── lib/
│   ├── api.ts      Cliente de la API (oculta fetch + errores)
│   └── types.ts    Tipos Product / ProductInput
├── components/
│   ├── ProductCard.tsx   Tarjeta de producto
│   └── ProductForm.tsx   Modal crear/editar con validación
└── app/
    ├── page.tsx    Listado + orquestación CRUD
    └── layout.tsx
```

Consulta el [README principal](../README.md) para más detalles.
