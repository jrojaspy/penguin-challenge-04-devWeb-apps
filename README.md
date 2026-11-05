# Náufrago · Apps de ejemplo 🌴

Dos aplicaciones construidas **solo** con el framework [Náufrago](../naufrago) (JSX + Virtual DOM + Flux), sin React, Vue ni Angular.

| App | Qué demuestra | 
|---|---|
| [`todo-app`](todo-app) — *Diario del náufrago* | Flux completo, listas con `key`, inputs controlados, edición en línea con `ref`, filtros, persistencia en `localStorage` |
| [`weather-app`](weather-app) — *Clima del náufrago* (bonus) | Acciones asíncronas, estados `loading/ok/error`, descarte de respuestas obsoletas, API real (Open-Meteo, sin clave) |

## Cómo ejecutarlas

Requiere Node 18+. Los dos repositorios deben estar **uno junto al otro**:

```
proyectos/
├── naufrago/          ← framework
└── naufrago-apps/     ← este repo
```

```bash
cd naufrago-apps/todo-app       # o weather-app
npm install
npm run dev                     # servidor de desarrollo
npm test                        # tests end-to-end en jsdom
npm run build                   # producción (≈10 KB, 4.5 KB gzip)
```

Cuando publiques el framework en NPM, cambia en cada `package.json`:
`"naufrago": "file:../../naufrago"` → `"naufrago": "^1.0.0"`.

## Arquitectura (igual en las dos apps)

```
src/
├── store.js          Actions + Reducer + Store (Flux)
├── components/       Funciones que reciben props y devuelven JSX
├── main.jsx          mount(App, #root, [store])
└── styles.css
```

La vista **nunca** modifica el estado: llama a `actions.algo()`, el reducer produce un estado nuevo y `mount` re-renderiza con diff.

## Probar el framework de un amigo (bonus)

1. Clona su repo junto a los demás o instálalo: `npm install ../framework-de-mi-amigo` (o desde NPM).
2. Crea una copia: `cp -r todo-app todo-app-amigo`.
3. En `package.json` reemplaza la dependencia `naufrago` por la suya.
4. Ajusta los imports y la configuración de JSX en `vite.config.js` (`jsxFactory`/`jsxFragment`) a lo que exponga su framework.
5. Lo que debas cambiar en la app es una medida real de qué tan portable es cada API. Anótalo en `docs/BITACORA.md`.
