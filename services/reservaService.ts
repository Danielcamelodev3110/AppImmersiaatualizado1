import { Platform } from "react-native";

// 👇 Mesma lógica de detecção de ambiente usada no userService.ts e no
// produtoService.ts. Se você já centralizou isso em um arquivo compartilhado
// (ex: config/api.ts), importe de lá em vez de duplicar aqui.
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

export type StatusReserva =
  | "pendente"
  | "confirmada"
  | "cancelada"
  | "concluida";

export type FormaPagamento = "cartao" | "pix" | "boleto" | "dinheiro";

// Payload enviado para criar a compra. O preço total é calculado no
// backend a partir do produto — não precisa (e não deve) mandar preco_total.
export interface CreateReservaPayload {
  id_cliente: number;
  id_produto: number;
  quantidade?: number;
  data_checkin?: string; // ISO string, ex: "2026-08-20"
  data_checkout?: string;
  forma_pagamento?: FormaPagamento;
  observacoes?: string;
}

export interface ReservaResponse {
  id: number;
  data_reserva: string;
  data_checkin?: string | null;
  data_checkout?: string | null;
  quantidade: number;
  preco_total: string; // vem como string do Postgres (numeric/decimal)
  status: StatusReserva;
  forma_pagamento?: FormaPagamento | null;
  codigo_reserva: string;
  observacoes?: string | null;
  id_cliente: number;
  id_produto: number;
  produto?: any;
  cliente?: any;
}

export const reservaService = {
  // Realiza a compra do produto
  create: async (
    dadosReserva: CreateReservaPayload,
  ): Promise<ReservaResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosReserva),
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

  findAll: async (): Promise<ReservaResponse[]> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas`, {
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

  findOne: async (id: number): Promise<ReservaResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas/${id}`, {
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

  // Histórico de compras do cliente logado
  findMinhasCompras: async (idCliente: number): Promise<ReservaResponse[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/reservas/minhas-compras/${idCliente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

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

  // Reservas recebidas nos produtos de um anfitrião
  findRecebidas: async (idAnfitriao: number): Promise<ReservaResponse[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/reservas/recebidas/${idAnfitriao}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

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

  // Ex: confirmar, cancelar, concluir
  updateStatus: async (
    id: number,
    status: StatusReserva,
  ): Promise<ReservaResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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

  remove: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }
    } catch (error: any) {
      throw error;
    }
  },
};
