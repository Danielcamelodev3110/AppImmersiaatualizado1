import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Reserva,
  ResumoGanhos,
  reservaService,
} from "../../services/reservaService";
import { userService } from "../../services/userService";

const formatarMoeda = (valor: number | string | undefined | null) => {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(!numero || isNaN(numero) ? 0 : numero);
};

const formatarData = (data?: string | null) => {
  if (!data) return "Data não disponível";
  return new Date(data).toLocaleDateString("pt-BR");
};

const rotuloStatus: Record<string, string> = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  concluida: "Concluída",
};

const corDoStatus = (status?: string) => {
  switch (status) {
    case "confirmada":
      return "#4ECDC4";
    case "concluida":
      return "#584128";
    case "cancelada":
      return "#FF6B6B";
    case "pendente":
    default:
      return "#C5A87B";
  }
};

export default function MeusGanhosScreen() {
  const router = useRouter();
  const [resumo, setResumo] = useState<ResumoGanhos | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;

      if (!usuarioLogado?.id) {
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para ver seus ganhos.",
        );
        router.replace("/login");
        return;
      }

      const [resumoDados, reservasDados] = await Promise.all([
        reservaService.getResumoGanhos(usuarioLogado.id),
        reservaService.findByAnfitriao(usuarioLogado.id),
      ]);

      setResumo(resumoDados);

      const ordenadas = [...(reservasDados || [])].sort(
        (a, b) =>
          new Date(b.data_reserva).getTime() -
          new Date(a.data_reserva).getTime(),
      );
      setReservas(ordenadas);
    } catch (error: any) {
      console.error("Erro ao buscar ganhos:", error);
      Alert.alert("Erro", "Não foi possível carregar seus ganhos.");
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarDados();
  }, [carregarDados]);

  const renderReserva = ({ item }: { item: Reserva }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <Text style={styles.produtoNome} numberOfLines={1}>
          {item.produto?.nome || "Produto"}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: corDoStatus(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusTexto, { color: corDoStatus(item.status) }]}
          >
            {rotuloStatus[item.status] || item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.data}>{formatarData(item.data_reserva)}</Text>

      <View style={styles.linhaValor}>
        <Text style={styles.linhaValorLabel}>Valor da reserva</Text>
        <Text style={styles.linhaValorTexto}>
          {formatarMoeda(item.preco_total)}
        </Text>
      </View>
      <View style={styles.linhaValor}>
        <Text style={styles.linhaValorLabel}>Taxa da plataforma</Text>
        <Text style={styles.linhaValorTaxa}>
          − {formatarMoeda(item.taxa_plataforma)}
        </Text>
      </View>
      <View style={[styles.linhaValor, styles.linhaLiquido]}>
        <Text style={styles.linhaLiquidoLabel}>Você recebe</Text>
        <Text style={styles.linhaLiquidoTexto}>
          {formatarMoeda(
            item.valor_repasse ?? item.preco_total - item.taxa_plataforma,
          )}
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Meus Ganhos</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={reservas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.resumoContainer}>
            <View style={styles.resumoCardPrincipal}>
              <Text style={styles.resumoPrincipalLabel}>
                Total líquido recebido
              </Text>
              <Text style={styles.resumoPrincipalValor}>
                {formatarMoeda(resumo?.totalLiquido)}
              </Text>
              <Text style={styles.resumoPrincipalSub}>
                {resumo?.quantidadeReservas || 0} reserva(s) confirmada(s) ou
                concluída(s)
              </Text>
            </View>

            <View style={styles.resumoLinha}>
              <View style={styles.resumoCardSecundario}>
                <Text style={styles.resumoSecundarioLabel}>Total bruto</Text>
                <Text style={styles.resumoSecundarioValor}>
                  {formatarMoeda(resumo?.totalBruto)}
                </Text>
              </View>
              <View style={styles.resumoCardSecundario}>
                <Text style={styles.resumoSecundarioLabel}>
                  Taxa da plataforma
                  {resumo?.percentualTaxa
                    ? ` (${(resumo.percentualTaxa * 100).toFixed(0)}%)`
                    : ""}
                </Text>
                <Text
                  style={[styles.resumoSecundarioValor, { color: "#FF6B6B" }]}
                >
                  − {formatarMoeda(resumo?.totalTaxaPlataforma)}
                </Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Extrato de reservas</Text>
          </View>
        }
        renderItem={renderReserva}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="wallet-outline" size={64} color="#CCC" />
            <Text style={styles.vazioTexto}>
              Você ainda não recebeu nenhuma reserva
            </Text>
          </View>
        }
      />
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
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#584128" },
  lista: { padding: 20, gap: 12, paddingBottom: 40 },
  resumoContainer: { gap: 12, marginBottom: 8 },
  resumoCardPrincipal: {
    backgroundColor: "#584128",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  resumoPrincipalLabel: { color: "#EDEAE0", fontSize: 13, fontWeight: "600" },
  resumoPrincipalValor: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
  },
  resumoPrincipalSub: { color: "#C5A87B", fontSize: 12, marginTop: 6 },
  resumoLinha: { flexDirection: "row", gap: 12 },
  resumoCardSecundario: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
  },
  resumoSecundarioLabel: { fontSize: 12, color: "#888" },
  resumoSecundarioValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    gap: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  produtoNome: { fontSize: 15, fontWeight: "600", color: "#333", flex: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusTexto: { fontSize: 11, fontWeight: "bold" },
  data: { fontSize: 12, color: "#999", marginBottom: 6 },
  linhaValor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  linhaValorLabel: { fontSize: 13, color: "#666" },
  linhaValorTexto: { fontSize: 13, color: "#333", fontWeight: "500" },
  linhaValorTaxa: { fontSize: 13, color: "#FF6B6B", fontWeight: "500" },
  linhaLiquido: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F0EEE9",
  },
  linhaLiquidoLabel: { fontSize: 14, fontWeight: "bold", color: "#333" },
  linhaLiquidoTexto: { fontSize: 14, fontWeight: "bold", color: "#27ae60" },
  vazioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 60,
  },
  vazioTexto: { fontSize: 16, color: "#999", textAlign: "center" },
});
