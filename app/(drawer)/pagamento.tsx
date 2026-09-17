import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCarrinho } from "../../constants/CarrinhoContext"; // ajuste o caminho conforme sua estrutura

import { pagamentoService } from "../../services/PagamentoService";
import { FormaPagamento, reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";

// 🔧 Mesmo percentual usado em Carrinho.tsx e no back-immercia
// (TAXA_PLATAFORMA_PERCENTUAL no .env, padrão 0.08 = 8%). Usado aqui só
// para EXIBIÇÃO — o valor realmente cobrado é sempre o que o backend
// calcula em reservas.service.js (reserva.preco_total já vem com a
// taxa embutida, e é isso que é enviado pro pagamentoService.create).
// Se mudar o percentual no .env do back, atualize aqui também (ou crie
// um endpoint tipo GET /config pra centralizar isso).
const TAXA_PLATAFORMA_PERCENTUAL = 0.1;

// 👇 opções exibidas na tela. Os "value" precisam bater exatamente com
// os valores do enum FormaPagamento criado no banco.
const OPCOES_PAGAMENTO: {
  value: FormaPagamento;
  label: string;
  icone: keyof typeof Feather.glyphMap;
}[] = [
  { value: "pix", label: "Pix", icone: "zap" },
  { value: "cartao_credito", label: "Cartão de crédito", icone: "credit-card" },
  { value: "cartao_debito", label: "Cartão de débito", icone: "credit-card" },
  { value: "boleto", label: "Boleto", icone: "file-text" },
];

const formatarDataISOParaBR = (dataISO?: string | null): string => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};

const formatarMoeda = (valor: number): string =>
  `R$ ${valor.toFixed(2).replace(".", ",")}`;

export default function Pagamento() {
  const { itens, totalPreco, limparCarrinho } = useCarrinho();
  const [formaSelecionada, setFormaSelecionada] =
    useState<FormaPagamento | null>(null);
  const [processando, setProcessando] = useState(false);

  // 🔧 FIX: agora soma a taxa da plataforma ao total exibido, igual ao
  // carrinho, em vez de mostrar só o subtotal sem taxa.
  const subtotal = totalPreco;
  const taxaAplicativo = Number(
    (subtotal * TAXA_PLATAFORMA_PERCENTUAL).toFixed(2),
  );
  const totalComTaxa = Number((subtotal + taxaAplicativo).toFixed(2));

  const handleConfirmarPagamento = async () => {
    if (itens.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione itens ao carrinho antes de pagar.",
      );
      return;
    }

    if (!formaSelecionada) {
      Alert.alert("Atenção", "Escolha uma forma de pagamento.");
      return;
    }

    setProcessando(true);

    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;

      if (!usuarioLogado?.id) {
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para finalizar a compra.",
        );
        router.push("/login");
        return;
      }

      // ⚠️ IMPORTANTE: isso cria uma reserva por item do carrinho, e
      // depois um pagamento por reserva criada — em sequência, sem
      // transação atômica entre as chamadas (a API REST do Supabase
      // não oferece isso facilmente por aqui). Ou seja: se o app cair
      // no meio do processo, pode sobrar uma reserva "pendente" sem
      // pagamento. Pra um app em produção com volume real, o ideal é
      // mover essa lógica pra uma função no banco (Postgres function/
      // RPC) que faça tudo numa transação só. Por enquanto, como é uma
      // simulação, essa limitação é aceitável.
      const reservasCriadas = [];
      for (const item of itens) {
        const reserva = await reservaService.create({
          id_cliente: usuarioLogado.id,
          id_produto: item.produto.id,
          quantidade: item.quantidade,
          data_checkin: item.produto.data_checkin,
          data_checkout: item.produto.data_checkout,
          forma_pagamento: formaSelecionada,
        });
        reservasCriadas.push(reserva);
      }

      // Cria o pagamento (simulado, aprovado na hora) pra cada reserva.
      // reserva.preco_total já vem do backend com a taxa da plataforma
      // embutida (ver reservas.service.js) — é esse valor, com taxa
      // incluída, que é efetivamente cobrado/registrado.
      await Promise.all(
        reservasCriadas.map((reserva) =>
          pagamentoService.create({
            id_reserva: reserva.id,
            valor: reserva.preco_total,
            forma_pagamento: formaSelecionada,
          }),
        ),
      );

      limparCarrinho();

      Alert.alert(
        "Pagamento aprovado!",
        "Sua compra foi confirmada com sucesso.",
        [
          {
            text: "Ver minhas reservas",
            onPress: () => router.replace("/minhas-reservas"),
          },
        ],
      );
    } catch (error: any) {
      const dadosErro = error.response?.data;
      const mensagemErro =
        dadosErro?.message ||
        error.message ||
        "Erro ao processar o pagamento. Tente novamente.";
      Alert.alert("Erro no pagamento", mensagemErro);
    } finally {
      setProcessando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.vazioContainer}>
          <Feather name="credit-card" size={64} color="#CCC" />
          <Text style={styles.vazioTexto}>Não há itens para pagar</Text>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.push("/carrinho")}
          >
            <Text style={styles.botaoVoltarTexto}>Voltar pro carrinho</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Pagamento</Text>

        {/* Resumo do pedido */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Resumo do pedido</Text>
          {itens.map((item) => {
            const temPeriodo =
              !!item.produto.data_checkin && !!item.produto.data_checkout;
            return (
              <View key={item.produto.id} style={styles.itemLinha}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome} numberOfLines={1}>
                    {item.produto.nome}
                  </Text>
                  {temPeriodo && (
                    <Text style={styles.itemDetalhe}>
                      {formatarDataISOParaBR(item.produto.data_checkin)} até{" "}
                      {formatarDataISOParaBR(item.produto.data_checkout)} ·{" "}
                      {item.quantidade} noite(s)
                    </Text>
                  )}
                  {!temPeriodo && (
                    <Text style={styles.itemDetalhe}>
                      Quantidade: {item.quantidade}
                    </Text>
                  )}
                </View>
                <Text style={styles.itemValor}>
                  R${" "}
                  {(item.produto.preco * item.quantidade)
                    .toFixed(2)
                    .replace(".", ",")}
                </Text>
              </View>
            );
          })}

          {/* 🔧 FIX: subtotal + taxa da plataforma, igual ao carrinho */}
          <View style={styles.totalLinha}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValor}>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={styles.totalLinha}>
            <Text style={styles.subtotalLabel}>Taxa da Plataforma</Text>
            <Text style={styles.subtotalValor}>
              {formatarMoeda(taxaAplicativo)}
            </Text>
          </View>
          <View style={[styles.totalLinha, styles.totalLinhaFinal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>{formatarMoeda(totalComTaxa)}</Text>
          </View>
        </View>

        {/* Forma de pagamento */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Forma de pagamento</Text>
          {OPCOES_PAGAMENTO.map((opcao) => (
            <TouchableOpacity
              key={opcao.value}
              style={[
                styles.opcaoPagamento,
                formaSelecionada === opcao.value && styles.opcaoPagamentoAtiva,
              ]}
              onPress={() => setFormaSelecionada(opcao.value)}
            >
              <Feather
                name={opcao.icone}
                size={20}
                color={formaSelecionada === opcao.value ? "#FFF" : "#584128"}
              />
              <Text
                style={[
                  styles.opcaoPagamentoTexto,
                  formaSelecionada === opcao.value &&
                    styles.opcaoPagamentoTextoAtivo,
                ]}
              >
                {opcao.label}
              </Text>
              {formaSelecionada === opcao.value && (
                <Feather
                  name="check-circle"
                  size={18}
                  color="#FFF"
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* 🔧 FIX: texto atualizado — antes dizia "sem taxas extras",
              o que não é mais verdade (a taxa agora é cobrada do
              comprador e já está somada no total acima). */}
          <Text style={styles.avisoTaxa}>
            O total acima já inclui a taxa da plataforma.
          </Text>

          {/* ⚠️ Nota visível pro usuário, já que é uma simulação por
              enquanto — tire isso quando integrar um gateway real */}
          <Text style={styles.avisoSimulacao}>
            Pagamento simulado para fins de teste — nenhuma cobrança real será
            feita.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.botaoConfirmar,
            (processando || !formaSelecionada) && styles.botaoDesabilitado,
          ]}
          onPress={handleConfirmarPagamento}
          disabled={processando || !formaSelecionada}
        >
          {processando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.botaoConfirmarTexto}>
              Confirmar pagamento · {formatarMoeda(totalComTaxa)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  scroll: { padding: 20, paddingBottom: 40 },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 16,
  },
  secao: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  itemLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EEE9",
  },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemNome: { fontSize: 14, fontWeight: "600", color: "#333" },
  itemDetalhe: { fontSize: 12, color: "#888", marginTop: 2 },
  itemValor: { fontSize: 14, fontWeight: "600", color: "#584128" },
  totalLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLinhaFinal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  subtotalLabel: { fontSize: 14, color: "#666" },
  subtotalValor: { fontSize: 14, color: "#333", fontWeight: "600" },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalValor: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  opcaoPagamento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  opcaoPagamentoAtiva: {
    backgroundColor: "#584128",
    borderColor: "#584128",
  },
  opcaoPagamentoTexto: { fontSize: 15, fontWeight: "600", color: "#584128" },
  opcaoPagamentoTextoAtivo: { color: "#FFF" },
  avisoTaxa: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  avisoSimulacao: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  botaoConfirmar: {
    backgroundColor: "#27ae60",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoConfirmarTexto: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  vazioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  vazioTexto: { fontSize: 16, color: "#999" },
  botaoVoltar: {
    marginTop: 8,
    backgroundColor: "#584128",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botaoVoltarTexto: { color: "#FFF", fontWeight: "600" },
});
