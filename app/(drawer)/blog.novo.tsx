import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { blogService } from "../../services/Blogservice";
import { userService } from "../../services/userService";

const mostrarAviso = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const CATEGORIAS = [
  "Destino",
  "Dica de Viagem",
  "Gastronomia",
  "Cultura",
  "Aventura",
];

export default function BlogNovoScreen() {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [idAutor, setIdAutor] = useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [destino, setDestino] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [imagemCapa, setImagemCapa] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sessao = await userService.getSavedSession();
        const usuarioLogado = sessao?.user ? sessao.user : sessao;

        if (!usuarioLogado?.id) {
          mostrarAviso("Atenção", "Você precisa estar logado.");
          router.replace("/login");
          return;
        }

        if (usuarioLogado.tipo_usuario !== "administrador") {
          setAutorizado(false);
        } else {
          setAutorizado(true);
          setIdAutor(usuarioLogado.id);
        }
      } finally {
        setVerificando(false);
      }
    })();
  }, []);

  const handlePublicar = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      mostrarAviso("Atenção", "Preencha pelo menos o título e o conteúdo.");
      return;
    }
    if (!idAutor) return;

    setPublicando(true);
    try {
      await blogService.create({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim() || undefined,
        destino: destino.trim() || undefined,
        categoria,
        imagem_capa: imagemCapa.trim() || undefined,
        conteudo: conteudo.trim(),
        id_autor: idAutor,
      });

      mostrarAviso("Publicado!", "A postagem foi publicada no blog.");
      router.replace("/blog" as any);
    } catch (error: any) {
      mostrarAviso("Erro ao publicar", error.message || "Tente novamente.");
    } finally {
      setPublicando(false);
    }
  };

  if (verificando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  if (!autorizado) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#584128" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Postagem</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.bloqueadoContainer}>
          <Feather name="lock" size={56} color="#C5A87B" />
          <Text style={styles.bloqueadoTitulo}>Acesso restrito</Text>
          <Text style={styles.bloqueadoTexto}>
            Só administradores podem criar postagens no blog.
          </Text>
        </View>
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
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Postagem</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 7 dias na Chapada dos Veadeiros"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Subtítulo</Text>
        <TextInput
          style={styles.input}
          placeholder="Uma linha de resumo pra chamar atenção"
          placeholderTextColor="#999"
          value={subtitulo}
          onChangeText={setSubtitulo}
        />

        <Text style={styles.label}>Destino / Viagem</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Chapada dos Veadeiros, GO"
          placeholderTextColor="#999"
          value={destino}
          onChangeText={setDestino}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriasRow}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoriaBtn,
                categoria === cat && styles.categoriaBtnAtiva,
              ]}
              onPress={() => setCategoria(cat)}
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === cat && styles.categoriaTextoAtivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>URL da imagem de capa</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#999"
          value={imagemCapa}
          onChangeText={setImagemCapa}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Conteúdo *</Text>
        <TextInput
          style={[styles.input, styles.inputConteudo]}
          placeholder="Conte a história da viagem ou do destino..."
          placeholderTextColor="#999"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.btnPublicar, publicando && styles.btnDesabilitado]}
          onPress={handlePublicar}
          disabled={publicando}
        >
          {publicando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnPublicarTexto}>Publicar</Text>
          )}
        </TouchableOpacity>
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

  bloqueadoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  bloqueadoTitulo: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  bloqueadoTexto: { fontSize: 14, color: "#999", textAlign: "center" },

  form: { padding: 20, paddingBottom: 60 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#584128",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  inputConteudo: { minHeight: 160 },
  categoriasRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoriaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C5A87B",
  },
  categoriaBtnAtiva: { backgroundColor: "#584128", borderColor: "#584128" },
  categoriaTexto: { fontSize: 13, color: "#584128" },
  categoriaTextoAtivo: { color: "#FFF", fontWeight: "600" },

  btnPublicar: {
    backgroundColor: "#27ae60",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 28,
  },
  btnDesabilitado: { opacity: 0.6 },
  btnPublicarTexto: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
