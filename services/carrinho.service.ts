const BASE_URL = "http://localhost:3000";

export interface AdicionarAoCarrinhoPayload {
  id_cliente: number;
  id_produto: number;
  quantidade?: number; // padrão 1 se não enviado
}

export interface ItemCarrinho {
  id: number;
  quantidade: number;
  data_criacao: string;
  data_atualizacao: string;
  preco_total: number;
  produtos: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem_url: string;
    quantidade_estoque: number;
    status: string;
  };
}

export interface CarrinhoResponse {
  itens: ItemCarrinho[];
  total: number;
}

export const carrinhoService = {
  adicionar: async (dadosCarrinho: AdicionarAoCarrinhoPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/carrinho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCarrinho),
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

  listarPorCliente: async (idCliente: number): Promise<CarrinhoResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/carrinho/${idCliente}`, {
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

  atualizarQuantidade: async (idItemCarrinho: number, quantidade: number) => {
    try {
      const response = await fetch(`${BASE_URL}/carrinho/${idItemCarrinho}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade }),
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

  async removerItem(idItemCarrinho: number) {
    try {
      const url = `${BASE_URL}/carrinho/${idItemCarrinho}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao remover item do carrinho.",
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao remover item do carrinho no front-end:", error);
      throw error;
    }
  },
};
