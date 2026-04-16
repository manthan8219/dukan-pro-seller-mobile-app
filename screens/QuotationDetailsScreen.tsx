import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Helper component for Bid Cards
const BidCard = ({ 
  index, 
  name, 
  rating, 
  ratingIcon = 'star', 
  reviews, 
  price, 
  image, 
  isBestValue = false, 
  features, 
  secondaryAction = false,
  onPress
}: any) => {
  return (
    <Animated.View entering={FadeInDown.delay(150 + index * 100).duration(400).springify()} style={styles.bidCardContainer}>
      {isBestValue && (
        <View style={styles.bestValueBadge}>
          <Text style={styles.bestValueText}>BEST VALUE</Text>
        </View>
      )}

      <View style={styles.bidderInfoRow}>
        <View style={styles.bidderImageContainer}>
          <Image source={{ uri: image }} style={styles.bidderImage} />
        </View>
        <View style={styles.bidderDetails}>
          <Text style={styles.bidderName}>{name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name={ratingIcon as any} size={16} color="#fabd00" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewsText}>{reviews}</Text>
          </View>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.estimatedTotalLabel}>Estimated Total</Text>
        <Text style={[styles.bidPrice, !secondaryAction && { color: '#006670' }]}>{price}</Text>
      </View>

      <TouchableOpacity style={[styles.selectBidButton, secondaryAction && styles.selectBidButtonSecondary]} activeOpacity={0.8} onPress={onPress}>
        <Text style={[styles.selectBidButtonText, secondaryAction && styles.selectBidButtonTextSecondary]}>
          Select This Bid
        </Text>
      </TouchableOpacity>

      <View style={styles.bidFeaturesContainer}>
        {features.map((feature: any, idx: number) => (
          <View key={idx} style={styles.featureItem}>
            <MaterialIcons name={feature.icon as any} size={16} color="#75d5e2" />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default function QuotationDetailsScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconButton} activeOpacity={0.6}>
            <MaterialIcons name="arrow-back" size={24} color="#006670" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quotation Detail</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.6} onPress={() => navigation.navigate('Cart')}>
            <MaterialIcons name="shopping-basket" size={24} color="#006670" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.heroContainer}>
            <View style={styles.heroInnerContainer}>
              <View style={styles.imageWrapper}>
                 <View style={styles.imageBackground} />
                 <Image
                   source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzHCspe5R95BUMoZq7Rsdc8OVSoK9iZoI0kGXWWshPBBaoPxzU3444AOm8h11-D-lPqtazjoJnC5cBaxeY2j0bkRasSoYnSbJIoBXvFRG2bReMq2dJcJ3EYQv0aPy2i0VLRYV2mqAOxZgUTjir-Mw_eMkbTsMzfCvv_h-tfIam6X0o96zgnbtMaKR-4oZhZjesN5wWfwlP6cbIarHxakbBkvt-r5VxDCIiT_lME-2BKLu9BWjytvqbKqUgqrSvYVetbANL14wnQOzr' }}
                   style={styles.heroImage}
                 />
              </View>

              <View style={styles.heroContent}>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>High Value Request</Text>
                </View>
                <Text style={styles.heroTitle}>Premium Perigord Black Truffles</Text>
                <Text style={styles.heroDescription}>
                  Requested for a private culinary event. Looking for Grade A quality, minimum 500g, must be fresh within 48 hours of harvest.
                </Text>

                <View style={styles.budgetDateGrid}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>My Budget</Text>
                    <Text style={styles.budgetAmount}>$800 - $1,200</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Request Date</Text>
                    <Text style={styles.dateText}>Oct 24, 2023</Text>
                  </View>
                </View>

                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={20} color="#00818d" />
                  <Text style={styles.locationText}>Delivery to Upper East Side, Manhattan</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Bids Received Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(400).springify()} style={styles.bidsHeader}>
            <Text style={styles.bidsTitle}>
              Bids Received <Text style={styles.bidsCount}>(4)</Text>
            </Text>
            <TouchableOpacity style={styles.sortButton} activeOpacity={0.6} onPress={() => {}}>
              <MaterialIcons name="filter-list" size={18} color="#006670" />
              <Text style={styles.sortButtonText}>Sort by Lowest Price</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Bids List */}
          <View style={styles.bidsList}>
            <BidCard
              index={0}
              name="The Truffle Hunter Ltd."
              rating="4.9"
              reviews="(128 reviews)"
              price="$950.00"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuB-LAdh_lMLJ2gqVofaf-2SyjJBqC9BELv3Hm81RAMisvbiVWr8MKiS927lobuuwzgN9qpmrXDKcDH3991gprNNT_0790DV7YDzdQgvjyl1V9RW8pwOv3Wh4XORn-fjc5CGhyKJG-J_wTW-WQPqxGmxJqF5Bf6giOlzwvLiiC2JuaLS9mMyhkSBORbXw6D6d13hQ-E2OYg2p-qs-dOUZrJx9sbeikAKSwUHM7KLWOaCLC_XrF5jQnnQilXSVZUVD1zvKQwcWSFIYniG"
              isBestValue={true}
              features={[
                { icon: 'verified', text: 'Verified Seller' },
                { icon: 'schedule', text: 'Available in 24h' },
              ]}
              onPress={() => navigation.navigate('Cart')}
            />

            <BidCard
              index={1}
              name="Manhattan Gourmet Imports"
              rating="4.7"
              reviews="(312 reviews)"
              price="$1,080.00"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCH8G5BxRCCUFnf4kYMGIvOKycKPA2GcW-u2vO4g6SrT3AKM0Va1JbVqvBcc977rvtX5IfPep-emQIU8a_dgqhmKVMVDaej6wBmCGoXo22F3P2D50G3QVdDgjCMwM4R1fYXKaHD3Ot70cgqR4Al70n2RbK2ialjWlBnt7YSYSba5hmNyGjfc4_dX_pLqp8rdsZm4T8VhUiEcHwecFUyJ3Hzt8WfzgQp1UtA8Hw72Xwi-gRYRY-a5IEXjopxrZRm2us94_g6Dsor59S1"
              features={[
                { icon: 'local-shipping', text: 'Same Day Delivery' },
              ]}
              secondaryAction={true}
              onPress={() => navigation.navigate('Cart')}
            />

            <BidCard
              index={2}
              name="Fine Foods Collective"
              rating="4.5"
              ratingIcon="star-half"
              reviews="(56 reviews)"
              price="$890.00"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ1gmg2wQLsF_sFWePYsOw2lgrUzyDxDiq9ch-OU_ByzFNtJg4aM7vly29z2UZqvT-2HPNT0N9YqwQ76X_rcMaMawFKNGIJb-R4P9UV5Zpz2OSqbXh-aURw9O281sIe6p7oH9cjWRQrBon6rXfOq94CTyH7GdjZWFTDgTGEMTx73MgAG_8QIVgEzBqVvlxINGDZgpMVd0Uldm6LcMODDNiGd2rGAvbAXwHFxobLOhDnVpyt05GaDd838zcVNzMlmww8O7RLFjNx-SZ"
              features={[
                { icon: 'eco', text: 'Ethically Sourced' },
              ]}
              secondaryAction={true}
              onPress={() => navigation.navigate('Cart')}
            />
          </View>

          {/* Trust Anchor */}
          <Animated.View entering={FadeInDown.delay(400).duration(400).springify()} style={styles.trustAnchorContainer}>
            <View style={styles.trustIconContainer}>
              <MaterialIcons name="security" size={32} color="#f6feff" />
            </View>
            <View style={styles.trustContent}>
              <Text style={styles.trustTitle}>Secure Curator Transactions</Text>
              <Text style={styles.trustDescription}>
                Your payment is only released to the seller once you've confirmed receipt and quality of your high-value items. Our concierge team is available 24/7 for support.
              </Text>
            </View>
            <TouchableOpacity style={styles.learnMoreButton} activeOpacity={0.6} onPress={() => navigation.navigate('HelpSupport')}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.6} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
            <MaterialIcons name="home" size={24} color="rgba(24, 28, 35, 0.6)" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.6} onPress={() => navigation.navigate('Main', { screen: 'GroceryHome' })}>
            <MaterialIcons name="storefront" size={24} color="rgba(24, 28, 35, 0.6)" />
            <Text style={styles.navText}>Shops</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItemActive} activeOpacity={0.8} onPress={() => navigation.navigate('Main', { screen: 'RequestQuotation' })}>
            <MaterialIcons name="request-quote" size={20} color="#006670" />
            <Text style={styles.navTextActive}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.6} onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
            <MaterialIcons name="person" size={24} color="rgba(24, 28, 35, 0.6)" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9ff',
},
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff'
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(249, 249, 255, 0.8)',
    zIndex: 50
},
  iconButton: {
    padding: 8,
    marginLeft: -8
},
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006670',
    letterSpacing: -0.5
},
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for bottom nav
  },
  heroContainer: {
    marginBottom: 40
},
  heroInnerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
},
  imageWrapper: {
    width: '100%',
    height: 256,
    marginBottom: 24,
    position: 'relative',
    alignSelf: 'center'
},
  imageBackground: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 129, 141, 0.1)',
    borderRadius: 16
},
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    zIndex: 10
},
  heroContent: {
    gap: 20
},
  tagContainer: {
    backgroundColor: 'rgba(148, 111, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 4
},
  tagText: {
    color: '#755700',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
},
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#181c23',
    letterSpacing: -0.5,
    marginBottom: 4
},
  heroDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#414754',
    marginBottom: 8
},
  budgetDateGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8
},
  gridItem: {
    flex: 1,
    backgroundColor: '#f1f3fe',
    padding: 16,
    borderRadius: 16
},
  gridLabel: {
    fontSize: 12,
    color: '#717786',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
},
  budgetAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#006670'
},
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181c23'
},
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
},
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#414754'
},
  bidsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
},
  bidsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181c23',
    letterSpacing: -0.5
},
  bidsCount: {
    color: '#006670'
},
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
},
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006670'
},
  bidsList: {
    gap: 24
},
  bidCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.15)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
},
  bestValueBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fd9000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    zIndex: 10
},
  bestValueText: {
    color: '#613400',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
},
  bidderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    paddingRight: 80, // Space for the badge
  },
  bidderImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e6e8f3',
    borderWidth: 2,
    borderColor: 'rgba(0, 129, 141, 0.2)',
    overflow: 'hidden'
},
  bidderImage: {
    width: '100%',
    height: '100%'
},
  bidderDetails: {
    flex: 1
},
  bidderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c23',
    marginBottom: 4
},
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
},
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#181c23'
},
  reviewsText: {
    fontSize: 12,
    color: '#717786',
    marginLeft: 4
},
  priceRow: {
    alignItems: 'flex-end',
    marginBottom: 20
},
  estimatedTotalLabel: {
    fontSize: 12,
    color: '#717786',
    fontWeight: '500',
    marginBottom: 4
},
  bidPrice: {
    fontSize: 30,
    fontWeight: '800',
    color: '#181c23'
},
  selectBidButton: {
    backgroundColor: '#006670',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: 'center',
    marginBottom: 20
},
  selectBidButtonSecondary: {
    backgroundColor: '#e6e8f3'
},
  selectBidButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
},
  selectBidButtonTextSecondary: {
    color: '#181c23'
},
  bidFeaturesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24
},
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
},
  featureText: {
    fontSize: 13,
    color: '#414754',
    fontWeight: '500'
},
  trustAnchorContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(0, 129, 141, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 129, 141, 0.1)',
    padding: 32,
    alignItems: 'flex-start',
    gap: 24
},
  trustIconContainer: {
    backgroundColor: '#00818d',
    padding: 16,
    borderRadius: 9999,
    alignSelf: 'flex-start'
},
  trustContent: {
    gap: 8
},
  trustTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006670'
},
  trustDescription: {
    fontSize: 15,
    color: '#414754',
    lineHeight: 24
},
  learnMoreButton: {
    alignSelf: 'flex-start'
},
  learnMoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006670',
    textDecorationLine: 'underline'
},
  bottomPadding: {
    height: 40
},
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.15)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 10
},
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 64
},
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 102, 112, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    gap: 4
},
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(24, 28, 35, 0.6)'
},
  navTextActive: {
    fontSize: 11,
    fontWeight: '600',
    color: '#006670'
}
});
