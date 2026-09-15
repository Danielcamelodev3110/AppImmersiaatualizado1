import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCarrinho } from "../../constants/CarrinhoContext"; // ajuste o caminho conforme sua estrutura
import {
  TAXA_PLATAFORMA_DESCRICAO,
  TAXA_PLATAFORMA_LABEL,
  aplicarTaxaPlataforma,
  calcularTaxaPlataforma,
} from "../../constants/taxas";

import { pagamentoService } from "../../services/PagamentoService";
import { FormaPagamento, reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";

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

  // 👇 NOVO: controla o modal de detalhamento do pedido
  const [modalDetalhamentoVisible, setModalDetalhamentoVisible] =
    useState(false);

  // 👇 NOVO: taxa da plataforma/aplicativo (8%) calculada sobre o
  // subtotal do carrinho, e total final que o cliente efetivamente paga
  const taxaAplicativo = calcularTaxaPlataforma(totalPreco);
  const totalComTaxa = totalPreco + taxaAplicativo;

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
      // 👇 NOVO: o valor enviado inclui a taxa do aplicativo (8%) em
      // cima do preco_total de cada reserva — é isso que faz a taxa
      // ser cobrada de verdade, já que o backend salva exatamente o
      // "valor" que a gente manda aqui, sem recalcular nada.
      await Promise.all(
        reservasCriadas.map((reserva) =>
          pagamentoService.create({
            id_reserva: reserva.id,
            valor: aplicarTaxaPlataforma(reserva.preco_total),
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

  // ===== MODAL DE DETALHAMENTO (NOVO) =====
  const ModalDetalhamento = () => (
    <Modal
      visible={modalDetalhamentoVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalDetalhamentoVisible(false)}
    >
      <View style={styles.modalDetalheOverlay}>
        <View style={styles.modalDetalheContainer}>
          <View style={styles.modalDetalheHeader}>
            <Text style={styles.modalDetalheTitulo}>
              Detalhamento do pedido
            </Text>
            <TouchableOpacity
              onPress={() => setModalDetalhamentoVisible(false)}
            >
              <Feather name="x" size={22} color="#584128" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalDetalheLinha}>
            <Text style={styles.modalDetalheLabel}>Subtotal</Text>
            <Text style={styles.modalDetalheValor}>
              {formatarMoeda(totalPreco)}
            </Text>
          </View>

          <View style={styles.modalDetalheLinha}>
            <Text style={styles.modalDetalheLabel}>
              {TAXA_PLATAFORMA_LABEL}
            </Text>
            <Text style={styles.modalDetalheValor}>
              {formatarMoeda(taxaAplicativo)}
            </Text>
          </View>

          {/* 👇 explicação de que é taxa do aplicativo/empresa */}
          <Text style={styles.modalDetalheExplicacao}>
            {TAXA_PLATAFORMA_DESCRICAO}
          </Text>

          <View style={styles.modalDetalheDivisor} />

          <View style={styles.modalDetalheLinha}>
            <Text style={styles.modalDetalheTotalLabel}>Total</Text>
            <Text style={styles.modalDetalheTotalValor}>
              {formatarMoeda(totalComTaxa)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modalDetalheBotaoFechar}
            onPress={() => setModalDetalhamentoVisible(false)}
          >
            <Text style={styles.modalDetalheBotaoFecharText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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

          <View style={styles.totalLinha}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValorSecundario}>
              {formatarMoeda(totalPreco)}
            </Text>
          </View>

          {/* 👇 NOVO: linha da taxa do aplicativo */}
          <View style={styles.totalLinha}>
            <Text style={styles.totalLabel}>{TAXA_PLATAFORMA_LABEL}</Text>
            <Text style={styles.totalValorSecundario}>
              {formatarMoeda(taxaAplicativo)}
            </Text>
          </View>

          {/* 👇 NOVO: botão de detalhamento, explicando a taxa da empresa */}
          <TouchableOpacity
            style={styles.btnDetalhamento}
            onPress={() => setModalDetalhamentoVisible(true)}
          >
            <Feather name="info" size={14} color="#584128" />
            <Text style={styles.btnDetalhamentoText}>
              Ver detalhamento do pedido
            </Text>
          </TouchableOpacity>

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

      <ModalDetalhamento />
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
  // 👇 NOVO: linha final (Total) com separador acima, igual antes
  totalLinhaFinal: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  totalLabel: { fontSize: 14, color: "#333" },
  totalValorSecundario: { fontSize: 14, fontWeight: "600", color: "#584128" },
  totalValor: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  // 👇 NOVO: botão "Ver detalhamento do pedido"
  btnDetalhamento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginTop: 4,
  },
  btnDetalhamentoText: {
    fontSize: 12,
    color: "#584128",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
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
  // 👇 NOVO: estilos do modal de detalhamento (mesmo padrão do carrinho)
  modalDetalheOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalDetalheContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalDetalheHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalDetalheTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2c1810",
  },
  modalDetalheLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  modalDetalheLabel: {
    fontSize: 14,
    color: "#2c1810",
    flexShrink: 1,
    paddingRight: 8,
  },
  modalDetalheValor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c1810",
  },
  modalDetalheExplicacao: {
    fontSize: 12,
    color: "#8B8272",
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 8,
    fontStyle: "italic",
  },
  modalDetalheDivisor: {
    height: 1,
    backgroundColor: "#f0ebe3",
    marginVertical: 8,
  },
  modalDetalheTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c1810",
  },
  modalDetalheTotalValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#584128",
  },
  modalDetalheBotaoFechar: {
    backgroundColor: "#584128",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  modalDetalheBotaoFecharText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
