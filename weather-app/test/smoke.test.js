import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';

const out = await build({
  entryPoints: ['src/main.jsx'], bundle: true, write: false, format: 'iife',
  jsxFactory: 'h', jsxFragment: 'Fragment', loader: { '.css': 'empty' },
});
const code = out.outputFiles[0].text;
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

// API simulada (los tests no necesitan red)
function fakeFetch(delays = {}) {
  return async (url) => {
    await tick(delays[new URL(url).searchParams.get('name')] ?? 0);
    const u = new URL(url);
    if (u.hostname.startsWith('geocoding')) {
      const name = u.searchParams.get('name');
      if (name === 'Nowhere') return { ok: true, json: async () => ({}) };
      return { ok: true, json: async () => ({ results: [{ name, country: 'País', latitude: 1, longitude: 2 }] }) };
    }
    return {
      ok: true,
      json: async () => ({
        current: { temperature_2m: 30, apparent_temperature: 32, wind_speed_10m: 11, weather_code: 0 },
        daily: {
          time: ['2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09'],
          weather_code: [0, 3, 61, 95, 71], temperature_2m_max: [31, 30, 28, 27, 25], temperature_2m_min: [20, 19, 18, 17, 15],
        },
      }),
    };
  };
}
async function boot(delays) {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', runScripts: 'outside-only' });
  dom.window.fetch = fakeFetch(delays);
  dom.window.eval(code);
  await tick();
  return { dom, $: (s) => dom.window.document.querySelector(s), $$: (s) => [...dom.window.document.querySelectorAll(s)] };
}

test('buscar ciudad: carga, muestra clima y pronóstico', async () => {
  const { $, $$, dom } = await boot();
  assert.match($('.hint').textContent, /Elige una ciudad/);
  $('input').value = 'Asunción';
  $('input').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await tick();
  $('.go').click();
  await tick();
  assert.equal($('.go').textContent, 'Buscando…');
  await tick(20);
  assert.match($('h2').textContent, /Asunción/);
  assert.equal($('.deg').textContent, '30°');
  assert.equal($$('.days li').length, 5);
  $('.unit').click();
  await tick();
  assert.equal($('.deg').textContent, '86°');
});

test('ciudad inexistente muestra un error útil', async () => {
  const { $, $$ } = await boot();
  $$('.chip')[0].click(); // Asunción OK
  await tick(20);
  const { dom } = { dom: $('input').ownerDocument.defaultView };
  $('input').value = 'Nowhere';
  $('input').dispatchEvent(new dom.Event('input', { bubbles: true }));
  await tick();
  $('.go').click();
  await tick(20);
  assert.match($('.error').textContent, /No encontré «Nowhere»/);
});

test('respuestas desordenadas: gana la última búsqueda, no la última respuesta', async () => {
  const { $, $$ } = await boot({ Madrid: 40, Tokio: 5 });
  $$('.chip').find((b) => b.textContent === 'Madrid').click(); // lenta
  $$('.chip').find((b) => b.textContent === 'Tokio').click();  // rápida, es la más reciente
  await tick(80);
  assert.match($('h2').textContent, /Tokio/);
});
