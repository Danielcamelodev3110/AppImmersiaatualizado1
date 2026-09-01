import { Ionicons } from "@expo/vector-icons";
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
import { userService } from "../../services/userService";

export default function EditarPerfilScreen() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // Estados de controle da UI
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Carrega os dados atuais do usuário logado ao abrir a tela
  useEffect(() => {
    async function carregarDadosUsuario() {
      try {
        const sessao = await userService.getSavedSession();
        // Se a estrutura vier envelopada em 'user', extraímos dela
        const usuarioLogado = sessao?.user ? sessao.user : sessao;

        if (usuarioLogado) {
          setNome(usuarioLogado.nome_completo || "");
          setEmail(usuarioLogado.email || "");
          setTelefone(usuarioLogado.telefone || "");
        } else {
          Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } finally {
        setCarregandoDados(false);
      }
    }
    carregarDadosUsuario();
  }, []);

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Os campos Nome e E-mail são obrigatórios.");
      return;
    }

    setSalvando(true);
    try {
      const dadosAtualizados = {
        nome_completo: nome,
        email: email,
        telefone: telefone,
      };

      await userService.updateProfile(dadosAtualizados);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar os dados.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoDados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#584128" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#584128"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#584128"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="seu-email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone / WhatsApp</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="logo-whatsapp"
              size={20}
              color="#584128"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#FFF"
              />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#584128" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#4A3B2C", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#4A3B2C",
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#333", fontSize: 15, height: "100%" },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#584128",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  saveButtonDisabled: { backgroundColor: "#8A7663" },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
