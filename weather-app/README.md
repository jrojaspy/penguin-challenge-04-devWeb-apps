# Clima del náufrago

Clima actual y pronóstico de 5 días con [Open-Meteo](https://open-meteo.com) (gratis, sin clave). Cambia entre °C y °F.

```bash
npm install && npm run dev
npm test      # usa una API simulada: no necesita internet
```

Lo interesante: [`src/store.js`](src/store.js) — `actions.search()` lanza `SEARCH_STARTED` → `SEARCH_SUCCEEDED | SEARCH_FAILED`
con un `requestId` para que, si llegan respuestas desordenadas, gane la **última búsqueda** y no la última respuesta
(hay un test para eso).

> Nota: el servicio meteorológico se consulta directamente desde el navegador; los tests no lo llaman,
> así que la integración con la API real conviene verificarla manualmente con `npm run dev`.
