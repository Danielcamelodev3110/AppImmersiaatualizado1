import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ReservaResponse, reservaService } from "../../services/reservaService"; // ajuste o caminho conforme sua estrutura
import { userService } from "../../services/userService"; // ajuste o caminho conforme sua estrutura

const normalizarPrimeiraImagem = (imagemUrl?: string): string | null => {
  if (!imagemUrl) return null;
  return imagemUrl.split(",")[0]?.trim() || null;
};

const formatarPreco = (preco: number | string) => {
  const valor = typeof preco === "string" ? parseFloat(preco) : preco;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(isNaN(valor) ? 0 : valor);
};

const formatarData = (data?: string | null) => {
  if (!data) return "Data não disponível";
  return new Date(data).toLocaleDateString("pt-BR");
};

// 👇 NOVO: monta o texto "DD/MM/AAAA até DD/MM/AAAA" a partir das datas
// de check-in/check-out da reserva, ou retorna null quando não houver
// período definido (ex: reservas de produtos que não são hospedagem).
const formatarPeriodo = (
  checkin?: string | null,
  checkout?: string | null,
): string | null => {
  if (!checkin || !checkout) return null;
  return `${formatarData(checkin)} até ${formatarData(checkout)}`;
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

export default function MinhasReservasScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarReservas = useCallback(async () => {
    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;

      if (!usuarioLogado?.id) {
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para ver suas reservas.",
        );
        router.replace("/login");
        return;
      }

      // 👇 corrigido: o service expõe "findMinhasCompras" (antes a tela
      // chamava um método que não existia em reservaService.ts)
      const dados = await reservaService.findMinhasCompras(usuarioLogado.id);
      // Mais recentes primeiro
      const ordenadas = [...(dados || [])].sort(
        (a, b) =>
          new Date(b.data_reserva).getTime() -
          new Date(a.data_reserva).getTime(),
      );
      setReservas(ordenadas);
    } catch (error: any) {
      console.error("Erro ao buscar reservas:", error);
      const mensagem =
        error.response?.data?.message ||
        "Não foi possível carregar suas reservas.";
      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, [router]);

  // Recarrega sempre que a tela ganha foco (ex: após finalizar uma compra)
  useFocusEffect(
    useCallback(() => {
      buscarReservas();
    }, [buscarReservas]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarReservas();
  }, [buscarReservas]);

  const renderReserva = ({ item }: { item: ReservaResponse }) => {
    const imagem = normalizarPrimeiraImagem(item.produto?.imagem_url);
    const periodo = formatarPeriodo(item.data_checkin, item.data_checkout);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/reserva/${item.id}` as any)}
        activeOpacity={0.85}
      >
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagem} />
        ) : (
          <View style={[styles.imagem, styles.imagemPlaceholder]}>
            <Ionicons name="image-outline" size={28} color="#AAA" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={2}>
            {item.produto?.nome || "Produto"}
          </Text>

          <Text style={styles.detalhe}>
            {item.quantidade} diária{item.quantidade > 1 ? "s" : ""} ·{" "}
            {formatarPreco(item.preco_total)}
          </Text>

          {/* 👇 NOVO: período de check-in/check-out, quando a reserva tiver */}
          {periodo && (
            <View style={styles.periodoLinha}>
              <Ionicons name="calendar-outline" size={13} color="#584128" />
              <Text style={styles.periodo}>{periodo}</Text>
            </View>
          )}

          <Text style={styles.codigo}>Código: {item.codigo_reserva}</Text>

          <Text style={styles.data}>{formatarData(item.data_reserva)}</Text>

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
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>Minhas Reservas</Text>
        <View style={{ width: 40 }} />
      </View>

      {reservas.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Ionicons name="calendar-outline" size={64} color="#CCC" />
          <Text style={styles.vazioTexto}>
            Você ainda não fez nenhuma reserva
          </Text>
          <TouchableOpacity
            style={styles.botaoExplorar}
            onPress={() => router.push("/")}
          >
            <Text style={styles.botaoExplorarTexto}>Explorar produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          renderItem={renderReserva}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  lista: { padding: 20, gap: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imagem: { width: 80, height: 80, borderRadius: 8 },
  imagemPlaceholder: {
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, justifyContent: "center", gap: 4 },
  nome: { fontSize: 15, fontWeight: "600", color: "#333" },
  detalhe: { fontSize: 13, color: "#666" },
  // 👇 NOVO: estilos do período de check-in/check-out
  periodoLinha: { flexDirection: "row", alignItems: "center", gap: 4 },
  periodo: { fontSize: 12, color: "#584128", fontWeight: "500" },
  codigo: { fontSize: 11, color: "#AAA" },
  data: { fontSize: 12, color: "#999" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  statusTexto: { fontSize: 11, fontWeight: "bold" },
  vazioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  vazioTexto: { fontSize: 16, color: "#999" },
  botaoExplorar: {
    marginTop: 8,
    backgroundColor: "#584128",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botaoExplorarTexto: { color: "#FFF", fontWeight: "600" },
});
