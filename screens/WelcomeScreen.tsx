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
  ScrollView
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function WelcomeScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
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
          {/* Brand Anchor */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.brandContainer}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <MaterialIcons name="storefront" size={24} color="#ffffff" />
              </View>
              <Text style={styles.brandName}>Radiant Market</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter your credentials to access your local market.
            </Text>
          </Animated.View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Phone Number Input */}
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View 
                style={[
                  styles.inputWrapper, 
                  isPhoneFocused && styles.inputWrapperFocused
                ]}
              >
                <MaterialIcons name="call" size={20} color="#414754" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="rgba(65, 71, 84, 0.5)"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View 
                style={[
                  styles.inputWrapper, 
                  isPasswordFocused && styles.inputWrapperFocused
                ]}
              >
                <MaterialIcons name="lock" size={20} color="#414754" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(65, 71, 84, 0.5)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.inputIconRight}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#414754"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Primary Action Button */}
            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={() => navigation.replace('Main')}
              >
                <Text style={styles.loginButtonText}>Login</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Divider */}
          <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or login with</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* SSO Action */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <TouchableOpacity style={styles.ssoButton} activeOpacity={0.8} onPress={() => navigation.replace('Home')}>
              <AntDesign name="google" size={20} color="#DB4437" style={styles.ssoIcon} />
              <Text style={styles.ssoButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Navigation */}
          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.footerNav}>
            <Text style={styles.footerNavText}>New to Radiant Market? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Home')}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Compliance */}
          <Animated.View entering={FadeIn.delay(800).duration(600)} style={styles.footerCompliance}>
            <Text style={styles.complianceText}>
              By continuing, you agree to our{' '}
              <Text style={styles.complianceLink}>Terms of Service</Text> and{' '}
              <Text style={styles.complianceLink}>Privacy Policy</Text>.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9ff', // surface
  },
  keyboardAvoiding: {
    flex: 1
},
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
},
  brandContainer: {
    marginBottom: 40,
    alignItems: 'flex-start'
},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
},
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#006670', // primary
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
},
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181c23', // on-surface
    letterSpacing: -0.5
},
  welcomeTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#181c23', // on-surface
    letterSpacing: -1
},
  welcomeSubtitle: {
    fontSize: 16,
    color: '#414754', // on-surface-variant
    marginTop: 8,
    lineHeight: 22
},
  formContainer: {
    marginBottom: 24
},
  inputGroup: {
    marginBottom: 24
},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#414754', // on-surface-variant
    marginBottom: 8,
    marginLeft: 4
},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e2ed', // surface-container-highest
    borderRadius: 12,
    minHeight: 52,
    borderWidth: 2,
    borderColor: 'transparent'
},
  inputWrapperFocused: {
    backgroundColor: '#ffffff', // surface-container-lowest
    borderColor: '#006670', // primary focus ring
  },
  inputIconLeft: {
    paddingLeft: 16,
    paddingRight: 12
},
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#181c23',
    paddingRight: 16
},
  inputIconRight: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center'
},
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4
},
  forgotPassword: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006670', // primary
  },
  loginButton: {
    backgroundColor: '#006670', // primary
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28, // rounded-full
    shadowColor: '#006670',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
},
  loginButtonText: {
    color: '#ffffff', // on-primary
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8
},
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
},
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#c1c6d7', // outline-variant
    opacity: 0.3
},
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#414754', // on-surface-variant
  },
  ssoButton: {
    backgroundColor: '#f1f3fe', // surface-container-low
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.2)', // outline-variant/20
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28
},
  ssoIcon: {
    marginRight: 12
},
  ssoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181c23', // on-surface
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
},
  footerNavText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#414754', // on-surface-variant
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006670', // primary
  },
  footerCompliance: {
    marginTop: 48,
    alignItems: 'center'
},
  complianceText: {
    fontSize: 12,
    color: 'rgba(65, 71, 84, 0.6)', // on-surface-variant/60
    textAlign: 'center',
    lineHeight: 18
},
  complianceLink: {
    textDecorationLine: 'underline'
}
});
