import { h } from 'naufrago';
import { actions } from '../store.js';

export function Header({ draft }) {
  return (
    <header class="masthead">
      <h1>Diario del náufrago</h1>
      <p class="sub">Lo que hay que hacer antes de que baje la marea.</p>
      <input
        class="new"
        placeholder="Escribe una tarea y pulsa Enter"
        aria-label="Nueva tarea"
        value={draft}
        onInput={(e) => actions.setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && actions.add()}
      />
    </header>
  );
}
