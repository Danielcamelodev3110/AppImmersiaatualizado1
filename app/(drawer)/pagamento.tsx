// Pagamento.tsx - VERSÃO REACT NATIVE COM NAVEGAÇÃO PARA CONCLUÍDO
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ===== IMPORTANDO AS IMAGENS =====
const pixImage = require('../../assets/images/pix.png');
const cartaoImage = require('../../assets/images/cartao.png');
const boletoImage = require('../../assets/images/boleto.png');

// ===== TIPAGENS =====
interface ItemCarrinho {
  nome: string;
  preco: number;
  qtd: number;
  subtotal: number;
}

// ===== COMPONENTE PRINCIPAL =====
const Pagamento: React.FC = () => {
  const router = useRouter();

  // ===== ESTADOS =====
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([
    { nome: 'Pacote "Cultura e Tradição no Sertão" – Pernambuco', preco: 3200, qtd: 1, subtotal: 3200 },
    { nome: 'Pacote "Amazon Experience" – Amazonas', preco: 4800, qtd: 1, subtotal: 4800 }
  ]);

  const [cupomAtual, setCupomAtual] = useState<string | null>(null);
  const [valorDesconto, setValorDesconto] = useState<number>(0);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('pix');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ===== DADOS DO CLIENTE =====
  const [cliente, setCliente] = useState({
    nome: 'Ana Rodrigues',
    email: 'ana.rodrigues@email.com',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999'
  });

  // ===== FUNÇÕES =====
  const calcularTotal = (): number => {
    let total = 0;
    itensCarrinho.forEach(item => {
      total += item.preco * item.qtd;
    });
    return total;
  };

  const formatarMoeda = (valor: number): string => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  };

  const atualizarResumo = () => {
    const subtotal = calcularTotal();
    let total = subtotal;
    let desconto = 0;

    return { subtotal, total, desconto };
  };

  // ===== FUNÇÃO PARA FINALIZAR PAGAMENTO - NAVEGA PARA CONCLUÍDO =====
  const finalizarCompra = () => {
    const { nome, email, cpf } = cliente;

    if (!nome.trim() || !email.trim() || !cpf.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    Alert.alert(
      'Confirmar Pagamento',
      'Deseja finalizar o pagamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              // Navega para a tela de concluído
              router.push('/concluido');
            }, 1500);
          }
        }
      ]
    );
  };

  const copiarChavePix = () => {
    const chave = 'imercia@email.com';
    Alert.alert('Chave PIX', 'Chave copiada: ' + chave);
  };

  const handleMetodoChange = (metodo: string) => {
    setMetodoPagamento(metodo);
  };

  // ===== RENDER =====
  const { subtotal, total, desconto } = atualizarResumo();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
       

        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>PAGAMENTO</Text>
          <View style={styles.heroDivider} />
        </View>

        {/* BALÃO DE ETAPAS - COM LABELS IGUAL AO CARRINHO */}
        <View style={styles.balaoOverlay}>
          <View style={styles.balao}>
            {/* Etapa 1 - CARRINHO */}
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloAtivo]}>
                <Text style={styles.circuloTexto}>1</Text>
              </View>
            </View>

            <View style={[styles.linhaBalao, styles.linhaAtiva]} />

            {/* Etapa 2 - PAGAMENTO */}
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloAtivo]}>
                <Text style={styles.circuloTexto}>2</Text>
              </View>
            </View>

            <View style={[styles.linhaBalao, styles.linhaInativa]} />

            {/* Etapa 3 - CONCLUÍDO */}
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloInativo]}>
                <Text style={styles.circuloTexto}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PAGAMENTO CONTAINER */}
        <View style={styles.pagamentoContainer}>
          {/* RESUMO DO PEDIDO */}
          <View style={styles.pagamentoCard}>
            <Text style={styles.cardTitle}> Resumo do Pedido</Text>
            
            {itensCarrinho.map((item, index) => (
              <View key={index} style={styles.resumoItem}>
                <Text style={styles.resumoItemText}>
                  {item.nome} <Text style={styles.itemQtd}>(x{item.qtd})</Text>
                </Text>
                <Text style={styles.resumoItemPreco}>{formatarMoeda(item.preco * item.qtd)}</Text>
              </View>
            ))}
            
            <View style={styles.resumoTotalContainer}>
              <Text style={styles.subtotalInfo}>Subtotal</Text>
              <View style={styles.totalContainer}>
                <Text style={styles.totalGrande}>{formatarMoeda(total)}</Text>
              </View>
              <View style={styles.cupomStatus}>
                <Text style={styles.cupomStatusText}>Nenhum cupom aplicado</Text>
              </View>
            </View>
          </View>

          {/* DADOS DE PAGAMENTO */}
          <View style={styles.pagamentoCard}>
            <Text style={styles.cardTitle}> Dados de Pagamento</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome Completo <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                value={cliente.nome}
                onChangeText={(text) => setCliente({ ...cliente, nome: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-mail <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                value={cliente.email}
                onChangeText={(text) => setCliente({ ...cliente, email: text })}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>CPF <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cliente.cpf}
                  onChangeText={(text) => setCliente({ ...cliente, cpf: text })}
                />
              </View>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>Telefone <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  value={cliente.telefone}
                  onChangeText={(text) => setCliente({ ...cliente, telefone: text })}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Método de Pagamento <Text style={styles.required}>*</Text></Text>
              <View style={styles.metodosPagamento}>
                <TouchableOpacity
                  style={[styles.metodoBtn, metodoPagamento === 'pix' && styles.metodoBtnActive]}
                  onPress={() => handleMetodoChange('pix')}
                >
                  <Image 
                    source={pixImage} 
                    style={[
                      styles.metodoImg,
                      metodoPagamento === 'pix' ? styles.metodoImgActive : styles.metodoImgInactive
                    ]} 
                  />
                  <Text style={[styles.metodoText, metodoPagamento === 'pix' && styles.metodoTextActive]}>PIX</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.metodoBtn, metodoPagamento === 'cartao' && styles.metodoBtnActive]}
                  onPress={() => handleMetodoChange('cartao')}
                >
                  <Image 
                    source={cartaoImage} 
                    style={[
                      styles.metodoImg,
                      metodoPagamento === 'cartao' ? styles.metodoImgActive : styles.metodoImgInactive
                    ]} 
                  />
                  <Text style={[styles.metodoText, metodoPagamento === 'cartao' && styles.metodoTextActive]}>Cartão</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.metodoBtn, metodoPagamento === 'boleto' && styles.metodoBtnActive]}
                  onPress={() => handleMetodoChange('boleto')}
                >
                  <Image 
                    source={boletoImage} 
                    style={[
                      styles.metodoImg,
                      metodoPagamento === 'boleto' ? styles.metodoImgActive : styles.metodoImgInactive
                    ]} 
                  />
                  <Text style={[styles.metodoText, metodoPagamento === 'boleto' && styles.metodoTextActive]}>Boleto</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* PIX */}
            {metodoPagamento === 'pix' && (
              <View style={styles.pixInfo}>
                <Text style={styles.pixTitle}> Pague com PIX</Text>
                <Text style={styles.pixSubtitle}>Escaneie o QR Code ou copie a chave</Text>
                <View style={styles.qrCodePlaceholder}>
                  <Text style={styles.qrText}>
                    QR CODE{'\n'}
                    <Text style={styles.qrSimulacao}>(simulação)</Text>
                  </Text>
                </View>
                <View style={styles.pixChaveContainer}>
                  <Text style={styles.chavePix}>imercia@email.com</Text>
                  <TouchableOpacity style={styles.btnCopiar} onPress={copiarChavePix}>
                    <Text style={styles.btnCopiarText}> Copiar chave</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.pixObs}>Após o pagamento, o pedido será confirmado em até 5 minutos</Text>
              </View>
            )}

            {/* CARTÃO */}
            {metodoPagamento === 'cartao' && (
              <View style={styles.cartaoInfo}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número do Cartão</Text>
                  <TextInput style={styles.input} placeholder="0000 0000 0000 0000" keyboardType="numeric" />
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, styles.formGroupHalf]}>
                    <Text style={styles.label}>Validade</Text>
                    <TextInput style={styles.input} placeholder="MM/AA" />
                  </View>
                  <View style={[styles.formGroup, styles.formGroupHalf]}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput style={styles.input} placeholder="123" keyboardType="numeric" secureTextEntry />
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nome no Cartão</Text>
                  <TextInput style={styles.input} placeholder="Nome como está no cartão" />
                </View>
              </View>
            )}

            {/* BOLETO */}
            {metodoPagamento === 'boleto' && (
              <View style={styles.boletoInfo}>
                <Text style={styles.boletoTitle}> Boleto Bancário</Text>
                <Text style={styles.boletoSubtitle}>O boleto será gerado após a confirmação</Text>
                <View style={styles.boletoDados}>
                  <Text style={styles.boletoBanco}>Banco: 001 - Itaú</Text>
                  <Text style={styles.boletoVencimento}>Vencimento: 5 dias úteis</Text>
                </View>
                <Text style={styles.boletoObs}>O boleto será enviado para seu e-mail</Text>
              </View>
            )}

            {/* BOTÃO FINALIZAR PAGAMENTO - NAVEGA PARA CONCLUÍDO */}
            <TouchableOpacity
              style={[styles.btnFinalizar, isLoading && styles.btnFinalizarDisabled]}
              onPress={finalizarCompra}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnFinalizarText}> Finalizar Pagamento</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnVoltar} onPress={() => router.push('/carrinho')}>
              <Text style={styles.btnVoltarText}>Voltar ao carrinho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0eb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2c1810',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#f5a623',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  heroBanner: {
    backgroundColor: '#584128',
    padding: 30,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#f5a623',
    marginTop: 8,
    borderRadius: 4,
  },
  // ===== BALÃO DE ETAPAS =====
  balaoOverlay: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  balao: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0ebe3',
  },
  bolinha: {
    alignItems: 'center',
    gap: 4,
  },
  circulo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloAtivo: {
    backgroundColor: '#f5a623',
    shadowColor: '#f5a623',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  circuloInativo: {
    backgroundColor: '#e8e0d8',
  },
  circuloTexto: {
    color: '#2c1810',
    fontWeight: '700',
    fontSize: 14,
  },
  label: {
    fontSize: 10,
    color: '#2c1810',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  linhaBalao: {
    width: 30,
    height: 2,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  linhaAtiva: {
    backgroundColor: '#f5a623',
  },
  linhaInativa: {
    backgroundColor: '#e8e0d8',
  },
  // ===== FIM BALÃO =====
  pagamentoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  pagamentoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#A59B85',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c1810',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#e8e0d8',
    paddingBottom: 12,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0d8',
  },
  resumoItemText: {
    color: '#2c1810',
    fontSize: 14,
    flex: 1,
  },
  itemQtd: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  resumoItemPreco: {
    color: '#2c1810',
    fontSize: 14,
    fontWeight: '600',
  },
  resumoTotalContainer: {
    borderTopWidth: 2,
    borderTopColor: '#e8e0d8',
    paddingTop: 16,
    marginTop: 8,
  },
  subtotalInfo: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  totalGrande: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c1810',
  },
  cupomStatus: {
    marginTop: 8,
  },
  cupomStatusText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2c1810',
    marginBottom: 6,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e8e0d8',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#faf8f5',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metodosPagamento: {
    flexDirection: 'row',
    gap: 12,
  },
  metodoBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e8e0d8',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#faf8f5',
  },
  metodoBtnActive: {
    borderColor: '#584128',
    backgroundColor: '#584128',
  },
  metodoImg: {
    width: 32,
    height: 32,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  metodoImgActive: {
    tintColor: '#FFFFFF',
  },
  metodoImgInactive: {
    tintColor: '#000000',
  },
  metodoText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#2c1810',
  },
  metodoTextActive: {
    color: '#FFF',
  },
  pixInfo: {
    backgroundColor: '#f8f6f2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#584128',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  pixTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2c1810',
  },
  pixSubtitle: {
    color: '#7f8c8d',
    fontSize: 14,
    marginTop: 4,
  },
  qrCodePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#e8e0d8',
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7f8c8d',
  },
  qrSimulacao: {
    fontSize: 12,
  },
  pixChaveContainer: {
    alignItems: 'center',
  },
  chavePix: {
    fontFamily: 'Courier New',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c1810',
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e0d8',
  },
  btnCopiar: {
    backgroundColor: '#584128',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  btnCopiarText: {
    color: '#FFF',
    fontWeight: '600',
  },
  pixObs: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 8,
  },
  cartaoInfo: {
    marginTop: 16,
  },
  boletoInfo: {
    backgroundColor: '#f8f6f2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  boletoTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2c1810',
  },
  boletoSubtitle: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  boletoDados: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e8e0d8',
    width: '100%',
    alignItems: 'center',
  },
  boletoBanco: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#2c1810',
  },
  boletoVencimento: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#7f8c8d',
  },
  boletoObs: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  btnFinalizar: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  btnFinalizarDisabled: {
    opacity: 0.5,
  },
  btnFinalizarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnVoltar: {
    borderWidth: 2,
    borderColor: '#584128',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  btnVoltarText: {
    color: '#584128',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Pagamento;