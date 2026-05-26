import { Drawer } from "expo-router/drawer";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Componente de header customizado para o drawer
function CustomDrawerHeader() {
  return (
    <View style={styles.drawerHeaderContainer}>
      <Image 
        source={require("../../assets/images/logo.png")} 
        style={styles.drawerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

// Componente personalizado do conteúdo do drawer
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentContainer}>
      {/* Cabeçalho do drawer com logo */}
      <View style={styles.drawerHeader}>
        <Image 
          source={require("../../assets/images/logo.png")} 
          style={styles.drawerHeaderLogo}
          resizeMode="contain"
        />
      </View>
      {/* Itens do drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: () => <CustomDrawerHeader />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#584128",
        },
        headerTintColor: "#ffffff",

        // ESTILIZAÇÃO DO DRAWER
        drawerStyle: {
          backgroundColor: "#584128",
          width: 280,
        },
        drawerActiveTintColor: "#fded8f",
        drawerInactiveTintColor: "#EDEAE0",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 12,
          marginVertical: 4,
        },
        drawerActiveBackgroundColor: "rgba(255, 215, 0, 0.2)",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
          drawerLabel: "Início",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
          drawerLabel: "Cadastro",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          drawerLabel: "Configurações",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="contato"
        options={{
          title: "Contato",
          drawerLabel: "Contato",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="sobre"
        options={{
          title: "Sobre",
          drawerLabel: "Sobre",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="sair"
        options={{
          title: "Sair",
          drawerLabel: "Sair",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="exemploproduto"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
      <Drawer.Screen
        name="exemploblog"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
      <Drawer.Screen
        name="perfil_anfitriao"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
      <Drawer.Screen
        name="cadastrar-produto"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
      <Drawer.Screen
        name="usuarios"
        options={{
          title: "",
          drawerLabel: "",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  // Header do topo (barra superior)
  drawerHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerHomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  drawerDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#EDEAE0',
  },
  drawerLogo: {
    width: 160,
    height: 50,
  },
  
  // Cabeçalho dentro do drawer (menu lateral)
  drawerContentContainer: {
    flex: 1,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237, 234, 224, 0.3)',
    marginBottom: 20,
  },
  drawerHeaderLogo: {
    width: 200,
    height: 60,
    marginBottom: -10,
  },
  drawerHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EDEAE0',
    marginTop: 8,
  },
  drawerHeaderDivider: {
    width: 50,
    height: 2,
    backgroundColor: '#FFD700',
    marginTop: 12,
  },
});