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
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { authService, getAuthErrorMessage } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [_request, response, promptAsync] = useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleToken(idToken);
      }
    }
  }, [response]);

  const handleGoogleToken = async (idToken: string) => {
    setGoogleLoading(true);
    try {
      await authService.signInWithGoogleToken(idToken);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Google Sign-In Failed', getAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await authService.signInWithEmail(email.trim(), password);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Sign In Failed', getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e0f2f1', '#ffffff', '#ffffff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header / Logo */}
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={['#0f766e', '#14b8a6']} style={styles.logoGradient}>
                  <MaterialIcons name="storefront" size={32} color="#ffffff" />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to continue to Radiant Market.</Text>
            </Animated.View>

            {/* Form */}
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

              <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
                  <MaterialIcons name="lock" size={20} color={isPasswordFocused ? '#0f766e' : '#94a3b8'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(400).springify()}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleEmailSignIn} disabled={loading}>
                  <LinearGradient
                    colors={['#0f766e', '#115e59']}
                    style={styles.primaryButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading
                      ? <ActivityIndicator color="#ffffff" />
                      : <Text style={styles.primaryButtonText}>Sign In</Text>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Social Login */}
            <Animated.View entering={FadeIn.delay(500).duration(800)} style={styles.socialContainer}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                  onPress={() => promptAsync()}
                  disabled={googleLoading}
                >
                  {googleLoading
                    ? <ActivityIndicator color="#DB4437" />
                    : <AntDesign name="google" size={24} color="#DB4437" />
                  }
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Sign Up Link */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Create one</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardAvoiding: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  formContainer: { marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
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
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: '#0f766e',
    backgroundColor: '#f8fafc',
    shadowOpacity: 0.1,
  },
  inputIcon: { paddingLeft: 16, paddingRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#0f172a' },
  eyeIcon: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginTop: 12 },
  forgotPasswordText: { fontSize: 14, fontWeight: '600', color: '#0f766e' },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  socialContainer: { marginBottom: 32 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
  socialButtonsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: { fontSize: 15, color: '#64748b' },
  footerLink: { fontSize: 15, fontWeight: '700', color: '#0f766e' },
});
