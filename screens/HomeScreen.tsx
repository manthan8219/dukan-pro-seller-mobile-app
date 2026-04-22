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
  Dimensions,
  Platform,
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
  Easing,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { useAddress } from '../context/AddressContext';
import { useNearbyShops } from '../hooks/useNearbyShops';

const { width } = Dimensions.get('window');

const colors = {
  background: '#f9f9ff',
  onBackground: '#181c23',
  primary: '#006670',
  primaryContainer: '#00818d',
  onPrimaryContainer: '#f6feff',
  secondaryContainer: '#fd9000',
  onSecondaryContainer: '#613400',
  surfaceContainer: '#ebedf9',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  primaryFixedDim: '#75d5e2',
  onPrimaryFixed: '#001f23',
  secondaryFixed: '#ffdcc1',
  tertiaryFixed: '#ffdf9e',
  errorContainer: '#ffdad6',
  surfaceContainerHigh: '#e6e8f3',
  onSurface: '#181c23',
  outline: '#717786',
  surface: '#f9f9ff',
  slate500: '#64748b',
  teal700: '#0f766e',
  teal100: '#ccfbf1',
  teal900: '#134e4a',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

// ─── Category chip ─────────────────────────────────────────────────────────
const CategoryItem = ({
  icon,
  label,
  bgColor,
  iconColor,
  onPress,
  index = 0,
}: {
  icon: any;
  label: string;
  bgColor: string;
  iconColor: string;
  onPress?: () => void;
  index?: number;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 65).duration(400)}>
      <AnimatedPressable
        style={[styles.categoryItemContainer, animatedStyle]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.84, { damping: 12, stiffness: 220 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 220 }); }}
      >
        <View style={[styles.categoryIconBox, { backgroundColor: bgColor }]}>
          <MaterialIcons name={icon} size={28} color={iconColor} />
        </View>
        <Text style={styles.categoryLabel}>{label}</Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ─── Shop card ─────────────────────────────────────────────────────────────
const ShopCard = ({
  image,
  title,
  category,
  distance,
  rating,
  tags,
  onPress,
  index = 0,
}: {
  image: string;
  title: string;
  category: string;
  distance: string;
  rating: string;
  tags: string[];
  onPress?: () => void;
  index?: number;
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
          {image ? (
            <Image source={{ uri: image }} style={styles.shopImage} />
          ) : (
            <LinearGradient
              colors={[colors.primaryContainer, colors.primary]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          {/* Bottom-fade overlay for premium depth */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.42)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0.45 }}
            end={{ x: 0, y: 1 }}
          />
          {/* Rating badge – top right */}
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={13} color="#eab308" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          {/* Distance – bottom left, over gradient */}
          {!!distance && (
            <View style={styles.distanceBadge}>
              <MaterialIcons name="near-me" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.distanceBadgeText}>{distance}</Text>
            </View>
          )}
        </View>

        <View style={styles.shopContent}>
          <Text style={styles.shopTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.shopCategory}>{category}</Text>
          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tagBadge}>
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
export default function HomeScreen({ navigation }: { navigation: any }) {
  const heroButtonScale = useSharedValue(1);
  const { activeAddress } = useAddress();
  const { shops: nearbyShops, loading: shopsLoading, error: shopsError, refetch } =
    useNearbyShops(activeAddress);

  const heroButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroButtonScale.value }],
  }));

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero ── */}
        <Animated.View entering={FadeInDown.duration(700)} style={styles.heroSection}>
          <LinearGradient
            colors={[colors.primary, colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Find local treasures near you.</Text>
              <Text style={styles.heroSubtitle}>
                Discover artisan shops, fresh groceries, and tech hubs within your neighbourhood.
              </Text>
              <AnimatedPressable
                style={[styles.heroButton, heroButtonAnimatedStyle]}
                onPress={() => navigation.navigate('GroceryHome')}
                onPressIn={() => { heroButtonScale.value = withSpring(0.92, { damping: 12 }); }}
                onPressOut={() => { heroButtonScale.value = withSpring(1, { damping: 12 }); }}
              >
                <Text style={styles.heroButtonText}>Explore Shops</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.onSecondaryContainer} />
              </AnimatedPressable>
            </View>
            <View style={styles.heroGlow} />
            <MaterialIcons
              name="storefront"
              size={140}
              color="rgba(255,255,255,0.12)"
              style={styles.heroIconBackground}
            />
          </LinearGradient>
        </Animated.View>

        {/* ── Categories ── */}
        <Animated.View entering={FadeInDown.delay(110).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <Pressable onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.sectionLink}>View All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            <CategoryItem index={0} icon="shopping-basket" label="Grocery"     bgColor={colors.secondaryFixed}     iconColor="#6c3a00"           onPress={() => navigation.navigate('GroceryHome')} />
            <CategoryItem index={1} icon="devices"          label="Electronics" bgColor="#92f1fe"                   iconColor={colors.onPrimaryFixed} onPress={() => navigation.navigate('GroceryHome')} />
            <CategoryItem index={2} icon="checkroom"        label="Fashion"     bgColor={colors.tertiaryFixed}      iconColor="#261a00"           onPress={() => navigation.navigate('GroceryHome')} />
            <CategoryItem index={3} icon="local-pharmacy"   label="Pharmacy"    bgColor={colors.errorContainer}     iconColor="#93000a"           onPress={() => navigation.navigate('GroceryHome')} />
            <CategoryItem index={4} icon="more-horiz"       label="More"        bgColor={colors.surfaceContainerHigh} iconColor="#414754"         onPress={() => navigation.navigate('GroceryHome')} />
          </ScrollView>
        </Animated.View>

        {/* ── Nearby Shops ── */}
        <Animated.View entering={FadeInDown.delay(220).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Shops</Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>Closest First</Text>
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
                <Text style={styles.emptyShopsTitle}>Could not load shops</Text>
                <Text style={styles.emptyShopsSubtitle}>{shopsError}</Text>
                <Pressable style={styles.emptyShopsButton} onPress={refetch}>
                  <Text style={styles.emptyShopsButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : nearbyShops.length === 0 ? (
              <View style={styles.emptyShops}>
                <MaterialIcons name="storefront" size={48} color="#cbd5e1" />
                <Text style={styles.emptyShopsTitle}>No shops nearby</Text>
                <Text style={styles.emptyShopsSubtitle}>
                  {activeAddress
                    ? `No shops found near ${activeAddress.city}.`
                    : 'Set a delivery address to see shops near you.'}
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
                  image={shop.imageUrl}
                  title={shop.name}
                  category={shop.category}
                  distance={shop.distance}
                  rating={shop.rating}
                  tags={shop.tags}
                  onPress={() => navigation.navigate(shop.screenTarget, { shopId: shop.id, shopName: shop.name, shopRating: shop.rating })}
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
                  <Text style={styles.featuredTitle}>Radiant Market+</Text>
                  <Text style={styles.featuredSubtitle}>
                    Get free delivery from all local shops with our premium membership.
                  </Text>
                  <Pressable style={styles.featuredButton} onPress={() => navigation.navigate('GroceryHome')}>
                    <Text style={styles.featuredButtonText}>Join Today</Text>
                  </Pressable>
                </View>
                <MaterialIcons name="verified" size={130} color="rgba(255,255,255,0.1)" style={styles.featuredIcon} />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  // ── Hero
  heroSection: {
    marginBottom: 40,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    padding: 32,
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 220,
    justifyContent: 'center',
  },
  heroContent: {
    zIndex: 10,
    maxWidth: '80%',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.onPrimaryContainer,
    opacity: 0.9,
    marginBottom: 28,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: colors.secondaryContainer,
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
    color: colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 14,
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
  heroIconBackground: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -70,
  },

  // ── Sections
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  filterBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate500,
  },

  // ── Categories
  categoriesList: {
    gap: 16,
    paddingRight: 24,
  },
  categoryItemContainer: {
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  categoryIconBox: {
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
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },

  // ── Shop cards
  shopsGrid: {
    gap: 20,
  },
  shopCard: {
    backgroundColor: colors.surfaceContainerLowest,
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
    backgroundColor: colors.surfaceContainer,
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.93)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
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
  shopContent: {
    padding: 20,
    paddingTop: 18,
  },
  shopTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  shopCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.onSurface,
  },

  // ── Skeleton
  skeletonBlock: {
    backgroundColor: '#e2e8f0',
  },

  // ── Featured card
  featuredCard: {
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 7,
  },
  featuredContent: {
    zIndex: 10,
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
  },
  featuredButtonText: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: colors.primary,
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

  // Legacy – unused but kept to avoid removal warnings
  header: { flexDirection: 'row' },
  headerLeft: { flexDirection: 'row' },
  headerLocationText: { flexDirection: 'column' },
  locationSubtitle: { fontSize: 10 },
  locationTitle: { fontSize: 14 },
  headerRight: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  avatar: { height: 32 },
  bottomNav: { position: 'absolute' },
  navItemActive: { alignItems: 'center' },
  navTextActive: { fontSize: 11 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 11 },
  shopHeaderRow: { flexDirection: 'row' },
  shopTitleBox: { flex: 1 },
  shopDistance: { fontSize: 12 },
});
