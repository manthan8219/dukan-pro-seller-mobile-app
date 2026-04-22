import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Platform, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { AddressRepository } from '../repositories/AddressRepository';
import type { Address } from '../models/Address';
import { getOrders, type OrderResponse } from '../services/OrderService';

const COLORS = {
  surface: '#f9f9ff',
  onSurface: '#181c23',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  surfaceContainer: '#ebedf9',
  surfaceContainerHigh: '#e6e8f3',
  primaryContainer: '#00818d',
  primary: '#006670',
  secondary: '#8e4e00',
  onSurfaceVariant: '#414754',
  outlineVariant: '#c1c6d7',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  teal700: '#0f766e',
  teal900: '#134e4a',
  teal100: '#ccfbf1',
  slate500: '#64748b'
};

// Animated pressable for subtle scaling
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TouchableScale = ({ children, style, onPress }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
}));

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={onPress}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};

const addressRepo = new AddressRepository();

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);

  const loadAddresses = useCallback(async () => {
    const saved = await addressRepo.getAll();
    setAddresses(saved);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const orders = await getOrders();
      setRecentOrders(orders.slice(0, 3));
    } catch {
      // silently ignore — not critical for profile screen
    }
  }, []);

  useEffect(() => {
    loadAddresses();
    loadOrders();
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
      loadOrders();
    });
    return unsubscribe;
  }, [navigation, loadAddresses, loadOrders]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const displayName = user?.displayName || 'Guest User';
  const displayEmail = user?.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Profile Header */}
          <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.profileSection}>
            <View style={styles.profileFloatBg} />
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                {user?.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarLetter}>{avatarLetter}</Text>
                  </View>
                )}
                <View style={styles.editBadge}>
                  <MaterialIcons name="edit" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{displayName}</Text>
                {displayEmail ? (
                  <View style={styles.profileInfoRow}>
                    <MaterialIcons name="mail" size={14} color={COLORS.onSurfaceVariant} />
                    <Text style={styles.profileInfoText}>{displayEmail}</Text>
                  </View>
                ) : null}
                {user?.phoneNumber ? (
                  <View style={styles.profileInfoRow}>
                    <MaterialIcons name="phone" size={14} color={COLORS.onSurfaceVariant} />
                    <Text style={styles.profileInfoText}>{user.phoneNumber}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Animated.View>

          {/* Delivery Addresses */}
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Addresses</Text>
              <TouchableScale onPress={() => navigation.navigate('Address')}>
                <Text style={styles.sectionAction}>Add New</Text>
              </TouchableScale>
            </View>

            {addresses.length === 0 ? (
              <TouchableScale style={styles.addressCard} onPress={() => navigation.navigate('Address')}>
                <View style={styles.addressCardRow}>
                  <View style={styles.addressCardLeft}>
                    <MaterialIcons name="add-location-alt" size={24} color={COLORS.outlineVariant} />
                    <View style={styles.addressContent}>
                      <Text style={styles.addressType}>No addresses saved</Text>
                      <Text style={styles.addressText}>Tap to add your first delivery address</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={COLORS.outlineVariant} />
                </View>
              </TouchableScale>
            ) : (
              addresses.map((addr) => (
                <TouchableScale
                  key={addr.id}
                  style={addr.isActive ? styles.addressCardActive : styles.addressCard}
                  onPress={() => navigation.navigate('Address')}
                >
                  <View style={styles.addressCardRow}>
                    <View style={styles.addressCardLeft}>
                      <MaterialIcons
                        name="location-on"
                        size={24}
                        color={addr.isActive ? COLORS.primary : COLORS.outlineVariant}
                      />
                      <View style={styles.addressContent}>
                        <Text style={styles.addressType}>{addr.label}</Text>
                        <Text style={styles.addressText}>{addr.street}{'\n'}{addr.city}{addr.zip ? `, ${addr.zip}` : ''}</Text>
                      </View>
                    </View>
                    <MaterialIcons name="more-vert" size={20} color={COLORS.outlineVariant} />
                  </View>
                </TouchableScale>
              ))
            )}
          </Animated.View>

          {/* Recent Orders */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              {recentOrders.length > 0 && (
                <Pressable onPress={() => navigation.navigate('OrderHistory')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              )}
            </View>
            {recentOrders.length === 0 ? (
              <TouchableScale style={styles.ordersPlaceholder} onPress={() => navigation.navigate('OrderHistory')}>
                <MaterialIcons name="receipt-long" size={36} color={COLORS.outlineVariant} />
                <Text style={styles.ordersPlaceholderTitle}>No orders yet</Text>
                <Text style={styles.ordersPlaceholderSubtitle}>Your recent orders will appear here.</Text>
              </TouchableScale>
            ) : (
              <View style={styles.ordersList}>
                {recentOrders.map((order) => (
                  <TouchableScale
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => navigation.navigate('OrderHistory')}
                  >
                    <View style={styles.orderCardLeft}>
                      <View style={styles.orderIconBg}>
                        <MaterialIcons name="storefront" size={20} color={COLORS.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderShop} numberOfLines={1}>
                          {order.shopDisplayName ?? 'Shop'}
                        </Text>
                        <Text style={styles.orderMeta}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderCardRight}>
                      <Text style={styles.orderAmount}>₹{(order.totalMinor / 100).toFixed(0)}</Text>
                      <View style={[styles.orderStatusDot, {
                        backgroundColor:
                          order.status === 'DELIVERED' ? '#10b981' :
                          order.status === 'CANCELLED' ? '#ef4444' : '#f59e0b'
                      }]} />
                    </View>
                  </TouchableScale>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Settings & Support */}
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Settings & Support</Text>
            <View style={styles.settingsContainer}>
              <TouchableScale style={styles.settingItem} onPress={() => navigation.navigate('Settings')}>
                <View style={styles.settingItemLeft}>
                  <MaterialIcons name="settings" size={22} color={COLORS.onSurfaceVariant} />
                  <Text style={styles.settingText}>App Settings</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={COLORS.outlineVariant} />
              </TouchableScale>
              
              <View style={styles.divider} />

              <TouchableScale style={styles.settingItem} onPress={() => navigation.navigate('Notifications')}>
                <View style={styles.settingItemLeft}>
                  <MaterialIcons name="notifications" size={22} color={COLORS.onSurfaceVariant} />
                  <Text style={styles.settingText}>Notifications</Text>
                </View>
                <View style={styles.settingItemRight}>
                  <View style={styles.notificationDot} />
                  <MaterialIcons name="chevron-right" size={22} color={COLORS.outlineVariant} />
                </View>
              </TouchableScale>

              <View style={styles.divider} />

              <TouchableScale style={styles.settingItem} onPress={() => navigation.navigate('HelpSupport')}>
                <View style={styles.settingItemLeft}>
                  <MaterialIcons name="help" size={22} color={COLORS.onSurfaceVariant} />
                  <Text style={styles.settingText}>Help & Support</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={COLORS.outlineVariant} />
              </TouchableScale>

              <View style={styles.divider} />

              <TouchableScale style={styles.logoutButton} onPress={handleLogout}>
                <View style={styles.settingItemLeft}>
                  <MaterialIcons name="logout" size={22} color={COLORS.error} />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
              </TouchableScale>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.footer}>
            <Text style={styles.footerTitle}>RADIANT MARKET V2.4.1</Text>
            <Text style={styles.footerSubtitle}>DESIGNED FOR CURATOR EXPERIENCES</Text>
          </Animated.View>

        </ScrollView>



      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface
},
  container: {
    flex: 1,
    position: 'relative'
},
  topAppBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)'
},
  topAppBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
},
  topAppBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.teal900,
    letterSpacing: -0.5
},
  searchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(241, 245, 249, 0.6)'
},
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 88, // 64 (header) + 24 (spacing)
    paddingBottom: 120, // Space for bottom nav
  },
  profileSection: {
    position: 'relative',
    marginBottom: 40
},
  profileFloatBg: {
    backgroundColor: COLORS.primaryContainer,
    height: 128,
    width: '100%',
    borderRadius: 16,
    position: 'absolute',
    top: -16,
    left: 0,
    opacity: 0.15
},
  profileCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
},
  avatarContainer: {
    position: 'relative'
},
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLowest,
},
  avatarPlaceholder: {
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
},
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
},
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerLowest
},
  profileInfo: {
    flex: 1
},
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -0.5,
    marginBottom: 6
},
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6
},
  profileInfoText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500'
},
  section: {
    marginBottom: 32
},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16
},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -0.5
},
  sectionAction: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14
},
  addressCardActive: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 12
},
  addressCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    marginBottom: 12
},
  addressCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
},
  addressCardLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1
},
  addressContent: {
    flex: 1
},
  addressType: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.onSurface
},
  addressText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20
},
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  ordersList: { gap: 10 },
  orderCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  orderIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderShop: { fontSize: 14, fontWeight: '700', color: COLORS.onSurface },
  orderMeta: { fontSize: 12, color: COLORS.slate500, marginTop: 2 },
  orderCardRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontSize: 14, fontWeight: '700', color: COLORS.teal700 },
  orderStatusDot: { width: 8, height: 8, borderRadius: 4 },
  ordersPlaceholder: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 10,
},
  ordersPlaceholderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
},
  ordersPlaceholderSubtitle: {
    fontSize: 13,
    color: COLORS.outlineVariant,
    textAlign: 'center',
    lineHeight: 20,
},
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceContainer
},
  settingsContainer: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
},
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.surfaceContainerLowest
},
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
},
  settingText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurface
},
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
},
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary
},
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.surfaceContainerLowest
},
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error
},
  footer: {
    paddingVertical: 24,
    alignItems: 'center'
},
  footerTitle: {
    fontSize: 12,
    color: COLORS.outlineVariant,
    fontWeight: '600',
    letterSpacing: 0.5
},
  footerSubtitle: {
    fontSize: 10,
    color: COLORS.outlineVariant,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
},
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20
},
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 12,
    backgroundColor: 'rgba(249, 249, 255, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
},
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6
},
  navItemActiveContainer: {
    alignItems: 'center',
    justifyContent: 'center'
},
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: COLORS.teal100,
    borderRadius: 24
},
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate500,
    marginTop: 4
},
  navTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.teal900,
    marginTop: 4
}
});
