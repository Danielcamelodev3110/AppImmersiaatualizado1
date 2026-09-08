// app/(drawer)/esqueceu-senha.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EsqueceuSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = Codigo, 3 = Nova Senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // ===== ENVIAR EMAIL DE RECUPERAÇÃO =====
  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Digite seu e-mail para recuperar a senha.');
      return;
    }

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      // Simula envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      setStep(2);
      Alert.alert(
        '✅ E-mail enviado!',
        `Enviamos um código de verificação para ${email}. Verifique sua caixa de entrada.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ===== VERIFICAR CÓDIGO =====
  const handleVerifyCode = async () => {
    if (!codigo.trim()) {
      Alert.alert('Erro', 'Digite o código de verificação enviado para seu e-mail.');
      return;
    }

    if (codigo.length < 6) {
      Alert.alert('Erro', 'O código deve ter pelo menos 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      // Simula verificação do código
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Código de exemplo: 123456
      if (codigo === '123456') {
        setStep(3);
        Alert.alert('✅ Código verificado!', 'Agora você pode criar uma nova senha.');
      } else {
        Alert.alert('Erro', 'Código inválido. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar o código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ===== REENVIAR CÓDIGO =====
  const handleResendCode = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('✅ Código reenviado!', `Um novo código foi enviado para ${email}.`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o código.');
    } finally {
      setLoading(false);
    }
  };

  // ===== REDEFINIR SENHA =====
  const handleResetPassword = async () => {
    if (!novaSenha.trim()) {
      Alert.alert('Erro', 'Digite sua nova senha.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '✅ Senha redefinida!',
        'Sua senha foi alterada com sucesso. Faça login com sua nova senha.',
        [
          {
            text: 'Fazer Login',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDERIZAR STEP 1 - EMAIL =====
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={60} color="#584128" />
      </View>
      <Text style={styles.stepTitle}>Recuperar Senha</Text>
      <Text style={styles.stepDescription}>
        Digite seu e-mail cadastrado e enviaremos um código de verificação para redefinir sua senha.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7a6a5a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleSendEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnPrimaryText}>Enviar código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#584128" />
        <Text style={styles.btnBackText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );

  // ===== RENDERIZAR STEP 2 - CÓDIGO =====
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="key-outline" size={60} color="#584128" />
      </View>
      <Text style={styles.stepTitle}>Código de Verificação</Text>
      <Text style={styles.stepDescription}>
        Digite o código de 6 dígitos enviado para <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Código de verificação</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={20} color="#7a6a5a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite o código"
            placeholderTextColor="#999"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnPrimaryText}>Verificar código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnResend}
        onPress={handleResendCode}
        disabled={loading}
      >
        <Text style={styles.btnResendText}>Não recebeu o código? Reenviar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => {
          setStep(1);
          setEmailSent(false);
        }}
      >
        <Ionicons name="arrow-back" size={20} color="#584128" />
        <Text style={styles.btnBackText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  // ===== RENDERIZAR STEP 3 - NOVA SENHA =====
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed-outline" size={60} color="#584128" />
      </View>
      <Text style={styles.stepTitle}>Nova Senha</Text>
      <Text style={styles.stepDescription}>
        Crie uma nova senha para sua conta. Use pelo menos 6 caracteres.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nova senha</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7a6a5a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua nova senha"
            placeholderTextColor="#999"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons
              name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#7a6a5a"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirmar senha</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7a6a5a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirme sua nova senha"
            placeholderTextColor="#999"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!mostrarConfirmarSenha}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
            <Ionicons
              name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#7a6a5a"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnPrimaryText}>Redefinir senha</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => {
          setStep(2);
          setCodigo('');
        }}
      >
        <Ionicons name="arrow-back" size={20} color="#584128" />
        <Text style={styles.btnBackText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  // ===== RENDER =====
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#7a6a5a" /> Recuperação segura
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0eb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  stepContainer: {
    gap: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c1810',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
  },
  stepDescription: {
    fontSize: 14,
    color: '#5a4a3a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#584128',
  },
  formGroup: {
    marginTop: 4,
  },
  label: {
    fontWeight: '600',
    color: '#2c1810',
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8e0d8',
    borderRadius: 12,
    backgroundColor: '#faf8f5',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c1810',
  },
  btnPrimary: {
    backgroundColor: '#584128',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#fff9f9',
    fontWeight: '700',
    fontSize: 16,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  btnBackText: {
    color: '#584128',
    fontWeight: '600',
    fontSize: 14,
  },
  btnResend: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnResendText: {
    color: '#7a6a5a',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#7a6a5a',
    fontSize: 13,
  },
});