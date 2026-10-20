import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PostBlog, blogService } from "../../../services/Blogservice";
import { userService } from "../../../services/userService";

const { width: LARGURA_TELA } = Dimensions.get("window");

const mostrarAviso = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Estimativa simples de tempo de leitura (~200 palavras por minuto)
const tempoLeitura = (texto: string): string => {
  const palavras = texto.trim().split(/\s+/).length;
  const minutos = Math.max(1, Math.round(palavras / 200));
  return `${minutos} min de leitura`;
};

// Garante sempre um array de imagens, mesmo pra posts antigos que só
// tinham imagem_capa preenchida.
const obterImagens = (post: PostBlog): string[] => {
  if (Array.isArray(post.imagens) && post.imagens.length > 0) {
    return post.imagens;
  }
  return post.imagem_capa ? [post.imagem_capa] : [];
};

export default function BlogScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostBlog[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<PostBlog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [indiceImagem, setIndiceImagem] = useState(0);

  const carregarDados = useCallback(async () => {
    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;
      setEhAdmin(usuarioLogado?.tipo_usuario === "administrador");

      const dados = await blogService.findAll();
      setPosts(dados);
    } catch (error: any) {
      mostrarAviso(
        "Erro",
        error.message || "Não foi possível carregar o blog.",
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

  const abrirPost = (post: PostBlog) => {
    setPostSelecionado(post);
    setIndiceImagem(0);
    setModalVisible(true);
  };

  const HeaderFixo = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
        <Feather name="arrow-left" size={22} color="#584128" />
      </TouchableOpacity>
      <View style={styles.headerCentro}>
        <Text style={styles.headerTitle}>Blog</Text>
        <Text style={styles.headerSubtitle}>Histórias e dicas de viagem</Text>
      </View>
      {/* Botão de nova postagem só aparece pra administrador */}
      {ehAdmin ? (
        <TouchableOpacity
          onPress={() => router.push("/blog.novo" as any)}
          style={[styles.headerBtn, styles.headerBtnAdd]}
        >
          <Feather name="plus" size={22} color="#FFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerBtn} />
      )}
    </View>
  );

  const renderPost = ({ item, index }: { item: PostBlog; index: number }) => {
    const imagens = obterImagens(item);
    const capa = imagens[0];
    // O primeiro post da lista ganha destaque (maior)
    const destaque = index === 0;

    return (
      <TouchableOpacity
        style={[styles.card, destaque && styles.cardDestaque]}
        onPress={() => abrirPost(item)}
        activeOpacity={0.92}
      >
        <View>
          {capa ? (
            <Image
              source={{ uri: capa }}
              style={[styles.cardImage, destaque && styles.cardImageDestaque]}
            />
          ) : (
            <View
              style={[
                styles.cardImage,
                styles.cardImagePlaceholder,
                destaque && styles.cardImageDestaque,
              ]}
            >
              <Feather name="image" size={36} color="#D9CDB8" />
            </View>
          )}

          {/* Escurecimento leve embaixo da imagem pra dar leitura aos badges */}
          <View style={styles.cardImageOverlay} />

          <View style={styles.badgeCategoria}>
            <Text style={styles.badgeCategoriaTexto}>{item.categoria}</Text>
          </View>

          {imagens.length > 1 && (
            <View style={styles.badgeFotos}>
              <Feather name="image" size={12} color="#FFF" />
              <Text style={styles.badgeFotosTexto}>{imagens.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          {!!item.destino && (
            <View style={styles.destinoRow}>
              <Feather name="map-pin" size={13} color="#C5A87B" />
              <Text style={styles.destinoTexto}>{item.destino}</Text>
            </View>
          )}

          <Text
            style={[styles.cardTitulo, destaque && styles.cardTituloDestaque]}
            numberOfLines={2}
          >
            {item.titulo}
          </Text>

          {!!item.subtitulo && (
            <Text style={styles.cardSubtitulo} numberOfLines={2}>
              {item.subtitulo}
            </Text>
          )}

          <View style={styles.cardDivisor} />

          <View style={styles.cardRodape}>
            <View style={styles.cardRodapeInfo}>
              <Text style={styles.cardData}>
                {formatarData(item.data_publicacao)}
              </Text>
              <Text style={styles.cardLeitura}>
                {tempoLeitura(item.conteudo)}
              </Text>
            </View>
            <View style={styles.cardLerMais}>
              <Text style={styles.cardLerMaisTexto}>Ler</Text>
              <Feather name="arrow-right" size={14} color="#584128" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBox}>
        <Feather name="book-open" size={44} color="#C5A87B" />
      </View>
      <Text style={styles.emptyTitulo}>Nenhuma postagem ainda</Text>
      <Text style={styles.emptyTexto}>
        Em breve teremos histórias e dicas de viagem por aqui.
      </Text>
    </View>
  );

  const ModalPost = () => {
    if (!postSelecionado) return null;

    const imagens = obterImagens(postSelecionado);
    const temVarias = imagens.length > 1;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Carrossel de imagens */}
            <View style={styles.carrosselContainer}>
              {imagens.length > 0 ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    const indice = Math.round(
                      e.nativeEvent.contentOffset.x / LARGURA_TELA,
                    );
                    setIndiceImagem(indice);
                  }}
                >
                  {imagens.map((url, i) => (
                    <Image
                      key={i}
                      source={{ uri: url }}
                      style={styles.carrosselImagem}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={[styles.carrosselImagem, styles.carrosselVazio]}>
                  <Feather name="image" size={48} color="#D9CDB8" />
                </View>
              )}

              {/* Botão de voltar sobre a imagem */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalVoltarBtn}
              >
                <Feather name="arrow-left" size={22} color="#584128" />
              </TouchableOpacity>

              {temVarias && (
                <>
                  <View style={styles.carrosselContador}>
                    <Feather name="image" size={12} color="#FFF" />
                    <Text style={styles.carrosselContadorTexto}>
                      {indiceImagem + 1} / {imagens.length}
                    </Text>
                  </View>

                  {/* Bolinhas indicadoras */}
                  <View style={styles.carrosselDots}>
                    {imagens.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          i === indiceImagem && styles.dotAtivo,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>

            <View style={styles.modalConteudoContainer}>
              <View style={styles.modalBadgesRow}>
                <View style={styles.modalBadgeCategoria}>
                  <Text style={styles.modalBadgeCategoriaTexto}>
                    {postSelecionado.categoria}
                  </Text>
                </View>
                {!!postSelecionado.destino && (
                  <View style={styles.destinoRow}>
                    <Feather name="map-pin" size={13} color="#C5A87B" />
                    <Text style={styles.destinoTexto}>
                      {postSelecionado.destino}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.modalTitulo}>{postSelecionado.titulo}</Text>

              {!!postSelecionado.subtitulo && (
                <Text style={styles.modalSubtitulo}>
                  {postSelecionado.subtitulo}
                </Text>
              )}

              <View style={styles.modalAutorRow}>
                <View style={styles.modalAutorAvatar}>
                  <Text style={styles.modalAutorAvatarTexto}>
                    {(postSelecionado.autor?.nome_completo || "I")
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.modalAutorNome}>
                    {postSelecionado.autor?.nome_completo || "Equipe Immersia"}
                  </Text>
                  <Text style={styles.modalMetaTexto}>
                    {formatarData(postSelecionado.data_publicacao)} ·{" "}
                    {tempoLeitura(postSelecionado.conteudo)}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDivisor} />

              <Text style={styles.modalConteudo}>
                {postSelecionado.conteudo}
              </Text>

              {/* Galeria de miniaturas no fim do post, quando há várias fotos */}
              {temVarias && (
                <View style={styles.galeriaContainer}>
                  <Text style={styles.galeriaTitulo}>Galeria</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10 }}
                  >
                    {imagens.map((url, i) => (
                      <Image
                        key={i}
                        source={{ uri: url }}
                        style={styles.galeriaMiniatura}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
      <HeaderFixo />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <ModalPost />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4EFE6" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4EFE6",
  },

  // ===== HEADER =====
  headerContainer: {
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4EFE6",
  },
  headerBtnAdd: { backgroundColor: "#584128" },
  headerCentro: { alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#2c1810" },
  headerSubtitle: { fontSize: 12, color: "#A89677", marginTop: 1 },

  lista: { padding: 16, paddingTop: 20, paddingBottom: 40, gap: 20 },

  // ===== CARD =====
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#584128",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  cardDestaque: { borderRadius: 24 },
  cardImage: { width: "100%", height: 170, resizeMode: "cover" },
  cardImageDestaque: { height: 240 },
  cardImagePlaceholder: {
    backgroundColor: "#F0EBE3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  badgeCategoria: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeCategoriaTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: "#584128",
    letterSpacing: 0.3,
  },
  badgeFotos: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeFotosTexto: { fontSize: 11, color: "#FFF", fontWeight: "700" },

  cardContent: { padding: 18 },
  destinoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  destinoTexto: {
    fontSize: 12,
    color: "#C5A87B",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: "#2c1810",
    marginTop: 8,
    lineHeight: 25,
  },
  cardTituloDestaque: { fontSize: 22, lineHeight: 29 },
  cardSubtitulo: {
    fontSize: 14,
    color: "#7A6F5F",
    marginTop: 6,
    lineHeight: 20,
  },
  cardDivisor: { height: 1, backgroundColor: "#F0EBE3", marginVertical: 14 },
  cardRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRodapeInfo: { gap: 2 },
  cardData: { fontSize: 12, color: "#8B8272", fontWeight: "600" },
  cardLeitura: { fontSize: 11, color: "#B5AA97" },
  cardLerMais: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F4EFE6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cardLerMaisTexto: { fontSize: 13, fontWeight: "700", color: "#584128" },

  // ===== VAZIO =====
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 10,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitulo: { fontSize: 18, fontWeight: "800", color: "#584128" },
  emptyTexto: {
    fontSize: 13,
    color: "#A89677",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 19,
  },

  // ===== MODAL DO POST =====
  modalContainer: { flex: 1, backgroundColor: "#FFF" },
  carrosselContainer: { position: "relative" },
  carrosselImagem: { width: LARGURA_TELA, height: 320, resizeMode: "cover" },
  carrosselVazio: {
    backgroundColor: "#F0EBE3",
    alignItems: "center",
    justifyContent: "center",
  },
  modalVoltarBtn: {
    position: "absolute",
    top: 44,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  carrosselContador: {
    position: "absolute",
    top: 50,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
  },
  carrosselContadorTexto: { fontSize: 12, color: "#FFF", fontWeight: "700" },
  carrosselDots: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotAtivo: { width: 20, backgroundColor: "#FFF" },

  modalConteudoContainer: {
    marginTop: -24,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 60,
  },
  modalBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  modalBadgeCategoria: {
    backgroundColor: "#584128",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalBadgeCategoriaTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.3,
  },
  modalTitulo: {
    fontSize: 27,
    fontWeight: "800",
    color: "#2c1810",
    marginTop: 14,
    lineHeight: 34,
  },
  modalSubtitulo: {
    fontSize: 16,
    color: "#7A6F5F",
    marginTop: 8,
    lineHeight: 23,
  },
  modalAutorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  modalAutorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#584128",
    alignItems: "center",
    justifyContent: "center",
  },
  modalAutorAvatarTexto: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  modalAutorNome: { fontSize: 14, fontWeight: "700", color: "#2c1810" },
  modalMetaTexto: { fontSize: 12, color: "#A89677", marginTop: 2 },
  modalDivisor: { height: 1, backgroundColor: "#F0EBE3", marginVertical: 22 },
  modalConteudo: { fontSize: 16, color: "#3a3228", lineHeight: 27 },

  galeriaContainer: { marginTop: 32 },
  galeriaTitulo: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2c1810",
    marginBottom: 12,
  },
  galeriaMiniatura: {
    width: 130,
    height: 100,
    borderRadius: 14,
    resizeMode: "cover",
  },
});
