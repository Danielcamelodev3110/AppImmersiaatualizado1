import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  RelatorioFinanceiro,
  relatorioService,
} from "../../services/Relatorioservice";

const formatarMoeda = (valor: number | undefined | null) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(!valor || isNaN(valor) ? 0 : valor);
};

const formatarData = (data?: string | null) => {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
};

// Monta o conteúdo do CSV a partir das linhas do relatório. Usa ";" como
// separador (padrão do Excel em pt-BR) e escapa aspas duplas.
function gerarCSV(relatorio: RelatorioFinanceiro): string {
  const cabecalho = [
    "Codigo Reserva",
    "Data",
    "Status",
    "Cliente",
    "Email Cliente",
    "Produto",
    "Gasto do Cliente",
    "Taxa da Plataforma (10%)",
    "Taxa do Produto (3%)",
    "Valor Repassado ao Anfitriao",
  ];

  const escapar = (valor: string) => `"${String(valor).replace(/"/g, '""')}"`;

  const linhas = relatorio.reservas.map((r) =>
    [
      escapar(r.codigo_reserva),
      escapar(formatarData(r.data_reserva)),
      escapar(r.status),
      escapar(r.cliente),
      escapar(r.email_cliente),
      escapar(r.produto),
      r.gasto_cliente.toFixed(2).replace(".", ","),
      r.taxa_plataforma.toFixed(2).replace(".", ","),
      r.taxa_produto.toFixed(2).replace(".", ","),
      r.valor_repasse.toFixed(2).replace(".", ","),
    ].join(";"),
  );

  const linhaTotais = [
    escapar("TOTAL"),
    "",
    "",
    "",
    "",
    "",
    relatorio.totalGastoClientes.toFixed(2).replace(".", ","),
    relatorio.totalTaxaPlataforma.toFixed(2).replace(".", ","),
    relatorio.totalTaxaProduto.toFixed(2).replace(".", ","),
    relatorio.totalSaidaAnfitrioes.toFixed(2).replace(".", ","),
  ].join(";");

  return [cabecalho.join(";"), ...linhas, linhaTotais].join("\n");
}

export default function Relatorio() {
  const router = useRouter();
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const dados = await relatorioService.financeiro();
      setRelatorio(dados);
    } catch (error: any) {
      mostrarAviso(
        "Erro",
        error.message || "Não foi possível carregar o relatório.",
      );
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarDados();
  }, [carregarDados]);

  const handleBaixar = async () => {
    if (!relatorio || relatorio.reservas.length === 0) {
      mostrarAviso("Sem dados", "Não há reservas nesse período pra exportar.");
      return;
    }

    setBaixando(true);
    try {
      const csv = gerarCSV(relatorio);
      const nomeArquivo = `relatorio-immercia-${Date.now()}.csv`;

      // 🔧 FIX: expo-file-system/expo-sharing não funcionam direito na
      // web (documentDirectory é null lá). Na web, gera o download
      // usando Blob + link, que é o jeito nativo do navegador.
      if (Platform.OS === "web") {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nomeArquivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBaixando(false);
        return;
      }

      const caminho = `${FileSystem.documentDirectory}${nomeArquivo}`;

      await FileSystem.writeAsStringAsync(caminho, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const podeCompartilhar = await Sharing.isAvailableAsync();
      if (podeCompartilhar) {
        await Sharing.shareAsync(caminho, {
          mimeType: "text/csv",
          dialogTitle: "Salvar relatório financeiro",
          UTI: "public.comma-separated-values-text",
        });
      } else {
        mostrarAviso("Arquivo gerado", `Arquivo salvo em: ${caminho}`);
      }
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      mostrarAviso(
        "Erro ao gerar arquivo",
        error.message || "Tente novamente.",
      );
    } finally {
      setBaixando(false);
    }
  };

  // 🔧 FIX: Alert.alert não mostra nada visível no Expo Web — só loga no
  // console. Na web, usa window.alert (que o navegador sabe mostrar de
  // verdade); fora da web, mantém o Alert.alert nativo normalmente.
  const mostrarAviso = (titulo: string, mensagem: string) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório Financeiro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quanto entra */}
        <View style={[styles.cardPrincipal, styles.cardEntrada]}>
          <Text style={styles.cardPrincipalLabel}>Total que ENTRA (taxas)</Text>
          <Text style={styles.cardPrincipalValor}>
            {formatarMoeda(relatorio?.totalEntradaPlataforma)}
          </Text>
        </View>

        {/* Quanto sai */}
        <View style={[styles.cardPrincipal, styles.cardSaida]}>
          <Text style={styles.cardPrincipalLabel}>
            Total que SAI (repasses aos anfitriões)
          </Text>
          <Text style={styles.cardPrincipalValor}>
            {formatarMoeda(relatorio?.totalSaidaAnfitrioes)}
          </Text>
        </View>

        {/* Detalhamento */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Detalhamento</Text>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>Total gasto pelos clientes</Text>
            <Text style={styles.linhaValor}>
              {formatarMoeda(relatorio?.totalGastoClientes)}
            </Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>
              Taxa da plataforma (10% · cliente)
            </Text>
            <Text style={styles.linhaValor}>
              {formatarMoeda(relatorio?.totalTaxaPlataforma)}
            </Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>
              Taxa do produto (3% · anfitrião)
            </Text>
            <Text style={styles.linhaValor}>
              {formatarMoeda(relatorio?.totalTaxaProduto)}
            </Text>
          </View>
          <View style={[styles.linha, styles.linhaFinal]}>
            <Text style={styles.linhaLabelFinal}>Reservas consideradas</Text>
            <Text style={styles.linhaValorFinal}>
              {relatorio?.quantidadeReservas || 0}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.botaoBaixar, baixando && styles.botaoDesabilitado]}
          onPress={handleBaixar}
          disabled={baixando}
        >
          {baixando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="#FFF" />
              <Text style={styles.botaoBaixarTexto}>
                Baixar relatório (CSV)
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.aviso}>
          O arquivo inclui todas as reservas confirmadas ou concluídas, com
          valores individuais de cada uma.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEAE0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  cardPrincipal: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  cardEntrada: { backgroundColor: "#27ae60" },
  cardSaida: { backgroundColor: "#584128" },
  cardPrincipalLabel: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.9,
  },
  cardPrincipalValor: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
  secao: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  linhaLabel: { fontSize: 14, color: "#666" },
  linhaValor: { fontSize: 14, color: "#333", fontWeight: "600" },
  linhaFinal: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0EEE9",
  },
  linhaLabelFinal: { fontSize: 15, fontWeight: "bold", color: "#333" },
  linhaValorFinal: { fontSize: 15, fontWeight: "bold", color: "#584128" },
  botaoBaixar: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#584128",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoBaixarTexto: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  aviso: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
  },
});
