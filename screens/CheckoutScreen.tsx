import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

// Colors from the provided Tailwind config
const colors = {
  primary: '#006670',
  primaryContainer: '#00818d',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#f6feff',
  surface: '#f9f9ff',
  onSurface: '#181c23',
  onSurfaceVariant: '#414754',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  surfaceContainerHigh: '#e6e8f3',
  surfaceContainerHighest: '#e0e2ed',
  outline: '#717786',
  outlineVariant: '#c1c6d7',
  secondary: '#8e4e00',
  secondaryContainer: '#fd9000',
  tertiary: '#755700',
  tertiaryContainer: '#946f00'
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Reusable Animated Pressable Component
const ScaleButton = ({ children, onPress, style, activeScale = 0.95 }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
};
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => {
        scale.value = withSpring(activeScale, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      onPress={onPress}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
};

export default function CheckoutScreen({ navigation }: any) {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedSlot, setSelectedSlot] = useState('slot-2');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ScaleButton
              style={styles.iconButton}
              onPress={() => navigation?.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </ScaleButton>
            <Text style={styles.headerTitle}>Checkout</Text>
          </View>
          <ScaleButton style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
            <MaterialIcons name="shopping-basket" size={24} color={colors.primary} />
          </ScaleButton>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Progress Indicator */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Checkout Process</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressSegment, styles.progressSegmentActive]} />
              <View style={[styles.progressSegment, styles.progressSegmentActive]} />
              <View style={[styles.progressSegment, styles.progressSegmentInactive]} />
            </View>
          </View>

          {/* Delivery Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                <Text style={styles.addText}>Add New</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressContainer}>
              {/* Home Address */}
              <ScaleButton
                onPress={() => setSelectedAddress('home')}
                style={[
                  styles.addressCard,
                  selectedAddress === 'home'
                    ? styles.addressCardSelected
                    : styles.addressCardUnselected,
                ]}
              >
                <View style={styles.addressCardHeader}>
                  <View
                    style={[
                      styles.addressIconContainer,
                      { backgroundColor: `${colors.primary}1A` },
                    ]}
                  >
                    <MaterialIcons name="home" size={20} color={colors.primary} />
                  </View>
                  {selectedAddress === 'home' && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>SELECTED</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressTitle}>Home</Text>
                <Text style={styles.addressDesc}>
                  452 Azure Heights, West Wing, Sky Garden District, Bangalore - 560001
                </Text>
                <Text style={styles.addressPhone}>+91 98765 43210</Text>
              </ScaleButton>

              {/* Office Address */}
              <ScaleButton
                onPress={() => setSelectedAddress('office')}
                style={[
                  styles.addressCard,
                  selectedAddress === 'office'
                    ? styles.addressCardSelected
                    : styles.addressCardUnselected,
                ]}
              >
                <View style={styles.addressCardHeader}>
                  <View
                    style={[
                      styles.addressIconContainer,
                      { backgroundColor: colors.surfaceContainerHighest },
                    ]}
                  >
                    <MaterialIcons
                      name="work"
                      size={20}
                      color={colors.onSurfaceVariant}
                    />
                  </View>
                  {selectedAddress === 'office' && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>SELECTED</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressTitle}>Office</Text>
                <Text style={styles.addressDesc}>
                  Tech Park One, Block C, Level 4, Outer Ring Road, Bangalore - 560103
                </Text>
                <Text style={styles.addressPhone}>+91 98765 43210</Text>
              </ScaleButton>
            </View>
          </View>

          {/* Delivery Slot Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionTitle}>Delivery Slot</Text>
              <Text style={styles.sectionSubtitle}>
                Choose your preferred time for arrival
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.slotsScrollContainer}
            >
              {[
                {
                  id: 'slot-1',
                  day: 'Today',
                  time: '10 AM - 12 PM',
                  status: 'Available',
                  type: 'normal'
},
                {
                  id: 'slot-2',
                  day: 'Today',
                  time: '2 PM - 4 PM',
                  status: 'Fast Delivery',
                  type: 'selected'
},
                {
                  id: 'slot-3',
                  day: 'Today',
                  time: '6 PM - 8 PM',
                  status: 'Available',
                  type: 'normal'
},
                {
                  id: 'slot-4',
                  day: 'Tomorrow',
                  time: '8 AM - 10 AM',
                  status: 'Next Day',
                  type: 'normal'
},
              ].map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <ScaleButton
                    key={slot.id}
                    activeScale={0.92}
                    onPress={() => setSelectedSlot(slot.id)}
                    style={[
                      styles.slotCard,
                      isSelected ? styles.slotCardSelected : styles.slotCardNormal,
                      !isSelected && { opacity: 0.8 },
                    ]}
                  >
                    <View
                      style={[
                        styles.slotDayBadge,
                        isSelected
                          ? styles.slotDayBadgeSelected
                          : styles.slotDayBadgeNormal,
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotDayText,
                          isSelected
                            ? styles.slotDayTextSelected
                            : styles.slotDayTextNormal,
                        ]}
                      >
                        {slot.day}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.slotTimeText,
                        isSelected
                          ? styles.slotTimeTextSelected
                          : styles.slotTimeTextNormal,
                      ]}
                    >
                      {slot.time}
                    </Text>
                    <Text
                      style={[
                        styles.slotStatusText,
                        isSelected
                          ? styles.slotStatusTextSelected
                          : styles.slotStatusTextNormal,
                      ]}
                    >
                      {slot.status}
                    </Text>
                  </ScaleButton>
                );
              })}
            </ScrollView>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>

            <View style={styles.paymentContainer}>
              {[
                {
                  id: 'upi',
                  icon: 'account-balance-wallet',
                  title: 'UPI (Google Pay / PhonePe)',
                  desc: 'Instant & secure payments',
                  iconBg: `${colors.secondaryContainer}1A`, // secondary-container/10
                  iconColor: colors.secondary
},
                {
                  id: 'cards',
                  icon: 'credit-card',
                  title: 'Credit / Debit Card',
                  desc: 'Visa, Mastercard, RuPay',
                  iconBg: `${colors.primary}1A`,
                  iconColor: colors.primary
},
                {
                  id: 'cod',
                  icon: 'payments',
                  title: 'Cash on Delivery',
                  desc: 'Pay when your items arrive',
                  iconBg: `${colors.tertiaryContainer}1A`,
                  iconColor: colors.tertiary
},
              ].map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <ScaleButton
                    key={method.id}
                    onPress={() => setSelectedPayment(method.id)}
                    style={styles.paymentCard}
                  >
                    <View style={styles.paymentLeft}>
                      <View
                        style={[
                          styles.paymentIconContainer,
                          { backgroundColor: method.iconBg },
                        ]}
                      >
                        <MaterialIcons
                          name={method.icon as any}
                          size={20}
                          color={method.iconColor}
                        />
                      </View>
                      <View style={styles.paymentTextCol}>
                        <Text style={styles.paymentTitle}>{method.title}</Text>
                        <Text style={styles.paymentDesc}>{method.desc}</Text>
                      </View>
                    </View>
                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                  </ScaleButton>
                );
              })}
            </View>
          </View>

          {/* Order Summary Card */}
          <View style={styles.summarySection}>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>Order Summary</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items Subtotal (8)</Text>
                <Text style={styles.summaryValue}>₹1,240.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>
                  FREE
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryLabelWithIcon}>
                  <Text style={styles.summaryLabel}>Packaging Charges</Text>
                  <MaterialIcons name="info" size={14} color={colors.outline} />
                </View>
                <Text style={styles.summaryValue}>₹20.00</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>₹1,260.00</Text>
                </View>
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsText}>
                    <MaterialIcons name="savings" size={14} color={colors.secondary} />
                    {' Saved ₹145 today'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Shell */}
        <View style={styles.bottomShell}>
          <View style={styles.bottomShellContent}>
            <View style={styles.selectedPaymentInfo}>
              <Text style={styles.selectedPaymentLabel}>Selected Payment</Text>
              <View style={styles.selectedPaymentValueContainer}>
                <Text style={styles.selectedPaymentValue}>UPI Wallet</Text>
                <MaterialIcons
                  name="expand-more"
                  size={16}
                  color={colors.primary}
                />
              </View>
            </View>
            <ScaleButton style={styles.placeOrderButton} onPress={() => navigation.navigate('OrderTracking')}>
              <MaterialIcons name="shopping-bag" size={20} color={colors.onPrimary} />
              <Text style={styles.placeOrderText}>Place Order • ₹1,260.00</Text>
            </ScaleButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface
},
  container: {
    flex: 1,
    backgroundColor: colors.surface
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    zIndex: 50
},
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
},
  iconButton: {
    padding: 8,
    borderRadius: 24
},
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    fontWeight: '700',
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.5
},
  scrollView: {
    flex: 1
},
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 140, // Space for bottom shell
    paddingHorizontal: 16,
    maxWidth: 896,
    alignSelf: 'center',
    width: '100%'
},
  progressSection: {
    paddingHorizontal: 8,
    marginBottom: 32
},
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8
},
  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
},
  progressSegment: {
    height: 6,
    flex: 1,
    borderRadius: 9999
},
  progressSegmentActive: {
    backgroundColor: colors.primary
},
  progressSegmentInactive: {
    backgroundColor: colors.surfaceContainerHigh
},
  section: {
    marginBottom: 32
},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 8
},
  sectionHeaderCol: {
    marginBottom: 16,
    paddingHorizontal: 8
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    letterSpacing: -0.5
},
  sectionSubtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4
},
  addText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14
},
  addressContainer: {
    gap: 16
},
  addressCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1
},
  addressCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surfaceContainerLowest
},
  addressCardUnselected: {
    borderColor: 'transparent',
    backgroundColor: colors.surfaceContainerLow
},
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
},
  addressIconContainer: {
    padding: 8,
    borderRadius: 8
},
  selectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
},
  selectedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: -0.5
},
  addressTitle: {
    fontWeight: '700',
    color: colors.onSurface,
    fontSize: 16,
    marginBottom: 4
},
  addressDesc: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20
},
  addressPhone: {
    fontSize: 12,
    color: colors.outline,
    marginTop: 12,
    fontWeight: '500'
},
  slotsScrollContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 12
},
  slotCard: {
    width: 144,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    marginRight: 12
},
  slotCardNormal: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: 'rgba(0, 102, 112, 0.2)'
},
  slotCardSelected: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
    transform: [{ scale: 1.05 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
},
  slotDayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999
},
  slotDayBadgeNormal: {
    backgroundColor: 'rgba(0, 102, 112, 0.05)'
},
  slotDayBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
},
  slotDayText: {
    fontSize: 12,
    fontWeight: '700'
},
  slotDayTextNormal: {
    color: colors.primary
},
  slotDayTextSelected: {
    color: 'rgba(255, 255, 255, 0.8)'
},
  slotTimeText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
},
  slotTimeTextNormal: {
    color: colors.onSurface
},
  slotTimeTextSelected: {
    color: colors.onPrimary,
    fontWeight: '700'
},
  slotStatusText: {
    fontSize: 10
},
  slotStatusTextNormal: {
    color: colors.onSurfaceVariant
},
  slotStatusTextSelected: {
    color: 'rgba(255, 255, 255, 0.7)'
},
  paymentContainer: {
    gap: 12
},
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.2)', // outlineVariant/20
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
},
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
},
  paymentTextCol: {
    gap: 2
},
  paymentTitle: {
    fontWeight: '700',
    color: colors.onSurface,
    fontSize: 14
},
  paymentDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant
},
  radioContainer: {
    paddingLeft: 12
},
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center'
},
  radioOuterSelected: {
    borderColor: colors.primary
},
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
},
  summarySection: {
    marginTop: 48,
    marginBottom: 32,
    position: 'relative'
},
  summaryBadge: {
    position: 'absolute',
    top: -16,
    left: 24,
    zIndex: 10,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
},
  summaryBadgeText: {
    color: colors.onPrimaryContainer,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5
},
  summaryCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 32,
    paddingTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.1)',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4
},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
},
  summaryLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 14
},
  summaryLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
},
  summaryValue: {
    fontWeight: '700',
    color: colors.onSurface,
    fontSize: 14
},
  summaryDivider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
    marginVertical: 16
},
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
},
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
},
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.onSurface
},
  savingsContainer: {
    alignItems: 'flex-end'
},
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary
},
  bottomShell: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.15)',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    zIndex: 60
},
  bottomShellContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    maxWidth: 896,
    alignSelf: 'center',
    width: '100%'
},
  selectedPaymentInfo: {
    display: Platform.OS === 'web' ? 'flex' : 'none', // Only hide on small mobile views typically, but we'll show it or handle it
  },
  selectedPaymentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: -0.5
},
  selectedPaymentValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
},
  selectedPaymentValue: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 14
},
  placeOrderButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
},
  placeOrderText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 16
}
});
