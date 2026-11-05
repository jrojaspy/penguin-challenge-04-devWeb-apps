import { h } from 'naufrago';
import { actions } from '../store.js';

const FILTERS = [['all', 'Todas'], ['active', 'Pendientes'], ['done', 'Hechas']];

export function Footer({ left, total, filter }) {
  const done = total - left;
  return (
    <footer class="foot">
      <span class="count">{left === 1 ? '1 pendiente' : `${left} pendientes`}</span>
      <nav class="filters" aria-label="Filtro">
        {FILTERS.map(([id, label]) => (
          <button key={id} class={filter === id ? 'on' : ''} aria-pressed={filter === id} onClick={() => actions.setFilter(id)}>
            {label}
          </button>
        ))}
      </nav>
      <button class="clear" disabled={done === 0} onClick={() => actions.clearCompleted()}>
        Limpiar hechas{done ? ` (${done})` : ''}
      </button>
    </footer>
  );
}
