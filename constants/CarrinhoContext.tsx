import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

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

interface CarrinhoContextData {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: ProdutoCarrinho, quantidade?: number) => void;
  removerDoCarrinho: (idProduto: number) => void;
  atualizarQuantidade: (idProduto: number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
}

const CarrinhoContext = createContext<CarrinhoContextData | undefined>(
  undefined,
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

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

  const limparCarrinho = () => setItens([]);

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
