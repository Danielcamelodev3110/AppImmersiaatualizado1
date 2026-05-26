import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { produtoService } from "../../services/ProdutoService";
import { userService } from "../../services/userService";

interface Hospedagem {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco: string;
  imagem_url: string;
  localizacao?: string;
  duracao?: string;
}

export default function MinhasHospedagensScreen() {
  const router = useRouter();
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const carregarHospedagens = async (id: number) => {
    try {
      setCarregando(true);
      const dados = await produtoService.findMinhasHospedagens(id);
      setHospedagens(dados);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar suas hospedagens.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const iniciarTela = async () => {
      const usuarioLogado = await userService.getSavedSession();
      if (usuarioLogado && usuarioLogado.id) {
        setUserId(usuarioLogado.id);
        carregarHospedagens(usuarioLogado.id);
      } else {
        Alert.alert("Acesso Negado", "Faça login para ver suas hospedagens.", [
          { text: "Login", onPress: () => router.replace("/login") },
        ]);
      }
    };
    iniciarTela();
  }, []);

  const renderCard = ({ item }: { item: Hospedagem }) => {
    // Tratamento para múltiplas imagens: separa por vírgula e pega a primeira url válida
    const linksImagens = item.imagem_url ? item.imagem_url.split(",") : [];
    const imagemCapa = linksImagens[0] || "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/detalhes-produto?id=${item.id}`)}
      >
        <Image source={{ uri: imagemCapa }} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>
              {item.categoria.toUpperCase()}
            </Text>
            <Text style={styles.priceText}>
              R$ {parseFloat(item.preco).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.titleText} numberOfLines={1}>
            {item.nome}
          </Text>

          {item.localizacao && (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={12} color="#777" />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.localizacao}
              </Text>
            </View>
          )}

          {item.duracao && (
            <View style={styles.infoRow}>
              <Feather name="clock" size={12} color="#777" />
              <Text style={styles.infoText}>{item.duracao}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Hospedagens</Text>
      </View>

      {/* Conteúdo Principal */}
      {carregando ? (
        <ActivityIndicator size="large" color="#584128" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={hospedagens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="home" size={48} color="#C4D5BE" />
              <Text style={styles.emptyText}>
                Você ainda não possui nenhuma hospedagem cadastrada.
              </Text>
              <TouchableOpacity
                style={styles.cadastrarBtn}
                onPress={() => router.push("/cadastrar-produto")}
              >
                <Text style={styles.cadastrarBtnText}>Anunciar Hospedagem</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "#EDEAE0",
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#584128" },
  listContainer: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C4D5BE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImage: { width: "100%", height: 160, backgroundColor: "#DDD" },
  cardContent: { padding: 14 },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryText: { fontSize: 11, fontWeight: "bold", color: "#C4D5BE" },
  priceText: { fontSize: 15, fontWeight: "bold", color: "#584128" },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  infoText: { fontSize: 13, color: "#666", flex: 1 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 20,
  },
  cadastrarBtn: {
    backgroundColor: "#584128",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cadastrarBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
