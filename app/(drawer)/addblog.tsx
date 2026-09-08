// app/(drawer)/(tabs)/addblog.tsx - VERSÃO SEM IMAGE PICKER
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NovoPostScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    estado: '',
    cidade: '',
    imagem: null as string | null,
    destaque: false,
    data: new Date().toISOString().split('T')[0],
  });

  // Estados para modais
  const [modalEstadosVisible, setModalEstadosVisible] = useState(false);
  const [modalCidadesVisible, setModalCidadesVisible] = useState(false);

  // Carregar estados
  useEffect(() => {
    carregarEstados();
  }, []);

  const carregarEstados = async () => {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      const data = await response.json();
      setEstados(data);
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
    }
  };

  const carregarCidades = async (estadoSigla: string) => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`);
      const data = await response.json();
      setCidades(data);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  // Salvar post
  const salvarPost = async () => {
    // Validações
    if (!formData.titulo.trim()) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return;
    }
    if (!formData.resumo.trim()) {
      Alert.alert('Erro', 'O resumo é obrigatório.');
      return;
    }
    if (!formData.conteudo.trim()) {
      Alert.alert('Erro', 'O conteúdo é obrigatório.');
      return;
    }
    if (!formData.estado) {
      Alert.alert('Erro', 'Selecione um estado.');
      return;
    }
    if (!formData.cidade) {
      Alert.alert('Erro', 'Selecione uma cidade.');
      return;
    }

    setLoading(true);

    try {
      // Simulando um delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Sucesso!',
        'Post publicado com sucesso!',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      Alert.alert('Erro', 'Não foi possível salvar o post.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar modal de estados
  const renderModalEstados = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalEstadosVisible}
      onRequestClose={() => setModalEstadosVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione um Estado</Text>
            <TouchableOpacity onPress={() => setModalEstadosVisible(false)}>
              <Ionicons name="close" size={24} color="#6e3821ff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList}>
            {estados.map((estado) => (
              <TouchableOpacity 
                key={estado.sigla}
                style={styles.modalItem}
                onPress={() => {
                  setFormData({ ...formData, estado: estado.sigla, cidade: '' });
                  carregarCidades(estado.sigla);
                  setModalEstadosVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{estado.nome} ({estado.sigla})</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Renderizar modal de cidades
  const renderModalCidades = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalCidadesVisible}
      onRequestClose={() => setModalCidadesVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione uma Cidade</Text>
            <TouchableOpacity onPress={() => setModalCidadesVisible(false)}>
              <Ionicons name="close" size={24} color="#6e3821ff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList}>
            {cidades.map((cidade) => (
              <TouchableOpacity 
                key={cidade.id}
                style={styles.modalItem}
                onPress={() => {
                  setFormData({ ...formData, cidade: cidade.nome });
                  setModalCidadesVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{cidade.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6e3821ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Post</Text>
          <TouchableOpacity onPress={salvarPost} disabled={loading} style={styles.saveButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título do post"
              placeholderTextColor="#999"
              value={formData.titulo}
              onChangeText={(text) => setFormData({ ...formData, titulo: text })}
            />
          </View>

          {/* Resumo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Resumo *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite um resumo do post"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={formData.resumo}
              onChangeText={(text) => setFormData({ ...formData, resumo: text })}
            />
          </View>

          {/* Conteúdo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Conteúdo *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite o conteúdo completo do post"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              value={formData.conteudo}
              onChangeText={(text) => setFormData({ ...formData, conteudo: text })}
            />
          </View>

          {/* Localização */}
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Estado *</Text>
              <TouchableOpacity 
                style={styles.selectInput}
                onPress={() => setModalEstadosVisible(true)}
              >
                <Text style={styles.selectText}>
                  {formData.estado ? estados.find(e => e.sigla === formData.estado)?.nome || formData.estado : 'Selecione'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Cidade *</Text>
              <TouchableOpacity 
                style={[styles.selectInput, !formData.estado && styles.selectDisabled]}
                onPress={() => {
                  if (formData.estado) {
                    setModalCidadesVisible(true);
                  }
                }}
              >
                <Text style={[styles.selectText, !formData.estado && styles.textDisabled]}>
                  {formData.cidade || (formData.estado ? 'Selecione' : 'Selecione um estado primeiro')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={formData.estado ? "#7f8c8d" : "#ccc"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Destaque */}
           

          {/* Imagem - Placeholder */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Imagem</Text>
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={50} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Adicione uma imagem</Text>
                <Text style={styles.imageSubtext}>(Funcionalidade em breve)</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerSpacer} />
        </View>

        {/* Modais */}
        {renderModalEstados()}
        {renderModalCidades()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e0d3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6e3821ff',
  },
  saveButton: {
    backgroundColor: '#6e3821ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  selectDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  textDisabled: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6e3821ff',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imagePlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 20,
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  imageSubtext: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  destaqueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  destaqueText: {
    fontSize: 16,
    color: '#999',
  },
  destaqueActive: {
    color: '#6e3821ff',
    fontWeight: '600',
  },
  footerSpacer: {
    height: 40,
  },
});