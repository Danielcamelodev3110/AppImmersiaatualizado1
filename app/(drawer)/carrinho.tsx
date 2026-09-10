// Carrinho.tsx - Conectado ao CarrinhoContext (itens reais, não mais mockados)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

// 👇 ajuste o caminho conforme a localização real do seu CarrinhoContext
import { useCarrinho } from "../../constants/CarrinhoContext";

// ===== IMAGENS DAS RECOMENDAÇÕES (mantidas como estavam) =====
const canecaImage = require("../../assets/images/caneca.jpg");
const portaRetratoImage = require("../../assets/images/portaretrato.jpg");
const chaveiroImage = require("../../assets/images/tag.jpg");
const blusaImage = require("../../assets/images/blusa.webp");

interface Recomendacao {
  id: number;
  nome: string;
  preco: number;
  imagem: any;
}

// 👇 NOVO: converte "AAAA-MM-DD" (formato salvo no carrinho) pro
// formato brasileiro "DD/MM/AAAA", só pra exibição
const formatarDataISOParaBR = (dataISO?: string): string => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};

const Carrinho: React.FC = () => {
  const router = useRouter();

  // 👇 NOVO: itens reais do carrinho, vindos do contexto (o mesmo que a
  // tela de hospedagens usa em "adicionarAoCarrinho"). Antes essa tela
  // ignorava completamente o contexto e usava um array fixo — por isso
  // nada adicionado em hospedagens aparecia aqui.
  const {
    itens,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    totalPreco,
  } = useCarrinho();

  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
  const [desconto, setDesconto] = useState(0);
  const [cupomFeedback, setCupomFeedback] = useState({
    mensagem: "",
    tipo: "",
  });

  const recomendacoes: Recomendacao[] = [
    { id: 1, nome: "Caneca Personalizada", preco: 39.9, imagem: canecaImage },
    {
      id: 2,
      nome: "Porta-retrato vídeo",
      preco: 49.9,
      imagem: portaRetratoImage,
    },
    { id: 3, nome: "Chaveiro com TAG", preco: 19.9, imagem: chaveiroImage },
    { id: 4, nome: "Blusa Personalizada", preco: 59.9, imagem: blusaImage },
  ];

  // ===== FUNÇÕES =====
  // 👇 ATUALIZADO: total agora vem direto do contexto, calculado a
  // partir dos itens reais (preco * quantidade de cada um)
  const calcularTotal = (): number => totalPreco;

  const calcularTotalComDesconto = (): number => {
    const total = calcularTotal();
    return total - (total * desconto) / 100;
  };

  const aplicarCupom = () => {
    const codigo = cupom.trim().toUpperCase();

    if (codigo === "IMERCIA10") {
      setCupomAplicado(codigo);
      setDesconto(10);
      setCupomFeedback({
        mensagem: "Cupom aplicado com sucesso! 10% de desconto",
        tipo: "success",
      });
      setCupom("");
    } else if (codigo === "IMERCIA20") {
      setCupomAplicado(codigo);
      setDesconto(20);
      setCupomFeedback({
        mensagem: "Cupom aplicado com sucesso! 20% de desconto",
        tipo: "success",
      });
      setCupom("");
    } else if (codigo === "") {
      setCupomFeedback({
        mensagem: "Digite um código de cupom",
        tipo: "error",
      });
    } else {
      setCupomFeedback({
        mensagem: "Código inválido. Tente novamente.",
        tipo: "error",
      });
    }

    setTimeout(() => {
      setCupomFeedback({ mensagem: "", tipo: "" });
    }, 3000);
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setDesconto(0);
  };

  const finalizarCompra = () => {
    if (itens.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione itens ao carrinho antes de finalizar.",
      );
      return;
    }
    router.push("/pagamento");
  };

  const total = calcularTotalComDesconto();

  // ===== RENDERIZAÇÃO =====
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>CARRINHO</Text>
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
              <View style={[styles.circulo, styles.circuloInativo]}>
                <Text style={styles.circuloTexto}>2</Text>
              </View>
            </View>
            <View style={[styles.linhaBalao, styles.linhaInativa]} />
            <View style={styles.bolinha}>
              <View style={[styles.circulo, styles.circuloInativo]}>
                <Text style={styles.circuloTexto}>3</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {/* PRODUTOS */}
          <View style={styles.produtosSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Produtos ({itens.length})</Text>
              {itens.length > 0 && (
                <TouchableOpacity
                  onPress={limparCarrinho}
                  style={styles.btnLimpar}
                >
                  <Text style={styles.btnLimparText}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>

            {itens.length === 0 ? (
              <View style={styles.carrinhoVazio}>
                <Text style={styles.vazioIcon}>🛒</Text>
                <Text style={styles.vazioTitle}>Seu carrinho está vazio</Text>
                <Text style={styles.vazioSubtitle}>
                  Que tal explorar nossas ofertas?
                </Text>
                <TouchableOpacity
                  style={styles.btnContinuarComprando}
                  onPress={() => router.push("/")}
                >
                  <Text style={styles.btnContinuarComprandoText}>
                    Continuar Comprando
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {itens.map((item) => {
                  // 👇 só itens de hospedagem carregam essas datas
                  const temPeriodo =
                    !!item.produto.data_checkin && !!item.produto.data_checkout;

                  return (
                    <View key={item.produto.id} style={styles.produtoCard}>
                      <View style={styles.produtoImagem}>
                        {item.produto.imagem_url ? (
                          <Image
                            source={{
                              uri: item.produto.imagem_url.split(",")[0],
                            }}
                            style={styles.produtoImg}
                          />
                        ) : (
                          <View
                            style={[
                              styles.produtoImg,
                              styles.produtoImgPlaceholder,
                            ]}
                          >
                            <Feather name="image" size={28} color="#AAA" />
                          </View>
                        )}
                      </View>

                      <View style={styles.produtoInfo}>
                        <Text style={styles.produtoNome} numberOfLines={2}>
                          {item.produto.nome}
                        </Text>

                        {/* 👇 mostra o período reservado, quando existir */}
                        {temPeriodo && (
                          <View style={styles.produtoDatasBtn}>
                            <Feather
                              name="calendar"
                              size={13}
                              color="#584128"
                            />
                            <Text style={styles.produtoDatas}>
                              {" "}
                              {formatarDataISOParaBR(
                                item.produto.data_checkin,
                              )}{" "}
                              até{" "}
                              {formatarDataISOParaBR(
                                item.produto.data_checkout,
                              )}
                            </Text>
                          </View>
                        )}

                        <View style={styles.produtoActions}>
                          <View style={styles.produtoQuantidade}>
                            <TouchableOpacity
                              onPress={() =>
                                atualizarQuantidade(
                                  item.produto.id,
                                  Math.max(1, item.quantidade - 1),
                                )
                              }
                              style={[
                                styles.qtdBtn,
                                item.quantidade <= 1 && styles.qtdBtnDisabled,
                              ]}
                              disabled={item.quantidade <= 1}
                            >
                              <Text style={styles.qtdBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtdNumero}>
                              {item.quantidade}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                atualizarQuantidade(
                                  item.produto.id,
                                  item.quantidade + 1,
                                )
                              }
                              style={styles.qtdBtn}
                            >
                              <Text style={styles.qtdBtnText}>+</Text>
                            </TouchableOpacity>
                            {temPeriodo && (
                              <Text style={styles.qtdLabel}>noite(s)</Text>
                            )}
                          </View>

                          <View style={styles.produtoPreco}>
                            <Text style={styles.precoTotal}>
                              R${" "}
                              {(item.produto.preco * item.quantidade)
                                .toFixed(2)
                                .replace(".", ",")}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => removerDoCarrinho(item.produto.id)}
                        style={styles.btnRemover}
                      >
                        <Text style={styles.btnRemoverText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </>
            )}

            {/* RECOMENDAÇÕES (continuam estáticas, não fazem parte do carrinho real) */}
            <View style={styles.recomendacoes}>
              <Text style={styles.recomendacoesTitle}>
                {" "}
                Você também pode gostar
              </Text>
              <View style={styles.recomendacoesGrid}>
                {recomendacoes.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recomendacaoCard}
                  >
                    <Image
                      source={item.imagem}
                      style={styles.recomendacaoImagem}
                    />
                    <Text style={styles.recomendacaoNome}>{item.nome}</Text>
                    <View style={styles.recomendacaoPreco}>
                      <Text style={styles.recomendacaoPrecoText}>
                        R$ {item.preco.toFixed(2).replace(".", ",")}
                      </Text>
                      <TouchableOpacity style={styles.btnAdicionar}>
                        <Text style={styles.btnAdicionarText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* RESUMO */}
          <View style={styles.resumoSection}>
            <Text style={styles.resumoTitle}>Resumo do Pedido</Text>

            <View style={styles.resumoItens}>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoLinhaLabel}>Subtotal</Text>
                <Text style={styles.resumoLinhaValor}>
                  R$ {calcularTotal().toFixed(2).replace(".", ",")}
                </Text>
              </View>

              <View style={styles.resumoCupom}>
                <View style={styles.cupomInputWrapper}>
                  <TextInput
                    style={styles.cupomInput}
                    placeholder="Código do cupom"
                    placeholderTextColor="#999"
                    value={cupom}
                    onChangeText={setCupom}
                    editable={!cupomAplicado}
                  />
                  <TouchableOpacity
                    style={[
                      styles.btnAplicarCupom,
                      cupomAplicado && styles.btnAplicarCupomDisabled,
                    ]}
                    onPress={aplicarCupom}
                    disabled={!!cupomAplicado}
                  >
                    <Text style={styles.btnAplicarCupomText}>Aplicar</Text>
                  </TouchableOpacity>
                </View>

                {cupomFeedback.mensagem && (
                  <Text
                    style={[
                      styles.cupomFeedback,
                      cupomFeedback.tipo === "success"
                        ? styles.cupomFeedbackSuccess
                        : styles.cupomFeedbackError,
                    ]}
                  >
                    {cupomFeedback.mensagem}
                  </Text>
                )}

                {cupomAplicado && (
                  <View style={styles.cupomAplicado}>
                    <Text style={styles.cupomAplicadoText}>
                      {cupomAplicado} - {desconto}% OFF
                    </Text>
                    <TouchableOpacity onPress={removerCupom}>
                      <Text style={styles.cupomRemover}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {desconto > 0 && (
                <View style={[styles.resumoLinha, styles.resumoLinhaDesconto]}>
                  <Text style={styles.resumoLinhaLabel}>Desconto</Text>
                  <Text style={styles.resumoLinhaValor}>
                    - R${" "}
                    {((calcularTotal() * desconto) / 100)
                      .toFixed(2)
                      .replace(".", ",")}
                  </Text>
                </View>
              )}

              <View style={styles.resumoTotal}>
                <Text style={styles.resumoTotalLabel}>Total</Text>
                <Text style={styles.totalValor}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </Text>
              </View>

              <Text style={styles.resumoParcelas}>
                ou em até 12x de R$ {(total / 12).toFixed(2).replace(".", ",")}{" "}
                sem juros
              </Text>
            </View>

            <View style={styles.resumoAcoes}>
              <TouchableOpacity
                style={[
                  styles.btnFinalizar,
                  itens.length === 0 && styles.btnFinalizarDisabled,
                ]}
                onPress={finalizarCompra}
                disabled={itens.length === 0}
              >
                <Text style={styles.btnFinalizarText}>Finalizar Compra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnContinuar}
                onPress={() => router.push("/")}
              >
                <Text style={styles.btnContinuarText}>Continuar Comprando</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resumoSeguranca}>
              <Text style={styles.resumoSegurancaText}> Compra segura</Text>
              <Text style={styles.resumoSegurancaText}>
                🔄 Pagamento protegido
              </Text>
            </View>
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
    backgroundColor: "#f5f0eb",
  },
  scrollView: {
    flex: 1,
  },
  heroBanner: {
    backgroundColor: "#584128",
    padding: 30,
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  heroDivider: {
    width: 60,
    height: 4,
    backgroundColor: "#f5a623",
    marginTop: 8,
    borderRadius: 4,
  },
  balaoOverlay: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  balao: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f0ebe3",
  },
  bolinha: {
    alignItems: "center",
    gap: 4,
  },
  circulo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  circuloAtivo: {
    backgroundColor: "#f5a623",
    shadowColor: "#f5a623",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  circuloInativo: {
    backgroundColor: "#e8e0d8",
  },
  circuloTexto: {
    color: "#2c1810",
    fontWeight: "700",
    fontSize: 14,
  },
  linhaBalao: {
    width: 30,
    height: 2,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  linhaAtiva: {
    backgroundColor: "#f5a623",
  },
  linhaInativa: {
    backgroundColor: "#e8e0d8",
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  produtosSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#f0ebe3",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c1810",
  },
  btnLimpar: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnLimparText: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "600",
  },
  carrinhoVazio: {
    alignItems: "center",
    paddingVertical: 30,
  },
  vazioIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  vazioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c1810",
  },
  vazioSubtitle: {
    color: "#7f8c8d",
    marginVertical: 8,
  },
  btnContinuarComprando: {
    backgroundColor: "#584128",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnContinuarComprandoText: {
    color: "#FFF",
    fontWeight: "600",
  },
  produtoCard: {
    backgroundColor: "#faf8f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    position: "relative",
    flexDirection: "column",
    gap: 8,
  },
  produtoImagem: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0ebe3",
  },
  produtoImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  produtoImgPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c1810",
    marginBottom: 4,
  },
  produtoDatasBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  produtoDatas: {
    fontSize: 13,
    color: "#95a5a6",
  },
  produtoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  produtoQuantidade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtdBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  qtdBtnDisabled: {
    opacity: 0.3,
  },
  qtdBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qtdNumero: {
    fontWeight: "600",
    minWidth: 25,
    textAlign: "center",
    fontSize: 16,
  },
  qtdLabel: {
    fontSize: 12,
    color: "#95a5a6",
    marginLeft: 2,
  },
  produtoPreco: {
    alignItems: "flex-end",
  },
  precoTotal: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2c1810",
  },
  btnRemover: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRemoverText: {
    fontSize: 18,
    color: "#95a5a6",
  },
  recomendacoes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#f0ebe3",
  },
  recomendacoesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c1810",
    marginBottom: 12,
  },
  recomendacoesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recomendacaoCard: {
    backgroundColor: "#faf8f5",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e6ddd2",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  recomendacaoImagem: {
    width: "100%",
    height: 80,
    borderRadius: 6,
    resizeMode: "cover",
  },
  recomendacaoNome: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2c1810",
    marginTop: 4,
    textAlign: "center",
  },
  recomendacaoPreco: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  recomendacaoPrecoText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#2c1810",
  },
  btnAdicionar: {
    backgroundColor: "#584128",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAdicionarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resumoSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c1810",
    marginBottom: 16,
  },
  resumoItens: {
    gap: 8,
  },
  resumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  resumoLinhaDesconto: {
    color: "#27ae60",
  },
  resumoLinhaLabel: {
    fontSize: 14,
    color: "#2c1810",
  },
  resumoLinhaValor: {
    fontSize: 14,
    color: "#2c1810",
  },
  resumoCupom: {
    marginVertical: 4,
  },
  cupomInputWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  cupomInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#e8e0d8",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#faf8f5",
    color: "#2c1810",
  },
  btnAplicarCupom: {
    backgroundColor: "#584128",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: "center",
  },
  btnAplicarCupomDisabled: {
    opacity: 0.5,
  },
  btnAplicarCupomText: {
    color: "#FFF",
    fontWeight: "600",
  },
  cupomFeedback: {
    fontSize: 12,
    padding: 4,
    marginTop: 4,
    borderRadius: 4,
  },
  cupomFeedbackSuccess: {
    color: "#1a7a42",
    backgroundColor: "#d5f5e3",
  },
  cupomFeedbackError: {
    color: "#922b21",
    backgroundColor: "#fadbd8",
  },
  cupomAplicado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#d5f5e3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  cupomAplicadoText: {
    fontWeight: "600",
    color: "#1a7a42",
  },
  cupomRemover: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
  },
  resumoTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: "#f0ebe3",
    marginTop: 8,
  },
  resumoTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c1810",
  },
  totalValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#584128",
  },
  resumoParcelas: {
    textAlign: "center",
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  resumoAcoes: {
    gap: 8,
    marginTop: 16,
  },
  btnFinalizar: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnFinalizarDisabled: {
    opacity: 0.5,
  },
  btnFinalizarText: {
    color: "#fcfbfb",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnContinuar: {
    borderWidth: 2,
    borderColor: "#584128",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnContinuarText: {
    color: "#584128",
    fontWeight: "600",
    fontSize: 14,
  },
  resumoSeguranca: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  resumoSegurancaText: {
    fontSize: 12,
    color: "#7f8c8d",
  },
});

export default Carrinho;
