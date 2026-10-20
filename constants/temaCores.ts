// =====================================================================
// CONVERSÃO DE CORES PARA O MODO ESCURO (funções puras, sem dependências)
//
// O app tem cores claras escritas direto nas telas (#fff, #333, #EDEAE0...).
// No modo escuro elas são convertidas automaticamente:
//   - "fundo": cores claras viram cinzas bem escuros (mantendo um leve tom)
//   - "texto": cores escuras/neutras viram cinzas claros
//   - "borda": bordas claras viram cinzas escuros
// Cores vivas (azul, vermelho, verde, laranja, dourado...) e cores que já
// são escuras são mantidas.
// =====================================================================

export type TipoCor = "fundo" | "texto" | "borda";

type RGBA = { r: number; g: number; b: number; a: number };

const NOMES: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  gray: "#808080",
  grey: "#808080",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  silver: "#c0c0c0",
  whitesmoke: "#f5f5f5",
  gainsboro: "#dcdcdc",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  ivory: "#fffff0",
  beige: "#f5f5dc",
  linen: "#faf0e6",
};

function parseCor(cor: string): RGBA | null {
  const c = cor.trim().toLowerCase();
  const s = NOMES[c] ?? c;

  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((x) => x + x)
        .join("");
    }
    if ((h.length !== 6 && h.length !== 8) || !/^[0-9a-f]+$/.test(h))
      return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  const m = s.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%?))?\s*\)$/,
  );
  if (m) {
    let a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (m[5] === "%") a /= 100;
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }

  return null;
}

function rgbParaHsl({ r, g, b }: RGBA) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslParaCss(h: number, s: number, l: number, a: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to255 = (v: number) => Math.round((v + m) * 255);
  if (a < 1)
    return `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${Math.round(a * 100) / 100})`;
  const hex = (v: number) => to255(v).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

const cache = new Map<string, string>();

/** Converte uma cor do tema claro para o equivalente no tema escuro. */
export function mapearCor(cor: string, tipo: TipoCor): string {
  const chave = `${tipo}|${cor}`;
  const guardada = cache.get(chave);
  if (guardada !== undefined) return guardada;

  let resultado = cor;
  const rgba = parseCor(cor);

  if (rgba && rgba.a > 0) {
    const { h, s, l } = rgbParaHsl(rgba);

    if (tipo === "fundo" || tipo === "borda") {
      const clara = l >= 0.62;
      const corViva = s > 0.5 && l < 0.82; // ex.: azul-claro de destaque
      const translucida = rgba.a < 0.6; // ex.: brilho branco sobre fundo escuro
      if (clara && !corViva && !translucida) {
        const t = (l - 0.62) / 0.38; // 0 (cinza claro) .. 1 (branco)
        const nl = tipo === "fundo" ? 0.04 + t * t * 0.1 : 0.15 + t * 0.12;
        resultado = hslParaCss(h, Math.min(s, 0.3), nl, rgba.a);
      }
    } else {
      // texto
      if (s < 0.25) {
        if (l < 0.6)
          resultado = hslParaCss(h, s, Math.min(0.95, 0.97 - 0.62 * l), rgba.a);
      } else if (l < 0.5) {
        resultado = hslParaCss(h, Math.min(s, 0.9), Math.max(l, 0.62), rgba.a);
      }
    }
  }

  cache.set(chave, resultado);
  return resultado;
}
