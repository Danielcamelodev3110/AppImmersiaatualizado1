const BASE_URL = "https://back-immercia.onrender.com";

export interface CreateProdutoPayload {
  nome: string;
  descricao: string;
  preco: number;
  categoria?: string;
  imagem_url: string; // Enviando como string (pode ser uma URL ou várias separadas por vírgula)
  quantidade_estoque?: number;
  tipo_produto: "experiencia" | "hospedagem"; // Baseado no seu Enum TipoProduto
  localizacao?: string;
  duracao?: string;
  inclui?: string;
  nao_inclui?: string;
  id_cliente_produto: number; // Chave estrangeira que conecta ao usuário logado
}

export const produtoService = {
  create: async (dadosProduto: CreateProdutoPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosProduto),
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

  // 👇 novo método: busca todos os produtos (usado para listar hospedagens/experiências)
  findAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/produtos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      return dados;
    } catch (error) {
      throw error;
    }
  },

  // No seu produtoService.ts (ou dentro do objeto produtoService existente)
  findMinhasHospedagens: async (idCliente: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/produtos/minhas-hospedagens/${idCliente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const dados = await response.json();
      if (!response.ok) throw new Error();
      return dados;
    } catch (error) {
      throw error;
    }
  },

  async deletarProduto(idProduto: number) {
    try {
      const url = `${BASE_URL}/produtos/${idProduto}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar o produto.");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao deletar produto no front-end:", error);
      throw error;
    }
  },
};
