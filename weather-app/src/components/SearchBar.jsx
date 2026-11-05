import { h } from 'naufrago';
import { actions } from '../store.js';

const SUGGESTIONS = ['Asunción', 'Madrid', 'Tokio', 'Reikiavik'];

export function SearchBar({ query, loading }) {
  return (
    <div class="search">
      <div class="row">
        <input
          aria-label="Ciudad"
          placeholder="Busca una ciudad"
          value={query}
          onInput={(e) => actions.setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && actions.search(query)}
        />
        <button class="go" disabled={loading} onClick={() => actions.search(query)}>
          {loading ? 'Buscando…' : 'Ver clima'}
        </button>
      </div>
      <div class="chips">
        {SUGGESTIONS.map((c) => (
          <button key={c} class="chip" onClick={() => actions.search(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}
