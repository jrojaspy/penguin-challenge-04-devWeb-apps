import { h } from 'naufrago';
import { store } from '../store.js';
import { SearchBar } from './SearchBar.jsx';
import { Forecast } from './Forecast.jsx';

export function App() {
  const { query, status, data, error, unit } = store.getState();
  return (
    <main class="wrap">
      <h1>Clima del náufrago</h1>
      <p class="lead">¿Llueve en tu isla? Revisa antes de salir a pescar.</p>
      <SearchBar query={query} loading={status === 'loading'} />
      {status === 'error' && <p class="error" role="alert">{error}</p>}
      {data && <Forecast data={data} unit={unit} />}
      {!data && status !== 'error' && <p class="hint">Elige una ciudad para ver el clima actual y los próximos 5 días.</p>}
    </main>
  );
}
