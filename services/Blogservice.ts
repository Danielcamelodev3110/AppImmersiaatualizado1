const BASE_URL = "https://back-immercia.onrender.com";

export interface PostBlog {
  id: number;
  titulo: string;
  subtitulo: string | null;
  destino: string | null;
  categoria: string;
  conteudo: string;
  imagem_capa: string | null;
  id_autor: number;
  publicado: boolean;
  data_publicacao: string;
  data_atualizacao: string;
  autor?: { nome_completo: string };
}

export interface CreatePostBlogPayload {
  titulo: string;
  subtitulo?: string;
  destino?: string;
  categoria?: string;
  conteudo: string;
  imagem_capa?: string;
  id_autor: number;
}

export const blogService = {
  create: async (dados: CreatePostBlogPayload): Promise<PostBlog> => {
    try {
      const response = await fetch(`${BASE_URL}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resposta = await response.json();

      if (!response.ok) {
        throw new Error(resposta.message || "Erro ao publicar no blog.");
      }

      return resposta;
    } catch (error: any) {
      throw error;
    }
  },

  findAll: async (): Promise<PostBlog[]> => {
    try {
      const response = await fetch(`${BASE_URL}/blog`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const resposta = await response.json();

      if (!response.ok) {
        throw new Error(resposta.message || "Erro ao buscar postagens.");
      }

      return resposta;
    } catch (error: any) {
      throw error;
    }
  },

  findOne: async (id: number): Promise<PostBlog> => {
    try {
      const response = await fetch(`${BASE_URL}/blog/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const resposta = await response.json();

      if (!response.ok) {
        throw new Error(resposta.message || "Erro ao buscar postagem.");
      }

      return resposta;
    } catch (error: any) {
      throw error;
    }
  },
};
