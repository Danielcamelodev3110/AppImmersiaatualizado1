import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCarrinho } from "../../constants/CarrinhoContext";
import { reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";

export default function Carrinho() {
  const {
    itens,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    totalPreco,
  } = useCarrinho();
  const [finalizando, setFinalizando] = useState(false);

  const handleFinalizarCompra = async () => {
    if (itens.length === 0) return;

    setFinalizando(true);

    try {
      const sessao = await userService.getSavedSession();
      const usuarioLogado = sessao?.user ? sessao.user : sessao;

      if (!usuarioLogado?.id) {
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para finalizar a compra.",
        );
        router.push("/login");
        return;
      }

      // Cria uma reserva por item do carrinho (o backend calcula o
      // preço total de cada uma a partir do preço atual do produto)
      await Promise.all(
        itens.map((item) =>
          reservaService.create({
            id_cliente: usuarioLogado.id,
            id_produto: item.produto.id,
            quantidade: item.quantidade,
          }),
        ),
      );

      limparCarrinho();

      Alert.alert("Sucesso", "Compra realizada com sucesso!", [
        { text: "OK", onPress: () => router.push("/minhas-reservas") },
      ]);
    } catch (error: any) {
      const dadosErro = error.response?.data;
      const mensagemErro =
        dadosErro?.message ||
        error.message ||
        "Erro ao finalizar a compra. Tente novamente.";
      Alert.alert("Erro na compra", mensagemErro);
    } finally {
      setFinalizando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.vazioContainer}>
          <Ionicons name="cart-outline" size={64} color="#CCC" />
          <Text style={styles.vazioTexto}>Seu carrinho está vazio</Text>
          <TouchableOpacity
            style={styles.botaoExplorar}
            onPress={() => router.push("/")}
          >
            <Text style={styles.botaoExplorarTexto}>Explorar produtos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Meu carrinho</Text>

      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.produto.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.produto.imagem_url ? (
              <Image
                source={{ uri: item.produto.imagem_url.split(",")[0] }}
                style={styles.imagem}
              />
            ) : (
              <View style={[styles.imagem, styles.imagemPlaceholder]}>
                <Ionicons name="image-outline" size={28} color="#AAA" />
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.nome} numberOfLines={2}>
                {item.produto.nome}
              </Text>
              <Text style={styles.preco}>
                R$ {item.produto.preco.toFixed(2)}
              </Text>

              <View style={styles.quantidadeContainer}>
                <TouchableOpacity
                  style={styles.quantidadeBotao}
                  onPress={() =>
                    atualizarQuantidade(item.produto.id, item.quantidade - 1)
                  }
                >
                  <Ionicons name="remove" size={18} color="#584128" />
                </TouchableOpacity>

                <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>

                <TouchableOpacity
                  style={styles.quantidadeBotao}
                  onPress={() =>
                    atualizarQuantidade(item.produto.id, item.quantidade + 1)
                  }
                >
                  <Ionicons name="add" size={18} color="#584128" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removerBotao}
                  onPress={() => removerDoCarrinho(item.produto.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#C0392B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.rodape}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>R$ {totalPreco.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.botaoFinalizar,
            finalizando && styles.botaoDesabilitado,
          ]}
          onPress={handleFinalizarCompra}
          disabled={finalizando}
        >
          <Text style={styles.botaoFinalizarTexto}>
            {finalizando ? "Finalizando..." : "Finalizar compra"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#584128",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  lista: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
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
  info: { flex: 1, justifyContent: "center" },
  nome: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 4 },
  preco: { fontSize: 14, color: "#666", marginBottom: 8 },
  quantidadeContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  quantidadeBotao: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDEAE0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantidadeTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    minWidth: 20,
    textAlign: "center",
  },
  removerBotao: { marginLeft: "auto", padding: 4 },
  rodape: {
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF",
    padding: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: { fontSize: 16, color: "#666" },
  totalValor: { fontSize: 20, fontWeight: "bold", color: "#584128" },
  botaoFinalizar: {
    backgroundColor: "#584128",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoFinalizarTexto: { color: "#FFF", fontSize: 16, fontWeight: "600" },
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
