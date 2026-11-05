// FLUX · Actions + Store. La vista nunca modifica el estado: solo lanza acciones.
import { createStore, bindActions } from 'naufrago';

const KEY = 'naufrago:diario';
let seq = 0;
const uid = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

function load() {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* datos corruptos: empezamos de cero */ }
  return [];
}

export const initialState = () => ({ todos: load(), filter: 'all', draft: '', editingId: null });

/* ── Actions ── */
export const actions = bindActions({
  setDraft: (text) => ({ type: 'DRAFT_CHANGED', text }),
  add: () => ({ type: 'TODO_ADDED', id: uid() }),
  toggle: (id) => ({ type: 'TODO_TOGGLED', id }),
  toggleAll: (done) => ({ type: 'ALL_TOGGLED', done }),
  remove: (id) => ({ type: 'TODO_REMOVED', id }),
  startEdit: (id) => ({ type: 'EDIT_STARTED', id }),
  saveEdit: (id, text) => ({ type: 'EDIT_SAVED', id, text }),
  cancelEdit: () => ({ type: 'EDIT_CANCELLED' }),
  setFilter: (filter) => ({ type: 'FILTER_CHANGED', filter }),
  clearCompleted: () => ({ type: 'COMPLETED_CLEARED' }),
});

/* ── Reducer (puro) ── */
export function reducer(state, a) {
  switch (a.type) {
    case 'DRAFT_CHANGED':
      return { ...state, draft: a.text };
    case 'TODO_ADDED': {
      const text = state.draft.trim();
      if (!text) return state.draft ? { ...state, draft: '' } : state; // en blanco: limpia el borrador
      return { ...state, draft: '', todos: [...state.todos, { id: a.id, text, done: false }] };
    }
    case 'TODO_TOGGLED':
      return { ...state, todos: state.todos.map((t) => (t.id === a.id ? { ...t, done: !t.done } : t)) };
    case 'ALL_TOGGLED':
      return { ...state, todos: state.todos.map((t) => ({ ...t, done: a.done })) };
    case 'TODO_REMOVED':
      return { ...state, todos: state.todos.filter((t) => t.id !== a.id) };
    case 'EDIT_STARTED':
      return { ...state, editingId: a.id };
    case 'EDIT_SAVED': {
      if (state.editingId !== a.id) return state; // evita doble guardado (Enter + blur)
      const text = a.text.trim();
      const todos = text
        ? state.todos.map((t) => (t.id === a.id ? { ...t, text } : t))
        : state.todos.filter((t) => t.id !== a.id); // texto vacío = borrar
      return { ...state, todos, editingId: null };
    }
    case 'EDIT_CANCELLED':
      return { ...state, editingId: null };
    case 'FILTER_CHANGED':
      return { ...state, filter: a.filter };
    case 'COMPLETED_CLEARED':
      return { ...state, todos: state.todos.filter((t) => !t.done) };
    default:
      return state;
  }
}

export const store = createStore(reducer, initialState());

// Persistencia: se guarda solo cuando cambia la lista, no por cada tecla del borrador.
let lastTodos = store.getState().todos;
store.subscribe((s) => {
  if (s.todos === lastTodos) return;
  lastTodos = s.todos;
  try { globalThis.localStorage?.setItem(KEY, JSON.stringify(s.todos)); } catch { /* cuota llena */ }
});
