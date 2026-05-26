import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { userService } from "../../services/userService";

const { width } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    setCarregando(true);

    try {
      const dadosLogin = {
        email: email.toLowerCase().trim(),
        senha: senha,
      };

      // Dispara a requisição para o NestJS através do userService
      const resposta = await userService.login(dadosLogin);
      console.log("Login bem-sucedido:", resposta);

      // Redireciona na hora para a página de perfil para evitar travamentos na Web
      router.replace("/perfil");
    } catch (error: any) {
      console.error("Erro capturado no Login:", error);

      const dadosErro = error.response?.data;
      const mensagemErro =
        dadosErro?.message ||
        error.message ||
        "Erro de conexão com o servidor.";

      Alert.alert(
        "Erro no Acesso",
        Array.isArray(mensagemErro) ? mensagemErro[0] : mensagemErro,
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Social Login", `Login com ${provider} em desenvolvimento`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Text style={styles.eyeIcon}>
                    {mostrarSenha ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Esqueceu a senha */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Botão Login */}
            <TouchableOpacity
              style={[styles.loginButton, carregando && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={carregando}
            >
              <Text style={styles.loginButtonText}>
                {carregando ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continue com</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botões Sociais */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
                onPress={() => handleSocialLogin("Google")}
              >
                <Text style={styles.socialButtonText}>G</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Link para Cadastro */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEAE0" },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#666" },
  form: { width: "100%" },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: { flex: 1, paddingRight: 50 },
  eyeButton: { position: "absolute", right: 16, padding: 8 },
  eyeIcon: { fontSize: 20 },
  forgotContainer: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { fontSize: 14, color: "#C5A87B", fontWeight: "600" },
  loginButton: {
    backgroundColor: "#584128",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  loginButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#DDD" },
  dividerText: { marginHorizontal: 16, fontSize: 14, color: "#999" },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonText: { fontSize: 24, color: "#FFF", fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: { fontSize: 16, color: "#666" },
  footerLink: { fontSize: 16, color: "#C5A87B", fontWeight: "600" },
});
