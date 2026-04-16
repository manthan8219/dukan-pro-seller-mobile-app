import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TermsOfServiceScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.date}>Last Updated: October 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Radiant Market. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our app.
          </Text>

          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          <Text style={styles.paragraph}>
            You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
          </Text>

          <Text style={styles.sectionTitle}>3. Purchases and Payments</Text>
          <Text style={styles.paragraph}>
            All transactions made through the platform are subject to our payment policies. We are not responsible for pricing errors or disputes directly with independent merchants, though we offer mediation services.
          </Text>

          <Text style={styles.sectionTitle}>4. User Content</Text>
          <Text style={styles.paragraph}>
            Any content you submit, including reviews and ratings, must be accurate and not violate any laws. We reserve the right to remove any content at our discretion.
          </Text>

          <Text style={styles.sectionTitle}>5. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your access to the service if you violate these terms or engage in fraudulent activities.
          </Text>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
});
