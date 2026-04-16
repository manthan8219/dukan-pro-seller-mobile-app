import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OrderHistoryScreen({ navigation }: any) {
  const orders = [
    {
      id: '1',
      store: 'Artisan Bakery & Deli',
      date: 'Mar 24, 2024',
      amount: '$42.50',
      items: '3 items',
      status: 'DELIVERED',
      icon: 'shopping-basket'
    },
    {
      id: '2',
      store: 'The Flower Collective',
      date: 'Mar 20, 2024',
      amount: '$89.00',
      items: '1 item',
      status: 'DELIVERED',
      icon: 'local-florist'
    },
    {
      id: '3',
      store: 'Volt Electronics',
      date: 'Mar 15, 2024',
      amount: '$120.00',
      items: '2 items',
      status: 'DELIVERED',
      icon: 'devices'
    },
    {
      id: '4',
      store: 'Green Life Grocers',
      date: 'Mar 10, 2024',
      amount: '$35.25',
      items: '8 items',
      status: 'DELIVERED',
      icon: 'eco'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {orders.map((order, index) => (
          <Animated.View key={order.id} entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity 
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderTracking')}
            >
              <View style={styles.orderTop}>
                <View style={styles.orderIconBg}>
                  <MaterialIcons name={order.icon as any} size={24} color="#006670" />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderStore}>{order.store}</Text>
                  <Text style={styles.orderMeta}>{order.date} • {order.items}</Text>
                </View>
                <Text style={styles.orderAmount}>{order.amount}</Text>
              </View>
              
              <View style={styles.orderBottom}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
                <TouchableOpacity style={styles.reorderBtn}>
                  <Text style={styles.reorderBtnText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    padding: 20,
  },
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
    marginBottom: 16,
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
  orderInfo: {
    flex: 1,
  },
  orderStore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f766e',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#065f46',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reorderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f3fe',
    borderRadius: 20,
  },
  reorderBtnText: {
    color: '#006670',
    fontWeight: '600',
    fontSize: 13,
  },
});
