// FLUX con acciones asíncronas: la "action creator" lanza varias acciones a lo largo del tiempo.
import { createStore, bindActions, dispatcher } from 'naufrago';
import { fetchWeather } from './api.js';

export const initialState = { query: '', status: 'idle', requestId: 0, data: null, error: '', unit: 'C' };

const sync = bindActions({
  setQuery: (text) => ({ type: 'QUERY_CHANGED', text }),
  toggleUnit: () => ({ type: 'UNIT_TOGGLED' }),
});

let counter = 0;
export const actions = {
  ...sync,
  /** Busca una ciudad. Si llegan respuestas desordenadas, solo cuenta la última petición. */
  async search(city) {
    const query = city.trim();
    if (!query) return;
    const requestId = ++counter;
    dispatcher.dispatch({ type: 'SEARCH_STARTED', requestId, query });
    try {
      const data = await fetchWeather(query);
      dispatcher.dispatch({ type: 'SEARCH_SUCCEEDED', requestId, data });
    } catch (err) {
      dispatcher.dispatch({ type: 'SEARCH_FAILED', requestId, error: err.message || 'Algo salió mal.' });
    }
  },
};

export function reducer(state, a) {
  switch (a.type) {
    case 'QUERY_CHANGED': return { ...state, query: a.text };
    case 'UNIT_TOGGLED': return { ...state, unit: state.unit === 'C' ? 'F' : 'C' };
    case 'SEARCH_STARTED': return { ...state, query: a.query, status: 'loading', requestId: a.requestId, error: '' };
    case 'SEARCH_SUCCEEDED':
      return a.requestId === state.requestId ? { ...state, status: 'ok', data: a.data } : state;
    case 'SEARCH_FAILED':
      return a.requestId === state.requestId ? { ...state, status: 'error', error: a.error } : state;
    default: return state;
  }
}

export const store = createStore(reducer, initialState);
