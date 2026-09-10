import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

const BASE_URL = "https://back-immercia.onrender.com";

export type FormaPagamento =
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "boleto";

export interface CreateReservaPayload {
  id_cliente: number;
  id_produto: number;
  quantidade?: number; // padrão 1 se não enviado
  data_checkin?: string; // "AAAA-MM-DD" — obrigatório pra hospedagem
  data_checkout?: string; // "AAAA-MM-DD" — obrigatório pra hospedagem
  forma_pagamento?: FormaPagamento;
  observacoes?: string;
}

export interface Reserva {
  id: number;
  id_cliente: number;
  id_produto: number;
  quantidade: number;
  preco_total: number;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
  forma_pagamento: string | null;
  codigo_reserva: string;
  data_checkin: Timestamp;
  data_checkout: Timestamp;
  data_reserva: string;
  observacoes: string | null;
}

export const reservaService = {
  // Cria uma reserva (o backend calcula o preco_total a partir do preço
  // atual do produto, nunca confia num valor vindo do front)
  create: async (dados: CreateReservaPayload): Promise<Reserva> => {
    try {
      const response = await fetch(`${BASE_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const dadosResposta = await response.json();

      if (!response.ok) {
        const erroInstancia = new Error();
        (erroInstancia as any).response = { data: dadosResposta };
        throw erroInstancia;
      }

      return dadosResposta;
    } catch (error: any) {
      throw error;
    }
  },

  // "Minhas compras"
  findByCliente: async (idCliente: number): Promise<Reserva[]> => {
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
        throw new Error("Erro ao buscar reservas.");
      }

      return dados;
    } catch (error) {
      throw error;
    }
  },
};
