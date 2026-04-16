import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FavoritesScreen({ navigation }: any) {
  const favorites = [
    {
      id: '1',
      name: 'Volt Electronics',
      type: 'Tech & Repairs',
      rating: '4.9',
      distance: '2.1 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpkoJu4nL-cCyFdbcu_XiHvW5HBejtAU-zvumyjmGoF-x7zkZXabD4xHtj7dVYLc2OASuVN6401QsGsf1XQX2bgLqw5xFLMx5f2dZ8VSlb-DgcUada4Zm59nkhznK1OKfnTBwhSMQ7KzIT_-tw4ktFT2J-EX1W84wOPDCuMWuO1soVSiIgbIm5TLKD2nuVHZwsIZEFjhfBjYvLXAw5SF5osUO2_CvFT4pTpky7YHJZh35Pjg9EbH9GGKc5qnvpOGcFGlNMBy8s_irV',
      tags: ['Certified Repair', 'New Arrivals'],
    },
    {
      id: '2',
      name: 'Green Life Grocers',
      type: 'Organic Market',
      rating: '4.5',
      distance: '1.2 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_uBOrq2SVmJB_WSkfEhVVj9Y-QXXsngXzFFbrZxiryMsl-tWbzj9fml3ZVvw37d3adqogr_2xO9J70NJ6GrbTdfw9mKXKy2OlLBA13ZRNvV_dK7xvqbL2NcQPZBgtQb62hOnBc5iQgYPXEJmMvEsa8ZKu5CzqyRqKNDw5w-xLBfujKvkHCAqS6lMDxoaYnbijMuW4HRUrtPC2fLePWhDCC5BC1pT1pwouVTVAbg0FjOPI9SZEEcoErFSZ0S_9OyuJOy7XbxeWqMdq',
      tags: ['Eco-Friendly', 'Locally Sourced'],
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {favorites.length > 0 ? (
          favorites.map((shop, index) => (
            <Animated.View key={shop.id} entering={FadeInDown.delay(index * 100).springify()}>
              <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ShopDetail')}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: shop.image }} style={styles.image} />
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={14} color="#eab308" />
                    <Text style={styles.ratingText}>{shop.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.heartButton}>
                    <MaterialIcons name="favorite" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.info}>
                  <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                  <Text style={styles.shopType}>{shop.type}</Text>
                  <Text style={styles.distance}>{shop.distance}</Text>
                  <View style={styles.tagsContainer}>
                    {shop.tags.map((tag, i) => (
                      <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="favorite-border" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>Tap the heart icon on any shop to add it to your favorites.</Text>
          </View>
        )}
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
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181c23',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 20,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 4,
  },
  shopType: {
    fontSize: 13,
    fontWeight: '500',
    color: '#006670',
    marginBottom: 4,
  },
  distance: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#f1f3fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#181c23',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181c23',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
