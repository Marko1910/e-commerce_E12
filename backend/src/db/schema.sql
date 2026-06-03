-- Esquema de la base de datos del ecommerce (PostgreSQL)

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150)   NOT NULL,
  description TEXT           NOT NULL DEFAULT '',
  price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   VARCHAR(500),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
