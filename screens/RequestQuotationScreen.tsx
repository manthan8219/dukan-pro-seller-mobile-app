import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

export default function RequestQuotationScreen({ navigation }) {
  // Form states
  const [item, setItem] = useState('');
  const [budget, setBudget] = useState('');
  const [specs, setSpecs] = useState('');

  // Reanimated values for upload box hover/press
  const uploadScale = useSharedValue(1);
  const handleUploadPressIn = () => {
    uploadScale.value = withSpring(0.95);
  };
  const handleUploadPressOut = () => {
    uploadScale.value = withSpring(1);
  };
  const uploadAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: uploadScale.value }]
};
  });

  // Reanimated values for submit button
  const submitScale = useSharedValue(1);
  const handleSubmitPressIn = () => {
    submitScale.value = withSpring(0.95);
  };
  const handleSubmitPressOut = () => {
    submitScale.value = withSpring(1);
  };
  const submitAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: submitScale.value }]
};
  });

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Request a Quotation</Text>
            <Text style={styles.heroDescription}>
              Let the best local shops bid on your next high-value purchase. Get the most competitive prices effortlessly.
            </Text>
          </View>

          {/* Form Column */}
          <View style={styles.formContainer}>
            {/* Item Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What are you looking for?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. MacBook Pro M3 Max, 64GB RAM"
                placeholderTextColor="#717786"
                value={item}
                onChangeText={setItem}
              />
            </View>

            {/* Target Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Budget</Text>
              <View style={styles.budgetInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.input, styles.budgetInput]}
                  placeholder="0.00"
                  placeholderTextColor="#717786"
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
              </View>
            </View>

            {/* Upload Reference */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reference Image or Receipt</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={handleUploadPressIn}
                onPressOut={handleUploadPressOut}
              >
                <Animated.View style={[styles.uploadBox, uploadAnimatedStyle]}>
                  <MaterialIcons name="cloud-upload" size={40} color="#006670" style={styles.uploadIcon} />
                  <Text style={styles.uploadText}>Tap to upload reference photos</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG up to 10MB</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Additional Details */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Specifications</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mention preferred color, warranty requirements, or delivery urgency..."
                placeholderTextColor="#717786"
                multiline
                numberOfLines={3}
                value={specs}
                onChangeText={setSpecs}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={handleSubmitPressIn}
              onPressOut={handleSubmitPressOut}
              onPress={() => navigation.navigate('QuotationDetails')}
            >
              <Animated.View style={[styles.submitButton, submitAnimatedStyle]}>
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Recent Requests Column */}
          <View style={styles.recentRequestsSection}>
            <View style={styles.recentRequestsHeader}>
              <Text style={styles.sectionTitle}>My Recent Requests</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MyRequests')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentRequestsList}>
              {/* Request Item 1 */}
              <TouchableOpacity style={styles.requestItem} activeOpacity={0.7} onPress={() => navigation.navigate('QuotationDetails')}>
                <View style={styles.requestImageContainer}>
                  <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5IPBkHLrLGkQ3O8BFqJCvqYHpgEyk0f8Ys5C9CYHm3On18-PI6OhXI52-e2Zs7xX_dkljOgFSXfcWBfUMOSKH1HPaQkJTLHv1h2JSihidVdd_Ua2y1YgOEbqnF7kw6WXGXpHm_3W8dzArJKiwViDKT6N8-OVP7EwtiwHNZnZdO_SokZo1pRtyzVGaSWZMAZeMx3-cyX7gDL429_AVCK4iJAPsmmvrnYD3bVjQFYD_fKp0xURiZtl7E4f9S0A-8w4Cun4zfIe55BtR' }}
                    style={styles.requestImage}
                  />
                </View>
                <View style={styles.requestItemContent}>
                  <Text style={styles.requestItemTitle}>MacBook Pro M3 Max</Text>
                  <View style={styles.requestItemStatus}>
                    <MaterialIcons name="local-offer" size={14} color="#006670" />
                    <Text style={styles.bidsReceivedText}>5 Bids Received</Text>
                  </View>
                  <Text style={styles.requestItemTime}>Last bid: 2 hours ago</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#717786" />
              </TouchableOpacity>

              {/* Request Item 2 */}
              <TouchableOpacity style={styles.requestItem} activeOpacity={0.7} onPress={() => navigation.navigate('QuotationDetails')}>
                <View style={styles.requestImageContainer}>
                  <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgIWHYkmvG1Q9qXy18CqJHINLoC2YPfWEBGF74oe7jnSRzQNrReFedN7fDbtIBs36cmndQyN6VlSJkzHEGkKAwQ_LJ0I5jo6L8G48h9RQy-BNDT55885G4ygTDvyD0GwPKp05pSdbsDxtDpVGphwICIaSrRc3sHbHYlrGluQ2Rbxkh3SfQp3_3UnZddqVAlLck1d_cLZaKUGGko-ebe1PVfeAycSpCupMF5VmxknxGlOaitRJvxHFuDUruvQ8Va-XOGEOEzP0ZxuuJ' }}
                    style={styles.requestImage}
                  />
                </View>
                <View style={styles.requestItemContent}>
                  <Text style={styles.requestItemTitle}>Smart Watch Series 9</Text>
                  <View style={styles.requestItemStatus}>
                    <MaterialIcons name="schedule" size={14} color="#c1c6d7" />
                    <Text style={styles.waitingBidsText}>Waiting for bids</Text>
                  </View>
                  <Text style={styles.requestItemTime}>Posted 1 day ago</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#717786" />
              </TouchableOpacity>
            </View>

            {/* Feature Float */}
            <View style={styles.featureFloatContainer}>
              <View style={styles.featureFloatBackground} />
              <View style={styles.featureFloatContent}>
                <MaterialIcons name="verified" size={28} color="#755700" style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Verified Sellers Only</Text>
                <Text style={styles.featureDescription}>
                  Every bid you receive comes from a pre-vetted, Radiant Market certified local vendor to ensure authenticity and quality.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9ff'
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 50
},
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#134e4a',
    letterSpacing: -0.5
},
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(241, 245, 249, 0.5)'
},
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 120, // Make room for BottomNav
  },
  heroSection: {
    marginBottom: 32
},
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#181c23',
    letterSpacing: -0.5,
    marginBottom: 8
},
  heroDescription: {
    fontSize: 16,
    color: '#414754',
    lineHeight: 24
},
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.15)',
    marginBottom: 32
},
  inputGroup: {
    marginBottom: 24
},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181c23',
    marginBottom: 8
},
  input: {
    backgroundColor: '#e0e2ed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#181c23'
},
  budgetInputContainer: {
    position: 'relative',
    justifyContent: 'center'
},
  currencySymbol: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#414754'
},
  budgetInput: {
    paddingLeft: 36
},
  uploadBox: {
    borderWidth: 2,
    borderColor: '#c1c6d7',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f1f3fe'
},
  uploadIcon: {
    marginBottom: 8
},
  uploadText: {
    fontSize: 14,
    color: '#414754',
    marginBottom: 4
},
  uploadSubtext: {
    fontSize: 12,
    color: '#717786'
},
  textArea: {
    minHeight: 80,
    paddingTop: 12
},
  submitButton: {
    backgroundColor: '#006670',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
},
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
},
  recentRequestsSection: {
    marginBottom: 32
},
  recentRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181c23',
    letterSpacing: -0.5
},
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006670'
},
  recentRequestsList: {
    gap: 16
},
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3fe',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.1)'
},
  requestImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#e0e2ed',
    overflow: 'hidden',
    marginRight: 16
},
  requestImage: {
    width: '100%',
    height: '100%'
},
  requestItemContent: {
    flex: 1
},
  requestItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#181c23',
    marginBottom: 4
},
  requestItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
},
  bidsReceivedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006670'
},
  waitingBidsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#414754'
},
  requestItemTime: {
    fontSize: 11,
    color: '#717786',
    fontStyle: 'italic'
},
  featureFloatContainer: {
    marginTop: 32,
    position: 'relative',
    paddingTop: 24,
    paddingBottom: 24
},
  featureFloatBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 129, 141, 0.1)',
    borderRadius: 24,
    transform: [{ rotate: '-2deg' }, { scale: 1.05 }]
},
  featureFloatContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
},
  featureIcon: {
    marginBottom: 8
},
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181c23',
    marginBottom: 8
},
  featureDescription: {
    fontSize: 12,
    color: '#414754',
    lineHeight: 18
},
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16
},
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 20
},
  navItemActive: {
    backgroundColor: '#ccfbf1',
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 20,
    transform: [{ scale: 0.95 }]
},
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4
},
  navTextActive: {
    fontSize: 11,
    fontWeight: '600',
    color: '#134e4a',
    marginTop: 4
}
});
