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
import { useCarrinho } from "../../../constants/CarrinhoContext"; // ajuste o caminho conforme sua estrutura
import { produtoService } from "../../../services/ProdutoService"; // ajuste o caminho se necessário

interface Hospedagem {
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

export default function HospedagensScreen() {
  const router = useRouter();
  const { itens: carrinho, adicionarAoCarrinho: adicionarNoContexto } =
    useCarrinho();
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<Hospedagem | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [carregandoAPI, setCarregandoAPI] = useState(false);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
  const [acaoLogin, setAcaoLogin] = useState<"favorito" | "carrinho">(
    "favorito",
  );

  // Novos estados para datas
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [modalCalendarioVisible, setModalCalendarioVisible] = useState(false);
  const [tipoDataSelecionada, setTipoDataSelecionada] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [diasEstadia, setDiasEstadia] = useState(0);

  const itensPorPagina = 6;

  const obterIdentificadorUsuario = async (): Promise<string | null> => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) return userId;

    const token = await AsyncStorage.getItem("@Immersia:token");
    if (token) {
      await AsyncStorage.setItem("userId", token);
      return token;
    }

    return null;
  };

  const buscarHospedagens = async () => {
    try {
      setCarregandoAPI(true);

      const data = await produtoService.findAll();

      const hospedagensFiltradas = data
        .filter((produto: any) => produto.tipo_produto === "hospedagem")
        .map((produto: any) => ({
          ...produto,
          imagem_url: normalizarImagens(produto.imagem_url),
        }));

      setHospedagens(hospedagensFiltradas);
    } catch (error) {
      console.error("Erro ao buscar hospedagens:", error);
      Alert.alert("Erro", "Não foi possível carregar as hospedagens");
    } finally {
      setCarregandoAPI(false);
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const userId = await obterIdentificadorUsuario();
      if (userId) {
        const favoritosSalvos = await AsyncStorage.getItem(
          `favoritos_hospedagens_${userId}`,
        );
        if (favoritosSalvos) setFavoritos(JSON.parse(favoritosSalvos));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarHospedagens();
      carregarFavoritos();
    }, []),
  );

  useEffect(() => {
    carregarFavoritos();
  }, []);

  // Função para calcular diferença de dias
  const calcularDias = useCallback(() => {
    if (checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDiasEstadia(diffDays > 0 ? diffDays : 0);
      return diffDays;
    }
    setDiasEstadia(0);
    return 0;
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    calcularDias();
  }, [calcularDias]);

  // Função para formatar data
  const formatarDataBR = (date: Date | null): string => {
    if (!date) return "Selecionar data";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função para gerar dias do mês
  const gerarCalendario = () => {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();
    const dias = [];

    // Gerar próximos 60 dias para seleção
    for (let i = 0; i < 60; i++) {
      const data = new Date(anoAtual, mesAtual, hoje.getDate() + i);
      dias.push(data);
    }

    return dias;
  };

  const abrirCalendario = (tipo: "checkin" | "checkout") => {
    setTipoDataSelecionada(tipo);
    setModalCalendarioVisible(true);
  };

  const selecionarData = (data: Date) => {
    if (tipoDataSelecionada === "checkin") {
      setCheckInDate(data);
      // Se a data de checkout for anterior à nova data de check-in, limpar
      if (checkOutDate && data >= checkOutDate) {
        setCheckOutDate(null);
      }
    } else if (tipoDataSelecionada === "checkout") {
      setCheckOutDate(data);
    }
    setModalCalendarioVisible(false);
  };

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
      const userId = await obterIdentificadorUsuario();
      if (userId) {
        const novosFavoritos = [...favoritos, id];
        setFavoritos(novosFavoritos);
        await AsyncStorage.setItem(
          `favoritos_hospedagens_${userId}`,
          JSON.stringify(novosFavoritos),
        );
        Alert.alert("Favoritos", "Hospedagem adicionada aos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  };

  const removerFavorito = async (id: number) => {
    try {
      const userId = await obterIdentificadorUsuario();
      if (userId) {
        const novosFavoritos = favoritos.filter((favId) => favId !== id);
        setFavoritos(novosFavoritos);
        await AsyncStorage.setItem(
          `favoritos_hospedagens_${userId}`,
          JSON.stringify(novosFavoritos),
        );
        Alert.alert("Favoritos", "Hospedagem removida dos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const adicionarAoCarrinho = async () => {
    const isLoggedIn = await verificarLogin("carrinho");
    if (!isLoggedIn) return;
    if (!produtoSelecionado) return;

    // Verificar se as datas foram selecionadas
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Erro", "Selecione as datas de check-in e check-out");
      return;
    }

    const dias = calcularDias();
    if (dias <= 0) {
      Alert.alert("Erro", "A data de check-out deve ser após o check-in");
      return;
    }

    if (dias > produtoSelecionado.quantidade_estoque) {
      Alert.alert("Erro", "Quantidade de diárias indisponível");
      return;
    }

    adicionarNoContexto(
      {
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        preco: produtoSelecionado.preco,
        imagem_url: produtoSelecionado.imagem_url?.[0],
        tipo_produto: "hospedagem",
      },
      dias,
    );

    Alert.alert(
      "Carrinho",
      `${dias} diária(s) de "${produtoSelecionado.nome}" adicionada(s)!\nCheck-in: ${formatarDataBR(checkInDate)}\nCheck-out: ${formatarDataBR(checkOutDate)}`,
      [
        {
          text: "Continuar Comprando",
          onPress: () => setModalDetalhesVisible(false),
        },
        {
          text: "Ver Carrinho",
          onPress: () => {
            setModalDetalhesVisible(false);
            router.push("../carrinho");
          },
        },
      ],
    );
  };

  const adicionarAoCarrinhoRapido = async (item: Hospedagem) => {
    const isLoggedIn = await verificarLogin("carrinho");
    if (!isLoggedIn) return;

    // Abrir modal de detalhes para seleção de datas
    abrirDetalhes(item);
    Alert.alert(
      "Atenção",
      "Selecione as datas de check-in e check-out para continuar.",
    );
  };

  const abrirDetalhes = (item: Hospedagem) => {
    setProdutoSelecionado(item);
    setQuantidadeSelecionada(1);
    setCheckInDate(null);
    setCheckOutDate(null);
    setModalDetalhesVisible(true);
  };

  const filtrarHospedagens = () => {
    let filtradas = hospedagens;
    if (searchQuery) {
      filtradas = filtradas.filter(
        (hosp) =>
          hosp.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hosp.categoria?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hosp.descricao?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtradas;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarHospedagens();
  }, []);

  const hospedagensFiltradas = filtrarHospedagens();
  const totalPaginas = Math.ceil(hospedagensFiltradas.length / itensPorPagina);
  const hospedagensPaginadas = hospedagensFiltradas.slice(
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

  const renderHospedagemCard = ({ item }: { item: Hospedagem }) => {
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
              {formatarPreco(item.preco)} / diária
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
            style={styles.cartBtn}
            onPress={(e) => {
              e.stopPropagation();
              adicionarAoCarrinhoRapido(item);
            }}
          >
            <Feather name="shopping-cart" size={18} color="#584128" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={(e) => {
              e.stopPropagation();
              isFavorito
                ? removerFavorito(item.id)
                : adicionarFavorito(item.id);
            }}
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

  const ModalCalendario = () => {
    const dias = gerarCalendario();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return (
      <Modal
        visible={modalCalendarioVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalCalendarioVisible(false)}
      >
        <View style={styles.modalDetalhesOverlay}>
          <View style={styles.calendarioContainer}>
            <View style={styles.calendarioHeader}>
              <Text style={styles.calendarioTitulo}>
                {tipoDataSelecionada === "checkin"
                  ? "Selecione o Check-in"
                  : "Selecione o Check-out"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalCalendarioVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.calendarioGrid}>
                {dias.map((data, index) => {
                  const isSelected =
                    (tipoDataSelecionada === "checkin" &&
                      checkInDate &&
                      data.toDateString() === checkInDate.toDateString()) ||
                    (tipoDataSelecionada === "checkout" &&
                      checkOutDate &&
                      data.toDateString() === checkOutDate.toDateString());

                  const isCheckInDate =
                    checkInDate &&
                    data.toDateString() === checkInDate.toDateString();

                  const isDisabled =
                    tipoDataSelecionada === "checkout" &&
                    checkInDate &&
                    data < checkInDate;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.diaButton,
                        isSelected && styles.diaButtonSelected,
                        isCheckInDate && styles.diaButtonCheckIn,
                        isDisabled && styles.diaButtonDisabled,
                      ]}
                      onPress={() => !isDisabled && selecionarData(data)}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.diaSemana,
                          isSelected && styles.diaTextoSelected,
                        ]}
                      >
                        {data.toLocaleDateString("pt-BR", {
                          weekday: "short",
                        })}
                      </Text>
                      <Text
                        style={[
                          styles.diaNumero,
                          isSelected && styles.diaTextoSelected,
                        ]}
                      >
                        {data.getDate()}
                      </Text>
                      <Text
                        style={[
                          styles.diaMes,
                          isSelected && styles.diaTextoSelected,
                        ]}
                      >
                        {data.toLocaleDateString("pt-BR", { month: "short" })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
                    {formatarPreco(produtoSelecionado.preco)} / diária
                  </Text>
                  <Text style={styles.detalhesEstoque}>
                    Disponibilidade: {produtoSelecionado.quantidade_estoque}{" "}
                    dias
                  </Text>
                </View>

                {/* Seção de seleção de datas */}
                <View style={styles.datasContainer}>
                  <Text style={styles.datasTitulo}>
                    Selecione as datas da sua estadia
                  </Text>

                  <View style={styles.datasRow}>
                    <View style={styles.dataCampo}>
                      <Text style={styles.dataLabel}>Check-in</Text>
                      <TouchableOpacity
                        style={styles.dataButton}
                        onPress={() => abrirCalendario("checkin")}
                      >
                        <Feather name="calendar" size={16} color="#584128" />
                        <Text style={styles.dataButtonText}>
                          {formatarDataBR(checkInDate)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.dataCampo}>
                      <Text style={styles.dataLabel}>Check-out</Text>
                      <TouchableOpacity
                        style={styles.dataButton}
                        onPress={() => abrirCalendario("checkout")}
                      >
                        <Feather name="calendar" size={16} color="#584128" />
                        <Text style={styles.dataButtonText}>
                          {formatarDataBR(checkOutDate)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {diasEstadia > 0 && (
                    <View style={styles.diasEstadiaContainer}>
                      <Feather name="moon" size={16} color="#584128" />
                      <Text style={styles.diasEstadiaText}>
                        {diasEstadia} {diasEstadia === 1 ? "diária" : "diárias"}{" "}
                        de estadia
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.infoRow}>
                  <Feather name="tag" size={18} color="#584128" />
                  <Text style={styles.infoText}>
                    Acomodação: {produtoSelecionado.categoria || "Hospedagem"}
                  </Text>
                </View>

                {produtoSelecionado.descricao && (
                  <View style={styles.descricaoContainer}>
                    <Text style={styles.descricaoTitulo}>Sobre o espaço</Text>
                    <Text style={styles.descricaoTexto}>
                      {produtoSelecionado.descricao}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Feather name="calendar" size={18} color="#584128" />
                  <Text style={styles.infoText}>
                    Anunciado em: {formatarData(produtoSelecionado.created_at)}
                  </Text>
                </View>

                <View style={styles.totalContainerModal}>
                  <Text style={styles.totalLabel}>Total da estadia:</Text>
                  <Text style={styles.totalValor}>
                    {formatarPreco(
                      produtoSelecionado.preco * (diasEstadia || 0),
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.btnAdicionarCarrinho,
                    (!checkInDate || !checkOutDate) && styles.btnDesabilitado,
                  ]}
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
          <Text style={styles.heroTitle}>HOSPEDAGENS</Text>
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
          placeholder="Buscar hospedagens..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={hospedagensPaginadas}
        renderItem={renderHospedagemCard}
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
      <ModalCalendario />

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
  cardText: { paddingRight: 56 },
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
  cartBtn: {
    position: "absolute",
    right: 40,
    bottom: 14,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
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

  // Novos estilos para datas
  datasContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  datasTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 12,
  },
  datasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dataCampo: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dataButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#584128",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#F9F6F0",
  },
  dataButtonText: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  diasEstadiaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  diasEstadiaText: {
    fontSize: 14,
    color: "#584128",
    fontWeight: "bold",
  },

  // Estilos do calendário
  calendarioContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
  },
  calendarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  calendarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  diaButton: {
    width: "30%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: "#F9F6F0",
    marginBottom: 10,
  },
  diaButtonSelected: {
    backgroundColor: "#584128",
    borderColor: "#584128",
  },
  diaButtonCheckIn: {
    backgroundColor: "#8B6914",
    borderColor: "#8B6914",
  },
  diaButtonDisabled: {
    opacity: 0.4,
  },
  diaSemana: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  diaNumero: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  diaMes: {
    fontSize: 11,
    color: "#666",
  },
  diaTextoSelected: {
    color: "#FFF",
  },

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
  btnDesabilitado: {
    opacity: 0.5,
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
