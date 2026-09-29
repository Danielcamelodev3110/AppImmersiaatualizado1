import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { Cupom, cuponsService } from "../services/cuponsService";

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
}

export interface ResultadoAplicarCupom {
  sucesso: boolean;
  mensagem: string;
}

interface CarrinhoContextData {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: ProdutoCarrinho, quantidade?: number) => void;
  removerDoCarrinho: (idProduto: number) => void;
  atualizarQuantidade: (idProduto: number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
  // 👇 Cupom — compartilhado entre Carrinho e Pagamento, pra não se
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

  // 🔧 Limpar o carrinho também limpa o cupom aplicado — evita que um
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

  // 🔧 Cupom: valida de verdade contra a API (nunca confia num valor
  // fixo no código do front) e só guarda o cupom no estado se a
  // validação passar.
  const aplicarCupom = async (
    codigo: string,
    idCliente: number,
  ): Promise<ResultadoAplicarCupom> => {
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
    () => Number((totalPreco - valorDesconto).toFixed(2)),
    [totalPreco, valorDesconto],
  );

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        totalPreco,
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
