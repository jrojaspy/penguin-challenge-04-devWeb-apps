import { h } from 'naufrago';
import { store, actions } from '../store.js';
import { Header } from './Header.jsx';
import { TodoItem } from './TodoItem.jsx';
import { Footer } from './Footer.jsx';

const VISIBLE = {
  all: () => true,
  active: (t) => !t.done,
  done: (t) => t.done,
};

export function App() {
  const { todos, filter, draft, editingId } = store.getState();
  const visible = todos.filter(VISIBLE[filter]);
  const left = todos.filter((t) => !t.done).length;
  const allDone = todos.length > 0 && left === 0;

  return (
    <main class="sheet">
      <Header draft={draft} />

      {todos.length === 0 ? (
        <p class="empty">La arena está vacía. Anota tu primera tarea arriba.</p>
      ) : (
        <section>
          <label class="all">
            <input type="checkbox" checked={allDone} onChange={() => actions.toggleAll(!allDone)} />
            Marcar todas
          </label>
          <ul class="list">
            {visible.map((t) => (
              <TodoItem key={t.id} todo={t} editing={t.id === editingId} />
            ))}
          </ul>
          {visible.length === 0 && <p class="empty">Nada en esta vista.</p>}
          <Footer left={left} total={todos.length} filter={filter} />
        </section>
      )}
    </main>
  );
}
