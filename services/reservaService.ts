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

// Produto/cliente "resumidos" que vêm junto da reserva via join do backend
// (select "*, produto:produtos(*), cliente:registro_cliente(*)")
export interface ProdutoDaReserva {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  tipo_produto?: string;
  id_cliente_produto?: number;
}

export interface ClienteDaReserva {
  id: number;
  nome_completo: string;
  email: string;
}

export interface Reserva {
  id: number;
  id_cliente: number;
  id_produto: number;
  quantidade: number;
  preco_total: number;
  // 👇 Taxa de comissão da plataforma sobre essa reserva (calculada e
  // gravada pelo backend na criação — nunca é enviada pelo app).
  // É descontada do valor repassado ao anfitrião, o comprador paga
  // sempre preco_total, nunca preco_total + taxa.
  taxa_plataforma: number;
  // 👇 Campo derivado (não existe como coluna no banco): preco_total -
  // taxa_plataforma. O backend calcula isso em tempo real em toda
  // resposta, pra nunca ficar desatualizado.
  valor_repasse?: number;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
  forma_pagamento: string | null;
  codigo_reserva: string;
  data_checkin: Timestamp;
  data_checkout: Timestamp;
  data_reserva: string;
  observacoes: string | null;
  produto?: ProdutoDaReserva;
  cliente?: ClienteDaReserva;
}

// Alias mantido por compatibilidade com telas que já esperam esse nome
// (ex: minhas-reservas.tsx)
export type ReservaResponse = Reserva;

export interface ResumoGanhos {
  totalBruto: number;
  totalTaxaPlataforma: number;
  totalLiquido: number;
  quantidadeReservas: number;
  percentualTaxa: number;
}

export const reservaService = {
  // Cria uma reserva (o backend calcula o preco_total e a taxa_plataforma
  // a partir do preço atual do produto, nunca confia num valor vindo do front)
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

  // "Minhas compras" — reservas feitas pelo cliente logado
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

  // Alias de findByCliente — algumas telas chamam esse nome
  findMinhasCompras: async (idCliente: number): Promise<Reserva[]> => {
    return reservaService.findByCliente(idCliente);
  },

  // Reservas recebidas pelo anfitrião (produtos dele comprados por clientes)
  findByAnfitriao: async (idAnfitriao: number): Promise<Reserva[]> => {
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
        throw new Error("Erro ao buscar reservas recebidas.");
      }

      return dados;
    } catch (error) {
      throw error;
    }
  },

  // Resumo financeiro do anfitrião (usado na tela "Meus Ganhos"): total
  // bruto vendido, total retido de taxa_plataforma e total líquido recebido.
  getResumoGanhos: async (idAnfitriao: number): Promise<ResumoGanhos> => {
    try {
      const response = await fetch(
        `${BASE_URL}/reservas/resumo-ganhos/${idAnfitriao}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const dados = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao buscar resumo de ganhos.");
      }

      return dados;
    } catch (error) {
      throw error;
    }
  },

  findOne: async (id: number): Promise<Reserva> => {
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
    } catch (error) {
      throw error;
    }
  },
};
