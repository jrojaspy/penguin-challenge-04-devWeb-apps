import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';

// Empaqueta la app REAL (JSX + framework) y la ejecuta en un navegador simulado.
const out = await build({
  entryPoints: ['src/main.jsx'], bundle: true, write: false, format: 'iife',
  jsxFactory: 'h', jsxFragment: 'Fragment', loader: { '.css': 'empty' },
});
const code = out.outputFiles[0].text;

const tick = () => new Promise((r) => setTimeout(r, 0));
async function boot() {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', runScripts: 'outside-only' });
  dom.window.eval(code);
  await tick();
  const $ = (s) => dom.window.document.querySelector(s);
  const $$ = (s) => [...dom.window.document.querySelectorAll(s)];
  const type = async (text) => {
    const input = $('input.new');
    input.value = text;
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    await tick();
    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await tick();
  };
  return { dom, $, $$, type };
}

test('añadir tareas, completar, filtrar y limpiar', async () => {
  const { $, $$, type, dom } = await boot();
  assert.match($('.empty').textContent, /vacía/);

  await type('Encender fogata');
  await type('Pescar');
  await type('   '); // vacía: se ignora
  assert.deepEqual($$('.item .text').map((e) => e.textContent), ['Encender fogata', 'Pescar']);
  assert.equal($('input.new').value, '', 'el input se vacía tras añadir');
  assert.equal($('.count').textContent, '2 pendientes');

  const first = $('.item');
  $('.item input[type=checkbox]').click();
  await tick();
  assert.equal($('.item'), first, 'el <li> conserva su nodo (diff, no re-creación)');
  assert.ok($('.item').classList.contains('done'));
  assert.equal($('.count').textContent, '1 pendiente');

  [...$$('.filters button')].find((b) => b.textContent === 'Pendientes').click();
  await tick();
  assert.deepEqual($$('.item .text').map((e) => e.textContent), ['Pescar']);

  [...$$('.filters button')].find((b) => b.textContent === 'Todas').click();
  $('.clear').click();
  await tick();
  assert.deepEqual($$('.item .text').map((e) => e.textContent), ['Pescar']);

  // persistencia
  assert.equal(JSON.parse(dom.window.localStorage.getItem('naufrago:diario')).length, 1);
});

test('editar con doble clic: Enter guarda, Escape cancela, vacío borra', async () => {
  const { $, $$, type, dom } = await boot();
  await type('Tarea A');

  $('.text').dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true }));
  await tick();
  const edit = $('input.edit');
  assert.ok(edit, 'aparece el input de edición');
  assert.equal(dom.window.document.activeElement, edit, 'ref() dio foco al input');
  edit.value = 'Tarea B';
  edit.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await tick();
  assert.equal($('.text').textContent, 'Tarea B');

  $('.text').dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true }));
  await tick();
  $('input.edit').dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await tick();
  assert.equal($('.text').textContent, 'Tarea B');

  $('.text').dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true }));
  await tick();
  $('input.edit').value = '';
  $('input.edit').dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await tick();
  assert.equal($$('.item').length, 0);
});

test('mientras escribes, el input conserva el foco y el nodo', async () => {
  const { $, dom } = await boot();
  const input = $('input.new');
  input.focus();
  input.value = 'abc';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await tick();
  assert.equal($('input.new'), input);
  assert.equal(dom.window.document.activeElement, input);
});
