import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function MyRequestsScreen({ navigation }: any) {
  const requests = [
    {
      id: '1',
      title: 'MacBook Pro M3 Max',
      status: 'Active',
      bids: 5,
      time: 'Last bid: 2 hours ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5IPBkHLrLGkQ3O8BFqJCvqYHpgEyk0f8Ys5C9CYHm3On18-PI6OhXI52-e2Zs7xX_dkljOgFSXfcWBfUMOSKH1HPaQkJTLHv1h2JSihidVdd_Ua2y1YgOEbqnF7kw6WXGXpHm_3W8dzArJKiwViDKT6N8-OVP7EwtiwHNZnZdO_SokZo1pRtyzVGaSWZMAZeMx3-cyX7gDL429_AVCK4iJAPsmmvrnYD3bVjQFYD_fKp0xURiZtl7E4f9S0A-8w4Cun4zfIe55BtR'
    },
    {
      id: '2',
      title: 'Smart Watch Series 9',
      status: 'Waiting',
      bids: 0,
      time: 'Posted 1 day ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgIWHYkmvG1Q9qXy18CqJHINLoC2YPfWEBGF74oe7jnSRzQNrReFedN7fDbtIBs36cmndQyN6VlSJkzHEGkKAwQ_LJ0I5jo6L8G48h9RQy-BNDT55885G4ygTDvyD0GwPKp05pSdbsDxtDpVGphwICIaSrRc3sHbHYlrGluQ2Rbxkh3SfQp3_3UnZddqVAlLck1d_cLZaKUGGko-ebe1PVfeAycSpCupMF5VmxknxGlOaitRJvxHFuDUruvQ8Va-XOGEOEzP0ZxuuJ'
    },
    {
      id: '3',
      title: 'Sony Noise Cancelling Headphones',
      status: 'Completed',
      bids: 3,
      time: 'Accepted 4 days ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOy5Gb2FW5JZQaUCwlwVukmZQS4DKqbe75fI5x4CIdz6gqo5osjKpe0-PCVhVTYZQI0nli4lSn73RkBx4rju-NJrJ6QRrfgJEbXIlVspdrh31rFUGoof_JfH05Q768bVJIVd-AIBhAhtlXibdx5WQYnPFu_RL74DWyzwSjrsYxPymWHEzCLRNKzzYDayGLwO8Hp2z0IJMkk_O0OGgeoeI-nfbkPgTDgzbmFfMLcsfRbT60yJFRdFvjijGV7PE3c89fmho_oOLHGgAj'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Quotation Requests</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {requests.map((req, index) => (
          <Animated.View key={req.id} entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity 
              style={styles.requestCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('QuotationDetails')}
            >
              <Image source={{ uri: req.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{req.title}</Text>
                
                <View style={styles.statusRow}>
                  <MaterialIcons 
                    name={req.bids > 0 ? "local-offer" : "schedule"} 
                    size={16} 
                    color={req.bids > 0 ? "#006670" : "#64748b"} 
                  />
                  <Text style={[styles.statusText, { color: req.bids > 0 ? '#006670' : '#64748b' }]}>
                    {req.bids > 0 ? `${req.bids} Bids Received` : 'Waiting for bids'}
                  </Text>
                </View>

                <Text style={styles.timeText}>{req.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <TouchableOpacity 
          style={styles.newRequestBtn} 
          onPress={() => navigation.navigate('RequestQuotation')}
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
          <Text style={styles.newRequestBtnText}>New Request</Text>
        </TouchableOpacity>
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
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  newRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006670',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
  },
  newRequestBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
