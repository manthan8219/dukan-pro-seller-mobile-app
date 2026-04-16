import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen({ navigation }: any) {
  const [faceId, setFaceId] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Address')}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="person-outline" size={24} color="#475569" />
                <Text style={styles.itemText}>Personal Information</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Checkout')}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="payment" size={24} color="#475569" />
                <Text style={styles.itemText}>Payment Methods</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="location-on" size={24} color="#475569" />
                <Text style={styles.itemText}>Location Services</Text>
              </View>
              <Switch 
                value={locationServices} 
                onValueChange={setLocationServices}
                trackColor={{ false: '#cbd5e1', true: '#006670' }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="dark-mode" size={24} color="#475569" />
                <Text style={styles.itemText}>Dark Mode</Text>
              </View>
              <Switch 
                value={darkMode} 
                onValueChange={setDarkMode}
                trackColor={{ false: '#cbd5e1', true: '#006670' }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="face" size={24} color="#475569" />
                <Text style={styles.itemText}>Face ID / Biometrics</Text>
              </View>
              <Switch 
                value={faceId} 
                onValueChange={setFaceId}
                trackColor={{ false: '#cbd5e1', true: '#006670' }}
              />
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TermsOfService')}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="description" size={24} color="#475569" />
                <Text style={styles.itemText}>Terms of Service</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PrivacyPolicy')}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="privacy-tip" size={24} color="#475569" />
                <Text style={styles.itemText}>Privacy Policy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#181c23',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 60,
  },
});
