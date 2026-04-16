import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useAddress } from '../context/AddressContext';
import { useNearbyShops } from '../hooks/useNearbyShops';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const categories = [
  { id: '1', name: 'Oil & Ghee',   icon: 'water-drop',    type: 'mi', bg: '#ffdcc1', color: '#2e1500' },
  { id: '2', name: 'Pulses & Dal', icon: 'grass',          type: 'mi', bg: '#92f1fe', color: '#001f23' },
  { id: '3', name: 'Spices',       icon: 'eco',            type: 'mi', bg: '#ffdf9e', color: '#261a00' },
  { id: '4', name: 'Flours',       icon: 'bakery-dining',  type: 'mi', bg: '#ffdad6', color: '#93000a' },
  { id: '5', name: 'More',         icon: 'more-horiz',     type: 'mi', bg: '#e6e8f3', color: '#414754' },
];

// ─── Skeleton shimmer card ─────────────────────────────────────────────────
const SkeletonCard = () => {
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

  return (
    <Animated.View style={[styles.shopCard, shimmerStyle]}>
      <View style={[styles.shopImageContainer, { backgroundColor: '#e2e8f0' }]} />
      <View style={{ padding: 20, gap: 10 }}>
        <View style={[styles.skeletonBlock, { height: 18, width: '55%', borderRadius: 6 }]} />
        <View style={[styles.skeletonBlock, { height: 13, width: '35%', borderRadius: 6 }]} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View style={[styles.skeletonBlock, { height: 24, width: 68, borderRadius: 6 }]} />
          <View style={[styles.skeletonBlock, { height: 24, width: 88, borderRadius: 6 }]} />
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Animated shop card ────────────────────────────────────────────────────
const ShopCard = ({
  shop,
  index,
  onPress,
}: {
  shop: { imageUrl: string; name: string; category: string; distance: string; rating: string; tags: string[] };
  index: number;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500).springify().damping(14)}>
      <AnimatedPressable
        style={[styles.shopCard, animatedStyle]}
        onPress={onPress}
        onPressIn={() => { scale.value = withTiming(0.97, { duration: 80 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
      >
        <View style={styles.shopImageContainer}>
          {shop.imageUrl ? (
            <Image source={{ uri: shop.imageUrl }} style={styles.shopImage} />
          ) : (
            <LinearGradient
              colors={['#00818d', '#006670']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          {/* Bottom-fade overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.42)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0.45 }}
            end={{ x: 0, y: 1 }}
          />
          {/* Rating – top right */}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#eab308" />
            <Text style={styles.ratingText}>{shop.rating}</Text>
          </View>
          {/* Distance – bottom left over gradient */}
          {!!shop.distance && (
            <View style={styles.distanceBadge}>
              <MaterialIcons name="near-me" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.distanceBadgeText}>{shop.distance}</Text>
            </View>
          )}
        </View>

        <View style={styles.shopInfo}>
          <Text style={styles.shopTitle} numberOfLines={1}>{shop.name}</Text>
          <Text style={styles.shopType}>{shop.category}</Text>
          {shop.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {shop.tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ─── Screen ────────────────────────────────────────────────────────────────
export default function GroceryHomeScreen({ navigation }: any) {
  const { activeAddress } = useAddress();
  const { shops: nearbyShops, loading: shopsLoading, error: shopsError, refetch } =
    useNearbyShops(activeAddress);

  const heroButtonScale = useSharedValue(1);
  const heroButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: heroButtonScale.value }] }));

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <Animated.View entering={FadeInDown.duration(700)} style={styles.section}>
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['#006670', '#00818d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroGlow} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Fresh pantry essentials at your door.</Text>
              <Text style={styles.heroSubtitle}>
                Discover local Kirana stores for your daily pulses, oils, and fresh farm produce.
              </Text>
              <AnimatedPressable
                style={[styles.heroButton, heroButtonStyle]}
                onPress={() => navigation.navigate('Categories')}
                onPressIn={() => { heroButtonScale.value = withSpring(0.92, { damping: 12 }); }}
                onPressOut={() => { heroButtonScale.value = withSpring(1, { damping: 12 }); }}
              >
                <Text style={styles.heroButtonText}>Shop Local Kirana</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#613400" />
              </AnimatedPressable>
            </View>
            <MaterialIcons
              name="shopping-basket"
              size={130}
              color="rgba(255,255,255,0.1)"
              style={styles.heroIcon}
            />
          </View>
        </Animated.View>

        {/* ── Categories ── */}
        <Animated.View entering={FadeInDown.delay(110).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pantry Categories</Text>
            <Pressable onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((cat, index) => (
              <Animated.View key={cat.id} entering={FadeInRight.delay(index * 65).duration(400)} style={styles.categoryItem}>
                <Pressable
                  style={[styles.categoryIconContainer, { backgroundColor: cat.bg }]}
                  onPress={() => navigation.navigate('Categories')}
                >
                  {cat.type === 'mi' ? (
                    <MaterialIcons name={cat.icon as any} size={28} color={cat.color} />
                  ) : (
                    <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.color} />
                  )}
                </Pressable>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Nearby Kirana Stores ── */}
        <Animated.View entering={FadeInDown.delay(220).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Kirana Stores</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Open Now</Text>
            </View>
          </View>

          <View style={styles.shopsGrid}>
            {shopsLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : shopsError ? (
              <View style={styles.emptyShops}>
                <MaterialIcons name="wifi-off" size={48} color="#cbd5e1" />
                <Text style={styles.emptyShopsTitle}>Could not load stores</Text>
                <Text style={styles.emptyShopsSubtitle}>{shopsError}</Text>
                <Pressable style={styles.emptyShopsButton} onPress={refetch}>
                  <Text style={styles.emptyShopsButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : nearbyShops.length === 0 ? (
              <View style={styles.emptyShops}>
                <MaterialIcons name="store" size={48} color="#cbd5e1" />
                <Text style={styles.emptyShopsTitle}>No Kirana stores nearby</Text>
                <Text style={styles.emptyShopsSubtitle}>
                  {activeAddress
                    ? `No stores found near ${activeAddress.city}.`
                    : 'Set a delivery address to see stores near you.'}
                </Text>
                <Pressable
                  style={styles.emptyShopsButton}
                  onPress={() => navigation.navigate('Address')}
                >
                  <Text style={styles.emptyShopsButtonText}>
                    {activeAddress ? 'Change Address' : 'Add Address'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              nearbyShops.map((shop, index) => (
                <ShopCard
                  key={shop.id}
                  index={index}
                  shop={shop}
                  onPress={() => navigation.navigate(shop.screenTarget, { shopId: shop.id, shopName: shop.name })}
                />
              ))
            )}

            {/* Featured promo card */}
            {!shopsLoading && (
              <Animated.View
                entering={FadeInDown.delay((nearbyShops.length + 1) * 100).duration(500)}
                style={styles.featuredCard}
              >
                <LinearGradient
                  colors={['#00818d', '#005f69']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>Kirana Premium</Text>
                  <Text style={styles.featuredSubtitle}>
                    Enjoy unlimited free delivery from all local Kirana partners.
                  </Text>
                  <Pressable style={styles.featuredButton} onPress={() => navigation.navigate('Cart')}>
                    <Text style={styles.featuredButtonText}>Upgrade Now</Text>
                  </Pressable>
                </View>
                <MaterialIcons
                  name="verified"
                  size={130}
                  color="rgba(255,255,255,0.1)"
                  style={styles.featuredIcon}
                />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 40,
  },

  // ── Hero
  heroContainer: {
    borderRadius: 28,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 220,
    justifyContent: 'center',
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 100,
  },
  heroContent: {
    zIndex: 10,
    maxWidth: '80%',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroSubtitle: {
    color: '#f6feff',
    opacity: 0.9,
    fontSize: 14,
    marginBottom: 28,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: '#fd9000',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroButtonText: {
    color: '#613400',
    fontWeight: '700',
    fontSize: 14,
  },
  heroIcon: {
    position: 'absolute',
    right: -20,
    top: '50%',
    transform: [{ translateY: -65 }],
  },

  // ── Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181c23',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006670',
  },

  // ── Categories
  categoriesList: {
    gap: 20,
    paddingRight: 24,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#181c23',
  },
  badge: {
    backgroundColor: '#ebedf9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },

  // ── Shop cards
  shopsGrid: {
    gap: 20,
  },
  shopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 5,
  },
  shopImageContainer: {
    height: 196,
    position: 'relative',
    backgroundColor: '#ebedf9',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.93)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181c23',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  shopInfo: {
    padding: 20,
    paddingTop: 18,
  },
  shopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  shopTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  shopTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  shopType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#006670',
  },
  shopDistance: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f1f3fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#181c23',
  },

  // ── Skeleton
  skeletonBlock: {
    backgroundColor: '#e2e8f0',
  },

  // ── Featured card
  featuredCard: {
    borderRadius: 24,
    padding: 28,
    minHeight: 188,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 7,
  },
  featuredContent: {
    zIndex: 10,
    flex: 1,
    maxWidth: '75%',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.85,
    lineHeight: 20,
    marginBottom: 24,
  },
  featuredButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  featuredButtonText: {
    color: '#006670',
    fontWeight: '700',
    fontSize: 13,
  },
  featuredIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },

  // ── Empty states
  emptyShops: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyShopsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },
  emptyShopsSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  emptyShopsButton: {
    marginTop: 8,
    backgroundColor: '#006670',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyShopsButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Legacy layout refs (unused but stable)
  header: { flexDirection: 'row' },
  headerLeft: { flexDirection: 'row' },
  locationTextContainer: { flexDirection: 'column' },
  locationLabel: { fontSize: 10 },
  locationValue: { fontSize: 14 },
  headerRight: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  avatar: { height: 32 },
  bottomNav: { position: 'absolute' },
  navItem: { alignItems: 'center' },
  navItemActive: { alignItems: 'center' },
  navText: { fontSize: 11 },
  navTextActive: { fontSize: 11 },
});
