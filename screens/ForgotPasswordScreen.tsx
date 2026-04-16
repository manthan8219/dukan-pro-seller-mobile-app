import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, getAuthErrorMessage } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await authService.sendPasswordResetEmail(email.trim());
      setIsSubmitted(true);
    } catch (err) {
      Alert.alert('Error', getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#f0fdfa']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}
        >
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.headerContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="lock-reset" size={32} color="#0f766e" />
              </View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter the email associated with your account and we'll send an email with instructions to reset your password.
              </Text>
            </Animated.View>

            {!isSubmitted ? (
              <View style={styles.formContainer}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[styles.inputWrapper, isEmailFocused && styles.inputWrapperFocused]}>
                    <MaterialIcons name="email" size={20} color={isEmailFocused ? '#0f766e' : '#94a3b8'} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSendReset}
                    disabled={loading}
                    style={styles.submitBtnWrapper}
                  >
                    <LinearGradient
                      colors={['#0f766e', '#115e59']}
                      style={styles.primaryButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {loading
                        ? <ActivityIndicator color="#ffffff" />
                        : <Text style={styles.primaryButtonText}>Send Instructions</Text>
                      }
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            ) : (
              <Animated.View entering={FadeInDown.springify()} style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <MaterialIcons name="mark-email-read" size={48} color="#0f766e" />
                </View>
                <Text style={styles.successTitle}>Check your mail</Text>
                <Text style={styles.successSubtitle}>
                  We have sent password recovery instructions to <Text style={{fontWeight: '700', color: '#0f172a'}}>{email}</Text>.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Login')}
                  style={styles.backToLoginBtn}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
},
  safeArea: {
    flex: 1
},
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 10,
    left: 20,
    zIndex: 10,
    padding: 10
},
  keyboardAvoiding: {
    flex: 1
},
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 100
},
  headerContainer: {
    marginBottom: 40,
    alignItems: 'flex-start'
},
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
},
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    letterSpacing: -0.5
},
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24
},
  formContainer: {
    marginBottom: 32
},
  inputGroup: {
    marginBottom: 24
},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4
},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    height: 56,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
},
  inputWrapperFocused: {
    borderColor: '#0f766e',
    backgroundColor: '#f8fafc',
    shadowOpacity: 0.1
},
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12
},
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0f172a'
},
  submitBtnWrapper: {
    marginTop: 8
},
  primaryButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
},
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5
},
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32
},
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
},
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16
},
  successSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20
},
  backToLoginBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#f1f5f9',
    borderRadius: 16
},
  backToLoginText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
}
});
