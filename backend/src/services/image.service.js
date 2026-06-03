import axios from "axios";

/**
 * Servicio de consumo de API externa para obtener imagenes de productos.
 *
 * Usa Lorem Picsum (https://picsum.photos):
 *  - Endpoint JSON /v2/list devuelve una lista de imagenes con su download_url.
 *  - Se elige una imagen al azar y se devuelve su URL real.
 *
 * Si la API externa falla (red, timeout, etc.), se usa un fallback determinista
 * basado en "seed" para que la creacion del producto nunca se bloquee.
 *
 * Modulo profundo: expone una sola funcion simple (fetchProductImage) y oculta
 * toda la complejidad de la peticion HTTP, el azar y el manejo de fallos.
 */

const PICSUM_LIST_URL = "https://picsum.photos/v2/list";
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Obtiene una URL de imagen desde Lorem Picsum.
 * @param {string} seed - texto (ej. el nombre del producto) usado para el fallback.
 * @returns {Promise<string>} URL de la imagen.
 */
export async function fetchProductImage(seed = "product") {
  try {
    // Pide una pagina aleatoria para variar las imagenes entre productos.
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const { data } = await axios.get(PICSUM_LIST_URL, {
      params: { page: randomPage, limit: 30 },
      timeout: REQUEST_TIMEOUT_MS,
    });

    if (Array.isArray(data) && data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      // Normalizamos a un tamano consistente para las tarjetas de producto.
      if (random?.id) {
        return `https://picsum.photos/id/${random.id}/600/400`;
      }
      if (random?.download_url) {
        return random.download_url;
      }
    }

    return buildFallbackUrl(seed);
  } catch (err) {
    console.warn(
      `[image.service] No se pudo consumir Picsum (${err.message}). Usando fallback.`
    );
    return buildFallbackUrl(seed);
  }
}

/**
 * URL de respaldo determinista: la misma "seed" siempre da la misma imagen.
 */
function buildFallbackUrl(seed) {
  const safeSeed = encodeURIComponent(String(seed).trim() || "product");
  return `https://picsum.photos/seed/${safeSeed}/600/400`;
}
