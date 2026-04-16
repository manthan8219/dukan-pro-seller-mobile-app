import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HelpSupportScreen({ navigation }: any) {
  const [message, setMessage] = useState('');

  const faqs = [
    { q: 'How do I return an item?', a: 'You can initiate a return through your Order History within 7 days of delivery.' },
    { q: 'When will my order arrive?', a: 'Orders typically arrive within 30-45 minutes. Track your order on the Order Tracking page.' },
    { q: 'How do bids work?', a: 'Local shops bid on your request based on stock and pricing. You choose the best offer!' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.contactItem}>
              <MaterialIcons name="phone" size={24} color="#0f766e" />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Call Us</Text>
                <Text style={styles.contactSubtitle}>1-800-RADIANT</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.contactItem}>
              <MaterialIcons name="email" size={24} color="#0f766e" />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Email</Text>
                <Text style={styles.contactSubtitle}>support@radiantmarket.com</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Send a Message</Text>
          <View style={styles.messageBox}>
            <TextInput
              style={styles.input}
              placeholder="How can we help you today?"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[styles.sendButton, message.trim().length === 0 && styles.sendButtonDisabled]}
              disabled={message.trim().length === 0}
              onPress={() => {
                setMessage('');
                navigation.goBack();
              }}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, idx) => (
              <View key={idx} style={styles.faqCard}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Text style={styles.faqA}>{faq.a}</Text>
              </View>
            ))}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactContent: {
    marginLeft: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181c23',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 56,
  },
  messageBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    fontSize: 16,
    color: '#181c23',
    minHeight: 100,
  },
  sendButton: {
    backgroundColor: '#006670',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  faqContainer: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  faqQ: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  faqA: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});
