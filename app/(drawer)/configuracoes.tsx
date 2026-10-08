import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useIdioma } from "../../constants/IdiomaContext";
import { IDIOMAS } from "../../constants/traducoes";

export default function ConfiguracoesScreen() {
  const { idioma, setIdioma } = useIdioma();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modalIdioma, setModalIdioma] = useState(false);

  const idiomaAtual = IDIOMAS.find((i) => i.codigo === idioma) ?? IDIOMAS[0];

  const settingsSections = [
    {
      title: "Preferências",
      data: [
        {
          id: "notifications",
          title: "Notificações",
          icon: "notifications-outline" as const,
          type: "switch" as const,
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          id: "darkMode",
          title: "Modo Escuro",
          icon: "moon-outline" as const,
          type: "switch" as const,
          value: darkMode,
          onValueChange: setDarkMode,
        },
      ],
    },
    {
      title: "Preferências de Exibição",
      data: [
        {
          id: "language",
          title: "Idioma",
          icon: "language-outline" as const,
          type: "button" as const,
          // nome do idioma sempre escrito no próprio idioma
          subtitle: `${idiomaAtual.bandeira}  ${idiomaAtual.nome}`,
        },
      ],
    },
    {
      title: "Privacidade",
      data: [
        {
          id: "privacy",
          title: "Política de Privacidade",
          icon: "lock-closed-outline" as const,
          type: "button" as const,
        },
      ],
    },
  ];

  const handleButtonPress = (id: string) => {
    if (id === "language") {
      setModalIdioma(true);
    }
    // 'privacy': abra aqui a tela de termos, se quiser (router.push('/termos'))
  };

  const escolherIdioma = async (codigo: (typeof IDIOMAS)[number]["codigo"]) => {
    await setIdioma(codigo);
    setModalIdioma(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.data.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === section.data.length - 1 && styles.lastItem,
                  ]}
                  onPress={() =>
                    item.type === "button" && handleButtonPress(item.id)
                  }
                  activeOpacity={item.type === "button" ? 0.7 : 1}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name={item.icon} size={24} color="#007AFF" />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      {"subtitle" in item && item.subtitle && (
                        <Text style={styles.settingSubtitle}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>

                  {item.type === "switch" && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: "#767577", true: "#007AFF" }}
                      thumbColor={item.value ? "#fff" : "#f4f3f4"}
                    />
                  )}

                  {item.type === "button" && (
                    <Ionicons
                      name="chevron-forward-outline"
                      size={20}
                      color="#666"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ===== SELETOR DE IDIOMA ===== */}
      <Modal
        visible={modalIdioma}
        transparent
        animationType="fade"
        onRequestClose={() => setModalIdioma(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalIdioma(false)}
        >
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Escolha o idioma</Text>

            {IDIOMAS.map((item) => {
              const selecionado = item.codigo === idioma;
              return (
                <TouchableOpacity
                  key={item.codigo}
                  style={[
                    styles.idiomaItem,
                    selecionado && styles.idiomaItemAtivo,
                  ]}
                  onPress={() => escolherIdioma(item.codigo)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.idiomaBandeira}>{item.bandeira}</Text>
                  <Text style={styles.idiomaNome}>{item.nome}</Text>
                  {selecionado && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#007AFF"
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.fecharBtn}
              onPress={() => setModalIdioma(false)}
            >
              <Text style={styles.fecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAE0",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  // modal de idioma
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 14,
    textAlign: "center",
  },
  idiomaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#f6f6f6",
  },
  idiomaItemAtivo: {
    backgroundColor: "#E8F1FF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  idiomaBandeira: {
    fontSize: 24,
    marginRight: 12,
  },
  idiomaNome: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  fecharBtn: {
    marginTop: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  fecharTexto: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
});
