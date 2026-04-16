import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Platform, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import HomeScreen from './HomeScreen';
import GroceryHomeScreen from './GroceryHomeScreen';
import RequestQuotationScreen from './RequestQuotationScreen';
import ProfileScreen from './ProfileScreen';
import { useAddress } from '../context/AddressContext';

const Tab = createBottomTabNavigator();

const colors = {
  primary: '#006670',
  slate500: '#64748b',
  teal700: '#0f766e',
  teal900: '#134e4a',
  teal100: '#ccfbf1',
  onPrimaryFixed: '#001f23',
};

const CustomTopBar = ({ route }: any) => {
  const isProfile = route.name === 'Profile';
  const navigation = useNavigation<any>();
  const { activeAddress } = useAddress();

  const locationLabel = activeAddress
    ? `${activeAddress.street}, ${activeAddress.city}`
    : 'Set delivery address';

  if (isProfile) {
    return (
      <BlurView intensity={80} tint="light">
        <SafeAreaView edges={['top']} style={styles.topAppBarWrapper}>
          <View style={styles.topAppBar}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="location-on" size={24} color={colors.teal700} />
              <Text style={styles.topAppBarTitle}>Radiant Market</Text>
            </View>
            <TouchableOpacity style={styles.iconButtonBlur} onPress={() => navigation.navigate('Search')}>
              <MaterialIcons name="search" size={24} color={colors.teal700} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BlurView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.headerWrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('Address')}>
          <MaterialIcons name="location-on" size={24} color={colors.teal700} style={styles.headerIconFixed} />
          <View style={styles.headerLocationText}>
            <Text style={styles.locationSubtitle} numberOfLines={1}>
              YOUR LOCATION
            </Text>
            <Text
              style={styles.locationTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {locationLabel}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={18} color={colors.teal700} style={styles.headerIconFixed} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={() => navigation.navigate('Search')}>
            <MaterialIcons name="search" size={24} color={colors.teal700} />
          </Pressable>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={20} color={colors.onPrimaryFixed} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Animated individual tab item with spring bounce on focus
const AnimatedTabItem = ({
  route,
  isFocused,
  options,
  onPress,
}: {
  route: any;
  isFocused: boolean;
  options: any;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  let iconName: any = 'home';
  if (route.name === 'GroceryHome') iconName = 'storefront';
  if (route.name === 'RequestQuotation') iconName = 'request-quote';
  if (route.name === 'Profile') iconName = 'person';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withTiming(0.88, { duration: 80 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 260 }); }}
      style={styles.tabPressable}
    >
      <Animated.View style={[isFocused ? styles.navItemActive : styles.navItem, animStyle]}>
        <MaterialIcons
          name={iconName}
          size={24}
          color={isFocused ? colors.teal900 : colors.slate500}
        />
        <Text style={isFocused ? styles.navTextActive : styles.navText}>
          {options.title || route.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomNavWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.bottomNav}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <AnimatedTabItem
              key={index}
              route={route}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomTopBar route={route} />,
      })}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="GroceryHome" component={GroceryHomeScreen} options={{ title: 'Shops' }} />
      <Tab.Screen name="RequestQuotation" component={RequestQuotationScreen} options={{ title: 'Request' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    borderBottomWidth: Platform.OS === 'android' ? 0 : 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  headerIconFixed: {
    flexShrink: 0,
  },
  headerLocationText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
  },
  locationSubtitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: colors.slate500,
    letterSpacing: 0.5,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181c23',
    maxWidth: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.teal900,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 0,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#75d5e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAppBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
  },
  topAppBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.teal900,
    letterSpacing: -0.5,
  },
  iconButtonBlur: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(241, 245, 249, 0.6)',
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal100,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 24,
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate500,
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal900,
    marginTop: 4,
  },
  tabPressable: {
    flex: 1,
    alignItems: 'center',
  },
});
