// =====================================================================
// TRADUÇÃO AUTOMÁTICA DO CONTEÚDO DO BANCO DE DADOS
//
// Textos que NÃO estão no dicionário fixo (constants/traducoes.ts) —
// nomes e descrições de produtos, hospedagens, mensagens do servidor etc.
// — são enviados em lote ao backend (POST /traducoes), que traduz e guarda
// o resultado em cache. Aqui no app o resultado também fica guardado
// (memória + AsyncStorage), então cada texto só é pedido uma vez.
// Enquanto a tradução não chega, o texto aparece em português e troca
// sozinho quando ela chegar.
// =====================================================================
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Idioma } from "./traducoes";

const API_URL = "https://back-immercia.onrender.com";
const CHAVE_CACHE = "traducoes_dinamicas_v1";

const TAMANHO_LOTE = 30; // textos por requisição
const ATRASO_LOTE_MS = 80; // espera juntar textos antes de enviar
const MAX_CACHE = 4000; // máximo de textos guardados por idioma
const RETENTAR_APOS_MS = 60 * 1000; // não insiste em texto que falhou
const MAX_CARACTERES = 2000;

type IdiomaRemoto = "en" | "es";

const cache: Record<IdiomaRemoto, Record<string, string>> = { en: {}, es: {} };
const fila: Record<IdiomaRemoto, Set<string>> = {
  en: new Set(),
  es: new Set(),
};
const emAndamento = new Set<string>();
const falhas = new Map<string, number>();
const esperando = new Map<string, ((traduzido: string | null) => void)[]>();

// ---------- avisa os <Text> quando chega tradução nova ----------
let versao = 0;
const ouvintes = new Set<() => void>();
export const assinar = (fn: () => void) => {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
};
export const obterVersao = () => versao;
const notificar = () => {
  versao += 1;
  ouvintes.forEach((fn) => fn());
};

// ---------- cache salvo no aparelho ----------
let timerSalvar: ReturnType<typeof setTimeout> | null = null;

const agendarSalvar = () => {
  if (timerSalvar) return;
  timerSalvar = setTimeout(() => {
    timerSalvar = null;
    (["en", "es"] as IdiomaRemoto[]).forEach((i) => {
      const chaves = Object.keys(cache[i]);
      if (chaves.length > MAX_CACHE) {
        chaves
          .slice(0, chaves.length - MAX_CACHE)
          .forEach((c) => delete cache[i][c]);
      }
    });
    AsyncStorage.setItem(CHAVE_CACHE, JSON.stringify(cache)).catch(() => {});
  }, 1500);
};

AsyncStorage.getItem(CHAVE_CACHE)
  .then((salvo) => {
    if (!salvo) return;
    const dados = JSON.parse(salvo);
    cache.en = { ...(dados.en || {}), ...cache.en };
    cache.es = { ...(dados.es || {}), ...cache.es };
    notificar();
  })
  .catch(() => {});

// ---------- o que vale a pena traduzir ----------
const separar = (texto: string) => {
  const m = texto.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return m
    ? { inicio: m[1], miolo: m[2], fim: m[3] }
    : { inicio: "", miolo: texto, fim: "" };
};

const deveTraduzir = (miolo: string) => {
  if (miolo.length < 3 || miolo.length > MAX_CARACTERES) return false;
  if (!/[A-Za-zÀ-ÿ]{2,}/.test(miolo)) return false; // só números/símbolos
  if (/^(https?:\/\/|www\.)\S+$/i.test(miolo)) return false; // link
  if (/^\S+@\S+\.\S+$/.test(miolo)) return false; // e-mail
  if (/^[A-Z0-9_\-./]+$/.test(miolo) && /\d/.test(miolo)) return false; // códigos
  if (/^(data:|file:|content:)/i.test(miolo)) return false;
  return true;
};

const chaveDe = (idioma: IdiomaRemoto, miolo: string) => `${idioma}|${miolo}`;

/** Lê a tradução já guardada (ou null se ainda não existe). */
export function lerCache(texto: string, idioma: Idioma): string | null {
  if (idioma === "pt") return null;
  const { inicio, miolo, fim } = separar(texto);
  const t = cache[idioma][miolo];
  return t !== undefined ? inicio + t + fim : null;
}

/** Pede a tradução ao servidor (em lote, sem travar a tela). */
export function pedirTraducao(
  texto: string,
  idioma: Idioma,
  ignorarFalha = false,
) {
  if (idioma === "pt") return;
  const { miolo } = separar(texto);
  if (!deveTraduzir(miolo)) return;
  if (cache[idioma][miolo] !== undefined) return;

  const chave = chaveDe(idioma, miolo);
  if (emAndamento.has(chave) || fila[idioma].has(miolo)) return;

  const falhouEm = falhas.get(chave);
  if (!ignorarFalha && falhouEm && Date.now() - falhouEm < RETENTAR_APOS_MS)
    return;

  fila[idioma].add(miolo);
  agendarEnvio();
}

let timerEnvio: ReturnType<typeof setTimeout> | null = null;
const agendarEnvio = () => {
  if (timerEnvio) return;
  timerEnvio = setTimeout(enviarFila, ATRASO_LOTE_MS);
};

async function enviarFila() {
  timerEnvio = null;

  for (const idioma of ["en", "es"] as IdiomaRemoto[]) {
    const textos = [...fila[idioma]];
    if (textos.length === 0) continue;
    fila[idioma].clear();

    for (let i = 0; i < textos.length; i += TAMANHO_LOTE) {
      const lote = textos.slice(i, i + TAMANHO_LOTE);
      lote.forEach((t) => emAndamento.add(chaveDe(idioma, t)));

      let mapa: Record<string, string> = {};
      try {
        const resp = await fetch(`${API_URL}/traducoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idioma, textos: lote }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const dados = await resp.json();
        mapa = dados.traducoes || {};
      } catch {
        mapa = {};
      }

      lote.forEach((original) => {
        const chave = chaveDe(idioma, original);
        const traduzido = mapa[original];
        if (typeof traduzido === "string" && traduzido !== "") {
          cache[idioma][original] = traduzido;
          falhas.delete(chave);
        } else {
          falhas.set(chave, Date.now());
        }
        emAndamento.delete(chave);

        const quem = esperando.get(chave);
        if (quem) {
          esperando.delete(chave);
          quem.forEach((resolver) =>
            resolver(typeof traduzido === "string" ? traduzido : null),
          );
        }
      });

      notificar();
      agendarSalvar();
    }
  }
}

/**
 * Versão assíncrona (usada nos Alert): espera a tradução chegar por até
 * 1,5 s; se demorar, mostra o texto original.
 */
export function traduzirAsync(texto: string, idioma: Idioma): Promise<string> {
  if (idioma === "pt") return Promise.resolve(texto);

  const emCache = lerCache(texto, idioma);
  if (emCache !== null) return Promise.resolve(emCache);

  const { inicio, miolo, fim } = separar(texto);
  if (!deveTraduzir(miolo)) return Promise.resolve(texto);

  return new Promise((resolve) => {
    const chave = chaveDe(idioma, miolo);
    const limite = setTimeout(() => resolve(texto), 1500);

    const lista = esperando.get(chave) || [];
    lista.push((traduzido) => {
      clearTimeout(limite);
      resolve(traduzido !== null ? inicio + traduzido + fim : texto);
    });
    esperando.set(chave, lista);

    pedirTraducao(texto, idioma, true);
  });
}
