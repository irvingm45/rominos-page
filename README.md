# Róminos: sitio web del salón de eventos

Sitio de una sola página para Róminos (San Martín Texmelucan, Puebla). Next.js (App Router) + TypeScript + Tailwind CSS + Motion, exportado como sitio estático.

## Comandos

```bash
pnpm install
pnpm dev        # http://localhost:3000 (genera las fotos optimizadas antes de arrancar)
pnpm build      # escribe el sitio estático en /out, listo para cualquier hosting estático
pnpm typecheck  # revisa los tipos de TypeScript
```

## Publicación (GitHub Actions)

`.github/workflows/deploy.yml` construye el sitio en cada push y pull request, y publica la rama `main` en GitHub Pages.

- Activa Pages una vez: **Settings → Pages → Source: GitHub Actions**.
- En GitHub Pages el sitio vive en `/<nombre-del-repo>/`; el workflow pasa ese prefijo como `NEXT_PUBLIC_BASE_PATH` y la URL pública como `NEXT_PUBLIC_SITE_URL`. Con un dominio propio el prefijo queda vacío solo.
- Las rutas a archivos de `public/` en `<img>` o `<source>` van con `asset("/ruta")` de `src/lib/asset.ts`, para que funcionen con y sin prefijo.

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Precios, servicios, paquetes de decoración, inflables | `src/data/pricing.ts` |
| Teléfono, WhatsApp, redes, dirección, horario, dominio | `src/data/business.ts` |
| Tipos de evento y su montaje sugerido, galería, pasos, preguntas frecuentes, reseñas | `src/data/content.ts` |
| Fotos | `img/` (originales del cliente) y `photos/source/`; se registran en `scripts/optimize-images.mjs` |

Todo lo que está marcado con `TODO` es un dato de ejemplo que el cliente debe confirmar antes de publicar.

**Agregar un servicio nuevo:** añade una entrada a `services` en `pricing.ts` con `kind: "addon"` (precio fijo que el visitante activa), `kind: "included"` (sin costo) o un paquete/inflable en su lista. Aparece solo en la sección de servicios, en el cotizador y en el mensaje de WhatsApp.

**Reseñas:** agrega reseñas reales a `testimonials` en `content.ts`; la sección aparece sola cuando la lista tiene algo.

**Fotos nuevas:** copia la foto a `img/`, agrégala a `sources` en `scripts/optimize-images.mjs` y úsala por su id. El script genera AVIF y WebP en varios tamaños.

**Quitar las animaciones al hacer scroll:** borra `<RevealObserver />` en `src/app/page.tsx`; todo queda visible sin animación.
