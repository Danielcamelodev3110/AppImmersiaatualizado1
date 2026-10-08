import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Favorito, favoritosService } from "../../../services/Favoritosservice";
import { userService } from "../../../services/userService";

// 🔧 Alert.alert não mostra nada visível no Expo Web — usa window.alert
// lá, e Alert.alert normal fora da web.
const mostrarAviso = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const formatarMoeda = (valor: number): string =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

export default function FavoritosScreen() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [idClienteLogado, setIdClienteLogado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;
      const idCliente = usuarioLogado?.id || null;
      setIdClienteLogado(idCliente);

      if (!idCliente) {
        setFavoritos([]);
        return;
      }

      const dados = await favoritosService.findByCliente(idCliente);
      setFavoritos(dados);
    } catch (error: any) {
      mostrarAviso(
        "Erro",
        error.message || "Não foi possível carregar seus favoritos.",
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

  const removerFavorito = (favorito: Favorito) => {
    const confirmar = () =>
      (async () => {
        if (!idClienteLogado) return;
        setRemovendoId(favorito.produto.id);
        try {
          await favoritosService.remover(idClienteLogado, favorito.produto.id);
          setFavoritos((atual) => atual.filter((f) => f.id !== favorito.id));
        } catch (error: any) {
          mostrarAviso("Erro", error.message || "Não foi possível remover.");
        } finally {
          setRemovendoId(null);
        }
      })();

    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente remover este item dos favoritos?")) {
        confirmar();
      }
      return;
    }

    Alert.alert(
      "Remover favorito",
      "Deseja realmente remover este item dos favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: confirmar },
      ],
    );
  };

  const HeaderFixo = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#6e3821ff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Favoritos</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const Subtitle = () => (
    <View style={styles.subtitleContainer}>
      <Text style={styles.headerSubtitle}>
        {favoritos.length}{" "}
        {favoritos.length === 1 ? "item salvo" : "itens salvos"}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Favorito }) => {
    const produto = item.produto;
    const removendoEsse = removendoId === produto.id;

    return (
      <View style={styles.card}>
        {produto.imagem_url ? (
          <Image
            source={{ uri: produto.imagem_url.split(",")[0] }}
            style={styles.cardImage}
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#CCC" />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.tipoContainer}>
              <Text style={styles.tipo}>
                {produto.tipo_produto || produto.categoria}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removerFavorito(item)}
              style={styles.favoriteButton}
              disabled={removendoEsse}
            >
              {removendoEsse ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <Ionicons name="heart" size={24} color="#FF6B6B" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.nome}>{produto.nome}</Text>

          {!!produto.localizacao && (
            <View style={styles.localContainer}>
              <Ionicons name="location-outline" size={14} color="#C5A87B" />
              <Text style={styles.localizacao}>{produto.localizacao}</Text>
            </View>
          )}

          <View style={styles.precoContainer}>
            <Text style={styles.cifrao}>R$</Text>
            <Text style={styles.preco}>
              {formatarMoeda(produto.preco).replace("R$ ", "")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoReservar}
            onPress={() =>
              // 🔧 Ajuste essa rota pro caminho real da tela de detalhe
              // do produto no seu app — não sei qual é.
              router.push(`/produto/${produto.id}` as any)
            }
          >
            <Text style={styles.botaoTexto}>RESERVAR AGORA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#C5A87B" />
      <Text style={styles.emptyTitle}>
        {idClienteLogado
          ? "Nenhum favorito ainda"
          : "Você precisa estar logado"}
      </Text>
      <Text style={styles.emptyText}>
        {idClienteLogado
          ? "Explore nossos destinos e adicione seus lugares favoritos clicando no coração ♥"
          : "Faça login para ver e salvar seus favoritos."}
      </Text>
      {!idClienteLogado && (
        <TouchableOpacity
          style={styles.botaoLogin}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.botaoTexto}>Fazer login</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <HeaderFixo />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#584128" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <HeaderFixo />

      <FlatList
        data={favoritos}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={favoritos.length > 0 ? Subtitle : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAE0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerContainer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 1,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6e3821ff",
  },

  headerRight: {
    width: 40,
  },

  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#EDEAE0",
    marginBottom: 5,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#C5A87B",
    textAlign: "center",
  },

  listContainer: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardImagePlaceholder: {
    backgroundColor: "#F0EBE3",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  tipoContainer: {
    backgroundColor: "#584128",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  tipo: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  favoriteButton: {
    padding: 4,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 8,
  },

  localContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  localizacao: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  precoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
    marginTop: 4,
  },

  cifrao: {
    fontSize: 14,
    color: "#C5A87B",
    fontWeight: "bold",
    marginRight: 2,
  },

  preco: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#584128",
  },

  botaoReservar: {
    backgroundColor: "#4A3721",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  botaoLogin: {
    marginTop: 16,
    backgroundColor: "#584128",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#584128",
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
