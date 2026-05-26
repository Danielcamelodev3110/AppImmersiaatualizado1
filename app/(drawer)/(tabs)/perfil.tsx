import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { userService } from "../../../services/userService";

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const sessao = await userService.getSavedSession();
        console.log("Sessão carregada no Perfil:", sessao);

        if (!sessao) {
          router.replace("/login");
        } else {
          setUser(sessao);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, []);

  const handleLogout = async () => {
    await userService.logout();
    router.replace("/login");
  };

  // Garante a leitura correta vinda da propriedade do banco de dados (Prisma)
  const userType = user?.tipo_usuario || "cliente";

  const baseMenuItems = [
    {
      icon: "chatbubble-outline",
      title: "Suporte",
      route: "/contato",
      color: "#C5A87B",
    },
    {
      icon: "document-text-outline",
      title: "Termos e Privacidade",
      route: "/termos",
      color: "#999999",
    },
  ];

  const clienteMenuItems = [
    {
      icon: "heart-outline",
      title: "Meus Favoritos",
      route: "/favoritos",
      color: "#FF6B6B",
    },
    {
      icon: "calendar-outline",
      title: "Minhas Reservas",
      route: "/reservas",
      color: "#4ECDC4",
    },
  ];

  const anfitriaoMenuItems = [
    {
      icon: "add-circle-outline",
      title: "Cadastrar Produto",
      route: "/cadastrar-produto",
      color: "#45B7D1",
      description: "Adicione um novo produto",
    },
    {
      icon: "home-outline",
      title: "Minhas Hospedagens",
      route: "/minhas-hospedagens",
      color: "#4ECDC4",
    },
    {
      icon: "stats-chart-outline",
      title: "Meus Ganhos",
      route: "/ganhos",
      color: "#96CEB4",
    },
  ];

  const adminMenuItems = [
    {
      icon: "people-outline",
      title: "Gerenciar Usuários",
      route: "../usuarios",
      color: "#FF6B6B",
    },
    {
      icon: "stats-chart-outline",
      title: "Relatórios Gerais",
      route: "/admin/relatorios",
      color: "#584128",
    },
  ];

  const getMenuItems = () => {
    if (userType === "anfitriao")
      return [...anfitriaoMenuItems, ...baseMenuItems];
    if (userType === "admin" || userType === "administrador")
      return [...adminMenuItems, ...baseMenuItems];
    return [...clienteMenuItems, ...baseMenuItems];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Cartão do Perfil do Usuário */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.nome_completo || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.userName}>
          {user?.nome_completo || "Usuário Immersia"}
        </Text>

        <View
          style={[
            styles.userBadge,
            {
              backgroundColor:
                userType === "anfitriao" ? "#FF6B6B20" : "#4ECDC420",
            },
          ]}
        >
          <Text
            style={[
              styles.userBadgeText,
              { color: userType === "anfitriao" ? "#FF6B6B" : "#4ECDC4" },
            ]}
          >
            {userType.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Seção Dinâmica de Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Opções</Text>
        {getMenuItems().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}
            >
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.description && (
                <Text style={styles.menuDescription}>{item.description}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#584128" },
  profileCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#584128",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 40, fontWeight: "bold", color: "#ffffff" },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#666", marginTop: 8 },
  userBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  userBadgeText: { fontSize: 12, fontWeight: "bold" },
  menuSection: {
    backgroundColor: "#ffffff",
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, color: "#333", fontWeight: "500" },
  menuDescription: { fontSize: 12, color: "#999", marginTop: 2 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  logoutText: { fontSize: 16, color: "#FF3B30", fontWeight: "600" },
});
