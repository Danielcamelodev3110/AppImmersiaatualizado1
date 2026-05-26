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

export default function Cadastro() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  // Estado definido estritamente com os termos do enum do Prisma (sem acento)
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "anfitriao">(
    "cliente",
  );
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const formatarCPF = (texto: string) => {
    let cpfFormatado = texto.replace(/\D/g, "");
    if (cpfFormatado.length <= 11) {
      cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
      cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
      cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpfFormatado;
  };

  const formatarData = (texto: string) => {
    let dataFormatada = texto.replace(/\D/g, "");
    if (dataFormatada.length <= 8) {
      dataFormatada = dataFormatada.replace(/(\d{2})(\d)/, "$1/$2");
      dataFormatada = dataFormatada.replace(/(\d{2})(\d)/, "$1/$2");
    }
    return dataFormatada;
  };

  const validarCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
    if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++)
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
    if (digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))) return false;

    return true;
  };

  const validarIdade = (data: string) => {
    const partes = data.split("/");
    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const ano = parseInt(partes[2]);

    const dataNasc = new Date(ano, mes, dia);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const diferencaMeses = hoje.getMonth() - dataNasc.getMonth();

    if (
      diferencaMeses < 0 ||
      (diferencaMeses === 0 && hoje.getDate() < dataNasc.getDate())
    ) {
      idade--;
    }
    return idade >= 18;
  };

  const handleCadastro = async () => {
    if (
      !nomeCompleto ||
      !email ||
      !cpf ||
      !dataNascimento ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido!");
      return;
    }

    if (!validarIdade(dataNascimento)) {
      Alert.alert(
        "Erro",
        "Você deve ter pelo menos 18 anos para se cadastrar!",
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setCarregando(true);

    try {
      const cpfLimpo = cpf.replace(/\D/g, "");
      const [dia, mes, ano] = dataNascimento.split("/");
      const dataFormatadaISO = `${ano}-${mes}-${dia}`;

      const dadosUsuario = {
        nome_completo: nomeCompleto,
        email: email.toLowerCase().trim(),
        senha: senha,
        cpf: cpfLimpo,
        data_nascimento: dataFormatadaISO,
        tipo_usuario: tipoUsuario,
      };

      await userService.create(dadosUsuario);

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      console.error("Erro detalhado no clique do botão:", error);

      const dadosErro = error.response?.data;
      const mensagemErro =
        dadosErro?.message ||
        error.message ||
        "Erro desconhecido ao conectar ao servidor.";

      Alert.alert(
        "Erro no Cadastro",
        Array.isArray(mensagemErro) ? mensagemErro[0] : mensagemErro,
      );
    } finally {
      setCarregando(false);
    }
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
          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar</Text>
          </View>

          <View style={styles.form}>
            {/* Seletor do Tipo de Usuário */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quero me cadastrar como:</Text>
              <View style={styles.selectorContainer}>
                <TouchableOpacity
                  style={[
                    styles.selectorButton,
                    tipoUsuario === "cliente" && styles.selectorButtonActive,
                  ]}
                  onPress={() => setTipoUsuario("cliente")}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      tipoUsuario === "cliente" &&
                        styles.selectorButtonTextActive,
                    ]}
                  >
                    👤 Cliente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.selectorButton,
                    tipoUsuario === "anfitriao" && styles.selectorButtonActive,
                  ]}
                  onPress={() => setTipoUsuario("anfitriao")}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      tipoUsuario === "anfitriao" &&
                        styles.selectorButtonTextActive,
                    ]}
                  >
                    🏠 Anfitrião
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#999"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                autoCapitalize="words"
              />
            </View>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="123.456.789-00"
                placeholderTextColor="#999"
                value={cpf}
                onChangeText={(texto) => setCpf(formatarCPF(texto))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#999"
                value={dataNascimento}
                onChangeText={(texto) => setDataNascimento(formatarData(texto))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarConfirmarSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                >
                  <Text style={styles.eyeIcon}>
                    {mostrarConfirmarSenha ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, carregando && styles.buttonDisabled]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            <Text style={styles.signupButtonText}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Fazer login</Text>
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
  selectorContainer: { flexDirection: "row", gap: 12, marginTop: 4 },
  selectorButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButtonActive: { backgroundColor: "#584128", borderColor: "#584128" },
  selectorButtonText: { fontSize: 15, fontWeight: "600", color: "#666" },
  selectorButtonTextActive: { color: "#FFF" },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: { flex: 1, paddingRight: 50 },
  eyeButton: { position: "absolute", right: 16, padding: 8 },
  eyeIcon: { fontSize: 20 },
  signupButton: {
    backgroundColor: "#584128",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  signupButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: { fontSize: 16, color: "#666" },
  footerLink: { fontSize: 16, color: "#C5A87B", fontWeight: "600" },
});
