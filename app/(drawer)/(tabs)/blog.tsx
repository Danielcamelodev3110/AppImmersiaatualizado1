import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function BlogScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostBlog[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<PostBlog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ehAdmin, setEhAdmin] = useState(false);

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
    setModalVisible(true);
  };

  const HeaderFixo = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#584128" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Blog de Viagens</Text>
      {/* 🔧 Botão de nova postagem só aparece pra administrador */}
      {ehAdmin ? (
        <TouchableOpacity
          onPress={() => router.push("/blog-novo" as any)}
          style={styles.headerAddButton}
        >
          <Feather name="plus" size={22} color="#584128" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerRight} />
      )}
    </View>
  );

  const renderPost = ({ item }: { item: PostBlog }) => (
    <TouchableOpacity style={styles.card} onPress={() => abrirPost(item)}>
      {item.imagem_capa ? (
        <Image source={{ uri: item.imagem_capa }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Feather name="image" size={32} color="#CCC" />
        </View>
      )}

      <View style={styles.cardContent}>
        {!!item.destino && (
          <View style={styles.destinoBadge}>
            <Feather name="map-pin" size={11} color="#584128" />
            <Text style={styles.destinoBadgeText}>{item.destino}</Text>
          </View>
        )}
        <Text style={styles.cardTitulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        {!!item.subtitulo && (
          <Text style={styles.cardSubtitulo} numberOfLines={2}>
            {item.subtitulo}
          </Text>
        )}
        <View style={styles.cardRodape}>
          <Text style={styles.cardData}>
            {formatarData(item.data_publicacao)}
          </Text>
          {!!item.autor?.nome_completo && (
            <Text style={styles.cardAutor}>por {item.autor.nome_completo}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="book-open" size={72} color="#C5A87B" />
      <Text style={styles.emptyTitulo}>Nenhuma postagem ainda</Text>
      <Text style={styles.emptyTexto}>
        Em breve teremos histórias e dicas de viagem por aqui.
      </Text>
    </View>
  );

  const ModalPost = () => {
    if (!postSelecionado) return null;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalBackButton}
            >
              <Feather name="arrow-left" size={24} color="#584128" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {postSelecionado.imagem_capa && (
              <Image
                source={{ uri: postSelecionado.imagem_capa }}
                style={styles.modalImagemCapa}
              />
            )}

            <View style={styles.modalConteudoContainer}>
              {!!postSelecionado.destino && (
                <View style={styles.destinoBadge}>
                  <Feather name="map-pin" size={11} color="#584128" />
                  <Text style={styles.destinoBadgeText}>
                    {postSelecionado.destino}
                  </Text>
                </View>
              )}

              <Text style={styles.modalTitulo}>{postSelecionado.titulo}</Text>

              {!!postSelecionado.subtitulo && (
                <Text style={styles.modalSubtitulo}>
                  {postSelecionado.subtitulo}
                </Text>
              )}

              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaTexto}>
                  {formatarData(postSelecionado.data_publicacao)}
                  {postSelecionado.autor?.nome_completo
                    ? ` · por ${postSelecionado.autor.nome_completo}`
                    : ""}
                </Text>
              </View>

              <Text style={styles.modalConteudo}>
                {postSelecionado.conteudo}
              </Text>
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
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEAE0",
  },

  headerContainer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  headerAddButton: { padding: 8 },
  headerRight: { width: 40 },

  lista: { padding: 16, paddingBottom: 40, gap: 16 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: "100%", height: 160, resizeMode: "cover" },
  cardImagePlaceholder: {
    backgroundColor: "#F0EBE3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { padding: 14, gap: 4 },
  destinoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0EBE3",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  destinoBadgeText: { fontSize: 11, color: "#584128", fontWeight: "600" },
  cardTitulo: { fontSize: 17, fontWeight: "bold", color: "#2c1810" },
  cardSubtitulo: { fontSize: 13, color: "#666", marginTop: 2 },
  cardRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardData: { fontSize: 11, color: "#999" },
  cardAutor: { fontSize: 11, color: "#999" },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitulo: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  emptyTexto: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  modalContainer: { flex: 1, backgroundColor: "#FFF" },
  modalHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalBackButton: { width: 32 },
  modalImagemCapa: { width: "100%", height: 220, resizeMode: "cover" },
  modalConteudoContainer: { padding: 20, gap: 8 },
  modalTitulo: { fontSize: 24, fontWeight: "bold", color: "#2c1810" },
  modalSubtitulo: { fontSize: 15, color: "#666" },
  modalMeta: { marginVertical: 8 },
  modalMetaTexto: { fontSize: 12, color: "#999" },
  modalConteudo: { fontSize: 15, color: "#333", lineHeight: 24, marginTop: 8 },
});
