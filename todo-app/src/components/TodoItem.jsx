import { h } from 'naufrago';
import { actions } from '../store.js';

export function TodoItem({ todo, editing }) {
  if (editing) {
    return (
      <li class="item editing">
        <input
          class="edit"
          aria-label="Editar tarea"
          value={todo.text}
          ref={(el) => { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }}
          onBlur={(e) => actions.saveEdit(todo.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') actions.saveEdit(todo.id, e.target.value);
            if (e.key === 'Escape') actions.cancelEdit();
          }}
        />
      </li>
    );
  }
  return (
    <li class={todo.done ? 'item done' : 'item'}>
      <input type="checkbox" aria-label="Completada" checked={todo.done} onChange={() => actions.toggle(todo.id)} />
      <span class="text" onDblClick={() => actions.startEdit(todo.id)} title="Doble clic para editar">
        {todo.text}
      </span>
      <button class="x" aria-label={`Borrar «${todo.text}»`} onClick={() => actions.remove(todo.id)}>×</button>
    </li>
  );
}
