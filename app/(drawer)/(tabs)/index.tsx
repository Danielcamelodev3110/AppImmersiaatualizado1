import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// TODAS AS CIDADES DO BRASIL POR ESTADO
// COMPONENTE DE MAPA COM BUSCA POR QUALQUER CIDADE
const CityMapComponent = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchAnyCity = async () => {
    if (!searchText.trim()) {
      Alert.alert("Atenção", "Digite o nome de uma cidade");
      return;
    }

    setLoading(true);
    try {
      // Busca a cidade no Google Maps para obter coordenadas
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchText)}`;
      await WebBrowser.openBrowserAsync(url);
      setSelectedCity(searchText);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o mapa");
    } finally {
      setLoading(false);
    }
  };

  const searchByCategory = async (category) => {
    if (!selectedCity && !searchText) {
      Alert.alert("Atenção", "Primeiro digite uma cidade");
      return;
    }
    const cityName = selectedCity || searchText;
    const url = `https://www.google.com/maps/search/?api=1&query=${category.search}+em+${encodeURIComponent(cityName)}`;
    await WebBrowser.openBrowserAsync(url);
  };

  const searchCustom = async () => {
    if (!selectedCity && !searchText) {
      Alert.alert("Atenção", "Digite uma cidade");
      return;
    }
    const cityName = selectedCity || searchText;
    const url = `https://www.google.com/maps/search/?api=1&query=lugares+em+${encodeURIComponent(cityName)}`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.mapCardNew}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.cardTitle}>Digite o nome da cidade</Text>

      {/* Campo de busca */}
      <View style={styles.searchContainerNew}>
        <Text style={styles.searchIcon}></Text>
        <TextInput
          style={styles.searchInputNew}
          placeholder="Ex: Rio de Janeiro, Salvador, Gramado..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchAnyCity}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de buscar */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={searchAnyCity}
        disabled={loading}
      >
        <Text style={styles.searchButtonText}>
          {loading ? "Buscando..." : " Buscar cidade"}
        </Text>
      </TouchableOpacity>

      {/* Cidade selecionada */}
      {selectedCity && (
        <View style={styles.selectedCityBox}>
          <Text style={styles.selectedCityText}>
            {" "}
            Cidade selecionada: {selectedCity}
          </Text>
        </View>
      )}

      {/* Categorias (só aparece se tiver uma cidade selecionada ou digitada) */}
      {(selectedCity || searchText) && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>
            O que você quer fazer em {selectedCity || searchText}?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "restaurantes" })}
            >
              <Text style={styles.categoryChipText}>Restaurantes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "hoteis" })}
            >
              <Text style={styles.categoryChipText}>Hotéis</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "praias" })}
            >
              <Text style={styles.categoryChipText}> Praias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "parques" })}
            >
              <Text style={styles.categoryChipText}> Parques</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "museus" })}
            >
              <Text style={styles.categoryChipText}>Museus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "shoppings" })}
            >
              <Text style={styles.categoryChipText}> Shoppings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "bares" })}
            >
              <Text style={styles.categoryChipText}> Bares</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => searchByCategory({ search: "pontos+turisticos" })}
            >
              <Text style={styles.categoryChipText}>Pontos Turísticos</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.customSearchButton}
            onPress={searchCustom}
          >
            <Text style={styles.customSearchButtonText}>
              Ver tudo em {selectedCity || searchText}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sugestões rápidas */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}> Sugestões:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Rio de Janeiro");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Rio de Janeiro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("São Paulo");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>São Paulo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Salvador");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Salvador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Gramado");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Gramado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Florianópolis");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Florianópolis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Fortaleza");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Fortaleza</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Recife");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Recife</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {
              setSearchText("Belo Horizonte");
              searchAnyCity();
            }}
          >
            <Text style={styles.suggestionChipText}>Belo Horizonte</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};
const { width } = Dimensions.get("window");

const logoImage = require("../../../assets/images/logo.png");
// Imagens diferentes para cada banner
const banner1 = require("../../../assets/images/imagemsite.png");
const banner2 = require("../../../assets/images/banner2.webp"); // Mude para uma imagem diferente
const banner3 = require("../../../assets/images/banner3.webp"); // Mude para uma imagem diferente

const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;

// 🔥 BANNERS COMPLETOS
const banners = [
  {
    id: "1",
    title: "Visite o Rio de Janeiro",
    subtitle: "Até 30% OFF",
    buttonText: "Reserve",
    image: banner1,
    color: "#FF6B6B",
  },
  {
    id: "2",
    title: "Pacotes Completos",
    subtitle: "Hospedagem + Voo",
    buttonText: "Ver ofertas",
    image: banner2,
    color: "#4A90E2",
  },
  {
    id: "3",
    title: "Viagens em Grupo",
    subtitle: "Descontos especiais",
    buttonText: "Saiba mais",
    image: banner3,
    color: "#50C878",
  },
];
const pacotes = [
  {
    id: "1",
    nome: "PACOTE SERTÕES DO BRASIL",
    preco: "3200,00",
    imagem: require("../../../assets/images/sertao.webp"),
  },
  {
    id: "2",
    nome: "FAZENDA CAFÉ ESPECIAL",
    preco: "1800,00",
    imagem: require("../../../assets/images/img2.webp"),
  },
  {
    id: "3",
    nome: "CHALÉ MONTANHA",
    preco: "2500,00",
    imagem: require("../../../assets/images/img3.jpg"),
  },
  {
    id: "4",
    nome: "PRAIA DO FORTE",
    preco: "3500,00",
    imagem: require("../../../assets/images/img4.jpg"),
  },
  {
    id: "5",
    nome: "SERRA GAÚCHA",
    preco: "2200,00",
    imagem: require("../../../assets/images/img5.jpg"),
  },
];

// 🔥 BANNER CAROUSEL - CORRIGIDO (AGORA VAI DO 1º → 2º → 3º → 1º)
const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const isAutoPlaying = useRef(true);

  // 🔥 REF para guardar o índice atual (evita problema de closure)
  const currentIndexRef = useRef(0);

  const bannerHeight = width * 0.6;

  // 🔥 Atualiza a ref sempre que o currentIndex mudar
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isAutoPlaying.current && flatListRef.current) {
        // 🔥 USA A REF para pegar o valor atualizado
        const currentIdx = currentIndexRef.current;
        let nextIndex = currentIdx + 1;
        if (nextIndex >= banners.length) {
          nextIndex = 0;
        }

        console.log("indo de", currentIdx, "para", nextIndex);

        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0,
        });
        setCurrentIndex(nextIndex);
      }
    }, 4000);
  };

  const stopAutoPlay = () => {
    isAutoPlaying.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    isAutoPlaying.current = true;
    startAutoPlay();
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / width);

    if (newIndex !== currentIndexRef.current) {
      setCurrentIndex(newIndex);
    }
    resetAutoPlay();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index || 0;
      if (newIndex !== currentIndexRef.current) {
        setCurrentIndex(newIndex);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: false,
  }).current;

  const renderBanner = ({ item }) => (
    <View style={{ width: width, height: bannerHeight }}>
      <ImageBackground
        source={item.image}
        style={styles.bannerImage}
        resizeMode="cover"
      >
        <View style={styles.bannerOverlay}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            <TouchableOpacity
              style={[styles.bannerButton, { backgroundColor: item.color }]}
            >
              <Text style={styles.bannerButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  const renderDots = () => (
    <View style={[styles.dotsContainer, { bottom: bannerHeight * 0.08 }]}>
      {banners.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
              currentIndex === index && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.carouselContainer, { height: bannerHeight }]}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onTouchStart={stopAutoPlay}
        onTouchEnd={resetAutoPlay}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialScrollIndex={0}
        snapToAlignment="start"
        snapToInterval={width}
        decelerationRate="fast"
        disableIntervalMomentum={true}
      />
      {renderDots()}
    </View>
  );
};
const PacoteCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  const cardWidth = width * 0.9;
  const cardMargin = 20;
  const snapInterval = cardWidth + cardMargin;
  const offset = (width - cardWidth) / 2;

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= pacotes.length ? 0 : prevIndex + 1;

        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.1,
          });
        }

        return nextIndex;
      });
    }, 4000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / snapInterval);

    if (index !== activeIndex && index >= 0 && index < pacotes.length) {
      setActiveIndex(index);
    }
  };

  const handleScrollEnd = () => {
    stopTimer();
    startTimer();
  };

  const getItemLayout = (data, index) => ({
    length: snapInterval,
    offset: snapInterval * index,
    index,
  });

  const renderPacote = ({ item }) => (
    <View style={[styles.pacoteCard, { width: cardWidth }]}>
      <View style={styles.molduraImagem}>
        <Image source={item.imagem} style={styles.pacoteImagem} />
      </View>
      <Text style={styles.pacoteNome}>{item.nome}</Text>
      <View style={styles.precoContainer}>
        <Text style={styles.pacotePreco}>{item.preco}</Text>
        <Text style={styles.cifrao}>R$</Text>
      </View>
      <TouchableOpacity style={styles.botaoSaibaMais}>
        <Text style={styles.botaoTexto}>SAIBA MAIS</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDots = () => (
    <View style={styles.pacoteDotsContainer}>
      {pacotes.map((_, index) => (
        <View
          key={index}
          style={[
            styles.pacoteDot,
            activeIndex === index && styles.pacoteDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.pacoteCarouselContainer}>
      <FlatList
        ref={flatListRef}
        data={pacotes}
        renderItem={renderPacote}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: offset }}
        snapToAlignment="center"
        snapToInterval={snapInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onTouchStart={stopTimer}
        onTouchEnd={handleScrollEnd}
        getItemLayout={getItemLayout}
        scrollEventThrottle={16}
      />
      {renderDots()}
    </View>
  );
};

// 🔥 CARD
function Card({ titulo, imagem, style, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        style,
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      <ImageBackground
        source={imagem}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>{titulo}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

// 🔥 APP
// 🔥 APP
export default function App() {
  // A chamada do hook deve estar AQUI dentro
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Carrossel de Banners (Topo) */}
        <BannerCarousel />

        <View style={styles.contentContainer}>
          {/* 4. SEÇÃO "CONHEÇA O QUE OFERECEMOS" */}
          <View style={[styles.textContainer, { marginTop: 150 }]}>
            <Text style={styles.h3}>Conheça o que oferecemos:</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.cardsContainer}>
            <Card
              titulo="EXPERIÊNCIA"
              imagem={require("../../../assets/images/exp.jpg")}
              // Agora o navigation existe neste escopo
              onPress={() => navigation.navigate("experiencias")}
            />
            <Card
              titulo="HOSPEDAGENS"
              imagem={require("../../../assets/images/hosp.webp")}
              onPress={() => navigation.navigate("hospedagens")}
            />
            <Card
              titulo="PACOTES"
              imagem={require("../../../assets/images/pacotes.jpg")}
              onPress={() => navigation.navigate("pacotes")}
            />
          </View>
          <View style={[styles.textContainer, { marginTop: 20 }]}>
            <Text style={styles.h3}>Experiências próximas de você:</Text>
            <View style={styles.underline} />
          </View>

          <CityMapComponent />

          <View style={[styles.textContainer, { marginTop: 20 }]}>
            <Text style={styles.h3}>Promoções da semana</Text>
            <View style={styles.underline} />
          </View>

          <View style={{ height: 10 }} />
          <PacoteCarousel />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// 🔥 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAE0",
  },

  header: {
    alignItems: "center",
    padding: 10,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    backgroundColor: "#584128",
  },

  logo: {
    width: 200,
    height: 60,
  },

  carouselContainer: {
    height: isSmallDevice ? 200 : isLargeDevice ? 300 : 250,
    position: "relative",
  },

  bannerCard: {
    width: width,
    height: "100%",
    overflow: "hidden",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },

  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: 20,
  },
  bannerContent: {
    paddingHorizontal: 0,
  },

  bannerTitle: {
    fontSize: isSmallDevice ? 22 : 28,
    fontWeight: "bold",
    color: "#FFF",
  },

  bannerSubtitle: {
    fontSize: isSmallDevice ? 12 : 14,
    color: "#FFF",
    marginVertical: 8,
  },

  bannerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  bannerButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  dotsContainer: {
    position: "absolute",
    bottom: 150,
    flexDirection: "row",
    alignSelf: "center",
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "#FF6B6B",
  },

  cardsContainer: {
    alignItems: "center",
    marginTop: -130,
  },

  card: {
    width: "85%",
    height: 90,
    marginVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    transform: [{ scale: 1.2 }], // 🔥 aumenta a imagem
    width: "100%",
    height: "100%",
  },

  imageBorder: {
    borderRadius: 20,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    marginTop: -100, // Ajuste esse valor para subir o bloco todo sobre o carrossel, se desejar
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 15, // Espaço entre o texto/linha e o que vem abaixo
  },

  h3: {
    fontSize: 20,
    color: "#584128",
    fontWeight: "bold",
    textTransform: "none", // Garante que não fique tudo em maiúsculo se não quiser
  },

  underline: {
    height: 2,
    backgroundColor: "#C5A87B", // Aquele tom dourado/bege da sua imagem
    width: 500, // Ajuste o tamanho da linha aqui
    marginTop: 4,
    borderRadius: 2,
  },

  cardsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10, // Espaço antes de começar o próximo bloco de texto
  },
  mapa: {
    width: "60%", // Mudei para 100% para ocupar a largura da tela
    height: 300, // <--- AQUI você define a nova altura
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 20, // Opcional: para arredondar as bordas do container
  },
  // 🔥 ESTILOS AJUSTADOS PARA MOBILE (TAMANHO REDUZIDO)
  pacoteCarouselContainer: {
    position: "relative",
    marginVertical: 5,
    width: width,
  },

  pacoteDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },

  pacoteDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C5A87B",
    marginHorizontal: 3,
  },

  pacoteDotActive: {
    backgroundColor: "#584128",
    width: 16,
  },

  pacoteCard: {
    alignItems: "center",
    marginRight: 15,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  molduraImagem: {
    width: "95%",
    height: 140, // Reduzido de 200
    borderWidth: 3, // Reduzido de 4
    borderColor: "#584128",
    padding: 4, // Reduzido de 5
    backgroundColor: "#F5F5DC",
    borderRadius: 8,
  },

  pacoteImagem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 6,
  },

  pacoteNome: {
    fontSize: 11, // Reduzido de 14
    color: "#C5A87B",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  precoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 3,
  },

  pacotePreco: {
    fontSize: 18, // Reduzido de 24
    color: "#584128",
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  cifrao: {
    fontSize: 12, // Reduzido de 16
    color: "#C5A87B",
    fontWeight: "bold",
    marginLeft: 4,
    marginBottom: 3,
  },

  botaoSaibaMais: {
    backgroundColor: "#4A3721",
    paddingHorizontal: 20, // Reduzido de 30
    paddingVertical: 6, // Reduzido de 10
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 10,
  },

  botaoTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 11, // Reduzido de 14
  },
  mapContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#584128",
  },
  mapTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#EDEAE0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  refreshButtonText: {
    color: "#584128",
    fontSize: 12,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapFooter: {
    padding: 8,
    backgroundColor: "#F5F5DC",
    alignItems: "center",
  },
  mapFooterText: {
    fontSize: 11,
    color: "#584128",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Adicione dentro do StyleSheet
  locationIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 5,
  },
  locationCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    minHeight: 200,
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  footerButton: {
    padding: 8,
    alignItems: "center",
  },
  // NOVOS ESTILOS DO MAPA COM CIDADES - ADICIONE AO FINAL DO StyleSheet

  // Estilos do novo componente CityMapComponent
  mapCardNew: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    width: "90%",
  },
  icon: {
    fontSize: 60,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  selectCityButton: {
    backgroundColor: "#584128",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  selectCityButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 20,
    width: "100%",
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  categoriesScroll: {
    flexDirection: "row",
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#333",
  },
  customSearchButton: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
  },
  customSearchButtonText: {
    fontSize: 14,
    color: "#584128",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    fontSize: 24,
    color: "#999",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 18,
    color: "#999",
    padding: 5,
  },
  sectionHeader: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#612205",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cityItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  cityItemInfo: {
    flex: 1,
  },
  cityItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cityItemState: {
    fontSize: 12,
    color: "#999",
  },
  cityItemArrow: {
    fontSize: 18,
    color: "#584128",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  tipCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 22,
  },
  // Novos estilos para busca de cidade
  searchContainerNew: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    width: "100%",
  },
  searchInputNew: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#584128",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  searchButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedCityBox: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  selectedCityText: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "bold",
  },
  suggestionsContainer: {
    marginTop: 15,
    width: "100%",
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  suggestionChip: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionChipText: {
    fontSize: 13,
    color: "#333",
  },
});
