import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getOrders, type OrderResponse } from '../services/OrderService';

const colors = {
  primary: '#006670',
  surface: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f3fe',
  onSurface: '#181c23',
  onSurfaceVariant: '#414754',
  outline: '#717786',
  outlineVariant: '#c1c6d7',
};

type StatusStep = {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
};

const STATUS_STEPS: StatusStep[] = [
  { key: 'PLACED',           label: 'Order Placed',       icon: 'check-circle-outline', description: 'Your order has been received by the shop.' },
  { key: 'CONFIRMED',        label: 'Confirmed',          icon: 'thumb-up-alt',         description: 'The shop has confirmed your order.' },
  { key: 'PROCESSING',       label: 'Being Prepared',     icon: 'inventory',            description: 'Your items are being packed.' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery',   icon: 'local-shipping',       description: 'Your order is on its way.' },
  { key: 'DELIVERED',        label: 'Delivered',          icon: 'check-circle',         description: 'Your order has been delivered.' },
];

const CANCELLED_STEP: StatusStep = {
  key: 'CANCELLED',
  label: 'Cancelled',
  icon: 'cancel',
  description: 'This order was cancelled.',
};

function currentStepIndex(status: string): number {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

interface Props {
  navigation?: any;
  route?: any;
}

export default function OrderTrackingScreen({ navigation, route }: Props) {
  const orderId: string | undefined = route?.params?.orderId;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    getOrders()
      .then((orders) => {
        const found = orders.find((o) => o.id === orderId) ?? orders[0] ?? null;
        setOrder(found);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const isCancelled = order?.status === 'CANCELLED';
  const activeIndex = order ? currentStepIndex(order.status) : -1;
  const steps = isCancelled ? [] : STATUS_STEPS;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Status</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <MaterialIcons name="wifi-off" size={48} color={colors.outlineVariant} />
          <Text style={styles.errorTitle}>Could not load order</Text>
          <Text style={styles.errorSub}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Success / Cancelled banner */}
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.banner, isCancelled ? styles.bannerCancelled : styles.bannerSuccess]}>
            <MaterialIcons
              name={isCancelled ? 'cancel' : order?.status === 'DELIVERED' ? 'check-circle' : 'shopping-bag'}
              size={40}
              color={isCancelled ? '#991b1b' : colors.primary}
            />
            <Text style={[styles.bannerTitle, isCancelled && { color: '#991b1b' }]}>
              {isCancelled ? 'Order Cancelled' : order?.status === 'DELIVERED' ? 'Order Delivered!' : 'Order Placed!'}
            </Text>
            {order && (
              <Text style={styles.bannerSub}>
                {isCancelled
                  ? 'This order was cancelled.'
                  : order.status === 'DELIVERED'
                  ? 'Your items have been delivered.'
                  : 'We\'ll keep you updated as it progresses.'}
              </Text>
            )}
            {!order && (
              <Text style={styles.bannerSub}>Your order was successfully placed.</Text>
            )}
          </Animated.View>

          {/* Order summary row */}
          {order && (
            <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shop</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>{order.shopDisplayName ?? '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items</Text>
                <Text style={styles.summaryValue}>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: '700' }]}>
                  ₹{(order.totalMinor / 100).toFixed(0)}
                </Text>
              </View>
              {order.paymentMethod && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment</Text>
                  <Text style={styles.summaryValue}>{order.paymentMethod.toUpperCase()}</Text>
                </View>
              )}
              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryLabel}>Placed</Text>
                <Text style={styles.summaryValue}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Status timeline */}
          {isCancelled ? (
            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Order Status</Text>
              <View style={styles.step}>
                <View style={[styles.stepDot, { backgroundColor: '#fee2e2' }]}>
                  <MaterialIcons name="cancel" size={18} color="#991b1b" />
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepLabel, { color: '#991b1b' }]}>Cancelled</Text>
                  <Text style={styles.stepDesc}>This order was cancelled.</Text>
                </View>
              </View>
            </Animated.View>
          ) : steps.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Order Progress</Text>
              {steps.map((step, idx) => {
                const done = activeIndex >= idx;
                const active = activeIndex === idx;
                return (
                  <View key={step.key} style={styles.stepRow}>
                    {/* Connector line above (skip first) */}
                    <View style={styles.stepLeft}>
                      {idx > 0 && (
                        <View style={[styles.connector, done && styles.connectorDone]} />
                      )}
                      <View style={[styles.stepDot, done ? styles.stepDotDone : styles.stepDotPending, active && styles.stepDotActive]}>
                        <MaterialIcons
                          name={done ? 'check' : step.icon}
                          size={16}
                          color={done ? '#ffffff' : colors.outlineVariant}
                        />
                      </View>
                    </View>
                    <View style={[styles.stepBody, idx < steps.length - 1 && { marginBottom: 8 }]}>
                      <Text style={[styles.stepLabel, !done && styles.stepLabelPending, active && { color: colors.primary }]}>
                        {step.label}
                      </Text>
                      {(done || active) && (
                        <Text style={styles.stepDesc}>{step.description}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </Animated.View>
          )}

          {/* Item list */}
          {order && order.items.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.itemsCard}>
              <Text style={styles.timelineTitle}>Items Ordered</Text>
              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.productNameSnapshot}</Text>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemQty}>×{item.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{(item.lineTotalMinor / 100).toFixed(0)}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation?.navigate('Main', { screen: 'Home' })}
            activeOpacity={0.8}
          >
            <MaterialIcons name="home" size={20} color="#ffffff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '30',
  },
  headerButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  errorSub: { fontSize: 14, color: colors.outline, textAlign: 'center' },
  content: { padding: 20, gap: 16 },

  banner: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 10,
  },
  bannerSuccess: { backgroundColor: '#e0f2f1' },
  bannerCancelled: { backgroundColor: '#fee2e2' },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  bannerSub: { fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center' },

  summaryCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '30',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  summaryLabel: { fontSize: 14, color: colors.onSurfaceVariant },
  summaryValue: { fontSize: 14, color: colors.onSurface, maxWidth: '60%', textAlign: 'right' },

  timelineCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '30',
  },
  timelineTitle: { fontSize: 16, fontWeight: '700', color: colors.onSurface, marginBottom: 20 },

  stepRow: { flexDirection: 'row', gap: 16 },
  stepLeft: { alignItems: 'center', width: 32 },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: colors.outlineVariant,
    marginBottom: 4,
  },
  connectorDone: { backgroundColor: colors.primary },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: { backgroundColor: colors.primary },
  stepDotActive: { backgroundColor: '#00818d' },
  stepDotPending: { backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.outlineVariant },
  step: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stepBody: { flex: 1, paddingBottom: 12 },
  stepLabel: { fontSize: 15, fontWeight: '700', color: colors.onSurface, marginBottom: 2 },
  stepLabelPending: { color: colors.outline, fontWeight: '500' },
  stepDesc: { fontSize: 13, color: colors.onSurfaceVariant },

  itemsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '30',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  itemName: { fontSize: 14, color: colors.onSurface, flex: 1, marginRight: 12 },
  itemRight: { alignItems: 'flex-end', gap: 2 },
  itemQty: { fontSize: 12, color: colors.outline },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.primary },

  homeButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  homeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
