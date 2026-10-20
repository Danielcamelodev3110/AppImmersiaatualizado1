import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, StyleSheet } from "react-native";

import { mapearCor } from "./temaCores";

const CHAVE_TEMA = "tema";

type TemaContextData = {
  escuro: boolean;
  setEscuro: (valor: boolean) => Promise<void>;
};

export const TemaContext = createContext<TemaContextData>({
  escuro: false,
  setEscuro: async () => {},
});

/** Hook: const { escuro, setEscuro } = useTema(); */
export const useTema = () => useContext(TemaContext);

// ---------------------------------------------------------------------
// CONVERSÃO DE ESTILOS
// ---------------------------------------------------------------------
const PROPS_ESTILO = [
  "style",
  "contentContainerStyle",
  "columnWrapperStyle",
  "ListHeaderComponentStyle",
  "ListFooterComponentStyle",
];

const tipoDaChave = (chave: string) =>
  chave === "backgroundColor"
    ? "fundo"
    : chave === "color"
      ? "texto"
      : /^border.*Color$/.test(chave)
        ? "borda"
        : null;

const cacheObjetos = new WeakMap<object, any>();

function mapearEstilo(style: any): any {
  if (style == null || style === false) return style;
  if (typeof style === "function")
    return (...args: any[]) => mapearEstilo(style(...args));

  const ehObjetoSimples = typeof style === "object" && !Array.isArray(style);
  if (ehObjetoSimples) {
    const guardado = cacheObjetos.get(style);
    if (guardado) return guardado;
  }

  const plano: any = StyleSheet.flatten(style);
  if (!plano || typeof plano !== "object") return style;

  let novo: any = null;
  for (const chave of Object.keys(plano)) {
    const valor = plano[chave];
    if (typeof valor !== "string") continue;
    const tipo = tipoDaChave(chave);
    if (!tipo) continue;
    const convertido = mapearCor(valor, tipo);
    if (convertido !== valor) {
      novo = novo || { ...plano };
      novo[chave] = convertido;
    }
  }

  const resultado = novo ?? style;
  if (ehObjetoSimples) cacheObjetos.set(style, resultado);
  return resultado;
}

// ---------------------------------------------------------------------
// COMPONENTES COM TEMA
// Cada View/ScrollView/TouchableOpacity/ícone... é trocado (em
// IdiomaContext.tsx, na interceptação do jsx) por uma versão que converte
// as cores quando o modo escuro está ligado.
// ---------------------------------------------------------------------
export function envolverComTema(Original: any, nome?: string) {
  function ComTema(props: any) {
    const { escuro } = useContext(TemaContext);
    if (!escuro) return React.createElement(Original, props);

    const novas: any = { ...props };
    for (const p of PROPS_ESTILO) {
      if (p in props) novas[p] = mapearEstilo(props[p]);
    }
    if (typeof props.color === "string")
      novas.color = mapearCor(props.color, "texto");
    if (typeof props.placeholderTextColor === "string") {
      novas.placeholderTextColor = mapearCor(
        props.placeholderTextColor,
        "texto",
      );
    }
    return React.createElement(Original, novas);
  }
  ComTema.displayName = `Tema(${nome || Original?.displayName || Original?.name || "Componente"})`;
  return ComTema;
}

function envolverStatusBar(Original: any) {
  function StatusBarComTema(props: any) {
    const { escuro } = useContext(TemaContext);
    const style = escuro && props.style === "dark" ? "light" : props.style;
    return React.createElement(Original, { ...props, style });
  }
  StatusBarComTema.displayName = "Tema(StatusBar)";
  return StatusBarComTema;
}

const NOMES_RN = [
  "View",
  "ScrollView",
  "TouchableOpacity",
  "TouchableHighlight",
  "Pressable",
  "FlatList",
  "SectionList",
  "VirtualizedList",
  "SafeAreaView",
  "KeyboardAvoidingView",
  "ImageBackground",
  "ActivityIndicator",
];

let tiposComTema: Map<any, any> | null = null;
const cacheIcones = new WeakMap<object, any>();

/**
 * Dado o tipo de um elemento, devolve a versão com tema (ou o próprio tipo
 * se ele não precisa de conversão de cores).
 */
export function tipoComTema(tipo: any, props: any) {
  if (!tiposComTema) {
    tiposComTema = new Map();
    const rn: any = require("react-native");
    for (const nome of NOMES_RN) {
      try {
        const Tipo = rn[nome];
        if (Tipo) tiposComTema.set(Tipo, envolverComTema(Tipo, nome));
      } catch {
        // componente indisponível nesta plataforma
      }
    }
    try {
      const SB = require("expo-status-bar").StatusBar;
      if (SB) tiposComTema.set(SB, envolverStatusBar(SB));
    } catch {
      // expo-status-bar não instalado
    }
  }

  const achado = tiposComTema.get(tipo);
  if (achado) return achado;

  // Ícones (Ionicons, Feather...): têm as props name + size + color
  if (
    tipo &&
    typeof tipo !== "string" &&
    props &&
    typeof props.name === "string" &&
    typeof props.size === "number" &&
    typeof props.color === "string"
  ) {
    let envolvido = cacheIcones.get(tipo);
    if (!envolvido) {
      envolvido = envolverComTema(tipo);
      cacheIcones.set(tipo, envolvido);
    }
    return envolvido;
  }

  return tipo;
}

// ---------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------
const TEMA_NAVEGACAO_ESCURO = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#121212",
    card: "#1E1E1E",
    text: "#EDEDED",
    border: "#2E2E2E",
    primary: "#fded8f",
  },
};

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [escuro, setEscuroState] = useState(false);

  // Carrega a escolha salva
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_TEMA)
      .then((salvo) => {
        if (salvo === "escuro") setEscuroState(true);
      })
      .catch(() => {});
  }, []);

  const setEscuro = useCallback(async (valor: boolean) => {
    setEscuroState(valor);
    try {
      await AsyncStorage.setItem(CHAVE_TEMA, valor ? "escuro" : "claro");
    } catch {
      // se não conseguir salvar, vale só nesta sessão
    }
  }, []);

  // Na web, pinta também o fundo da página (evita faixa branca)
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.body.style.backgroundColor = escuro ? "#121212" : "";
      document.documentElement.style.colorScheme = escuro ? "dark" : "light";
    }
  }, [escuro]);

  const value = useMemo(() => ({ escuro, setEscuro }), [escuro, setEscuro]);

  return (
    <TemaContext.Provider value={value}>
      <ThemeProvider value={escuro ? TEMA_NAVEGACAO_ESCURO : DefaultTheme}>
        {children}
      </ThemeProvider>
    </TemaContext.Provider>
  );
}
