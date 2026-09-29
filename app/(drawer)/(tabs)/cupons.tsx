import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Cupom, cuponsService } from "../../../services/cuponsService";
import { userService } from "../../../services/userService";

// 🔧 Alert.alert não mostra nada visível no Expo Web — só loga no
// console. Na web usa window.alert; fora da web mantém o Alert nativo.
const mostrarAviso = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const formatarData = (data?: string | null): string => {
  if (!data) return "Sem validade";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

const formatarMoeda = (valor: number): string =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

export default function CuponsScreen() {
  const router = useRouter();

  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [resgatadosIds, setResgatadosIds] = useState<number[]>([]);
  const [idClienteLogado, setIdClienteLogado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resgatandoId, setResgatandoId] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchText, setSearchText] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;
      const idCliente = usuarioLogado?.id || null;
      setIdClienteLogado(idCliente);

      const [cuponsDados, resgatadosDados] = await Promise.all([
        cuponsService.findAll(),
        idCliente
          ? cuponsService.findResgatadosPorCliente(idCliente)
          : Promise.resolve([]),
      ]);

      setCupons(cuponsDados);
      setResgatadosIds(resgatadosDados);
    } catch (error: any) {
      mostrarAviso(
        "Erro",
        error.message || "Não foi possível carregar os cupons.",
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

  // Categorias derivadas dos cupons que realmente existem no banco
  const categories = [
    "Todos",
    ...Array.from(new Set(cupons.map((c) => c.categoria))),
  ];

  const filteredCupons = cupons.filter((cupom) => {
    const matchCategory =
      selectedCategory === "Todos" || cupom.categoria === selectedCategory;
    const termo = searchText.toLowerCase();
    const matchSearch =
      cupom.codigo.toLowerCase().includes(termo) ||
      (cupom.descricao || "").toLowerCase().includes(termo);
    return matchCategory && matchSearch;
  });

  const copyCode = async (cupom: Cupom) => {
    try {
      await Share.share({
        message: `Cupom ${cupom.codigo}\nDesconto: ${cupom.percentual_desconto}%\nAproveite no Immersia!`,
        title: "Cupom Immersia",
      });
    } catch (error) {
      mostrarAviso("Erro", "Não foi possível compartilhar o cupom");
    }
  };

  const handleResgatar = async (cupom: Cupom) => {
    if (!idClienteLogado) {
      mostrarAviso(
        "Atenção",
        "Você precisa estar logado para resgatar um cupom.",
      );
      router.push("/login");
      return;
    }

    setResgatandoId(cupom.id);
    try {
      await cuponsService.resgatar(cupom.id, idClienteLogado);
      setResgatadosIds((prev) => [...prev, cupom.id]);
      mostrarAviso(
        "Cupom resgatado!",
        "Aplique o código na hora do pagamento.",
      );
    } catch (error: any) {
      mostrarAviso("Erro ao resgatar", error.message || "Tente novamente.");
    } finally {
      setResgatandoId(null);
    }
  };

  const availableCount = cupons.filter(
    (c) => !resgatadosIds.includes(c.id),
  ).length;

  const HeaderFixo = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#584128" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Cupons</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const Subtitle = () => (
    <View style={styles.subtitleContainer}>
      <Text style={styles.headerSubtitle}>
        {availableCount}{" "}
        {availableCount === 1 ? "cupom disponível" : "cupons disponíveis"}
      </Text>
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#C5A87B" />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cupom..."
        placeholderTextColor="#C5A87B"
        value={searchText}
        onChangeText={setSearchText}
      />
      {searchText !== "" && (
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  const CategoriesList = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryButton,
            selectedCategory === cat && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(cat)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItem = ({ item }: { item: Cupom }) => {
    const usado = resgatadosIds.includes(item.id);
    const resgatandoEsse = resgatandoId === item.id;

    return (
      <View style={[styles.cupomCard, usado && styles.cupomCardUsed]}>
        <View style={styles.cupomLeft}>
          <View style={styles.cupomIcon}>
            <Text style={styles.cupomIconText}>🎫</Text>
          </View>
        </View>

        <View style={styles.cupomCenter}>
          <Text style={styles.cupomDiscount}>
            {item.percentual_desconto}% OFF
          </Text>
          <Text style={styles.cupomDescription}>{item.descricao}</Text>
          <View style={styles.cupomDetails}>
            <Text style={styles.cupomDetail}>{item.categoria}</Text>
            <Text style={styles.cupomDetail}>
              Mínimo: {formatarMoeda(item.valor_minimo_compra)}
            </Text>
            <Text style={styles.cupomDetail}>
              Válido até: {formatarData(item.data_validade)}
            </Text>
          </View>
        </View>

        <View style={styles.cupomRight}>
          <TouchableOpacity
            style={[styles.codeButton, usado && styles.codeButtonUsed]}
            onPress={() => copyCode(item)}
            disabled={usado}
          >
            <Text style={styles.codeText}>{item.codigo}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.useButton, usado && styles.useButtonUsed]}
            onPress={() => !usado && handleResgatar(item)}
            disabled={usado || resgatandoEsse}
          >
            {resgatandoEsse ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.useButtonText}>
                {usado ? "✅ Usado" : "Resgatar"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="pricetag-outline" size={80} color="#C5A87B" />
      <Text style={styles.emptyTitle}>Nenhum cupom encontrado</Text>
      <Text style={styles.emptyText}>Tente outra busca ou categoria</Text>
    </View>
  );

  const ListHeader = () => (
    <>
      <Subtitle />
      <SearchBar />
      <CategoriesList />
    </>
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
        data={filteredCupons}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Como usar:</Text>
        <Text style={styles.tipsText}>
          1. Toque no código do cupom para compartilhar{"\n"}
          2. Clique em "Resgatar" para ativar o cupom{"\n"}
          3. Use o código no momento da sua compra{"\n"}
          4. Cada cupom pode ser resgatado apenas uma vez por cliente
        </Text>
      </View>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#584128",
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#584128",
  },

  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#C5A87B",
  },
  categoryButtonActive: {
    backgroundColor: "#584128",
    borderColor: "#584128",
  },
  categoryText: {
    fontSize: 14,
    color: "#584128",
  },
  categoryTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },

  cupomCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cupomCardUsed: {
    opacity: 0.6,
    backgroundColor: "#F5F5F5",
  },
  cupomLeft: {
    marginRight: 12,
  },
  cupomIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#584128",
    justifyContent: "center",
    alignItems: "center",
  },
  cupomIconText: {
    fontSize: 24,
  },
  cupomCenter: {
    flex: 1,
  },
  cupomDiscount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#584128",
  },
  cupomDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cupomDetails: {
    marginTop: 8,
  },
  cupomDetail: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  cupomRight: {
    alignItems: "flex-end",
  },
  codeButton: {
    backgroundColor: "#584128",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeButtonUsed: {
    backgroundColor: "#CCC",
  },
  codeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  useButton: {
    backgroundColor: "#C5A87B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  useButtonUsed: {
    backgroundColor: "#27AE60",
  },
  useButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
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
    color: "#C5A87B",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  tipsCard: {
    margin: 16,
    marginTop: 5,
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#584128",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 22,
  },
});
