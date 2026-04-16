import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#006670',
  primaryContainer: '#00818d',
  onPrimary: '#ffffff',
  onPrimaryFixedVariant: '#004f56',
  secondary: '#8e4e00',
  onSecondary: '#ffffff',
  secondaryContainer: '#fd9000',
  onSecondaryContainer: '#613400',
  surface: '#f9f9ff',
  onSurface: '#181c23',
  onSurfaceVariant: '#414754',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  surfaceContainerHighest: '#e0e2ed',
  outline: '#717786',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Backend DTO shape ─────────────────────────────────────────────────────
interface BackendProduct {
  id: string;
  productId: string;
  shopId: string;
  quantity: number;
  unit: string;
  priceMinor: number;
  minOrderQuantity: number;
  isListed: boolean;
  displayImageUrl: string;
  productName: string;
  productCategory: string | null;
  listingNotes: string | null;
}

// ─── UI product shape ──────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
}

function mapProduct(dto: BackendProduct): Product {
  const parts = [dto.productCategory, dto.unit].filter(Boolean);
  return {
    id: dto.productId,
    name: dto.productName,
    desc: parts.join(' · '),
    price: dto.priceMinor / 100,
    image: dto.displayImageUrl ?? '',
    category: dto.productCategory ?? 'Other',
  };
}

function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
}

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
            <Text style={styles.inCartBadgeText}>{quantity} IN CART</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productDesc} numberOfLines={1}>{product.desc}</Text>
        <View style={styles.productBottom}>
          <Text style={styles.productPrice}>₹{product.price.toFixed(0)}</Text>
          {quantity > 0 ? (
            <View style={styles.quantityControl}>
              <Pressable style={styles.quantityBtn} onPress={onDec}>
                <MaterialIcons name="remove" size={14} color={colors.primary} />
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable style={[styles.quantityBtn, styles.quantityBtnAdd]} onPress={onInc}>
                <MaterialIcons name="add" size={14} color={colors.onPrimary} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={onAdd}>
              <MaterialIcons name="add" size={18} color={colors.onPrimary} />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Screen ────────────────────────────────────────────────────────────────
export default function KiranaShopScreen({ navigation, route }: { navigation?: any; route?: any }) {
  const { shopId, shopName } = (route?.params ?? {}) as { shopId?: string; shopName?: string };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
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

    fetch(`${getApiBaseUrl()}/shops/${shopId}/products?listedOnly=true`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json() as Promise<BackendProduct[]>;
      })
      .then((dtos) => {
        if (cancelled) return;
        setProducts(dtos.map(mapProduct));
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load products.');
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
      const matchesSearch =
        !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, count]) => {
    const p = products.find((x) => x.id === id);
    return total + (p ? p.price * count : 0);
  }, 0);

  const handleUpdateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] ?? 0) + delta;
      const updated = { ...prev };
      if (next <= 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const favoriteScale = useSharedValue(1);
  const favoriteStyle = useAnimatedStyle(() => ({ transform: [{ scale: favoriteScale.value }] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconButton} onPress={() => navigation?.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {shopName ?? 'Kirana Store'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={() => navigation?.navigate('Search')}>
            <MaterialIcons name="search" size={24} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero banner ── */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.heroSection}>
            <LinearGradient
              colors={[colors.primary, colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroContent}>
                <Text style={styles.shopTitle}>{shopName ?? 'Kirana Store'}</Text>
                <Text style={styles.shopSubtitle}>Daily Groceries & Pantry Staples</Text>
                <View style={styles.shopStats}>
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={13} color={colors.onSecondaryContainer} />
                    <Text style={styles.ratingText}>4.7</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <MaterialIcons name="schedule" size={13} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.timeText}>10–20 min</Text>
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
                  size={22}
                  color={isFavorite ? '#ef4444' : '#ffffff'}
                />
              </AnimatedPressable>
              <MaterialIcons
                name="shopping-basket"
                size={120}
                color="rgba(255,255,255,0.1)"
                style={styles.heroBgIcon}
              />
            </LinearGradient>
          </Animated.View>

          {/* ── Search bar ── */}
          <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.searchSection}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color={colors.outline} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for dal, oil, spices…"
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
          </Animated.View>

          {/* ── Category filter chips ── */}
          {!loading && categories.length > 1 && (
            <Animated.View entering={FadeInDown.delay(140).duration(500)}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
              >
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
            </Animated.View>
          )}

          {/* ── Product grid ── */}
          <View style={styles.productGrid}>
            {loading ? (
              <>
                {[0, 1, 2, 3].map((i) => <SkeletonProductCard key={i} />)}
              </>
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
                  quantity={cart[product.id] ?? 0}
                  index={index}
                  onAdd={() => handleUpdateCart(product.id, 1)}
                  onInc={() => handleUpdateCart(product.id, 1)}
                  onDec={() => handleUpdateCart(product.id, -1)}
                />
              ))
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Sticky cart bar ── */}
        {cartItemsCount > 0 && (
          <Animated.View entering={FadeInDown.springify()} style={styles.cartBannerWrapper}>
            <Pressable style={styles.cartBanner} onPress={() => navigation?.navigate('Cart')}>
              <View style={styles.cartBannerLeft}>
                <View style={styles.cartItemsBadge}>
                  <Text style={styles.cartItemsBadgeText}>
                    {cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}
                  </Text>
                </View>
                <Text style={styles.cartBannerTitle}>View Your Cart</Text>
              </View>
              <View style={styles.cartBannerRight}>
                <Text style={styles.cartBannerTotal}>₹{cartTotal.toFixed(0)}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'rgba(249,249,255,0.95)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onPrimaryFixedVariant,
    letterSpacing: -0.3,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Hero
  heroSection: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 7,
  },
  heroBanner: {
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 140,
  },
  heroContent: {
    flex: 1,
    zIndex: 1,
  },
  shopTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  shopSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 14,
  },
  shopStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253,144,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
    color: 'rgba(255,255,255,0.85)',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroBgIcon: {
    position: 'absolute',
    right: -24,
    bottom: -24,
  },

  // ── Search
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 999,
    height: 48,
  },
  searchIcon: {
    paddingLeft: 16,
    paddingRight: 10,
  },
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

  // ── Filter chips
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    paddingHorizontal: 2,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // ── Product grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(193,198,215,0.12)',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  productCardActive: {
    borderColor: 'rgba(0,102,112,0.22)',
    shadowOpacity: 0.12,
    elevation: 5,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceContainerLow,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  inCartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inCartBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.onSecondary,
    letterSpacing: 0.3,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
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
  productBottom: {
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
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,129,141,0.1)',
    borderRadius: 14,
    padding: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,102,112,0.18)',
  },
  quantityBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnAdd: {
    backgroundColor: colors.primary,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimaryFixedVariant,
    minWidth: 16,
    textAlign: 'center',
  },

  // ── Cart banner
  cartBannerWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 40,
  },
  cartBanner: {
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
  cartBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartItemsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cartItemsBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSecondary,
  },
  cartBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSecondary,
  },
  cartBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBannerTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSecondary,
  },

  // ── Empty / error states
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
});
