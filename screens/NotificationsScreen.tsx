import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NotificationsScreen({ navigation }: any) {
  const notifications = [
    {
      id: '1',
      title: 'Order Delivered! 🎉',
      message: 'Your order from Artisan Bakery & Deli has been delivered to your front door.',
      time: '2 hours ago',
      icon: 'shopping-bag',
      bg: '#dcfce7',
      color: '#059669',
      unread: true,
    },
    {
      id: '2',
      title: 'New Bid on Your Request',
      message: 'Volt Electronics has placed a $1,250 bid on your MacBook Pro M3 Max request.',
      time: '5 hours ago',
      icon: 'local-offer',
      bg: '#e0f2fe',
      color: '#0284c7',
      unread: true,
    },
    {
      id: '3',
      title: 'Flash Sale: 20% off Groceries',
      message: 'Shop at Green Life Grocers today and save 20% on all fresh produce.',
      time: 'Yesterday',
      icon: 'flash-on',
      bg: '#fef08a',
      color: '#b45309',
      unread: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((notif, index) => (
          <Animated.View key={notif.id} entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity style={[styles.card, notif.unread && styles.cardUnread]}>
              <View style={[styles.iconContainer, { backgroundColor: notif.bg }]}>
                <MaterialIcons name={notif.icon as any} size={24} color={notif.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.title}>{notif.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
                <Text style={styles.time}>{notif.time}</Text>
              </View>
              {notif.unread && <View style={styles.unreadDot} />}
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'flex-start',
  },
  cardUnread: {
    borderColor: '#99f6e4',
    backgroundColor: '#f0fdfa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0f766e',
    marginTop: 4,
  },
});
