import { h } from 'naufrago';
import { describe } from '../codes.js';
import { actions } from '../store.js';

const conv = (c, unit) => Math.round(unit === 'C' ? c : (c * 9) / 5 + 32);
const weekday = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es', { weekday: 'short' });

export function Forecast({ data, unit }) {
  const now = describe(data.current.code);
  return (
    <section class="report" aria-live="polite">
      <div class="now">
        <div>
          <h2>{data.place.name}<small>{data.place.country}</small></h2>
          <p class="desc">{now.label} · sensación de {conv(data.current.feels, unit)}°</p>
          <p class="meta">Viento {Math.round(data.current.wind)} km/h</p>
        </div>
        <div class="big">
          <span class="icon" aria-hidden="true">{now.icon}</span>
          <span class="deg">{conv(data.current.temp, unit)}°</span>
        </div>
      </div>

      <button class="unit" onClick={() => actions.toggleUnit()} aria-label="Cambiar unidad">
        Mostrar en °{unit === 'C' ? 'F' : 'C'}
      </button>

      <ul class="days">
        {data.days.map((d) => (
          <li key={d.date}>
            <span class="wd">{weekday(d.date)}</span>
            <span aria-hidden="true">{describe(d.code).icon}</span>
            <span class="range"><b>{conv(d.max, unit)}°</b> {conv(d.min, unit)}°</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
