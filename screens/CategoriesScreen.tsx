import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ALL_CATEGORIES = [
  { id: '1', name: 'Grocery', icon: 'shopping-basket', type: 'mi', bg: '#ffdcc1', color: '#6c3a00' },
  { id: '2', name: 'Electronics', icon: 'devices', type: 'mi', bg: '#92f1fe', color: '#001f23' },
  { id: '3', name: 'Fashion', icon: 'checkroom', type: 'mi', bg: '#ffdf9e', color: '#261a00' },
  { id: '4', name: 'Pharmacy', icon: 'local-pharmacy', type: 'mi', bg: '#ffdad6', color: '#93000a' },
  { id: '5', name: 'Hardware', icon: 'handyman', type: 'mi', bg: '#e6e8f3', color: '#414754' },
  { id: '6', name: 'Stationery', icon: 'edit', type: 'mi', bg: '#ccfbf1', color: '#0f766e' },
  { id: '7', name: 'Sports', icon: 'sports-soccer', type: 'mi', bg: '#fee2e2', color: '#991b1b' },
  { id: '8', name: 'Toys', icon: 'toys', type: 'mi', bg: '#fef3c7', color: '#92400e' },
  { id: '9', name: 'Home Decor', icon: 'chair', type: 'mi', bg: '#e0e7ff', color: '#3730a3' },
];

export default function CategoriesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {ALL_CATEGORIES.map((cat, index) => (
            <Animated.View key={cat.id} entering={FadeInDown.delay(index * 50).springify()} style={styles.gridItem}>
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => navigation.navigate('GroceryHome')}
              >
                <View style={[styles.iconContainer, { backgroundColor: cat.bg }]}>
                  {cat.type === 'mi' ? (
                    <MaterialIcons name={cat.icon as any} size={32} color={cat.color} />
                  ) : (
                    <MaterialCommunityIcons name={cat.icon as any} size={32} color={cat.color} />
                  )}
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    marginBottom: 24,
  },
  categoryCard: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
});
