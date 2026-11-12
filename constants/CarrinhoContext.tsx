import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { Cupom, cuponsService } from "../services/cuponsService";

// Desconto (em %) dado a quem monta um pacote (hospedagem + experiência).
// ⚠️ Aqui é só pra EXIBIÇÃO — o valor realmente cobrado é calculado no
// backend (DESCONTO_PACOTE_PERCENTUAL em reservas.service.js, padrão
// 0.05). Se mudar um, mude o outro.
export const DESCONTO_PACOTE_PERCENTUAL = 5;

// Formato mínimo do produto que o carrinho precisa conhecer.
// Ajuste os campos aqui se o seu ProdutoResponse tiver nomes diferentes.
export interface ProdutoCarrinho {
  data_checkin: string | undefined;
  data_checkout: string | undefined;
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  tipo_produto?: string;
}

export interface ItemCarrinho {
  produto: ProdutoCarrinho;
  quantidade: number;
  // true quando o item entrou no carrinho pela tela de montar pacote
  pacote?: boolean;
}

export interface ResultadoAplicarCupom {
  sucesso: boolean;
  mensagem: string;
}

interface CarrinhoContextData {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: ProdutoCarrinho, quantidade?: number) => void;
  // 🆕 Adiciona um pacote inteiro (hospedagem + experiências). Se algum
  // produto já estava no carrinho, ele é substituído pelo do pacote
  // (datas e quantidade do pacote valem).
  adicionarPacoteAoCarrinho: (
    itensPacote: { produto: ProdutoCarrinho; quantidade: number }[],
  ) => void;
  removerDoCarrinho: (idProduto: number) => void;
  atualizarQuantidade: (idProduto: number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
  // 🆕 Desconto de pacote
  pacoteAtivo: boolean;
  itemTemDescontoPacote: (item: ItemCarrinho) => boolean;
  descontoPacote: number;
  // Cupom — compartilhado entre Carrinho e Pagamento, pra não se
  // perder ao navegar entre as telas.
  cupomAplicado: Cupom | null;
  aplicandoCupom: boolean;
  aplicarCupom: (
    codigo: string,
    idCliente: number,
  ) => Promise<ResultadoAplicarCupom>;
  removerCupom: () => void;
  valorDesconto: number;
  totalComDesconto: number;
}

const CarrinhoContext = createContext<CarrinhoContextData | undefined>(
  undefined,
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(null);
  const [aplicandoCupom, setAplicandoCupom] = useState(false);

  const adicionarAoCarrinho = (produto: ProdutoCarrinho, quantidade = 1) => {
    setItens((atual) => {
      const existente = atual.find((item) => item.produto.id === produto.id);

      if (existente) {
        // Já está no carrinho — só soma a quantidade
        return atual.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        );
      }

      // Novo item
      return [...atual, { produto, quantidade }];
    });
  };

  // 🆕 O desconto de pacote não acumula com cupom, então adicionar um
  // pacote também remove o cupom que estivesse aplicado.
  const adicionarPacoteAoCarrinho = (
    itensPacote: { produto: ProdutoCarrinho; quantidade: number }[],
  ) => {
    setItens((atual) => {
      const idsDoPacote = new Set(itensPacote.map((i) => i.produto.id));
      const restantes = atual.filter((i) => !idsDoPacote.has(i.produto.id));
      return [
        ...restantes,
        ...itensPacote.map((i) => ({ ...i, pacote: true })),
      ];
    });
    setCupomAplicado(null);
  };

  const removerDoCarrinho = (idProduto: number) => {
    setItens((atual) => atual.filter((item) => item.produto.id !== idProduto));
  };

  const atualizarQuantidade = (idProduto: number, quantidade: number) => {
    if (quantidade < 1) {
      removerDoCarrinho(idProduto);
      return;
    }
    setItens((atual) =>
      atual.map((item) =>
        item.produto.id === idProduto ? { ...item, quantidade } : item,
      ),
    );
  };

  // Limpar o carrinho também limpa o cupom aplicado — evita que um
  // cupom já usado fique "grudado" pra próxima compra.
  const limparCarrinho = () => {
    setItens([]);
    setCupomAplicado(null);
  };

  const totalItens = useMemo(
    () => itens.reduce((soma, item) => soma + item.quantidade, 0),
    [itens],
  );

  const totalPreco = useMemo(
    () =>
      itens.reduce(
        (soma, item) => soma + item.produto.preco * item.quantidade,
        0,
      ),
    [itens],
  );

  // 🆕 O pacote só vale se ainda tiver hospedagem E pelo menos uma
  // experiência marcadas como do pacote. Se o cliente remover a
  // hospedagem (ou todas as experiências) do carrinho, o desconto some.
  const pacoteAtivo = useMemo(() => {
    const doPacote = itens.filter((i) => i.pacote);
    return (
      doPacote.some((i) => i.produto.tipo_produto === "hospedagem") &&
      doPacote.some((i) => i.produto.tipo_produto === "experiencia")
    );
  }, [itens]);

  const itemTemDescontoPacote = (item: ItemCarrinho): boolean =>
    pacoteAtivo && !!item.pacote;

  // Mesma conta do backend: arredonda o preço do item, aplica o
  // percentual e arredonda de novo, item por item.
  const descontoPacote = useMemo(() => {
    if (!pacoteAtivo) return 0;
    const total = itens
      .filter((i) => i.pacote)
      .reduce((soma, item) => {
        const base = Number((item.produto.preco * item.quantidade).toFixed(2));
        return (
          soma + Number((base * (DESCONTO_PACOTE_PERCENTUAL / 100)).toFixed(2))
        );
      }, 0);
    return Number(total.toFixed(2));
  }, [itens, pacoteAtivo]);

  // Valida de verdade contra a API (nunca confia num valor fixo no
  // código do front) e só guarda o cupom no estado se a validação passar.
  const aplicarCupom = async (
    codigo: string,
    idCliente: number,
  ): Promise<ResultadoAplicarCupom> => {
    if (pacoteAtivo) {
      return {
        sucesso: false,
        mensagem: "Cupons não podem ser usados junto com o desconto de pacote.",
      };
    }

    setAplicandoCupom(true);
    try {
      const cupom = await cuponsService.validarParaUso(
        codigo,
        idCliente,
        totalPreco,
      );
      setCupomAplicado(cupom);
      return {
        sucesso: true,
        mensagem: `Cupom aplicado! ${cupom.percentual_desconto}% de desconto`,
      };
    } catch (error: any) {
      return {
        sucesso: false,
        mensagem: error.message || "Não foi possível aplicar o cupom.",
      };
    } finally {
      setAplicandoCupom(false);
    }
  };

  const removerCupom = () => setCupomAplicado(null);

  const valorDesconto = useMemo(() => {
    if (!cupomAplicado) return 0;
    return Number(
      ((totalPreco * Number(cupomAplicado.percentual_desconto)) / 100).toFixed(
        2,
      ),
    );
  }, [cupomAplicado, totalPreco]);

  const totalComDesconto = useMemo(
    () => Number((totalPreco - valorDesconto - descontoPacote).toFixed(2)),
    [totalPreco, valorDesconto, descontoPacote],
  );

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        adicionarPacoteAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        totalPreco,
        pacoteAtivo,
        itemTemDescontoPacote,
        descontoPacote,
        cupomAplicado,
        aplicandoCupom,
        aplicarCupom,
        removerCupom,
        valorDesconto,
        totalComDesconto,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error(
      "useCarrinho precisa ser usado dentro de um CarrinhoProvider",
    );
  }
  return contexto;
}
