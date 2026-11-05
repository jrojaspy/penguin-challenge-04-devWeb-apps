// Códigos meteorológicos WMO → descripción + emoji.
const TABLE = [
  [[0], 'Despejado', '☀️'], [[1, 2], 'Poco nublado', '🌤️'], [[3], 'Nublado', '☁️'],
  [[45, 48], 'Niebla', '🌫️'], [[51, 53, 55, 56, 57], 'Llovizna', '🌦️'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'Lluvia', '🌧️'], [[71, 73, 75, 77, 85, 86], 'Nieve', '❄️'],
  [[95, 96, 99], 'Tormenta', '⛈️'],
];
export function describe(code) {
  const hit = TABLE.find(([codes]) => codes.includes(code));
  return hit ? { label: hit[1], icon: hit[2] } : { label: 'Sin datos', icon: '❔' };
}
