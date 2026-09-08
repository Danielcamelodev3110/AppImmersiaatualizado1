// app/(drawer)/portaretrato.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ===== TIPAGENS =====
interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: any;
}

// ===== DADOS =====
const relatedProducts: RelatedProduct[] = [
  {
    id: 1,
    name: 'Caneca Personalizada',
    price: 39.90,
    image: require('../../assets/images/caneca.jpg'),
  },
  {
    id: 2,
    name: 'Porta-retrato vídeo',
    price: 49.90,
    image: require('../../assets/images/portavideo.jpg'),
  },
  {
    id: 3,
    name: 'Chaveiro com TAG',
    price: 19.90,
    image: require('../../assets/images/tag.jpg'),
  },
  {
    id: 4,
    name: 'Blusa Personalizada',
    price: 59.90,
    image: require('../../assets/images/blusa.webp'),
  },
];

const initialReviews: Review[] = [
  {
    id: 1,
    name: 'Ana Rodrigues',
    rating: 5,
    comment: 'Produto incrível! A qualidade da imagem é surpreendente e o NFC funciona perfeitamente. Recomendo para quem quer um presente tecnológico e elegante.',
    date: '15 de Janeiro, 2026',
    helpful: 12,
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    rating: 4.5,
    comment: 'Muito bom! A única coisa que poderia melhorar é a duração da bateria, mas no geral é um excelente produto. A personalização via app é muito intuitiva.',
    date: '10 de Janeiro, 2026',
    helpful: 8,
  },
  {
    id: 3,
    name: 'Mariana Silva',
    rating: 5,
    comment: 'Comprei para presentear minha mãe e ela amou! O efeito 3D é muito bonito e a qualidade do material é excelente. Super recomendo!',
    date: '05 de Janeiro, 2026',
    helpful: 15,
  },
];

// ===== COMPONENTE PRINCIPAL =====
export default function PortaRetratoScreen() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [mainImage, setMainImage] = useState(require('../../assets/images/portaretrato.jpg'));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showLoadMore, setShowLoadMore] = useState(true);

  // ===== IMAGENS DA GALERIA =====
  const images = [
    { id: 1, image: require('../../assets/images/portaretrato.jpg'), label: 'Vista frontal' },
    { id: 2, image: require('../../assets/images/portaretrato2.webp'), label: 'Vista lateral' },
    { id: 3, image: require('../../assets/images/portaretrato3.jpg'), label: 'Detalhe' },
    { id: 4, image: require('../../assets/images/portaretatro4.jpg'), label: 'Em uso' },
  ];

  const [selectedImage, setSelectedImage] = useState(images[0].image);

  // ===== FUNÇÕES =====
  const changeImage = (image: any) => {
    setSelectedImage(image);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = () => {
    setCartCount(prev => prev + quantity);
    Alert.alert(
      '🛒 Adicionado!',
      `${quantity}x Porta Retrato Inteligente adicionado ao carrinho.`,
      [{ text: 'OK' }]
    );
  };

  const openReviewForm = () => {
    setShowReviewForm(true);
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
  };

  const setRating = (value: number) => {
    setReviewRating(value);
  };

  const submitReview = () => {
    if (!reviewName.trim() || !reviewComment.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const now = new Date();
    const date = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const newReview: Review = {
      id: reviews.length + 1,
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: date,
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);
    Alert.alert('✅ Sucesso!', 'Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
    closeReviewForm();
  };

  const markHelpful = (id: number) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === id
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const loadMoreReviews = () => {
    const moreReviews: Review[] = [
      {
        id: 4,
        name: 'Pedro Oliveira',
        rating: 5,
        comment: 'Produto de alta qualidade! A entrega foi rápida e o atendimento excelente. Recomendo a todos!',
        date: '20 de Dezembro, 2025',
        helpful: 5,
      },
    ];
    setReviews(prev => [...prev, ...moreReviews]);
    setShowLoadMore(false);
  };

  // ===== RENDERIZAR ESTRELAS =====
  const renderStars = (rating: number, size: number = 14) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={size} color="#f5a623" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={size} color="#f5a623" />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#f5a623" />
      );
    }

    return stars;
  };

  // ===== RENDERIZAR PRODUTO RELACIONADO =====
  const renderRelatedProduct = ({ item }: { item: RelatedProduct }) => (
    <TouchableOpacity
      style={styles.relatedCard}
      onPress={() => Alert.alert('Produto', `Ver detalhes de ${item.name}`)}
    >
      <Image source={item.image} style={styles.relatedImage} />
      <Text style={styles.relatedName}>{item.name}</Text>
      <Text style={styles.relatedPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
    </TouchableOpacity>
  );

  // ===== RENDERIZAR AVALIAÇÃO =====
  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <Ionicons name="person" size={20} color="#5a4a3a" />
          </View>
          <View>
            <Text style={styles.reviewerName}>{item.name}</Text>
            <View style={styles.reviewStars}>
              {renderStars(item.rating)}
            </View>
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewText}>"{item.comment}"</Text>
      <View style={styles.reviewHelpful}>
        <Text style={styles.reviewHelpfulText}>
          <Ionicons name="thumbs-up-outline" size={14} color="#7a6a5a" /> {item.helpful} pessoas acharam útil
        </Text>
        <TouchableOpacity
          style={styles.btnHelpful}
          onPress={() => markHelpful(item.id)}
        >
          <Text style={styles.btnHelpfulText}>Útil?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ===== RENDER =====
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2c1810" />
          </TouchableOpacity>
          <View style={styles.logo}>
            <Text style={styles.logoTitle}>🛒 Loja Immercia</Text>
          </View>
          <TouchableOpacity style={styles.cartIcon} onPress={() => router.push('/loja')}>
            <Ionicons name="cart-outline" size={22} color="#584128" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* PRODUCT DETAIL */}
        <View style={styles.productDetail}>
          {/* Galeria */}
          <View style={styles.productGallery}>
            <View style={styles.mainImage}>
              <Image source={selectedImage} style={styles.mainImageContent} />
            </View>
            <View style={styles.thumbnails}>
              {images.map((img) => (
                <TouchableOpacity
                  key={img.id}
                  onPress={() => changeImage(img.image)}
                >
                  <Image
                    source={img.image}
                    style={[
                      styles.thumbnailImage,
                      selectedImage === img.image && styles.thumbnailActive,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Informações */}
          <View style={styles.productInfo}>
            <View style={styles.productCategoryBadge}>
              <Ionicons name="pricetag-outline" size={12} color="#584128" />
              <Text style={styles.productCategoryText}>porta-retrato</Text>
            </View>

            <Text style={styles.productTitle}>Porta Retrato Inteligente</Text>

            <View style={styles.productRating}>
              <View style={styles.starsContainer}>
                {renderStars(4.5, 18)}
              </View>
              <Text style={styles.ratingText}>(42 avaliações)</Text>
            </View>

            <Text style={styles.productPrice}>
              R$ 60,00 <Text style={styles.priceSmall}>cada</Text>
            </Text>

            <Text style={styles.productDescription}>
              Porta retrato inteligente com tecnologia NFC e display 3D. Perfeito para guardar memórias especiais com um toque de inovação.
            </Text>

            <View style={styles.productFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="hardware-chip-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>Tecnologia NFC integrada</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="expand-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>Tela 3D com efeito holográfico</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="flash-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>Bateria de longa duração</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="sync-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>Atualizações automáticas</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="wifi-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>Conexão Wi-Fi</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="phone-portrait-outline" size={18} color="#584128" />
                <Text style={styles.featureText}>App para personalização</Text>
              </View>
            </View>

            <View style={styles.productMeta}>
              <Text style={styles.metaItem}>
                <Ionicons name="cube-outline" size={14} color="#7a6a5a" /> Em estoque
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="car-outline" size={14} color="#7a6a5a" /> Frete grátis
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#7a6a5a" /> Garantia 12 meses
              </Text>
            </View>

            <View style={styles.productActions}>
              <View style={styles.quantitySelector}>
                <Text style={styles.quantityLabel}>Quantidade:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQuantity}>
                    <Ionicons name="remove" size={18} color="#2c1810" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={increaseQuantity}>
                    <Ionicons name="add" size={18} color="#2c1810" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.btnAddCart} onPress={addToCart}>
                <Ionicons name="cart-outline" size={20} color="#fff9f9" />
                <Text style={styles.btnAddCartText}>Adicionar ao carrinho</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PRODUTOS RELACIONADOS */}


        {/* AVALIAÇÕES */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>
              <Ionicons name="star" size={20} color="#f5a623" /> Avaliações dos clientes
            </Text>
            <View style={styles.reviewsSummary}>
              <View style={styles.ratingAverage}>
                <Text style={styles.bigRating}>4.7</Text>
                <View style={styles.starsContainer}>
                  {renderStars(4.7, 16)}
                </View>
                <Text style={styles.totalReviews}>(42 avaliações)</Text>
              </View>
              <TouchableOpacity style={styles.btnWriteReview} onPress={openReviewForm}>
                <Ionicons name="create-outline" size={16} color="#3d2a1a" />
                <Text style={styles.btnWriteReviewText}>Avaliar produto</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORMULÁRIO DE AVALIAÇÃO */}
          {showReviewForm && (
            <View style={styles.reviewFormContainer}>
              <Text style={styles.reviewFormTitle}>
                <Ionicons name="create-outline" size={18} color="#2c1810" /> Escreva sua avaliação
              </Text>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome:</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Seu nome"
                  value={reviewName}
                  onChangeText={setReviewName}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nota:</Text>
                <View style={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity key={value} onPress={() => setRating(value)}>
                      <Ionicons
                        name={value <= reviewRating ? 'star' : 'star-outline'}
                        size={32}
                        color={value <= reviewRating ? '#f5a623' : '#d6cbbc'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Comentário:</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Conte sua experiência com o produto..."
                  multiline
                  numberOfLines={4}
                  value={reviewComment}
                  onChangeText={setReviewComment}
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity style={styles.btnSubmitReview} onPress={submitReview}>
                  <Ionicons name="paper-plane-outline" size={18} color="#FFF" />
                  <Text style={styles.btnSubmitReviewText}>Enviar avaliação</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancelReview} onPress={closeReviewForm}>
                  <Text style={styles.btnCancelReviewText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* LISTA DE AVALIAÇÕES */}
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={styles.reviewsList}
          />

          {/* BOTÃO CARREGAR MAIS */}
          {showLoadMore && (
            <TouchableOpacity style={styles.btnLoadMore} onPress={loadMoreReviews}>
              <Ionicons name="chevron-down-outline" size={18} color="#3d2a1a" />
              <Text style={styles.btnLoadMoreText}>Carregar mais avaliações</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

// ===== STYLES =====
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#daccb5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(88,65,40,0.25)',
  },
  backButton: {
    padding: 8,
  },
  logo: {
    flex: 1,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
  },
  cartIcon: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#584128',
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  productDetail: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    margin: 16,
    marginTop: 16,
  },
  productGallery: {
    gap: 12,
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f5f0',
    borderWidth: 1,
    borderColor: '#e6ddd2',
  },
  mainImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnails: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#584128',
  },
  productInfo: {
    gap: 12,
  },
  productCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f4efe8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  productCategoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#584128',
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    color: '#7a6a5a',
    fontSize: 14,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7a6a5a',
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5a4a3a',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0ebe3',
  },
  productFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '48%',
  },
  featureText: {
    fontSize: 13,
    color: '#3d2a1a',
  },
  productMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 8,
  },
  metaItem: {
    fontSize: 13,
    color: '#7a6a5a',
  },
  productActions: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#f0ebe3',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityLabel: {
    fontWeight: '600',
    color: '#2c1810',
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d6cbbc',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
    width: 40,
    textAlign: 'center',
    color: '#2c1810',
  },
  btnAddCart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#584128',
    paddingVertical: 14,
    borderRadius: 60,
  },
  btnAddCartText: {
    color: '#fff9f9',
    fontWeight: '700',
    fontSize: 16,
  },
  relatedSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c1810',
    marginBottom: 12,
    fontFamily: 'Plus Jakarta Sans',
  },
  relatedList: {
    gap: 12,
  },
  relatedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    alignItems: 'center',
    width: 150,
    marginRight: 12,
  },
  relatedImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f8f5f0',
    resizeMode: 'cover',
  },
  relatedName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#2c1810',
    marginTop: 8,
    textAlign: 'center',
  },
  relatedPrice: {
    fontWeight: '700',
    color: '#584128',
    fontSize: 14,
    marginTop: 4,
  },
  reviewsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reviewsHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f0ebe3',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 12,
  },
  reviewsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  ratingAverage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bigRating: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
  },
  totalReviews: {
    color: '#7a6a5a',
    fontSize: 13,
  },
  btnWriteReview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f4efe8',
    borderWidth: 1,
    borderColor: '#d6cbbc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
  },
  btnWriteReviewText: {
    fontWeight: '600',
    color: '#3d2a1a',
    fontSize: 13,
  },
  reviewFormContainer: {
    backgroundColor: '#f8f5f0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6ddd2',
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c1810',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontWeight: '600',
    color: '#2c1810',
    marginBottom: 4,
    fontSize: 13,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d6cbbc',
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#2c1810',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  starRating: {
    flexDirection: 'row',
    gap: 4,
  },
  formActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  btnSubmitReview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#584128',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
  },
  btnSubmitReviewText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  btnCancelReview: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#d6cbbc',
  },
  btnCancelReviewText: {
    color: '#5a4a3a',
    fontWeight: '600',
    fontSize: 13,
  },
  reviewsList: {
    gap: 12,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: '#f8f5f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d6cbbc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerName: {
    fontWeight: '600',
    color: '#2c1810',
    fontSize: 14,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    color: '#7a6a5a',
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3d2a1a',
    marginBottom: 8,
  },
  reviewHelpful: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  reviewHelpfulText: {
    fontSize: 12,
    color: '#7a6a5a',
  },
  btnHelpful: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  btnHelpfulText: {
    color: '#584128',
    fontWeight: '600',
    fontSize: 12,
  },
  btnLoadMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0ebe3',
    marginTop: 8,
  },
  btnLoadMoreText: {
    color: '#3d2a1a',
    fontWeight: '600',
    fontSize: 13,
  },
  footerSpacer: {
    height: 20,
  },
});