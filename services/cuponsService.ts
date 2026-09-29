const BASE_URL = "https://back-immercia.onrender.com";

export interface Cupom {
  id: number;
  codigo: string;
  hash: string;
  percentual_desconto: number;
  descricao: string | null;
  categoria: string;
  valor_minimo_compra: number;
  data_validade: string | null; // "AAAA-MM-DD" ou null
  ativo: boolean;
  data_criacao: string;
}

export const cuponsService = {
  findAll: async (): Promise<Cupom[]> => {
    try {
      const response = await fetch(`${BASE_URL}/cupons`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao buscar cupons.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  // Ids dos cupons que o cliente já resgatou (pra pintar "usado" na tela)
  findResgatadosPorCliente: async (idCliente: number): Promise<number[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/cupons/resgatados/${idCliente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao buscar cupons resgatados.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  // Valida se o cliente pode usar esse cupom numa compra de "valorCompra"
  // reais. Se voltar sem erro, o cupom retornado já traz o
  // percentual_desconto certo pra aplicar. Usado pelo carrinho.
  validarParaUso: async (
    codigo: string,
    idCliente: number,
    valorCompra: number,
  ): Promise<Cupom> => {
    try {
      const response = await fetch(`${BASE_URL}/cupons/${codigo}/validar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: idCliente,
          valor_compra: valorCompra,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Não foi possível validar o cupom.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  resgatar: async (idCupom: number, idCliente: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cupons/${idCupom}/resgatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: idCliente }),
      });

      const dados = await response.json();

      if (!response.ok) {
        const erroInstancia = new Error(
          dados.message || "Erro ao resgatar cupom.",
        );
        (erroInstancia as any).response = { data: dados };
        throw erroInstancia;
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },
};
