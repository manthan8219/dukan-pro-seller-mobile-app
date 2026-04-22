import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';

import { fetchShopProducts, type UiShopProduct } from '../utils/shopProductsApi';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const colors = {
  surface: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  surfaceContainerHighest: '#e0e2ed',
  primary: '#006670',
  onPrimary: '#ffffff',
  primaryContainer: '#00818d',
  onPrimaryFixedVariant: '#004f56',
  secondary: '#8e4e00',
  onSecondary: '#ffffff',
  secondaryContainer: '#fd9000',
  onSecondaryContainer: '#613400',
  onSurface: '#181c23',
  onSurfaceVariant: '#414754',
  outline: '#717786',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Product = UiShopProduct;

// ─── Skeleton product card ─────────────────────────────────────────────────
const SkeletonProductCard = () => {
  const shimmer = useSharedValue(0.45);
  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 850, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.45, { duration: 850, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, []);
  const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  const cardW = (width - 48) / 2;
  return (
    <Animated.View style={[styles.productCard, shimmerStyle, { width: cardW }]}>
      <View style={[styles.productImageContainer, { backgroundColor: '#e2e8f0' }]} />
      <View style={{ padding: 12, gap: 8 }}>
        <View style={{ height: 14, width: '70%', borderRadius: 5, backgroundColor: '#e2e8f0' }} />
        <View style={{ height: 11, width: '50%', borderRadius: 5, backgroundColor: '#e2e8f0' }} />
        <View style={{ height: 16, width: '40%', borderRadius: 5, backgroundColor: '#e2e8f0', marginTop: 4 }} />
      </View>
    </Animated.View>
  );
};

// ─── Product card ──────────────────────────────────────────────────────────
const ProductCard = ({
  product,
  quantity,
  index,
  onAdd,
  onInc,
  onDec,
}: {
  product: Product;
  quantity: number;
  index: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) => {
  const cardW = (width - 48) / 2;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(450).springify().damping(14)}
      style={[styles.productCard, quantity > 0 && styles.productCardActive, { width: cardW }]}
    >
      <View style={styles.productImageContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[colors.primaryContainer, colors.primary]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        {quantity > 0 && (
          <View style={styles.inCartBadge}>
            <Text style={styles.inCartText}>{quantity} IN CART</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productDesc} numberOfLines={1}>{product.desc}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{product.price.toFixed(0)}</Text>
          {quantity > 0 ? (
            <View style={styles.counterContainer}>
              <Pressable onPress={onDec} style={styles.counterButton}>
                <MaterialIcons name="remove" size={14} color={colors.primary} />
              </Pressable>
              <Text style={styles.counterText}>{quantity}</Text>
              <Pressable onPress={onInc} style={styles.counterButtonActive}>
                <MaterialIcons name="add" size={14} color={colors.onPrimary} />
              </Pressable>
            </View>
          ) : (
            <Animated.View style={animStyle}>
              <Pressable
                onPressIn={() => { scale.value = withTiming(0.88, { duration: 80 }); }}
                onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
                onPress={onAdd}
                style={styles.addButton}
              >
                <MaterialIcons name="add" size={18} color={colors.onPrimary} />
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Screen ────────────────────────────────────────────────────────────────
export default function ShopDetailScreen({ navigation, route }: any) {
  const { shopId, shopName } = (route?.params ?? {}) as { shopId?: string; shopName?: string };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { updateCart, getQuantity, cartCount, cartTotal } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  // ── Fetch products ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      setError('No shop selected.');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchShopProducts(shopId)
      .then(({ products, error: fetchErr }) => {
        if (cancelled) return;
        setProducts(products);
        setError(fetchErr);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load products.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [shopId]);

  // ── Derived data ───────────────────────────────────────────────────────
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);


  const cartScale = useSharedValue(1);
  const cartAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: cartScale.value }] }));

  const favoriteScale = useSharedValue(1);
  const favoriteStyle = useAnimatedStyle(() => ({ transform: [{ scale: favoriteScale.value }] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Hero banner ── */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.heroSection}>
            <LinearGradient
              colors={['#004f56', colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <MaterialIcons name="storefront" size={160} color="rgba(255,255,255,0.08)" style={styles.heroBgIcon} />
            </LinearGradient>

            {/* Floating info card */}
            <View style={styles.heroCard}>
              <View style={styles.heroCardRow}>
                <View style={styles.heroCardInfo}>
                  <Text style={styles.heroTitle}>{shopName ?? 'Shop'}</Text>
                  <Text style={styles.heroSubtitle}>Gourmet & Handcrafted Goods</Text>
                  <View style={styles.heroStats}>
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={13} color={colors.onSecondaryContainer} />
                      <Text style={styles.ratingText}>4.9</Text>
                    </View>
                    <View style={styles.timeBadge}>
                      <MaterialIcons name="schedule" size={13} color={colors.onSurfaceVariant} />
                      <Text style={styles.timeText}>15–25 min</Text>
                    </View>
                  </View>
                </View>
                <AnimatedPressable
                  style={[styles.favoriteButton, favoriteStyle, isFavorite && styles.favoriteButtonActive]}
                  onPress={() => {
                    setIsFavorite((v) => !v);
                    favoriteScale.value = withSequence(
                      withTiming(0.7, { duration: 80 }),
                      withSpring(1, { damping: 8 }),
                    );
                  }}
                >
                  <MaterialIcons
                    name={isFavorite ? 'favorite' : 'favorite-border'}
                    size={20}
                    color={isFavorite ? '#ef4444' : colors.primary}
                  />
                </AnimatedPressable>
              </View>
            </View>
          </Animated.View>

          {/* ── Search & Filter ── */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.searchSection}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color={colors.outline} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search in this shop…"
                placeholderTextColor={colors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {!!searchQuery && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.searchClear}>
                  <MaterialIcons name="close" size={18} color={colors.outline} />
                </Pressable>
              )}
            </View>
            {!loading && categories.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
                    onPress={() => setActiveFilter(cat)}
                  >
                    <Text style={[styles.filterChipText, activeFilter === cat && styles.filterChipTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Animated.View>

          {/* ── Product Grid ── */}
          <View style={styles.productGrid}>
            {loading ? (
              <>{[0, 1, 2, 3].map((i) => <SkeletonProductCard key={i} />)}</>
            ) : error ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="wifi-off" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>Could not load products</Text>
                <Text style={styles.emptySubtitle}>{error}</Text>
              </View>
            ) : visibleProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="inventory-2" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery ? 'Try a different search term.' : 'This shop has no listed products yet.'}
                </Text>
              </View>
            ) : (
              visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={getQuantity(product.id)}
                  index={index}
                  onAdd={() => updateCart(product, 1)}
                  onInc={() => updateCart(product, 1)}
                  onDec={() => updateCart(product, -1)}
                />
              ))
            )}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

        {/* ── Header (absolute, sits over hero) ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation?.goBack()} style={styles.iconButton}>
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton} onPress={() => navigation?.navigate('Search')}>
              <MaterialIcons name="search" size={24} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* ── Sticky cart bar ── */}
        {cartCount > 0 && (
          <Animated.View entering={FadeInDown.springify()} style={[styles.cartBarContainer, cartAnimatedStyle]}>
            <Pressable
              onPressIn={() => { cartScale.value = withTiming(0.97, { duration: 80 }); }}
              onPressOut={() => { cartScale.value = withSpring(1, { damping: 12 }); }}
              onPress={() => navigation?.navigate('Cart')}
              style={styles.cartButton}
            >
              <View style={styles.cartButtonLeft}>
                <View style={styles.cartItemCountBadge}>
                  <Text style={styles.cartItemCountText}>
                    {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                  </Text>
                </View>
                <Text style={styles.cartViewText}>View Your Cart</Text>
              </View>
              <View style={styles.cartButtonRight}>
                <Text style={styles.cartPriceText}>₹{cartTotal.toFixed(0)}</Text>
                <MaterialIcons name="shopping-cart-checkout" size={20} color={colors.onSecondary} />
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // ── Hero
  heroSection: {
    marginBottom: 56,
    position: 'relative',
  },
  heroGradient: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
  },
  heroBgIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  heroCard: {
    position: 'absolute',
    bottom: -44,
    left: 16,
    right: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(193,198,215,0.12)',
  },
  heroCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroCardInfo: { flex: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: 12,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253,144,0,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(193,198,215,0.25)',
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderColor: 'rgba(239,68,68,0.2)',
  },

  // ── Header (absolute over hero)
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
    zIndex: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },

  // ── Search & filter
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 999,
    height: 48,
  },
  searchIcon: { paddingLeft: 16, paddingRight: 10 },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: colors.onSurface,
  },
  searchClear: {
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  filterChipTextActive: { color: colors.onPrimary, fontWeight: '600' },

  // ── Product grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(193,198,215,0.1)',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  productCardActive: {
    borderColor: 'rgba(0,102,112,0.22)',
    elevation: 5,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceContainerLow,
    position: 'relative',
  },
  productImage: { width: '100%', height: '100%' },
  inCartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inCartText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.onSecondary,
    letterSpacing: 0.3,
  },
  productInfo: { padding: 12 },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 3,
    lineHeight: 18,
  },
  productDesc: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,129,141,0.1)',
    borderRadius: 14,
    padding: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,102,112,0.18)',
  },
  counterButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimaryFixedVariant,
    minWidth: 16,
    textAlign: 'center',
  },

  // ── Cart bar
  cartBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 40,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    height: 56,
    borderRadius: 999,
    paddingHorizontal: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cartButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartItemCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cartItemCountText: { fontSize: 13, fontWeight: '700', color: colors.onSecondary },
  cartViewText: { fontSize: 14, fontWeight: '600', color: colors.onSecondary },
  cartButtonRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartPriceText: { fontSize: 16, fontWeight: '800', color: colors.onSecondary },

  // ── Empty state
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 24,
  },

  // Legacy stubs to avoid missing-key warnings
  headerTitle: { fontSize: 18 },
  navButton: { alignItems: 'center' },
  navButtonActive: { alignItems: 'center' },
  navText: { fontSize: 11 },
  navTextActive: { fontSize: 11 },
  bottomNav: { flexDirection: 'row' },
});
