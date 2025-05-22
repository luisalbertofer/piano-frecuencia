export const filtrarNotasExistentes = async (urls, baseUrl) => {
  const resultados = await Promise.all(
    Object.entries(urls).map(async ([nota, archivo]) => {
      try {
        const response = await fetch(baseUrl + archivo, { method: "HEAD" });
        if (response.ok) return [nota, archivo];
      } catch {}
      return null;
    })
  );

  const urlsValidas = Object.fromEntries(resultados.filter(Boolean));
  return urlsValidas;
};
