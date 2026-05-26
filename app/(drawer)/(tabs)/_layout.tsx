import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

function ProdutosMenuTrigger() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const menuItems = [
    { id: "experiencias", title: "Experiências", icon: "compass" },
    { id: "pacotes", title: "Pacotes", icon: "briefcase" },
    { id: "hospedagens", title: "Hospedagens", icon: "home" },
  ];

  const navigateTo = (route: string) => {
    setModalVisible(false);
    router.push(`/${route}`);
  };

  return (
    <>
      <Pressable
        style={styles.menuButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="grid" size={24} color="#ffffff" />
        <Text style={styles.menuText}>Produtos</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Categorias</Text>
            </View>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.modalItem}
                onPress={() => navigateTo(item.id)}
              >
                <Feather name={item.icon as any} size={24} color="#fded8f" />
                <Text style={styles.modalItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function CustomTabBarButton(props: any) {
  return (
    <View style={styles.tabItemContainer}>
      <ProdutosMenuTrigger />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fded8f",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="experiencias" options={{ href: null }} />
      <Tabs.Screen name="pacotes" options={{ href: null }} />
      <Tabs.Screen name="hospedagens" options={{ href: null }} />

      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cupons"
        options={{
          title: "Cupons",
          tabBarIcon: ({ color, size }) => (
            <Feather name="tag" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: "Blog",
          tabBarIcon: ({ color }) => (
            <Feather name="edit-3" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: "#584128",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    marginHorizontal: 2,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  menuButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 0,
    backgroundColor: "#584128",
    borderRadius: 0,
    gap: 0,
    borderWidth: 0,
    overflow: "hidden",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  menuText: {
    fontSize: 11,
    color: "#ffffff",
    marginTop: 2,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#584128",
    borderRadius: 16,
    width: "80%",
    maxWidth: 300,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fded8f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
});
