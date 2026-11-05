// Capa de acceso a la API (Open-Meteo, gratuita y sin clave).
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST = 'https://api.open-meteo.com/v1/forecast';

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`El servicio respondió ${res.status}.`);
  return res.json();
}

export async function fetchWeather(query) {
  const geo = await getJson(`${GEO}?name=${encodeURIComponent(query)}&count=1&language=es`);
  const place = geo.results?.[0];
  if (!place) throw new Error(`No encontré «${query}». Prueba con otro nombre de ciudad.`);

  const params = new URLSearchParams({
    latitude: place.latitude, longitude: place.longitude, timezone: 'auto', forecast_days: 5,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  });
  const w = await getJson(`${FORECAST}?${params}`);
  return {
    place: { name: place.name, country: place.country ?? '' },
    current: {
      temp: w.current.temperature_2m, feels: w.current.apparent_temperature,
      wind: w.current.wind_speed_10m, code: w.current.weather_code,
    },
    days: w.daily.time.map((date, i) => ({
      date, code: w.daily.weather_code[i], max: w.daily.temperature_2m_max[i], min: w.daily.temperature_2m_min[i],
    })),
  };
}
