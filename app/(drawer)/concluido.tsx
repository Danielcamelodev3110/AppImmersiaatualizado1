// Concluido.tsx - Tela de Confirmação Baseada no HTML
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// ===== TIPAGENS =====
interface ItemPedido {
  nome: string;
  preco: number;
  qtd: number;
}

interface Pedido {
  numero: string;
  data: string;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  total: number;
  cupom: string | null;
  cliente: {
    nome: string;
    email: string;
  };
  metodo: string;
}

// ===== COMPONENTE PRINCIPAL =====
const Concluido: React.FC = () => {
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  // ===== FUNÇÕES =====
  const formatarMoeda = (valor: number): string => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  };

  const getMetodoLabel = (metodo: string): string => {
    const labels: { [key: string]: string } = {
      pix: ' PIX',
      cartao: ' Cartão de Crédito',
      boleto: ' Boleto Bancário'
    };
    return labels[metodo] || metodo;
  };

  const carregarPedido = () => {
    // Tenta recuperar o pedido do localStorage
    const pedidoSalvo = localStorage.getItem('ultimoPedido');

    if (!pedidoSalvo) {
      // Dados de exemplo para demonstração
      const pedidoExemplo: Pedido = {
        numero: 'IM' + String(Date.now()).slice(-6),
        data: new Date().toLocaleDateString('pt-BR'),
        itens: [
          { nome: 'Pacote "Cultura e Tradição no Sertão" – Pernambuco', preco: 3200, qtd: 1 },
          { nome: 'Pacote "Amazon Experience" – Amazonas', preco: 4800, qtd: 1 }
        ],
        subtotal: 8000,
        desconto: 0,
        total: 8000,
        cupom: null,
        cliente: { nome: 'Ana Rodrigues', email: 'ana.rodrigues@email.com' },
        metodo: 'pix'
      };
      setPedido(pedidoExemplo);
      return;
    }

    try {
      const pedidoData: Pedido = JSON.parse(pedidoSalvo);
      setPedido(pedidoData);
    } catch (e) {
      console.error('Erro ao carregar pedido:', e);
      // Dados de exemplo em caso de erro
      const pedidoExemplo: Pedido = {
        numero: 'IM' + String(Date.now()).slice(-6),
        data: new Date().toLocaleDateString('pt-BR'),
        itens: [
          { nome: 'Pacote "Cultura e Tradição no Sertão" – Pernambuco', preco: 3200, qtd: 1 },
          { nome: 'Pacote "Amazon Experience" – Amazonas', preco: 4800, qtd: 1 }
        ],
        subtotal: 8000,
        desconto: 0,
        total: 8000,
        cupom: null,
        cliente: { nome: 'Ana Rodrigues', email: 'ana.rodrigues@email.com' },
        metodo: 'pix'
      };
      setPedido(pedidoExemplo);
    }
  };

  useEffect(() => {
    carregarPedido();
  }, []);

  if (!pedido) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
      

        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>CONCLUÍDO</Text>
          <View style={styles.heroDivider} />
        </View>

        {/* BALÃO DE ETAPAS */}
        <View style={styles.balaoOverlay}>
          <View style={styles.balao}>
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloAtivo]}>
                <Text style={styles.circuloTexto}>1</Text>
              </View>
            </View>
            <View style={[styles.linhaBalao, styles.linhaAtiva]} />
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloAtivo]}>
                <Text style={styles.circuloTexto}>2</Text>
              </View>
            </View>
            <View style={[styles.linhaBalao, styles.linhaAtiva]} />
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloAtivo]}>
                <Text style={styles.circuloTexto}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.concluidoContainer}>
          {/* ÍCONE DE SUCESSO */}
          <View style={styles.iconeContainer}>
            <View style={styles.iconeGrande}>
              <Feather name="check-circle" size={80} color="#27ae60" />
            </View>
          </View>

          <Text style={styles.title}>Compra Finalizada!</Text>
          <Text style={styles.subtitle}>
            Obrigado por comprar com a <Text style={styles.destaque}>Immercia</Text>! Sua viagem dos sonhos está mais perto.
          </Text>
          <Text style={styles.emailInfo}>
             Um e-mail de confirmação foi enviado para seu endereço.
          </Text>

          {/* NÚMERO DO PEDIDO */}
          <View style={styles.numeroPedido}>
            <Text style={styles.numeroPedidoText}>#{pedido.numero}</Text>
          </View>

          {/* DETALHES DO PEDIDO */}
          <View style={styles.detalhesPedido}>
            <Text style={styles.detalhesTitle}>Detalhes do Pedido</Text>
            
            {pedido.itens.map((item, index) => (
              <View key={index} style={styles.itemPedido}>
                <Text style={styles.itemNome}>
                  {item.nome} <Text style={styles.itemQtd}>(x{item.qtd})</Text>
                </Text>
                <Text style={styles.itemPreco}>{formatarMoeda(item.preco * item.qtd)}</Text>
              </View>
            ))}

            {pedido.desconto && pedido.desconto > 0 && (
              <View style={[styles.itemPedido, styles.itemDesconto]}>
                <Text style={styles.itemNome}>
                  🎯 Desconto ({pedido.cupom || 'Cupom'})
                </Text>
                <Text style={styles.itemPrecoDesconto}>- {formatarMoeda(pedido.desconto)}</Text>
              </View>
            )}

            <View style={styles.totalFinal}>
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>{formatarMoeda(pedido.total)}</Text>
            </View>

            <View style={styles.metodoPagamento}>
              <Text style={styles.metodoLabel}>Pagamento via:</Text>
              <Text style={styles.metodoValue}>{getMetodoLabel(pedido.metodo)}</Text>
            </View>
          </View>

          {/* BOTÕES */}
          <View style={styles.botoesAcoes}>
            <TouchableOpacity 
              style={styles.btnHome}
              onPress={() => router.push('/')}
            >
              <Feather name="home" size={20} color="#FFF" />
              <Text style={styles.btnHomeText}>Voltar para Home</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0eb',
  },
  loadingText: {
    fontSize: 18,
    color: '#584128',
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
  concluidoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 30,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#A59B85',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconeGrande: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d5f5e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c1810',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  destaque: {
    fontWeight: 'bold',
    color: '#584128',
  },
  emailInfo: {
    fontSize: 15,
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  numeroPedido: {
    backgroundColor: '#f8f6f2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e8e0d8',
    marginBottom: 16,
  },
  numeroPedidoText: {
    fontFamily: 'Courier New, monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c1810',
  },
  detalhesPedido: {
    backgroundColor: '#f8f6f2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  detalhesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c1810',
    fontFamily: 'Georgia, serif',
    marginBottom: 12,
  },
  itemPedido: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0d8',
  },
  itemDesconto: {
    borderBottomColor: '#27ae60',
  },
  itemNome: {
    fontSize: 14,
    color: '#2c1810',
    flex: 1,
  },
  itemQtd: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c1810',
  },
  itemPrecoDesconto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#2c1810',
  },
  totalFinalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c1810',
  },
  totalFinalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  metodoPagamento: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e0d8',
  },
  metodoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  metodoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c1810',
  },
  segurancaInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  botoesAcoes: {
    gap: 12,
  },
  btnHome: {
    backgroundColor: '#584128',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  btnHomeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnViagens: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  btnViagensText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Concluido;