export default function prettyMilliseconds(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const parts = [];

  if (hours > 0) parts.push(hours + (hours === 1 ? " hora" : " horas"));
  if (remainingMinutes > 0) parts.push(remainingMinutes + (remainingMinutes === 1 ? " minuto" : " minutos"));

  return parts.length > 0 ? parts.join(" y ") : "0 minutos";
}