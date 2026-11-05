# Diario del náufrago — lista de tareas

App hecha con Náufrago. Añade tareas (Enter), complétalas, **doble clic para editar** (Enter guarda, Esc cancela, vacío borra),
filtra por estado y limpia las hechas. Se guarda sola en `localStorage`.

```bash
npm install && npm run dev
npm test      # 3 tests e2e: añadir/filtrar/limpiar, edición, foco del input
```

Lo interesante para estudiar: [`src/store.js`](src/store.js) (acciones + reducer puro) y
[`src/components/TodoItem.jsx`](src/components/TodoItem.jsx) (alternar vista/edición con `ref` para dar foco).
