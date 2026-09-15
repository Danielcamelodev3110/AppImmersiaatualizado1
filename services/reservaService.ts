// services/reservaService.ts
const BASE_URL = "https://back-immercia.onrender.com";

export type FormaPagamento =
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "boleto";

export interface CreateReservaPayload {
  id_cliente: number;
  id_produto: number;
  quantidade?: number;
  data_checkin?: string;
  data_checkout?: string;
  forma_pagamento?: FormaPagamento;
  observacoes?: string;
}

// 👇 renomeada de "Reserva" pra "ReservaResponse" (é o nome que a tela
// de listagem já importa) e datas como string, não Timestamp do
// react-native-reanimated (isso não tem nada a ver com datas do banco)
export interface ReservaResponse {
  id: number;
  id_cliente: number;
  id_produto: number;
  quantidade: number;
  preco_total: number;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
  forma_pagamento: string | null;
  codigo_reserva: string;
  data_checkin: string | null;
  data_checkout: string | null;
  data_reserva: string;
  observacoes: string | null;
  produto?: {
    id: number;
    nome: string;
    imagem_url?: string;
    [key: string]: any;
  };
}

export const reservaService = {
  create: async (dados: CreateReservaPayload): Promise<ReservaResponse> => {
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

  // 👇 "Minhas compras" — nome alinhado com o que a tela minhas-reservas
  // realmente chama (antes era "findByCliente" e a tela chamava
  // "findMinhasCompras", que não existia -> quebrava em runtime)
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
        throw new Error("Erro ao buscar reservas.");
      }

      return dados;
    } catch (error) {
      throw error;
    }
  },
};
