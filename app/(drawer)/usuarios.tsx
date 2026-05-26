import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 🌟 Importando diretamente do seu userService atualizado
import { UserResponse, userService } from "../../services/userService";

export default function GerenciarUsuariosScreen() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      // 🌟 Chamando a função findAll criada no userService
      const lista = await userService.findAll();
      setUsuarios(lista);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleConfirmarExclusao = (id: number, nome: string) => {
    if (Platform.OS === "web") {
      const confirmar = window.confirm(
        `Deseja realmente excluir permanentemente a conta de ${nome}?`,
      );
      if (confirmar) executarExclusao(id);
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        `Tem certeza que deseja apagar permanentemente a conta de ${nome}? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => executarExclusao(id),
          },
        ],
      );
    }
  };

  const executarExclusao = async (id: number) => {
    try {
      // 🌟 Chamando a função remove criada no userService
      await userService.remove(id);
      setUsuarios((prev) => prev.filter((user) => user.id !== id));

      if (Platform.OS === "web") {
        window.alert("Usuário removido com sucesso.");
      } else {
        Alert.alert("Sucesso", "Usuário removido com sucesso.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao deletar a conta do usuário.");
    }
  };

  const renderItem = ({ item }: { item: UserResponse }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nomeText}>{item.nome_completo}</Text>
        <Text style={styles.detalheText}>
          <Feather name="mail" size={12} /> {item.email}
        </Text>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, styles.tipoBadge]}>
            {item.tipo_usuario ? item.tipo_usuario.toUpperCase() : "CLIENTE"}
          </Text>
          <Text
            style={[
              styles.badge,
              item.status_conta === "ativo"
                ? styles.ativoBadge
                : styles.inactiveBadge,
            ]}
          >
            {item.status_conta ? item.status_conta.toUpperCase() : "ATIVO"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleConfirmarExclusao(item.id, item.nome_completo)}
      >
        <Feather name="trash-2" size={20} color="#900" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Contas</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#584128" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text>
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#EDEAE0",
  },
  backButton: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: "bold", color: "#584128" },
  listContent: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#C4D5BE",
  },
  infoContainer: { flex: 1, marginRight: 10 },
  nomeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  detalheText: { fontSize: 13, color: "#666", marginBottom: 6 },
  badgeRow: { flexDirection: "row", gap: 6 },
  badge: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  tipoBadge: { backgroundColor: "#E2E8F0", color: "#4A5568" },
  ativoBadge: { backgroundColor: "#C6F6D5", color: "#22543D" },
  inactiveBadge: { backgroundColor: "#FED7D7", color: "#742A2A" },
  deleteButton: { padding: 10, borderRadius: 20, backgroundColor: "#FFF5F5" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
});
