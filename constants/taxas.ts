// constants/taxas.ts
//
// Taxa cobrada pelo aplicativo/empresa em cima de cada pedido.
// Centralizada aqui pra não repetir o número "0.08" espalhado pelo
// carrinho, pagamento etc. Se um dia a taxa mudar, muda só aqui.

export const TAXA_PLATAFORMA = 0.08; // 8%

export const TAXA_PLATAFORMA_LABEL = "Taxa do aplicativo (8%)";

export const TAXA_PLATAFORMA_DESCRICAO =
  "Essa é a taxa de serviço cobrada pela Immersia para manter a plataforma " +
  "funcionando: hospedagem dos dados, suporte, segurança dos pagamentos e " +
  "manutenção do aplicativo. Ela é calculada sobre o valor do pedido " +
  "(após descontos) e somada ao total antes da confirmação do pagamento.";

// Calcula o valor (em R$) da taxa em cima de um valor base.
// Arredondado pra 2 casas decimais, igual dinheiro de verdade.
export const calcularTaxaPlataforma = (valorBase: number): number =>
  Number(((valorBase || 0) * TAXA_PLATAFORMA).toFixed(2));

// Aplica a taxa e devolve o valor final (base + taxa).
export const aplicarTaxaPlataforma = (valorBase: number): number =>
  Number(((valorBase || 0) * (1 + TAXA_PLATAFORMA)).toFixed(2));
