import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { produtoService } from "../../services/ProdutoService";
import { userService } from "../../services/userService";

export default function CadastrarProdutoScreen() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Estados do formulário baseados no Model do Prisma
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("geral");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("1");
  const [tipoProduto, setTipoProduto] = useState<"experiencia" | "hospedagem">(
    "experiencia",
  );
  const [localizacao, setLocalizacao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [inclui, setInclui] = useState("");
  const [naoInclui, setNaoInclui] = useState("");

  // 🌟 ESTADOS PARA MÚLTIPLAS IMAGENS
  const [imagens, setImagens] = useState<string[]>([""]); // Começa com um campo vazio

  // Carrega o usuário logado de forma persistente assim que a tela abre
  useEffect(() => {
    const verificarSessao = async () => {
      const usuarioLogado = await userService.getSavedSession();
      if (usuarioLogado && usuarioLogado.id) {
        setUserId(usuarioLogado.id);
      } else {
        Alert.alert(
          "Acesso Negado",
          "Você precisa estar logado para cadastrar.",
          [{ text: "Ir para Login", onPress: () => router.replace("/login") }],
        );
      }
    };
    verificarSessao();
  }, []);

  // 🌟 FUNÇÕES PARA GERENCIAR AS IMAGENS
  const handleAlterarImagemText = (texto: string, index: number) => {
    const novasImagens = [...imagens];
    novasImagens[index] = texto;
    setImagens(novasImagens);
  };

  const handleAdicionarCampoImagem = () => {
    setImagens([...imagens, ""]);
  };

  const handleRemoverCampoImagem = (index: number) => {
    if (imagens.length === 1) {
      setImagens([""]); // Não deixa ficar sem nenhum campo
      return;
    }
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };

  const handleCadastrar = async () => {
    // Filtra links vazios que o usuário possa ter deixado criados
    const imagensValidas = imagens.filter((url) => url.trim() !== "");

    if (!nome || !descricao || !preco || imagensValidas.length === 0) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha Nome, Descrição, Preço e insira ao menos uma Imagem válida.",
      );
      return;
    }

    if (!userId) {
      Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      setSalvando(true);

      // 🌟 Junta os links das imagens em uma string separada por vírgulas para o banco
      const stringImagensUnificadas = imagensValidas.join(",");

      const payload = {
        nome,
        categoria,
        descricao,
        preco: parseFloat(preco.replace(",", ".")),
        imagem_url: stringImagensUnificadas, // Enviando todas as URLs juntas
        quantidade_estoque: parseInt(estoque) || 0,
        tipo_produto: tipoProduto,
        localizacao,
        duracao,
        inclui,
        nao_inclui: naoInclui,
        id_cliente_produto: userId,
      };

      await produtoService.create(payload);

      Alert.alert("Sucesso!", "Sua experiência foi cadastrada perfeitamente.", [
        {
          text: "OK",
          onPress: () => router.replace("/"), // Ajustado para voltar à Home principal
        },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Erro ao cadastrar",
        "Verifique os dados ou a conexão com o servidor.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Produto</Text>
      </View>

      {/* Seletor Tipo de Produto */}
      <Text style={styles.label}>Tipo de Cadastro</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorBtn,
            tipoProduto === "experiencia" && styles.selectorBtnActive,
          ]}
          onPress={() => setTipoProduto("experiencia")}
        >
          <Text
            style={[
              styles.selectorText,
              tipoProduto === "experiencia" && styles.selectorTextActive,
            ]}
          >
            Experiência
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectorBtn,
            tipoProduto === "hospedagem" && styles.selectorBtnActive,
          ]}
          onPress={() => setTipoProduto("hospedagem")}
        >
          <Text
            style={[
              styles.selectorText,
              tipoProduto === "hospedagem" && styles.selectorTextActive,
            ]}
          >
            Hospedagem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nome */}
      <Text style={styles.label}>Título do Anúncio *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Passeio de Balão ao Entardecer"
        value={nome}
        onChangeText={setNome}
      />

      {/* Categoria & Preço */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Natureza"
            value={categoria}
            onChangeText={setCategoria}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="150.00"
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />
        </View>
      </View>

      {/* Localização & Duração */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Localização</Text>
          <TextInput
            style={styles.input}
            placeholder="Cidade - UF"
            value={localizacao}
            onChangeText={setLocalizacao}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Duração / Vagas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 3 horas"
            value={duracao}
            onChangeText={setDuracao}
          />
        </View>
      </View>

      {/* Estoque */}
      <Text style={styles.label}>Vagas Disponíveis em Estoque</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 10"
        keyboardType="numeric"
        value={estoque}
        onChangeText={setEstoque}
      />

      {/* 🌟 SEÇÃO DINÂMICA DE URLS DE IMAGENS */}
      <View style={styles.imagensHeaderRow}>
        <Text style={styles.label}>URLs das Imagens *</Text>
        <TouchableOpacity
          style={styles.addImgBtn}
          onPress={handleAdicionarCampoImagem}
        >
          <Feather name="plus" size={16} color="#FFF" />
          <Text style={styles.addImgBtnText}>Adicionar Foto</Text>
        </TouchableOpacity>
      </View>

      {imagens.map((url, index) => (
        <View key={index} style={styles.imageInputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder={`Link da imagem ${index + 1}`}
            value={url}
            onChangeText={(texto) => handleAlterarImagemText(texto, index)}
          />
          <TouchableOpacity
            style={styles.removeImgBtn}
            onPress={() => handleRemoverCampoImagem(index)}
          >
            <Feather name="trash-2" size={18} color="#900" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Descrição */}
      <Text style={styles.label}>Descrição Detalhada *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conte detalhes sobre o que torna essa vivência única..."
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Inclui */}
      <Text style={styles.label}>O que está incluso? (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: Almoço, Equipamentos, Guia Local"
        multiline
        value={inclui}
        onChangeText={setInclui}
      />

      {/* Não Inclui */}
      <Text style={styles.label}>O que NÃO está incluso? (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: Transporte até o local, bebidas"
        multiline
        value={naoInclui}
        onChangeText={setNaoInclui}
      />

      {/* Botão de Envio */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleCadastrar}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>Cadastrar Produto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#584128" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#584128",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C4D5BE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },
  textArea: { textAlignVertical: "top", height: 80 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  selectorContainer: { flexDirection: "row", marginBottom: 15, gap: 10 },
  selectorBtn: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#584128",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  selectorBtnActive: { backgroundColor: "#584128" },
  selectorText: { color: "#584128", fontWeight: "bold" },
  selectorTextActive: { color: "#FFF" },
  imagensHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  addImgBtn: {
    flexDirection: "row",
    backgroundColor: "#584128",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  addImgBtnText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  imageInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  removeImgBtn: {
    backgroundColor: "#FFF5F5",
    padding: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  submitBtn: {
    backgroundColor: "#584128",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
