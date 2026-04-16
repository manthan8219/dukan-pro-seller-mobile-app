import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeInUp
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  navigation?: any;
}

export default function OrderTrackingScreen({ navigation }: Props) {
  const pingScale = useSharedValue(1);
  const pingOpacity = useSharedValue(0.5);

  useEffect(() => {
    pingScale.value = withRepeat(
      withTiming(2.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pingOpacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pingOpacity.value
}));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header (Absolute Positioned over ScrollView) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={[styles.headerButton, { marginRight: 8 }]} 
              onPress={() => navigation?.goBack()}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={24} color="#006670" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Track Order</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => navigation.navigate('Cart')}>
            <MaterialIcons name="shopping-basket" size={24} color="#006670" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Map Section */}
          <View style={styles.mapSection}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVd7V-Ba0vVvicFvaopZwbI0NzdGJ5ssFx0K6e0Ui4uIMK8zUOIWtPQRDVqZSwdYFLSF91Ohn-vckAudOy9NzC7PbgYD-hP_S9QNAqP2d8P0G5J8J7b_NC8iD8SdzmMSk93pkiwH3IDoIymB-1nmNgp4tUmzKrxsvhrCnPbKkixAIC9gwg0t9OYQUADuEMXMU_fTJwc8aXSNoeplI-dir1EqZ6ETzkdac3fa91-UoWxd6L-GmMkVqhghkf2qhX4zgU3fKZ4Akdy9Nh' }} 
              style={styles.mapImage}
            />
            <LinearGradient
              colors={['rgba(249, 249, 255, 0.8)', 'rgba(249, 249, 255, 0)', 'rgba(249, 249, 255, 0)', 'rgba(249, 249, 255, 1)']}
              locations={[0, 0.2, 0.8, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            
            {/* Delivery Pin */}
            <View style={styles.pinContainer}>
              <Animated.View style={[styles.pinPing, pingStyle]} />
              <View style={styles.pinCore}>
                <MaterialIcons name="electric-scooter" size={20} color="#ffffff" />
              </View>
            </View>
          </View>

          {/* Contextual Content Overlay */}
          <View style={styles.contentOverlay}>
            {/* ETA Card */}
            <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.etaCard}>
              <View>
                <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
                <Text style={styles.etaTime}>12:45 PM</Text>
              </View>
              <View style={styles.etaBadge}>
                <Text style={styles.etaBadgeText}>12 mins</Text>
              </View>
            </Animated.View>

            {/* Courier Card */}
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.courierCard}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7iJfpLztC2Fc5qpOVw4IViJuLHAV6ZyMQjkReMCOz7GB2jVz-19pzmLHTZbTdiGAzatahJLhkfV-v-T-xD5yTfKe3TccuJQasdAo0XMR94zYz4kM9TtNrJlyXbudmHrFTiAhIvkBllQLzRDt1kiFj6c8A4eXD4UAasMo22YZQBghlVFglvyrbzBOtwJFPjc6DkLVtys5yvtYrbMJtvezzatBhFpNf40Y0iGhskLOpwL12qw0UYypFlUSgIO6B6Fp4E-fzd23-LoF6' }}
                style={styles.courierImage}
              />
              <View style={styles.courierInfo}>
                <Text style={styles.courierName}>Marcus Thompson</Text>
                <Text style={styles.courierRole}>Your Delivery Partner</Text>
              </View>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7} onPress={() => {}}>
                <MaterialIcons name="call" size={24} color="#613400" />
              </TouchableOpacity>
            </Animated.View>

            {/* Order Progress */}
            <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.progressSection}>
              <Text style={styles.progressTitle}>Order Progress</Text>
              <View style={styles.timeline}>

                {/* Step 1 */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepDotCompleted}>
                    <MaterialIcons name="check" size={14} color="#ffffff" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Order Placed</Text>
                    <Text style={styles.stepDescription}>We've received your order at 12:10 PM</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepDotCompleted}>
                    <MaterialIcons name="check" size={14} color="#ffffff" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Packing</Text>
                    <Text style={styles.stepDescription}>Curating your items with care</Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepDotActive}>
                    <View style={styles.stepDotActiveInner} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitleActive}>Out for Delivery</Text>
                    <Text style={styles.stepDescription}>Marcus is on his way to your location</Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={[styles.timelineStep, { marginBottom: 0 }]}>
                  <View style={styles.stepDotInactive} />
                  <View style={[styles.stepContent, { opacity: 0.4 }]}>
                    <Text style={styles.stepTitle}>Delivered</Text>
                    <Text style={styles.stepDescription}>Enjoy your fresh groceries!</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Summary Card */}
            <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryOrderId}>ORDER #GC-8829</Text>
                  <Text style={styles.summaryTitle}>Premium Weekly Haul</Text>
                </View>
                <Text style={styles.summaryPrice}>$42.50</Text>
              </View>
              <View style={styles.summaryImagesRow}>
                <Image style={styles.summaryImage} source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOvbhsVVjG-on3bfwvWHblU0_FROEABOAbM3RMqzXpmHY8c0ieuuJbuGuXXdX9xMHMp8DNhdykqrsdsMrb09EGdStgACev9S3MmEzzIGNdVnhVqAYLJ9Vlby2NJU6zX5OzmPPQ8OvGoDqg37A_CIdBYti-TM-4feHBP0TvSHVT7lk3ZUj02Av44GpdyQ0hfD6SHSNgC3UoMJQt0QpfC_cvWnRx_fCAhMvpcJt1E2lPCQ7MQmtbV6ie6BzOPPLqJ85A9bA8OtCdTnb0' }} />
                <Image style={styles.summaryImage} source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHjsVAUk0rfxK9hwf_lmR4dWxM8vzTltyBJrOBYqNrl6e-LRjWg4c8gW_dZZGLaTeTcpq1N3xx7yIp2eEQ1OtwK2EabhniiyHtcL3_Ok1LvIlpIwvhXUqeGl921-JP5ub3MXV6FRqJkQeCT7L3z6P5I4-493q5IUDV3IvGCXkdhszLoyPubtHT4gR6psvTATiU6EHKjWMAOf-mENfrAcxvNBvAozzB5wj4iX_WIwpUDXPBFujwZKvujExAYeW-zR9KgdDq-jPO0l4W' }} />
                <Image style={styles.summaryImage} source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD03DFCOjzIaM19tTnao-eGUxbeFWziixA5n6irBD4ou_-2ugqY8s8tl9K1HAiUhRsMbifiIVTBT2au2aN_CAOuEcYeWEpW_hHUzol8xvjKPkljiLRsIbnXZzDXOdMfh72VSNVtqncDTS25EWIuXPhtdiXS9iOqPOl_tPPI3qGkJLYxvw0nM_zC5fLDoLir3CPLW2eF1LBIey62ClDeTa7Kh_jBVOFAj_irWRVC2q4Vps5QgrMt31v5s_fr5U37yi7SCcssNeUlEvhn' }} />
                <View style={styles.summaryMoreImages}>
                  <Text style={styles.summaryMoreImagesText}>+4</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.liveTrackButton} activeOpacity={0.8} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
            <MaterialIcons name="home" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.liveTrackButtonText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpButton} activeOpacity={0.8} onPress={() => navigation.navigate('HelpSupport')}>
            <MaterialIcons name="help-outline" size={24} color="#181c23" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9ff'
},
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff'
},
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(249, 249, 255, 0.8)',
    zIndex: 50
},
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
},
  headerButton: {
    padding: 4
},
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006670',
    letterSpacing: -0.5
},
  scrollView: {
    flex: 1
},
  scrollContent: {
    paddingTop: 64,
    paddingBottom: 120
},
  mapSection: {
    height: 397,
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
},
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
},
  pinPing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 102, 112, 0.2)'
},
  pinCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#006670',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8
},
  contentOverlay: {
    paddingHorizontal: 24,
    marginTop: -64,
    position: 'relative',
    zIndex: 30
},
  etaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#181c23',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4
},
  etaLabel: {
    fontSize: 12,
    color: '#414754',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4
},
  etaTime: {
    fontSize: 30,
    fontWeight: '800',
    color: '#006670',
    letterSpacing: -0.5
},
  etaBadge: {
    backgroundColor: 'rgba(0, 129, 141, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999
},
  etaBadgeText: {
    color: '#006670',
    fontWeight: '700',
    fontSize: 18
},
  courierCard: {
    backgroundColor: '#f1f3fe',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.15)'
},
  courierImage: {
    width: 56,
    height: 56,
    borderRadius: 28
},
  courierInfo: {
    flex: 1,
    marginLeft: 16
},
  courierName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 2
},
  courierRole: {
    fontSize: 14,
    color: '#414754'
},
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fd9000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
},
  progressSection: {
    marginBottom: 48
},
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 24,
    paddingHorizontal: 4
},
  timeline: {
    marginLeft: 16,
    paddingLeft: 32,
    position: 'relative',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(193, 198, 215, 0.3)'
},
  timelineStep: {
    position: 'relative',
    marginBottom: 40
},
  stepDotCompleted: {
    position: 'absolute',
    left: -43,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#006670',
    borderWidth: 4,
    borderColor: 'rgba(0, 102, 112, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
},
  stepDotActive: {
    position: 'absolute',
    left: -43,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00818d',
    borderWidth: 4,
    borderColor: 'rgba(0, 129, 141, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
},
  stepDotActiveInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f6feff'
},
  stepDotInactive: {
    position: 'absolute',
    left: -43,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e2ed',
    borderWidth: 4,
    borderColor: 'rgba(224, 226, 237, 0.5)'
},
  stepContent: {
    marginLeft: 0
},
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 4
},
  stepTitleActive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006670',
    marginBottom: 4
},
  stepDescription: {
    fontSize: 14,
    color: '#414754'
},
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.15)'
},
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
},
  summaryOrderId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#946f00',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4
},
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c23'
},
  summaryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006670'
},
  summaryImagesRow: {
    flexDirection: 'row'
},
  summaryImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f3fe',
    marginRight: 8
},
  summaryMoreImages: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e2ed',
    alignItems: 'center',
    justifyContent: 'center'
},
  summaryMoreImagesText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#414754'
},
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.8)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.15)',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    zIndex: 50
},
  liveTrackButton: {
    flex: 1,
    backgroundColor: '#006670',
    borderRadius: 999,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 16
},
  liveTrackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
},
  helpButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e2ed',
    alignItems: 'center',
    justifyContent: 'center'
}
});
