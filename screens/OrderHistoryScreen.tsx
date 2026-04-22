import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getOrders, type OrderResponse } from '../services/OrderService';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PLACED:           { label: 'Placed',           bg: '#dbeafe', text: '#1e40af' },
  CONFIRMED:        { label: 'Confirmed',         bg: '#e0f2fe', text: '#0369a1' },
  PROCESSING:       { label: 'Processing',        bg: '#fef9c3', text: '#854d0e' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  bg: '#ffedd5', text: '#c2410c' },
  DELIVERED:        { label: 'Delivered',         bg: '#d1fae5', text: '#065f46' },
  CANCELLED:        { label: 'Cancelled',         bg: '#fee2e2', text: '#991b1b' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(minor: number): string {
  return `₹${(minor / 100).toFixed(0)}`;
}

export default function OrderHistoryScreen({ navigation }: any) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006670" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <MaterialIcons name="wifi-off" size={48} color="#cbd5e1" />
          <Text style={styles.errorTitle}>Could not load orders</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="receipt-long" size={56} color="#cbd5e1" />
          <Text style={styles.errorTitle}>No orders yet</Text>
          <Text style={styles.errorSubtitle}>Your past orders will appear here.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {orders.map((order, index) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, bg: '#f1f5f9', text: '#475569' };
            const itemCount = order.items.length;
            const shopName = order.shopDisplayName ?? 'Shop';

            return (
              <Animated.View key={order.id} entering={FadeInDown.delay(index * 80).springify()}>
                <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
                  <View style={styles.orderTop}>
                    <View style={styles.orderIconBg}>
                      <MaterialIcons name="storefront" size={24} color="#006670" />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderStore} numberOfLines={1}>{shopName}</Text>
                      <Text style={styles.orderMeta}>
                        {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </Text>
                    </View>
                    <Text style={styles.orderAmount}>{formatAmount(order.itemsSubtotalMinor)}</Text>
                  </View>

                  {/* Item snapshots */}
                  <View style={styles.itemsList}>
                    {order.items.map((item) => (
                      <Text key={item.id} style={styles.itemLine} numberOfLines={1}>
                        · {item.productNameSnapshot} × {item.quantity}
                      </Text>
                    ))}
                  </View>

                  {/* Price breakdown */}
                  <View style={styles.priceBreakdown}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Items</Text>
                      <Text style={styles.priceValue}>{formatAmount(order.itemsSubtotalMinor)}</Text>
                    </View>
                    {order.deliveryFeeMinor > 0 && (
                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Delivery fee</Text>
                        <Text style={styles.priceValue}>{formatAmount(order.deliveryFeeMinor)}</Text>
                      </View>
                    )}
                    <View style={[styles.priceRow, styles.priceTotalRow]}>
                      <Text style={styles.priceTotalLabel}>Total</Text>
                      <Text style={styles.priceTotalValue}>{formatAmount(order.totalMinor)}</Text>
                    </View>
                  </View>

                  <View style={styles.orderBottom}>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                      <Text style={[styles.statusText, { color: statusCfg.text }]}>
                        {statusCfg.label.toUpperCase()}
                      </Text>
                    </View>
                    {order.paymentMethod && (
                      <Text style={styles.paymentMethod}>
                        {order.paymentMethod.toUpperCase()}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3fe',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#334155', textAlign: 'center' },
  errorSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  content: { padding: 20 },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e0f2f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  orderInfo: { flex: 1 },
  orderStore: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  orderMeta: { fontSize: 13, color: '#64748b' },
  orderAmount: { fontSize: 16, fontWeight: '700', color: '#0f766e' },
  itemsList: { marginBottom: 12 },
  itemLine: { fontSize: 13, color: '#64748b', lineHeight: 20 },
  priceBreakdown: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 13, color: '#64748b' },
  priceValue: { fontSize: 13, color: '#334155', fontWeight: '500' },
  priceTotalRow: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 6, marginTop: 2 },
  priceTotalLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  priceTotalValue: { fontSize: 13, fontWeight: '700', color: '#0f766e' },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  paymentMethod: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
});
