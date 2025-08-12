# Ecommerce Backend — Clean API (Express + Mongo)

API limpia lista para front React. Sin vistas ni estáticos.

## Endpoints
- `GET /api/products` — query: `page`, `limit`, `sort`, `category`, `q` → **{ data, total, page, limit }**
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me` (auth)
- `GET /api/orders` (auth)
- `POST /api/orders` (auth)

## Arranque
```bash
cp .env.example .env
# edita MONGO_URI, FRONT_ORIGIN, JWT_SECRET
npm i
npm run dev
