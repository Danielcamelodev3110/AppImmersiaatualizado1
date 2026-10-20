import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🔧 Ajuste os caminhos conforme a pasta onde esse arquivo ficar
// (aqui segui o mesmo padrão de hospedagens.tsx e experiencias.tsx).
import { useCarrinho } from "../../../constants/CarrinhoContext";
import { produtoService } from "../../../services/ProdutoService";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  categoria?: string;
  localizacao?: string;
  quantidade_estoque: number;
  status: string;
  tipo_produto: string;
  imagem_url: string[];
}

const ETAPAS = ["Hospedagem", "Experiências", "Resumo"];

const IMAGEM_PADRAO = require("../../../assets/images/imagem-fundo-immersia.png");

// Alert.alert não mostra nada visível no Expo Web — usa window.alert lá.
const mostrarAviso = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const normalizarImagens = (imagemUrl: any): string[] => {
  if (!imagemUrl) return [];

  if (Array.isArray(imagemUrl)) {
    return imagemUrl.filter(
      (url) => url && typeof url === "string" && url.trim() !== "",
    );
  }

  if (typeof imagemUrl === "string") {
    try {
      const parsed = JSON.parse(imagemUrl);
      if (Array.isArray(parsed)) {
        return parsed.filter((url) => url && url.trim() !== "");
      }
    } catch (e) {}

    if (imagemUrl.includes(",")) {
      return imagemUrl.split(",").map((url: string) => url.trim());
    }

    if (imagemUrl.trim()) {
      return [imagemUrl.trim()];
    }
  }

  return [];
};

const formatarPreco = (valor: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);

const formatarDataBR = (date: Date | null): string => {
  if (!date) return "Selecionar";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Date -> "YYYY-MM-DD" (formato que o backend espera)
const formatarDataISO = (date: Date): string => {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Próximos N dias, sempre à meia-noite, pra o calendário
const gerarDias = (quantidade = 120): Date[] => {
  const hoje = new Date();
  return Array.from(
    { length: quantidade },
    (_, i) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i),
  );
};

const calcularDiarias = (entrada: Date | null, saida: Date | null): number => {
  if (!entrada || !saida) return 0;
  const diff = Math.round((saida.getTime() - entrada.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
};

export default function PacotesScreen() {
  const router = useRouter();
  const { adicionarAoCarrinho: adicionarNoContexto } = useCarrinho();

  const [etapa, setEtapa] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  const [hospedagens, setHospedagens] = useState<Produto[]>([]);
  const [experiencias, setExperiencias] = useState<Produto[]>([]);

  // Escolhas do cliente
  const [hospedagemSel, setHospedagemSel] = useState<Produto | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  // id da experiência -> quantidade de vagas
  const [experienciasSel, setExperienciasSel] = useState<
    Record<number, number>
  >({});

  // Calendário
  const [modalCalendario, setModalCalendario] = useState(false);
  const [tipoData, setTipoData] = useState<"checkin" | "checkout">("checkin");
  const dias = useMemo(() => gerarDias(120), []);

  useEffect(() => {
    (async () => {
      try {
        const data = await produtoService.findAll();

        // O backend só aceita reservar produto com status "disponivel",
        // então já escondemos o que não está disponível.
        const normalizados: Produto[] = data
          .filter((p: any) => p.status === "disponivel")
          .map((p: any) => ({
            ...p,
            imagem_url: normalizarImagens(p.imagem_url),
          }));

        setHospedagens(
          normalizados.filter((p) => p.tipo_produto === "hospedagem"),
        );
        setExperiencias(
          normalizados.filter((p) => p.tipo_produto === "experiencia"),
        );
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        mostrarAviso("Erro", "Não foi possível carregar as opções do pacote.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  // ===== CÁLCULOS =====
  const diarias = calcularDiarias(checkIn, checkOut);
  const totalHospedagem = hospedagemSel ? hospedagemSel.preco * diarias : 0;

  const experienciasSelecionadas = experiencias
    .filter((exp) => experienciasSel[exp.id] !== undefined)
    .map((exp) => ({ produto: exp, quantidade: experienciasSel[exp.id] }));

  const totalExperiencias = experienciasSelecionadas.reduce(
    (soma, item) => soma + item.produto.preco * item.quantidade,
    0,
  );

  const totalPacote = totalHospedagem + totalExperiencias;

  // ===== CALENDÁRIO =====
  const abrirCalendario = (tipo: "checkin" | "checkout") => {
    if (tipo === "checkout" && !checkIn) {
      mostrarAviso("Atenção", "Selecione primeiro a data de check-in.");
      return;
    }
    setTipoData(tipo);
    setModalCalendario(true);
  };

  const selecionarData = (data: Date) => {
    if (tipoData === "checkin") {
      setCheckIn(data);
      if (checkOut && data.getTime() >= checkOut.getTime()) {
        setCheckOut(null);
      }
    } else {
      setCheckOut(data);
    }
    setModalCalendario(false);
  };

  // ===== EXPERIÊNCIAS =====
  const alternarExperiencia = (exp: Produto) => {
    setExperienciasSel((atual) => {
      const copia = { ...atual };
      if (copia[exp.id] !== undefined) {
        delete copia[exp.id];
      } else {
        copia[exp.id] = 1;
      }
      return copia;
    });
  };

  const alterarQuantidade = (exp: Produto, delta: number) => {
    setExperienciasSel((atual) => {
      const quantidadeAtual = atual[exp.id];
      if (quantidadeAtual === undefined) return atual;
      const nova = Math.min(
        exp.quantidade_estoque,
        Math.max(1, quantidadeAtual + delta),
      );
      return { ...atual, [exp.id]: nova };
    });
  };

  // ===== NAVEGAÇÃO ENTRE ETAPAS =====
  const etapaCompleta = (() => {
    if (etapa === 0) {
      return (
        !!hospedagemSel &&
        diarias > 0 &&
        diarias <= hospedagemSel.quantidade_estoque
      );
    }
    if (etapa === 1) return experienciasSelecionadas.length > 0;
    return true;
  })();

  const avancar = () => {
    if (etapa === 0) {
      if (!checkIn || !checkOut) {
        mostrarAviso("Atenção", "Selecione as datas de check-in e check-out.");
        return;
      }
      if (!hospedagemSel) {
        mostrarAviso("Atenção", "Escolha uma hospedagem pro seu pacote.");
        return;
      }
      if (diarias > hospedagemSel.quantidade_estoque) {
        mostrarAviso(
          "Indisponível",
          `Essa hospedagem tem só ${hospedagemSel.quantidade_estoque} diária(s) disponível(is).`,
        );
        return;
      }
    }

    if (etapa === 1 && experienciasSelecionadas.length === 0) {
      mostrarAviso(
        "Atenção",
        "Escolha pelo menos uma experiência pro seu pacote.",
      );
      return;
    }

    setEtapa((atual) => Math.min(2, atual + 1));
  };

  const voltar = () => {
    if (etapa === 0) {
      router.back();
    } else {
      setEtapa((atual) => atual - 1);
    }
  };

  // ===== ADICIONAR AO CARRINHO =====
  const adicionarPacoteAoCarrinho = async () => {
    if (adicionando) return;
    if (!hospedagemSel || !checkIn || !checkOut) return;

    const token = await AsyncStorage.getItem("@Immersia:token");
    if (!token) {
      mostrarAviso(
        "Faça login",
        "Você precisa estar logado para adicionar o pacote ao carrinho.",
      );
      router.push("/login");
      return;
    }

    setAdicionando(true);

    // A hospedagem entra com as datas e a quantidade = número de diárias
    adicionarNoContexto(
      {
        id: hospedagemSel.id,
        nome: hospedagemSel.nome,
        preco: hospedagemSel.preco,
        imagem_url: hospedagemSel.imagem_url?.[0],
        tipo_produto: "hospedagem",
        data_checkin: formatarDataISO(checkIn),
        data_checkout: formatarDataISO(checkOut),
      },
      diarias,
    );

    // Cada experiência entra com a quantidade de vagas escolhida
    experienciasSelecionadas.forEach(({ produto, quantidade }) => {
      adicionarNoContexto(
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem_url: produto.imagem_url?.[0],
          tipo_produto: "experiencia",
          data_checkin: undefined,
          data_checkout: undefined,
        },
        quantidade,
      );
    });

    // Limpa o montador pra poder criar outro pacote depois
    setEtapa(0);
    setHospedagemSel(null);
    setCheckIn(null);
    setCheckOut(null);
    setExperienciasSel({});
    setAdicionando(false);

    // 🔧 Ajuste se o caminho da tela de carrinho no seu projeto for outro
    router.push("../carrinho");
  };

  // ===== RENDER: INDICADOR DE ETAPAS =====
  const renderEtapas = () => (
    <View style={styles.etapasContainer}>
      {ETAPAS.map((nome, index) => {
        const ativa = index === etapa;
        const concluida = index < etapa;
        return (
          <React.Fragment key={nome}>
            <View style={styles.etapaItem}>
              <View
                style={[
                  styles.etapaCirculo,
                  (ativa || concluida) && styles.etapaCirculoAtivo,
                ]}
              >
                {concluida ? (
                  <Feather name="check" size={14} color="#FFF" />
                ) : (
                  <Text
                    style={[
                      styles.etapaNumero,
                      (ativa || concluida) && styles.etapaNumeroAtivo,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[styles.etapaLabel, ativa && styles.etapaLabelAtivo]}
              >
                {nome}
              </Text>
            </View>
            {index < ETAPAS.length - 1 && (
              <View
                style={[styles.etapaLinha, concluida && styles.etapaLinhaAtiva]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  // ===== RENDER: ETAPA 1 (HOSPEDAGEM) =====
  const cabecalhoHospedagem = (
    <View>
      <Text style={styles.secaoTitulo}>Datas da estadia</Text>
      <View style={styles.datasCard}>
        <View style={styles.datasRow}>
          <View style={styles.dataCampo}>
            <Text style={styles.dataLabel}>Check-in</Text>
            <TouchableOpacity
              style={styles.dataBtn}
              onPress={() => abrirCalendario("checkin")}
            >
              <Feather name="calendar" size={16} color="#584128" />
              <Text style={styles.dataBtnTexto}>{formatarDataBR(checkIn)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataCampo}>
            <Text style={styles.dataLabel}>Check-out</Text>
            <TouchableOpacity
              style={styles.dataBtn}
              onPress={() => abrirCalendario("checkout")}
            >
              <Feather name="calendar" size={16} color="#584128" />
              <Text style={styles.dataBtnTexto}>
                {formatarDataBR(checkOut)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {diarias > 0 && (
          <View style={styles.diariasRow}>
            <Feather name="moon" size={16} color="#584128" />
            <Text style={styles.diariasTexto}>
              {diarias} {diarias === 1 ? "diária" : "diárias"} de estadia
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.secaoTitulo}>Escolha a hospedagem</Text>
    </View>
  );

  const renderHospedagem = ({ item }: { item: Produto }) => {
    const selecionada = hospedagemSel?.id === item.id;
    const esgotada = item.quantidade_estoque <= 0;
    const poucasDiarias =
      !esgotada && diarias > 0 && diarias > item.quantidade_estoque;
    const imagem = item.imagem_url[0]
      ? { uri: item.imagem_url[0] }
      : IMAGEM_PADRAO;

    return (
      <View
        style={[
          styles.itemCard,
          selecionada && styles.itemCardAtivo,
          esgotada && styles.itemCardDesabilitado,
        ]}
      >
        <TouchableOpacity
          style={styles.itemLinha}
          activeOpacity={0.9}
          disabled={esgotada}
          onPress={() => setHospedagemSel(selecionada ? null : item)}
        >
          <Image source={imagem} style={styles.itemImagem} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemNome} numberOfLines={2}>
              {item.nome}
            </Text>
            {!!(item.localizacao || item.categoria) && (
              <View style={styles.itemLocalRow}>
                <Feather name="map-pin" size={12} color="#8B8272" />
                <Text style={styles.itemLocal} numberOfLines={1}>
                  {item.localizacao || item.categoria}
                </Text>
              </View>
            )}
            <Text style={styles.itemPreco}>
              {formatarPreco(item.preco)} / diária
            </Text>
            {diarias > 0 && !esgotada && !poucasDiarias && (
              <Text style={styles.itemSubtotal}>
                {diarias} {diarias === 1 ? "diária" : "diárias"}:{" "}
                {formatarPreco(item.preco * diarias)}
              </Text>
            )}
            {esgotada && <Text style={styles.itemAviso}>Esgotado</Text>}
            {poucasDiarias && (
              <Text style={styles.itemAviso}>
                Disponível por apenas {item.quantidade_estoque} diária(s)
              </Text>
            )}
          </View>
          <View style={[styles.check, selecionada && styles.checkAtivo]}>
            {selecionada && <Feather name="check" size={16} color="#FFF" />}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // ===== RENDER: ETAPA 2 (EXPERIÊNCIAS) =====
  const cabecalhoExperiencias = (
    <View>
      <Text style={styles.secaoTitulo}>Escolha as experiências</Text>
      <Text style={styles.secaoDica}>
        Marque quantas quiser e ajuste o número de vagas de cada uma.
      </Text>
    </View>
  );

  const renderExperiencia = ({ item }: { item: Produto }) => {
    const quantidade = experienciasSel[item.id];
    const selecionada = quantidade !== undefined;
    const esgotada = item.quantidade_estoque <= 0;
    const imagem = item.imagem_url[0]
      ? { uri: item.imagem_url[0] }
      : IMAGEM_PADRAO;

    return (
      <View
        style={[
          styles.itemCard,
          selecionada && styles.itemCardAtivo,
          esgotada && styles.itemCardDesabilitado,
        ]}
      >
        <TouchableOpacity
          style={styles.itemLinha}
          activeOpacity={0.9}
          disabled={esgotada}
          onPress={() => alternarExperiencia(item)}
        >
          <Image source={imagem} style={styles.itemImagem} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemNome} numberOfLines={2}>
              {item.nome}
            </Text>
            {!!(item.localizacao || item.categoria) && (
              <View style={styles.itemLocalRow}>
                <Feather name="tag" size={12} color="#8B8272" />
                <Text style={styles.itemLocal} numberOfLines={1}>
                  {item.categoria || item.localizacao}
                </Text>
              </View>
            )}
            <Text style={styles.itemPreco}>
              {formatarPreco(item.preco)} / vaga
            </Text>
            {esgotada ? (
              <Text style={styles.itemAviso}>Esgotado</Text>
            ) : (
              <Text style={styles.itemEstoque}>
                {item.quantidade_estoque} vaga(s) disponível(is)
              </Text>
            )}
          </View>
          <View style={[styles.check, selecionada && styles.checkAtivo]}>
            {selecionada && <Feather name="check" size={16} color="#FFF" />}
          </View>
        </TouchableOpacity>

        {selecionada && (
          <View style={styles.quantidadeRow}>
            <Text style={styles.quantidadeLabel}>Vagas</Text>
            <View style={styles.quantidadeSelector}>
              <TouchableOpacity
                style={styles.quantidadeBtn}
                onPress={() => alterarQuantidade(item, -1)}
              >
                <Feather name="minus" size={18} color="#584128" />
              </TouchableOpacity>
              <Text style={styles.quantidadeValor}>{quantidade}</Text>
              <TouchableOpacity
                style={styles.quantidadeBtn}
                onPress={() => alterarQuantidade(item, 1)}
              >
                <Feather name="plus" size={18} color="#584128" />
              </TouchableOpacity>
            </View>
            <Text style={styles.quantidadeSubtotal}>
              {formatarPreco(item.preco * quantidade)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // ===== RENDER: ETAPA 3 (RESUMO) =====
  const renderResumo = () => {
    if (!hospedagemSel || !checkIn || !checkOut) return null;

    const imagem = hospedagemSel.imagem_url[0]
      ? { uri: hospedagemSel.imagem_url[0] }
      : IMAGEM_PADRAO;

    return (
      <ScrollView
        contentContainerStyle={styles.resumoContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.secaoTitulo}>Sua hospedagem</Text>
        <View style={styles.resumoCard}>
          <Image source={imagem} style={styles.resumoImagem} />
          <View style={styles.resumoCardInfo}>
            <Text style={styles.resumoNome}>{hospedagemSel.nome}</Text>
            <Text style={styles.resumoDetalhe}>
              {formatarDataBR(checkIn)} até {formatarDataBR(checkOut)}
            </Text>
            <Text style={styles.resumoDetalhe}>
              {diarias} {diarias === 1 ? "diária" : "diárias"} ×{" "}
              {formatarPreco(hospedagemSel.preco)}
            </Text>
            <Text style={styles.resumoValor}>
              {formatarPreco(totalHospedagem)}
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Suas experiências</Text>
        <View style={styles.resumoLista}>
          {experienciasSelecionadas.map(({ produto, quantidade }) => (
            <View key={produto.id} style={styles.resumoLinha}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.resumoLinhaNome} numberOfLines={2}>
                  {produto.nome}
                </Text>
                <Text style={styles.resumoDetalhe}>
                  {quantidade} {quantidade === 1 ? "vaga" : "vagas"} ×{" "}
                  {formatarPreco(produto.preco)}
                </Text>
              </View>
              <Text style={styles.resumoLinhaValor}>
                {formatarPreco(produto.preco * quantidade)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.resumoTotalBox}>
          <Text style={styles.resumoTotalLabel}>Total do pacote</Text>
          <Text style={styles.resumoTotalValor}>
            {formatarPreco(totalPacote)}
          </Text>
        </View>
        <Text style={styles.resumoNota}>
          Taxas e cupons de desconto são aplicados no carrinho.
        </Text>
      </ScrollView>
    );
  };

  // ===== RENDER: CALENDÁRIO =====
  const renderCalendario = () => (
    <Modal
      visible={modalCalendario}
      transparent
      animationType="slide"
      onRequestClose={() => setModalCalendario(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.calendarioContainer}>
          <View style={styles.calendarioHeader}>
            <Text style={styles.calendarioTitulo}>
              {tipoData === "checkin"
                ? "Selecione o check-in"
                : "Selecione o check-out"}
            </Text>
            <TouchableOpacity
              onPress={() => setModalCalendario(false)}
              style={styles.calendarioFechar}
            >
              <Feather name="x" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.calendarioGrid}>
              {dias.map((data, index) => {
                const ehCheckIn =
                  !!checkIn && data.toDateString() === checkIn.toDateString();
                const ehCheckOut =
                  !!checkOut && data.toDateString() === checkOut.toDateString();
                const noIntervalo =
                  !!checkIn &&
                  !!checkOut &&
                  data.getTime() > checkIn.getTime() &&
                  data.getTime() < checkOut.getTime();
                // Pro check-out, só vale dia depois do check-in
                const desabilitado =
                  tipoData === "checkout" &&
                  !!checkIn &&
                  data.getTime() <= checkIn.getTime();
                const destacado = ehCheckIn || ehCheckOut;

                return (
                  <View key={index} style={styles.diaCelula}>
                    <TouchableOpacity
                      style={[
                        styles.diaBtn,
                        noIntervalo && styles.diaBtnIntervalo,
                        destacado && styles.diaBtnAtivo,
                        desabilitado && styles.diaBtnDesabilitado,
                      ]}
                      disabled={desabilitado}
                      onPress={() => selecionarData(data)}
                    >
                      <Text
                        style={[
                          styles.diaSemana,
                          destacado && styles.diaTextoAtivo,
                        ]}
                      >
                        {data.toLocaleDateString("pt-BR", { weekday: "short" })}
                      </Text>
                      <Text
                        style={[
                          styles.diaNumero,
                          destacado && styles.diaTextoAtivo,
                        ]}
                      >
                        {data.getDate()}
                      </Text>
                      <Text
                        style={[
                          styles.diaMes,
                          destacado && styles.diaTextoAtivo,
                        ]}
                      >
                        {data.toLocaleDateString("pt-BR", { month: "short" })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ===== RENDER PRINCIPAL =====
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#584128" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color="#584128" />
        </TouchableOpacity>
        <View style={styles.headerCentro}>
          <Text style={styles.headerTitulo}>Monte seu pacote</Text>
          <Text style={styles.headerSubtitulo}>
            Escolha onde ficar e o que viver
          </Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {renderEtapas()}

      <View style={styles.conteudo}>
        {etapa === 0 && (
          <FlatList
            data={hospedagens}
            renderItem={renderHospedagem}
            keyExtractor={(item) => String(item.id)}
            extraData={[hospedagemSel, diarias]}
            ListHeaderComponent={cabecalhoHospedagem}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>
                Nenhuma hospedagem disponível no momento.
              </Text>
            }
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
          />
        )}

        {etapa === 1 && (
          <FlatList
            data={experiencias}
            renderItem={renderExperiencia}
            keyExtractor={(item) => String(item.id)}
            extraData={experienciasSel}
            ListHeaderComponent={cabecalhoExperiencias}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>
                Nenhuma experiência disponível no momento.
              </Text>
            }
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
          />
        )}

        {etapa === 2 && renderResumo()}
      </View>

      {/* Rodapé com total parcial e botões */}
      <View style={styles.rodape}>
        <View style={styles.rodapeTotal}>
          <Text style={styles.rodapeTotalLabel}>Total do pacote</Text>
          <Text style={styles.rodapeTotalValor}>
            {formatarPreco(totalPacote)}
          </Text>
        </View>

        {etapa < 2 ? (
          <TouchableOpacity
            style={[styles.btnPrimario, !etapaCompleta && styles.btnOpaco]}
            onPress={avancar}
          >
            <Text style={styles.btnPrimarioTexto}>Continuar</Text>
            <Feather name="arrow-right" size={18} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnConfirmar, adicionando && styles.btnOpaco]}
            onPress={adicionarPacoteAoCarrinho}
            disabled={adicionando}
          >
            {adicionando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Feather name="shopping-cart" size={18} color="#FFF" />
                <Text style={styles.btnPrimarioTexto}>
                  Adicionar ao carrinho
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {renderCalendario()}
    </SafeAreaView>
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

  // ===== HEADER =====
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCentro: { alignItems: "center" },
  headerTitulo: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  headerSubtitulo: { fontSize: 12, color: "#A89677", marginTop: 1 },

  // ===== ETAPAS =====
  etapasContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  etapaItem: { alignItems: "center", width: 84 },
  etapaCirculo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8E0D8",
    alignItems: "center",
    justifyContent: "center",
  },
  etapaCirculoAtivo: { backgroundColor: "#584128" },
  etapaNumero: { fontSize: 13, fontWeight: "700", color: "#8B8272" },
  etapaNumeroAtivo: { color: "#FFF" },
  etapaLabel: { fontSize: 11, color: "#8B8272", marginTop: 4 },
  etapaLabelAtivo: { color: "#584128", fontWeight: "700" },
  etapaLinha: {
    flex: 1,
    height: 2,
    backgroundColor: "#E8E0D8",
    marginTop: 14,
    marginHorizontal: -10,
  },
  etapaLinhaAtiva: { backgroundColor: "#584128" },

  // ===== CONTEÚDO =====
  conteudo: { flex: 1 },
  lista: { padding: 16, paddingBottom: 24 },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c1810",
    marginTop: 8,
    marginBottom: 10,
  },
  secaoDica: {
    fontSize: 12,
    color: "#8B8272",
    marginTop: -6,
    marginBottom: 12,
  },
  vazioTexto: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    paddingVertical: 40,
  },

  // ===== DATAS =====
  datasCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  datasRow: { flexDirection: "row", gap: 12 },
  dataCampo: { flex: 1 },
  dataLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  dataBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#584128",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F9F6F0",
  },
  dataBtnTexto: { fontSize: 13, color: "#333", flex: 1 },
  diariasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  diariasTexto: { fontSize: 14, color: "#584128", fontWeight: "bold" },

  // ===== CARDS DE ITENS =====
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  itemCardAtivo: { borderColor: "#584128", backgroundColor: "#FBF8F2" },
  itemCardDesabilitado: { opacity: 0.5 },
  itemLinha: { flexDirection: "row", alignItems: "center", padding: 10 },
  itemImagem: {
    width: 84,
    height: 84,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#F0EBE3",
  },
  itemInfo: { flex: 1, paddingHorizontal: 12, gap: 3 },
  itemNome: { fontSize: 15, fontWeight: "bold", color: "#2c1810" },
  itemLocalRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  itemLocal: { fontSize: 12, color: "#8B8272", flex: 1 },
  itemPreco: { fontSize: 13, color: "#584128", fontWeight: "600" },
  itemSubtotal: { fontSize: 12, color: "#27ae60", fontWeight: "600" },
  itemEstoque: { fontSize: 11, color: "#999" },
  itemAviso: { fontSize: 12, color: "#E74C3C", fontWeight: "600" },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#D6CCBC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkAtivo: { backgroundColor: "#584128", borderColor: "#584128" },

  // ===== QUANTIDADE (EXPERIÊNCIAS) =====
  quantidadeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EFE8DA",
  },
  quantidadeLabel: { fontSize: 13, color: "#333" },
  quantidadeSelector: { flexDirection: "row", alignItems: "center", gap: 14 },
  quantidadeBtn: {
    borderWidth: 1,
    borderColor: "#584128",
    borderRadius: 6,
    padding: 5,
  },
  quantidadeValor: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  quantidadeSubtotal: { fontSize: 14, fontWeight: "bold", color: "#584128" },

  // ===== RESUMO =====
  resumoContent: { padding: 16, paddingBottom: 24 },
  resumoCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  resumoImagem: { width: "100%", height: 140, resizeMode: "cover" },
  resumoCardInfo: { padding: 14, gap: 4 },
  resumoNome: { fontSize: 17, fontWeight: "bold", color: "#2c1810" },
  resumoDetalhe: { fontSize: 12, color: "#8B8272" },
  resumoValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#584128",
    marginTop: 4,
  },
  resumoLista: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  resumoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE3",
  },
  resumoLinhaNome: { fontSize: 14, fontWeight: "600", color: "#2c1810" },
  resumoLinhaValor: { fontSize: 14, fontWeight: "bold", color: "#584128" },
  resumoTotalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#584128",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  resumoTotalLabel: { fontSize: 15, color: "#EDEAE0", fontWeight: "600" },
  resumoTotalValor: { fontSize: 22, color: "#FFF", fontWeight: "bold" },
  resumoNota: {
    fontSize: 12,
    color: "#8B8272",
    textAlign: "center",
    marginTop: 10,
  },

  // ===== RODAPÉ =====
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  rodapeTotal: { flexShrink: 1 },
  rodapeTotalLabel: { fontSize: 11, color: "#8B8272" },
  rodapeTotalValor: { fontSize: 18, fontWeight: "bold", color: "#584128" },
  btnPrimario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#584128",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },
  btnConfirmar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#27ae60",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    minWidth: 190,
  },
  btnPrimarioTexto: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  btnOpaco: { opacity: 0.5 },

  // ===== CALENDÁRIO =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  calendarioContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 16,
  },
  calendarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  calendarioTitulo: { fontSize: 17, fontWeight: "bold", color: "#333" },
  calendarioFechar: {
    backgroundColor: "#584128",
    borderRadius: 16,
    padding: 6,
  },
  calendarioGrid: { flexDirection: "row", flexWrap: "wrap" },
  diaCelula: { width: "25%", padding: 4 },
  diaBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: "#F9F6F0",
  },
  diaBtnIntervalo: { backgroundColor: "#EADFC9", borderColor: "#D9C9A8" },
  diaBtnAtivo: { backgroundColor: "#584128", borderColor: "#584128" },
  diaBtnDesabilitado: { opacity: 0.35 },
  diaSemana: { fontSize: 10, color: "#666", marginBottom: 2 },
  diaNumero: { fontSize: 18, fontWeight: "bold", color: "#333" },
  diaMes: { fontSize: 10, color: "#666", marginTop: 2 },
  diaTextoAtivo: { color: "#FFF" },
});
