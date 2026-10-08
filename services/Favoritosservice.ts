const BASE_URL = "https://back-immercia.onrender.com";

// Campos do produto como vêm do back-immercia (produtos.service.js).
// ⚠️ Não existe campo de avaliação/nota no banco hoje — se quiser
// mostrar isso na tela, precisa criar essa coluna/tabela primeiro.
export interface ProdutoFavorito {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  tipo_produto?: string;
  localizacao?: string;
  quantidade_estoque?: number;
  status?: string;
}

export interface Favorito {
  id: number;
  data_criacao: string;
  produto: ProdutoFavorito;
}

export const favoritosService = {
  adicionar: async (idCliente: number, idProduto: number) => {
    try {
      const response = await fetch(`${BASE_URL}/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: idCliente, id_produto: idProduto }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao favoritar.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  remover: async (idCliente: number, idProduto: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/favoritos/${idCliente}/${idProduto}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao remover dos favoritos.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  findByCliente: async (idCliente: number): Promise<Favorito[]> => {
    try {
      const response = await fetch(`${BASE_URL}/favoritos/${idCliente}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao buscar favoritos.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },

  // Útil em telas de listagem/detalhe de produto, pra saber se o
  // coração deve aparecer preenchido ou não.
  findIdsPorCliente: async (idCliente: number): Promise<number[]> => {
    try {
      const response = await fetch(`${BASE_URL}/favoritos/${idCliente}/ids`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao buscar favoritos.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },
};
