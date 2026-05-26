import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Experiencia {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  categoria: string;
  quantidade_estoque: number;
  status: string;
  tipo_produto: string;
  imagem_url: string[];
  id_cliente_produto: number;
  created_at?: string;
  updated_at?: string;
}

// Função para normalizar imagens
const normalizarImagens = (imagemUrl: any): string[] => {
  if (!imagemUrl) return [];

  if (Array.isArray(imagemUrl)) {
    return imagemUrl.filter(
      (url) => url && typeof url === "string" && url.trim() !== "",
    );
  }

  if (typeof imagemUrl === "string") {
    try {
      const parsed = JSON.parse(imagemUrl);
      if (Array.isArray(parsed)) {
        return parsed.filter((url) => url && url.trim() !== "");
      }
    } catch (e) {}

    if (imagemUrl.includes(",")) {
      return imagemUrl.split(",").map((url: string) => url.trim());
    }

    if (imagemUrl.trim()) {
      return [imagemUrl.trim()];
    }
  }

  return [];
};

export default function ExperienciasScreen() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<Experiencia | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [carregandoAPI, setCarregandoAPI] = useState(false);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
  const [acaoLogin, setAcaoLogin] = useState<"favorito" | "carrinho">(
    "favorito",
  );

  const itensPorPagina = 6;

  const carregarCarrinho = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const carrinhoSalvo = await AsyncStorage.getItem(`carrinho_${userId}`);
        if (carrinhoSalvo) setCarrinho(JSON.parse(carrinhoSalvo));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    }
  };

  const salvarCarrinho = async (novoCarrinho: any[]) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await AsyncStorage.setItem(
          `carrinho_${userId}`,
          JSON.stringify(novoCarrinho),
        );
        setCarrinho(novoCarrinho);
      }
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  };

  const buscarExperiencias = async () => {
    try {
      setCarregandoAPI(true);
      const response = await fetch("http://localhost:3000/produtos", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao buscar experiências");

      const data = await response.json();
      const experienciasFiltradas = data
        .filter((produto: any) => produto.tipo_produto === "experiencia")
        .map((produto: any) => ({
          ...produto,
          imagem_url: normalizarImagens(produto.imagem_url),
        }));

      setExperiencias(experienciasFiltradas);
    } catch (error) {
      console.error("Erro ao buscar experiências:", error);
      Alert.alert("Erro", "Não foi possível carregar as experiências");
    } finally {
      setCarregandoAPI(false);
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const favoritosSalvos = await AsyncStorage.getItem(
          `favoritos_experiencias_${userId}`,
        );
        if (favoritosSalvos) setFavoritos(JSON.parse(favoritosSalvos));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarExperiencias();
      carregarFavoritos();
      carregarCarrinho();
    }, []),
  );

  useEffect(() => {
    carregarFavoritos();
    carregarCarrinho();
  }, []);

  const verificarLogin = async (
    acao: "favorito" | "carrinho" = "favorito",
  ): Promise<boolean> => {
    const userToken = await AsyncStorage.getItem("@Immersia:token");
    if (!userToken) {
      setAcaoLogin(acao);
      setModalLoginVisible(true);
      return false;
    }
    return true;
  };

  const adicionarFavorito = async (id: number) => {
    const isLoggedIn = await verificarLogin("favorito");
    if (!isLoggedIn) return;

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const novosFavoritos = [...favoritos, id];
        setFavoritos(novosFavoritos);
        await AsyncStorage.setItem(
          `favoritos_experiencias_${userId}`,
          JSON.stringify(novosFavoritos),
        );
        Alert.alert("Favoritos", "Experiência adicionada aos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  };

  const removerFavorito = async (id: number) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const novosFavoritos = favoritos.filter((favId) => favId !== id);
        setFavoritos(novosFavoritos);
        await AsyncStorage.setItem(
          `favoritos_experiencias_${userId}`,
          JSON.stringify(novosFavoritos),
        );
        Alert.alert("Favoritos", "Experiência removida dos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const adicionarAoCarrinho = async () => {
    const isLoggedIn = await verificarLogin("carrinho");
    if (!isLoggedIn) return;
    if (!produtoSelecionado) return;

    if (quantidadeSelecionada > produtoSelecionado.quantidade_estoque) {
      Alert.alert("Erro", "Quantidade indisponível em estoque");
      return;
    }

    const itemExistente = carrinho.find(
      (item) => item.id === produtoSelecionado.id,
    );
    let novoCarrinho;

    if (itemExistente) {
      novoCarrinho = carrinho.map((item) =>
        item.id === produtoSelecionado.id
          ? { ...item, quantidade: item.quantidade + quantidadeSelecionada }
          : item,
      );
    } else {
      novoCarrinho = [
        ...carrinho,
        {
          id: produtoSelecionado.id,
          nome: produtoSelecionado.nome,
          preco: produtoSelecionado.preco,
          quantidade: quantidadeSelecionada,
          imagem: produtoSelecionado.imagem_url?.[0] || null,
          tipo: "experiencia",
        },
      ];
    }

    await salvarCarrinho(novoCarrinho);

    Alert.alert(
      "Carrinho",
      `${quantidadeSelecionada} vaga(s) de "${produtoSelecionado.nome}" adicionada(s)!`,
      [
        {
          text: "Continuar Comprando",
          onPress: () => setModalDetalhesVisible(false),
        },
        {
          text: "Ver Carrinho",
          onPress: () => {
            setModalDetalhesVisible(false);
            router.push("/carrinho");
          },
        },
      ],
    );
  };

  const abrirDetalhes = (item: Experiencia) => {
    setProdutoSelecionado(item);
    setQuantidadeSelecionada(1);
    setModalDetalhesVisible(true);
  };

  const filtrarExperiencias = () => {
    let filtradas = experiencias;
    if (searchQuery) {
      filtradas = filtradas.filter(
        (exp) =>
          exp.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.categoria?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.descricao?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtradas;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarExperiencias();
  }, []);

  const experienciasFiltradas = filtrarExperiencias();
  const totalPaginas = Math.ceil(experienciasFiltradas.length / itensPorPagina);
  const experienciasPaginadas = experienciasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(preco);
  };

  const formatarData = (data?: string) => {
    if (!data) return "Data não disponível";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const renderExperienciaCard = ({ item }: { item: Experiencia }) => {
    const isFavorito = favoritos.includes(item.id);
    const imagemPrincipal =
      item.imagem_url && item.imagem_url.length > 0
        ? { uri: item.imagem_url[0] }
        : require("../../../assets/images/imagem-fundo-immersia.png");

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => abrirDetalhes(item)}
        activeOpacity={0.9}
      >
        <Image source={imagemPrincipal} style={styles.cardImage} />
        {item.imagem_url && item.imagem_url.length > 1 && (
          <View style={styles.multiImageIndicator}>
            <Feather name="image" size={12} color="#FFF" />
            <Text style={styles.multiImageText}>{item.imagem_url.length}</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardPrice}>
              {formatarPreco(item.preco)} ({item.quantidade_estoque} dias)
            </Text>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.nome}
            </Text>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={12} color="#8B8272" />
              <Text style={styles.locationText}>
                {item.categoria || "Brasil"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() =>
              isFavorito ? removerFavorito(item.id) : adicionarFavorito(item.id)
            }
          >
            <Feather
              name="heart"
              size={20}
              color={isFavorito ? "#FF3B30" : "#000000"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ModalDetalhes = () => {
    if (!produtoSelecionado) return null;

    const images = produtoSelecionado.imagem_url || [];
    const hasMultipleImages = images.length > 1;
    const [localImageIndex, setLocalImageIndex] = useState(0);

    const currentImage =
      images.length > 0
        ? { uri: images[localImageIndex] }
        : require("../../../assets/images/imagem-fundo-immersia.png");

    return (
      <Modal
        visible={modalDetalhesVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalDetalhesVisible(false)}
      >
        <View style={styles.modalDetalhesOverlay}>
          <View style={styles.modalDetalhesContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalDetalhesVisible(false)}
            >
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.carouselContainer}>
                <Image
                  source={currentImage}
                  style={styles.detalhesImage}
                  resizeMode="cover"
                />

                {hasMultipleImages && (
                  <>
                    <TouchableOpacity
                      style={[styles.navButton, styles.navButtonLeft]}
                      onPress={() =>
                        setLocalImageIndex(Math.max(0, localImageIndex - 1))
                      }
                    >
                      <Feather name="chevron-left" size={30} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.navButton, styles.navButtonRight]}
                      onPress={() =>
                        setLocalImageIndex(
                          Math.min(images.length - 1, localImageIndex + 1),
                        )
                      }
                    >
                      <Feather name="chevron-right" size={30} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.imageCounter}>
                      <Text style={styles.imageCounterText}>
                        {localImageIndex + 1} / {images.length}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {hasMultipleImages && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.thumbnailScroll}
                >
                  {images.map((url, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setLocalImageIndex(index)}
                    >
                      <Image
                        source={{ uri: url }}
                        style={[
                          styles.thumbnailImage,
                          localImageIndex === index &&
                            styles.thumbnailImageActive,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View style={styles.detalhesContent}>
                <Text style={styles.detalhesTitulo}>
                  {produtoSelecionado.nome}
                </Text>
                <View style={styles.detalhesPrecoContainer}>
                  <Text style={styles.detalhesPreco}>
                    {formatarPreco(produtoSelecionado.preco)}
                  </Text>
                  <Text style={styles.detalhesEstoque}>
                    {produtoSelecionado.quantidade_estoque} vagas disponíveis
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Feather name="tag" size={18} color="#584128" />
                  <Text style={styles.infoText}>
                    Categoria: {produtoSelecionado.categoria || "Experiência"}
                  </Text>
                </View>

                {produtoSelecionado.descricao && (
                  <View style={styles.descricaoContainer}>
                    <Text style={styles.descricaoTitulo}>Descrição</Text>
                    <Text style={styles.descricaoTexto}>
                      {produtoSelecionado.descricao}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Feather name="calendar" size={18} color="#584128" />
                  <Text style={styles.infoText}>
                    Criado em: {formatarData(produtoSelecionado.created_at)}
                  </Text>
                </View>

                <View style={styles.quantidadeContainer}>
                  <Text style={styles.quantidadeLabel}>Vagas desejadas:</Text>
                  <View style={styles.quantidadeSelector}>
                    <TouchableOpacity
                      onPress={() =>
                        setQuantidadeSelecionada(
                          Math.max(1, quantidadeSelecionada - 1),
                        )
                      }
                      style={styles.quantidadeBtn}
                    >
                      <Feather name="minus" size={20} color="#584128" />
                    </TouchableOpacity>
                    <Text style={styles.quantidadeValor}>
                      {quantidadeSelecionada}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setQuantidadeSelecionada(
                          Math.min(
                            produtoSelecionado.quantidade_estoque,
                            quantidadeSelecionada + 1,
                          ),
                        )
                      }
                      style={styles.quantidadeBtn}
                    >
                      <Feather name="plus" size={20} color="#584128" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.totalContainerModal}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValor}>
                    {formatarPreco(
                      produtoSelecionado.preco * quantidadeSelecionada,
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnAdicionarCarrinho}
                  onPress={adicionarAoCarrinho}
                >
                  <Feather name="shopping-cart" size={20} color="#FFF" />
                  <Text style={styles.btnAdicionarText}>
                    Adicionar ao Carrinho
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPagination = () => {
    if (totalPaginas <= 1) return null;
    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

    return (
      <View style={styles.pagination}>
        {paginas.map((pag) => (
          <TouchableOpacity
            key={pag}
            style={[
              styles.pageButton,
              paginaAtual === pag && styles.pageButtonActive,
            ]}
            onPress={() => setPaginaAtual(pag)}
          >
            <Text
              style={[
                styles.pageText,
                paginaAtual === pag && styles.pageTextActive,
              ]}
            >
              {pag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (carregando || carregandoAPI) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/imagem-fundo-immersia.png")}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>EXPERIÊNCIAS</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar experiências..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={experienciasPaginadas}
        renderItem={renderExperienciaCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderPagination()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <ModalDetalhes />

      <Modal visible={modalLoginVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Acesso Necessário</Text>
            <Text style={styles.modalText}>
              Faça login para continuar com essa ação.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonLogin}
                onPress={() => {
                  setModalLoginVisible(false);
                  router.push("/login");
                }}
              >
                <Text style={styles.modalButtonText}>Fazer Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalLoginVisible(false)}
              >
                <Text style={{ color: "#666" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  heroContainer: { height: 120, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  listContent: { paddingHorizontal: 12, paddingBottom: 20 },
  gridRow: { justifyContent: "space-between", marginBottom: 16 },

  // Customização CSS baseada na Imagem enviada
  card: {
    flex: 0.48,
    backgroundColor: "#E4D5BE",
    borderRadius: 0,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#4A3B2C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderBottomWidth: 1.5,
    borderBottomColor: "#4A3B2C",
  },
  multiImageIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  multiImageText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  cardContent: { padding: 12, position: "relative" },
  cardText: { paddingRight: 28 },
  cardPrice: {
    fontSize: 13,
    color: "#4A3B2C",
    fontWeight: "500",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "bold",
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: { fontSize: 12, color: "#8B8272", marginLeft: 4 },
  favoriteBtn: {
    position: "absolute",
    right: 12,
    bottom: 14,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  modalDetalhesOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalDetalhesContainer: {
    backgroundColor: "#f1eae0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "85%",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#584128",
    borderRadius: 20,
    padding: 6,
    marginBottom: 10,
  },
  carouselContainer: { height: 200, position: "relative", marginBottom: 10 },
  detalhesImage: { width: "100%", height: "100%", borderRadius: 8 },
  navButton: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  navButtonLeft: { left: 10 },
  navButtonRight: { right: 10 },
  imageCounter: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  imageCounterText: { color: "#FFF", fontSize: 12 },
  thumbnailScroll: { flexDirection: "row", marginBottom: 15 },
  thumbnailImage: {
    width: 60,
    height: 45,
    marginRight: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  thumbnailImageActive: { opacity: 1, borderWidth: 2, borderColor: "#584128" },
  detalhesContent: { gap: 12 },
  detalhesTitulo: { fontSize: 20, fontWeight: "bold", color: "#333" },
  detalhesPrecoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detalhesPreco: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  detalhesEstoque: { fontSize: 12, color: "#666" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 14, color: "#444" },
  descricaoContainer: { marginTop: 10 },
  descricaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 4,
  },
  descricaoTexto: { fontSize: 14, color: "#555", lineHeight: 20 },
  quantidadeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingTop: 12,
  },
  quantidadeLabel: { fontSize: 14, color: "#333" },
  quantidadeSelector: { flexDirection: "row", alignItems: "center", gap: 12 },
  quantidadeBtn: {
    borderWidth: 1,
    borderColor: "#584128",
    borderRadius: 4,
    padding: 4,
  },
  quantidadeValor: { fontSize: 16, fontWeight: "bold" },
  totalContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalValor: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  btnAdicionarCarrinho: {
    backgroundColor: "#584128",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
  },
  btnAdicionarText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 30,
  },
  pageButtonActive: { backgroundColor: "#584128" },
  pageText: { color: "#584128" },
  pageTextActive: { color: "#FFF" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { textAlign: "center", color: "#666", marginBottom: 16 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalButtonLogin: {
    backgroundColor: "#584128",
    padding: 10,
    borderRadius: 6,
  },
  modalButtonCancel: { backgroundColor: "#EEE", padding: 10, borderRadius: 6 },
  modalButtonText: { color: "#FFF", fontWeight: "bold" },
});
