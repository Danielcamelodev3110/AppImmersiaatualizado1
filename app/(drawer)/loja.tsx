// app/(drawer)/(tabs)/loja.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ===== TIPAGENS =====
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoria: string;
  image: any;
}

interface CartItem {
  id: number;
  quantity: number;
}

// ===== DADOS DOS PRODUTOS =====
const products: Product[] = [
  {
    id: 1,
    name: 'Caneca Personalizada',
    description: '400ml, porcelana, estampa geek',
    price: 39.90,
    categoria: 'caneca',
    image: require('../../assets/images/caneca.jpg'),
  },
  {
    id: 2,
    name: 'Porta Retrato Inteligente',
    description: 'NFC, tecnologia, 3D',
    price: 60.00,
    categoria: 'porta-retrato',
    image: require('../../assets/images/portaretrato.jpg'),
  },
  {
    id: 3,
    name: 'Chaveiro com TAG',
    description: 'Metal, pingente 3D, divertido',
    price: 19.90,
    categoria: 'chaveiro',
    image: require('../../assets/images/tag.jpg'),
  },
  {
    id: 4,
    name: 'Chaveiro Viagem',
    description: 'Aço inox, gravação amor eterno',
    price: 14.90,
    categoria: 'chaveiro',
    image: require('../../assets/images/Curitiba.webp'),
  },
  {
    id: 5,
    name: 'Porta-retrato vídeo',
    description: 'Dois vídeos 10x15, madeira clara',
    price: 49.90,
    categoria: 'porta-retrato',
    image: require('../../assets/images/portavideo.jpg'),
  },
  {
    id: 6,
    name: 'Blusa Personalizada',
    description: 'Moldura dourada, estilo retrô',
    price: 59.90,
    categoria: 'camiseta',
    image: require('../../assets/images/blusa.webp'),
  },
  {
    id: 7,
    name: 'Imã de geladeira fruta',
    description: 'Imã decorativo, formato morango',
    price: 9.90,
    categoria: 'ima',
    image: require('../../assets/images/ima.webp'),
  },
  {
    id: 8,
    name: 'Imã mapa Brasil',
    description: 'Imã colorido, 5cm, viagens',
    price: 12.90,
    categoria: 'ima',
    image: require('../../assets/images/brasil.webp'),
  },
];

// ===== FILTROS =====
const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'caneca', label: 'Canecas' },
  { id: 'chaveiro', label: 'Chaveiros' },
  { id: 'porta-retrato', label: 'Porta-Retratos' },
  { id: 'ima', label: 'Imãs' },
  { id: 'camiseta', label: 'Camisetas' },
];

// ===== COMPONENTE PRINCIPAL =====
export default function LojaScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState('todos');

  // ===== FUNÇÕES DO CARRINHO =====
  const addOneToCart = (productId: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === productId);
      if (existing) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { id: productId, quantity: 1 }];
      }
    });
  };

  const removeOneFromCart = (productId: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === productId);
      if (!existing) return prevCart;
      if (existing.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  const removeAllFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getProductQuantity = (productId: number) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // ===== FUNÇÕES DE FILTRO =====
  const getFilteredProducts = () => {
    if (filter === 'todos') return products;
    return products.filter(p => p.categoria === filter);
  };

  // ===== FINALIZAR COMPRA =====
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione alguns itens ao carrinho!');
      return;
    }
    const total = getTotalPrice();
    Alert.alert(
      '🛒 Compra finalizada!',
      `Total: R$ ${total.toFixed(2).replace('.', ',')}\nObrigado pela sua compra!`,
      [
        {
          text: 'OK',
          onPress: clearCart,
        },
      ]
    );
  };

  // ===== FORMATAR PREÇO =====
  const formatPrice = (value: number) => {
    return value.toFixed(2).replace('.', ',');
  };

  // ===== RENDERIZAR PRODUTO =====
  const renderProduct = ({ item }: { item: Product }) => {
    const quantity = getProductQuantity(item.id);
    const inStock = quantity < 10;

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.productContent}
          onPress={() => {
            // Navegar para detalhes do produto
            router.push(`/loja/produto/${item.id}`);
          }}
        >
          <View style={styles.productImage}>
            <Image source={item.image} style={styles.productImageContent} />
          </View>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productCategory}>
            <Text style={styles.productCategoryText}>{item.categoria}</Text>
          </View>
          <Text style={styles.productPrice}>
            R$ {formatPrice(item.price)} <Text style={styles.priceSmall}>cada</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAdd, !inStock && styles.btnAddDisabled]}
          onPress={() => addOneToCart(item.id)}
          disabled={!inStock}
        >
          <Ionicons name="cart-outline" size={18} color={inStock ? '#FFF' : '#5a4a3a'} />
          <Text style={[styles.btnAddText, !inStock && styles.btnAddTextDisabled]}>
            {inStock ? 'adicionar' : 'esgotado'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ===== RENDERIZAR ITEM DO CARRINHO =====
  const renderCartItem = ({ item }: { item: CartItem }) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return null;
    const subtotal = product.price * item.quantity;

    return (
      <View style={styles.cartItem}>
        <Text style={styles.cartItemName}>
          {product.name} ({item.quantity}x)
        </Text>
        <View style={styles.cartItemActions}>
          <Text style={styles.cartItemPrice}>R$ {formatPrice(subtotal)}</Text>
          <TouchableOpacity
            style={styles.cartItemBtn}
            onPress={() => removeOneFromCart(item.id)}
          >
            <Ionicons name="remove-circle-outline" size={22} color="#b85a4a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartItemBtn}
            onPress={() => addOneToCart(item.id)}
          >
            <Ionicons name="add-circle-outline" size={22} color="#584128" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartItemBtn}
            onPress={() => removeAllFromCart(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#b85a4a" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ===== RENDER =====
  const filteredProducts = getFilteredProducts();

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
            <Text style={styles.logoSubtitle}>Produtos exclusivos</Text>
          </View>
        </View>

        {/* FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosContainer}
          contentContainerStyle={styles.filtrosContent}
        >
          {categorias.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filtroBtn, filter === cat.id && styles.filtroBtnActive]}
              onPress={() => setFilter(cat.id)}
            >
              <Text style={[styles.filtroBtnText, filter === cat.id && styles.filtroBtnTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TOOLBAR */}
        <View style={styles.toolbar}>
          <View style={styles.infoProdutos}>
            <Ionicons name="grid-outline" size={16} color="#584128" />
            <Text style={styles.infoProdutosText}>
              {filteredProducts.length} produtos
            </Text>
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={clearCart}>
            <Ionicons name="refresh-outline" size={16} color="#3d2a1a" />
            <Text style={styles.resetBtnText}>Limpar Carrinho</Text>
          </TouchableOpacity>
        </View>

        {/* GRADE DE PRODUTOS */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto nesta categoria</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
          />
        )}

        {/* CARRINHO */}
        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <Ionicons name="cart-outline" size={24} color="#584128" />
            <Text style={styles.cartTitle}>Seu Carrinho</Text>
          </View>

          {cart.length === 0 ? (
            <Text style={styles.cartEmpty}>Nenhum item adicionado</Text>
          ) : (
            <>
              <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                style={styles.cartItemsList}
              />
              <View style={styles.cartTotalRow}>
                <Text style={styles.cartTotalLabel}>Total:</Text>
                <Text style={styles.cartTotalValue}>
                  R$ {formatPrice(getTotalPrice())}
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.checkoutBtnText}>Finalizar Compra</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f5f0eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(88,65,40,0.25)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logo: {
    flex: 1,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c1810',
  },
  logoSubtitle: {
    fontSize: 12,
    color: '#5a4a3a',
    marginTop: 2,
  },
  filtrosContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(88,65,40,0.15)',
  },
  filtrosContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 40,
    backgroundColor: '#f4efe8',
    marginRight: 8,
  },
  filtroBtnActive: {
    backgroundColor: '#584128',
  },
  filtroBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3d2a1a',
  },
  filtroBtnTextActive: {
    color: '#fff9f9',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(88,65,40,0.1)',
  },
  infoProdutos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f4efe8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 40,
  },
  infoProdutosText: {
    fontSize: 14,
    color: '#3d2a1a',
    fontWeight: '500',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#cbbdb0',
  },
  resetBtnText: {
    fontSize: 14,
    color: '#3d2a1a',
    fontWeight: '500',
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  productCard: {
    flex: 0.48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    alignItems: 'center',
  },
  productContent: {
    alignItems: 'center',
    width: '100%',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f5f0',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6ddd2',
    marginBottom: 12,
  },
  productImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c1810',
    textAlign: 'center',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#5a4a3a',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  productCategory: {
    backgroundColor: '#f4efe8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 30,
    marginBottom: 8,
  },
  productCategoryText: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#7a6a5a',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c1810',
    marginBottom: 12,
  },
  priceSmall: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7a6a5a',
  },
  btnAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#584128',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 60,
    width: '100%',
  },
  btnAddDisabled: {
    backgroundColor: '#d6cbbc',
  },
  btnAddText: {
    color: '#fff9f9',
    fontWeight: '700',
    fontSize: 14,
  },
  btnAddTextDisabled: {
    color: '#5a4a3a',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#7a6a5a',
    fontSize: 16,
  },
  cartSection: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c1810',
  },
  cartEmpty: {
    color: '#8a7a6a',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  cartItemsList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f5f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#e6ddd2',
    marginBottom: 6,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c1810',
    flex: 1,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartItemPrice: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2c1810',
    marginRight: 8,
  },
  cartItemBtn: {
    padding: 4,
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#d6cbbc',
    borderStyle: 'dashed',
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c1810',
  },
  cartTotalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c1810',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2c1810',
    paddingVertical: 14,
    borderRadius: 60,
    marginTop: 12,
  },
  checkoutBtnText: {
    color: '#fff9f9',
    fontWeight: '700',
    fontSize: 16,
  },
  footerSpacer: {
    height: 20,
  },
});