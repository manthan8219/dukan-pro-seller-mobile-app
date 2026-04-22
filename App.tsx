import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { CartProvider } from './context/CartContext';
import { initPushNotifications, setupNotificationListeners } from './services/NotificationService';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import MainTabs from './screens/MainTabs';
import KiranaShopScreen from './screens/KiranaShopScreen';
import ShopDetailScreen from './screens/ShopDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import QuotationDetailsScreen from './screens/QuotationDetailsScreen';

import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import SearchScreen from './screens/SearchScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import AddressScreen from './screens/AddressScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MyRequestsScreen from './screens/MyRequestsScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  // Register for push notifications once user is logged in
  useEffect(() => {
    if (user) {
      initPushNotifications();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9ff' }}>
        <ActivityIndicator size="large" color="#006670" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Main' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Auth screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

      {/* App screens */}
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="KiranaShop" component={KiranaShopScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="ShopDetail" component={ShopDetailScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="QuotationDetails" component={QuotationDetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const cleanup = setupNotificationListeners((orderId) => {
      // When user taps a notification, navigate to the relevant screen
      if (orderId) {
        navigationRef.current?.navigate('OrderTracking', { orderId });
      } else {
        navigationRef.current?.navigate('OrderHistory');
      }
    });
    return cleanup;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AddressProvider>
            <CartProvider>
              <NavigationContainer ref={navigationRef}>
                <RootNavigator />
              </NavigationContainer>
            </CartProvider>
          </AddressProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
