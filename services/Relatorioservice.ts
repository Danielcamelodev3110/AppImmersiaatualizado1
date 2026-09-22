const BASE_URL = "https://back-immercia.onrender.com";

export interface LinhaRelatorio {
  id: number;
  codigo_reserva: string;
  data_reserva: string;
  status: string;
  cliente: string;
  email_cliente: string;
  produto: string;
  gasto_cliente: number; // quanto o cliente pagou (preço + taxa de 10%)
  taxa_plataforma: number; // entrada: taxa do cliente (10%)
  taxa_produto: number; // entrada: taxa do anfitrião (3%)
  valor_repasse: number; // saída: repassado ao anfitrião
}

export interface RelatorioFinanceiro {
  periodo: { dataInicio: string | null; dataFim: string | null };
  quantidadeReservas: number;
  totalGastoClientes: number;
  totalTaxaPlataforma: number;
  totalTaxaProduto: number;
  totalEntradaPlataforma: number; // o que ENTRA na Immercia
  totalSaidaAnfitrioes: number; // o que SAI da Immercia
  reservas: LinhaRelatorio[];
}

export const relatorioService = {
  // dataInicio/dataFim no formato "AAAA-MM-DD" (opcionais)
  financeiro: async (
    dataInicio?: string,
    dataFim?: string,
  ): Promise<RelatorioFinanceiro> => {
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("dataInicio", dataInicio);
      if (dataFim) params.append("dataFim", dataFim);
      const query = params.toString() ? `?${params.toString()}` : "";

      const response = await fetch(`${BASE_URL}/relatorio/financeiro${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao buscar relatório.");
      }

      return dados;
    } catch (error: any) {
      throw error;
    }
  },
};
