import { FormaPagamento } from "./reservaService";

const BASE_URL = "https://back-immercia.onrender.com";

export interface CreatePagamentoPayload {
  id_reserva: number;
  valor: number;
  forma_pagamento: FormaPagamento;
}

export interface Pagamento {
  id: number;
  valor: number;
  forma_pagamento: string;
  status: string;
  transacao_id: string;
  id_reserva: number;
  data_pagamento: string;
  comprovante_url: string | null;
}

export const pagamentoService = {
  // ⚠️ Hoje isso é uma SIMULAÇÃO: o backend aprova o pagamento na hora,
  // sem gateway real. Quando integrar um gateway de verdade, essa
  // função provavelmente vai retornar um status "pendente" + os dados
  // necessários pra abrir o checkout do gateway (ex: link do Pix,
  // client_secret do Stripe etc.), em vez de já vir "aprovado".
  create: async (dados: CreatePagamentoPayload): Promise<Pagamento> => {
    try {
      const response = await fetch(`${BASE_URL}/pagamentos`, {
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
};
