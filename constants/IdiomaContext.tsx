import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Alert, Platform } from "react-native";

import {
  assinar,
  lerCache,
  obterVersao,
  pedirTraducao,
  traduzirAsync,
} from "./traducaoRemota";
import { buscarTraducao, Idioma, traduzirTexto } from "./traducoes";

const CHAVE_IDIOMA = "idioma";

// Idioma atual fora do React (usado pelos Alert, que não são componentes)
let idiomaAtual: Idioma = "pt";

/** Traduz um texto usando o idioma atual (pode ser usado em qualquer lugar). */
export const traduzir = (texto: string) => traduzirTexto(texto, idiomaAtual);

type IdiomaContextData = {
  idioma: Idioma;
  setIdioma: (novo: Idioma) => Promise<void>;
  t: (texto: string) => string;
};

const IdiomaContext = createContext<IdiomaContextData>({
  idioma: "pt",
  setIdioma: async () => {},
  t: (texto) => texto,
});

// ---------------------------------------------------------------------
// TRADUÇÃO GLOBAL
// Em vez de editar as ~35 telas, interceptamos a criação de elementos
// do React (jsx): todo <Text> e <TextInput> do app (e do menu/abas) é
// trocado por uma versão que traduz o texto pelo dicionário
// (constants/traducoes.ts). O useContext dentro dessas versões faz cada
// texto se atualizar na hora quando o idioma muda, sem recarregar a tela.
// ---------------------------------------------------------------------
// 1) dicionário fixo do app  2) tradução já guardada do servidor
// 3) se ainda não existe, pede ao servidor e mostra o original até chegar
const traduzirString = (texto: string, idioma: Idioma): string => {
  const doDicionario = buscarTraducao(texto, idioma);
  if (doDicionario !== null) return doDicionario;

  const doServidor = lerCache(texto, idioma);
  if (doServidor !== null) return doServidor;

  pedirTraducao(texto, idioma);
  return texto;
};

const traduzirFilhos = (filhos: any, idioma: Idioma): any => {
  if (typeof filhos === "string") return traduzirString(filhos, idioma);
  if (Array.isArray(filhos)) {
    return filhos.map((f) =>
      typeof f === "string" ? traduzirString(f, idioma) : f,
    );
  }
  return filhos;
};

// Componentes originais do React Native (lidos só na hora de usar)
const textoOriginal = () => (require("react-native") as any).Text;
const inputOriginal = () => (require("react-native") as any).TextInput;

function TextTraduzido(props: any) {
  const { idioma } = useContext(IdiomaContext);
  // re-renderiza quando chega uma tradução nova do servidor
  useSyncExternalStore(assinar, obterVersao, obterVersao);
  const novasProps =
    idioma === "pt"
      ? props
      : { ...props, children: traduzirFilhos(props.children, idioma) };
  // createElement (e não JSX) de propósito: evita recursão no patch abaixo
  return React.createElement(textoOriginal(), novasProps);
}
TextTraduzido.displayName = "Text";

function TextInputTraduzido(props: any) {
  const { idioma } = useContext(IdiomaContext);
  const novasProps =
    idioma === "pt" || typeof props.placeholder !== "string"
      ? props
      : { ...props, placeholder: traduzirTexto(props.placeholder, idioma) };
  return React.createElement(inputOriginal(), novasProps);
}
TextInputTraduzido.displayName = "TextInput";

const trocarTipo = (tipo: any) => {
  if (tipo === textoOriginal()) return TextTraduzido;
  if (tipo === inputOriginal()) return TextInputTraduzido;
  return tipo;
};

function interceptar(modulo: any, nomes: string[]) {
  for (const nome of nomes) {
    const original = modulo?.[nome];
    if (typeof original !== "function") continue;
    modulo[nome] = function (tipo: any, ...resto: any[]) {
      return original.call(this, trocarTipo(tipo), ...resto);
    };
  }
}

let patchAplicado = false;

function aplicarTraducaoGlobal() {
  if (patchAplicado) return;
  patchAplicado = true;

  // ----- <Text> e <TextInput> (placeholder) -----
  try {
    interceptar(require("react/jsx-runtime"), ["jsx", "jsxs"]);
  } catch (e) {
    console.warn("[idioma] Não foi possível aplicar a tradução ao <Text>.", e);
  }
  try {
    // usado em modo de desenvolvimento
    interceptar(require("react/jsx-dev-runtime"), ["jsxDEV"]);
  } catch {
    // não existe em produção — sem problema
  }

  // ----- Alert.alert (título, mensagem e botões) -----
  // Se o texto não está no dicionário (ex.: mensagem de erro do servidor),
  // espera até 1,5 s pela tradução automática antes de mostrar o alerta.
  const traduzirParaAlerta = (texto: any): any => {
    if (typeof texto !== "string" || idiomaAtual === "pt") return texto;
    const doDicionario = buscarTraducao(texto, idiomaAtual);
    if (doDicionario !== null) return doDicionario;
    return traduzirAsync(texto, idiomaAtual); // Promise<string>
  };
  const ehPromise = (x: any) => x && typeof x.then === "function";

  const alertOriginal = Alert.alert.bind(Alert);
  Alert.alert = (titulo: any, mensagem?: any, botoes?: any, opcoes?: any) => {
    const botoesTraduzidos = Array.isArray(botoes)
      ? botoes.map((b: any) =>
          b && typeof b.text === "string"
            ? { ...b, text: traduzir(b.text) }
            : b,
        )
      : botoes;

    const t = traduzirParaAlerta(titulo);
    const m = traduzirParaAlerta(mensagem);

    if (!ehPromise(t) && !ehPromise(m)) {
      alertOriginal(t, m, botoesTraduzidos, opcoes);
      return;
    }
    Promise.all([t, m]).then(([tf, mf]) =>
      alertOriginal(tf, mf, botoesTraduzidos, opcoes),
    );
  };

  // ----- alert() / window.alert() na versão web -----
  if (Platform.OS === "web" && typeof window !== "undefined" && window.alert) {
    const alertWebOriginal = window.alert.bind(window);
    window.alert = (mensagem?: any) => {
      const m = traduzirParaAlerta(mensagem);
      if (ehPromise(m)) m.then((mf: string) => alertWebOriginal(mf));
      else alertWebOriginal(m);
    };
  }
}

aplicarTraducaoGlobal();

// ---------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------
export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>("pt");

  // Carrega o idioma salvo quando o app abre
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_IDIOMA)
      .then((salvo) => {
        if (salvo === "pt" || salvo === "en" || salvo === "es") {
          idiomaAtual = salvo;
          setIdiomaState(salvo);
        }
      })
      .catch(() => {});
  }, []);

  const setIdioma = useCallback(async (novo: Idioma) => {
    idiomaAtual = novo;
    setIdiomaState(novo);
    try {
      await AsyncStorage.setItem(CHAVE_IDIOMA, novo);
    } catch {
      // se não conseguir salvar, o idioma continua valendo nesta sessão
    }
  }, []);

  // Atualiza o atributo lang da página na versão web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.lang =
        idioma === "pt" ? "pt-BR" : idioma === "en" ? "en" : "es";
    }
  }, [idioma]);

  const value = useMemo<IdiomaContextData>(
    () => ({
      idioma,
      setIdioma,
      t: (texto: string) => traduzirTexto(texto, idioma),
    }),
    [idioma, setIdioma],
  );

  return (
    <IdiomaContext.Provider value={value}>{children}</IdiomaContext.Provider>
  );
}

/** Hook: const { idioma, setIdioma, t } = useIdioma(); */
export const useIdioma = () => useContext(IdiomaContext);
