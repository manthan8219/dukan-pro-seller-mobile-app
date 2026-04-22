import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useCart } from '../context/CartContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const theme = {
  primary: '#006670',
  primaryContainer: '#00818d',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#f6feff',
  secondary: '#8e4e00',
  onSecondary: '#ffffff',
  surface: '#f9f9ff',
  onSurface: '#181c23',
  onSurfaceVariant: '#414754',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  outlineVariant: '#c1c6d7'
};


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedPressableProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  activeScale?: number;
}

const AnimatedPressable = ({ onPress, children, style, activeScale = 0.95 }: AnimatedPressableProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
};
  });

  const handlePressIn = () => {
    scale.value = withSpring(activeScale, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      activeOpacity={0.8}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
};

interface CartScreenProps {
  navigation?: any;
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const { cartItemsList, cartCount, cartTotal, updateCart } = useCart();

  const DELIVERY_FEE = 50;
  const TAX_RATE = 0.05;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + DELIVERY_FEE + tax;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.surface} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AnimatedPressable onPress={() => navigation?.goBack()} style={styles.headerButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>GroceryCurator</Text>
        </View>
        <AnimatedPressable style={styles.headerButton} onPress={() => navigation.navigate('Cart')}>
          <View>
            <MaterialIcons name="shopping-basket" size={24} color={theme.primary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          </View>
        </AnimatedPressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.sectionHeader}>
          <Text style={styles.title}>My Basket</Text>
          <Text style={styles.subtitle}>Review your items before we get them delivered to you.</Text>
        </Animated.View>

        <View style={styles.cartList}>
          {cartItemsList.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.cartItem}>
              <Text style={[styles.itemDescription, { textAlign: 'center', flex: 1 }]}>Your basket is empty. Add items from a shop.</Text>
            </Animated.View>
          ) : (
            cartItemsList.map((entry, index) => (
              <Animated.View key={entry.product.id} entering={FadeInDown.duration(400).delay(200 + index * 100)} style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  {entry.product.image ? (
                    <Image source={{ uri: entry.product.image }} style={styles.itemImage} />
                  ) : null}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{entry.product.name}</Text>
                  <Text style={styles.itemDescription}>{entry.product.desc}</Text>
                  <Text style={styles.itemPrice}>₹{entry.product.price.toFixed(0)}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <AnimatedPressable style={styles.controlButton} onPress={() => updateCart(entry.product, 1)}>
                    <MaterialIcons name="add" size={16} color={theme.primary} />
                  </AnimatedPressable>
                  <Text style={styles.quantityText}>{entry.quantity}</Text>
                  <AnimatedPressable style={styles.controlButton} onPress={() => updateCart(entry.product, -1)}>
                    <MaterialIcons name={entry.quantity === 1 ? 'delete' : 'remove'} size={16} color={theme.primary} />
                  </AnimatedPressable>
                </View>
              </Animated.View>
            ))
          )}
        </View>

        <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.upsellSection}>
          <View style={styles.upsellCard}>
            <Text style={styles.upsellTitle}>Add Fresh Produce?</Text>
            <Text style={styles.upsellSubtitle}>Complete your meal with organic local farm vegetables.</Text>
          </View>
          <View style={styles.upsellImageWrapper}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAow7jEv4JkVIl4tPALiQw7i_Vk3D9ACgiNwmZm9thpKA7jXGwZAN6mY8zCNNDDc8-NFIjp_RIKxIaGE1jV_Iq5hal0R2VK6rv_IBUKHJn5hRFvDb28ao9L1MipFx-QlTWBjRNtjVW70PReoHzACB-uUO_mLdIcvDqvGEc1OVSSH1mAqxEoVhKMfHrLoSbrnm-Fcswl-BgpvqxA3iC-YwGXvzKKyyGG0t5DrC6A9bQ6gPPuCXAY0uuNb8E0FGLTK9xekvsLcEXeO9Db' }} 
              style={styles.upsellImage} 
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(700)} style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{cartTotal.toFixed(0)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>₹{DELIVERY_FEE.toFixed(0)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (5%)</Text>
            <Text style={styles.priceValueTax}>₹{tax.toFixed(0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(800)}>
          <AnimatedPressable style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <MaterialIcons name="arrow-forward" size={24} color={theme.onPrimary} />
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <AnimatedPressable style={styles.navItem} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <MaterialIcons name="home" size={24} color="rgba(24, 28, 35, 0.6)" />
          <Text style={styles.navItemText}>Home</Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.navItem} onPress={() => navigation.navigate('Main', { screen: 'GroceryHome' })}>
          <MaterialIcons name="storefront" size={24} color="rgba(24, 28, 35, 0.6)" />
          <Text style={styles.navItemText}>Shops</Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.navItemActive} onPress={() => navigation.navigate('Cart')}>
          <MaterialIcons name="add-shopping-cart" size={24} color={theme.primary} />
          <Text style={styles.navItemTextActive}>Cart</Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.navItem} onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
          <MaterialIcons name="person" size={24} color="rgba(24, 28, 35, 0.6)" />
          <Text style={styles.navItemText}>Profile</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.surface
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    zIndex: 50
},
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
},
  headerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4
},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    letterSpacing: -0.5
},
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
},
  badgeText: {
    color: theme.onSecondary,
    fontSize: 10,
    fontWeight: 'bold'
},
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 120,
    paddingHorizontal: 16
},
  sectionHeader: {
    marginBottom: 32
},
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.onSurface,
    letterSpacing: -0.5,
    marginBottom: 4
},
  subtitle: {
    fontSize: 14,
    color: theme.onSurfaceVariant
},
  cartList: {
    flexDirection: 'column',
    gap: 24
},
  cartItem: {
    backgroundColor: theme.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
},
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.surfaceContainerLow,
    overflow: 'hidden'
},
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
},
  itemDetails: {
    flex: 1
},
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.onSurface,
    marginBottom: 2
},
  itemDescription: {
    fontSize: 12,
    color: theme.onSurfaceVariant,
    marginBottom: 8
},
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.primary
},
  quantityControls: {
    backgroundColor: theme.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 8
},
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
},
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.onSurface
},
  upsellSection: {
    marginTop: 48,
    marginBottom: 32,
    position: 'relative'
},
  upsellCard: {
    backgroundColor: theme.primaryContainer,
    borderRadius: 12,
    padding: 32,
    minHeight: 160,
    justifyContent: 'center'
},
  upsellTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.onPrimaryContainer,
    marginBottom: 4
},
  upsellSubtitle: {
    fontSize: 14,
    color: theme.onPrimaryContainer,
    opacity: 0.9,
    maxWidth: '60%',
    lineHeight: 20
},
  upsellImageWrapper: {
    position: 'absolute',
    right: -8,
    top: 16,
    width: 128,
    height: 160,
    backgroundColor: theme.surfaceContainerLowest,
    borderRadius: 12,
    padding: 8,
    transform: [{ rotate: '6deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderColor: 'rgba(193, 198, 215, 0.15)',
    borderWidth: 1
},
  upsellImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover'
},
  priceBreakdown: {
    backgroundColor: theme.surfaceContainerLow,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'column',
    gap: 16
},
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
},
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.onSurfaceVariant
},
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.onSurface
},
  priceValueTax: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary
},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
    paddingTop: 16,
    marginTop: 8
},
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.onSurface
},
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.primary
},
  checkoutButton: {
    width: '100%',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4
},
  checkoutButtonText: {
    color: theme.onPrimary,
    fontSize: 18,
    fontWeight: 'bold'
},
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.15)',
    shadowColor: '#181c23',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 50
},
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
},
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 102, 112, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 24
},
  navItemText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(24, 28, 35, 0.6)',
    marginTop: 4
},
  navItemTextActive: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.primary,
    marginTop: 4
}
});
