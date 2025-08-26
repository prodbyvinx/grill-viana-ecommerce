export const staticImagesById: Record<number, string[]> = {
  1: ["/images/fixa.png"],
  2: ["/images/camping.png"],
  3: ["/images/espeteira.png"],
  4: ["/images/i60_capa.png"],
  5: ["/images/galvanizada_g60.png"],
  6: ["/images/mini_bancada_inox.jpg"],
  7: ["/images/fixa_grande.jpg"],
  8: ["/images/inox_duas_grelhas.png"],
};

function normalize(path: string): string {
  if (!path) return "/images/placeholder.png";
  return path.startsWith("/images/") ? path : `/images/${path.replace(/^@\/images\//,"").replace(/^public\//,"").replace(/^\/?images\//,"")}`;
}

export function getStaticImagesForId(id?: number): string[] {
  if (!id) return ["/images/placeholder.png"];
  const imgs = staticImagesById[id] || [];
  const normalized = imgs.map(normalize).filter(Boolean);
  return normalized.length ? normalized : ["/images/placeholder.png"];
}