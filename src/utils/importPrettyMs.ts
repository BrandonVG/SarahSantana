async function loadPrettyMs() {
  const { default: prettyMs } = await import('pretty-ms');
  return prettyMs;
}

export default loadPrettyMs;