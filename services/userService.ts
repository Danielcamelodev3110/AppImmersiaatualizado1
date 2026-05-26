import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Configuração inteligente de URL base
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "web") {
      return "http://localhost:3000";
    }
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000";
    }
    return "http://10.108.22.69:3000"; // Seu IP do Ethernet
  }
  return "http://localhost:3000"; // Fallback caso não esteja em __DEV__
};

const BASE_URL = getBaseUrl();
const CHAVE_SESSAO = "immersia_user_session";

export interface CreateUserPayload {
  nome_completo: string;
  email: string;
  senha: string;
  cpf?: string;
  tipo_usuario?: "cliente" | "anfitriao" | "administrador";
  data_nascimento?: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

// Interface para mapear o retorno dos usuários na listagem do Admin
export interface UserResponse {
  id: number;
  nome_completo: string;
  email: string;
  cpf?: string;
  tipo_usuario: string;
  status_conta: string;
  data_criacao: string;
}

export const userService = {
  create: async (dadosUsuario: CreateUserPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosUsuario),
      });
      const dados = await response.json();
      if (!response.ok) {
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }
      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  login: async (dadosLogin: LoginPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin),
      });

      const dados = await response.json();

      if (!response.ok) {
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }

      if (dados.user) {
        const dadosString = JSON.stringify(dados.user);

        if (Platform.OS !== "web") {
          await SecureStore.setItemAsync(CHAVE_SESSAO, dadosString);
        } else {
          localStorage.setItem(CHAVE_SESSAO, dadosString);
        }
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  getSavedSession: async () => {
    try {
      let sessaoString = null;

      if (Platform.OS !== "web") {
        sessaoString = await SecureStore.getItemAsync(CHAVE_SESSAO);
      } else {
        sessaoString = localStorage.getItem(CHAVE_SESSAO);
      }

      return sessaoString ? JSON.parse(sessaoString) : null;
    } catch (error) {
      console.error("Erro ao ler sessão local:", error);
      return null;
    }
  },

  logout: async () => {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync(CHAVE_SESSAO);
      } else {
        localStorage.removeItem(CHAVE_SESSAO);
      }
      return true;
    } catch (error) {
      console.error("Erro ao deletar sessão:", error);
      return false;
    }
  },

  // 🌟 NOVA FUNÇÃO: Busca todos os usuários cadastrados
  findAll: async (): Promise<UserResponse[]> => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  // 🌟 NOVA FUNÇÃO: Exclui um usuário pelo ID
  remove: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const dados = await response.json();
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }
    } catch (error: any) {
      throw error;
    }
  },
};
