import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, GlobalStyles } from '../theme/typography';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import { createOrderAPI } from '../services/api';

export default function PricingScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const [loading, setLoading] = useState(false);

  const handlePayment = async (planName, amount) => {
    setLoading(true);
    try {
      // 1. Fetch Order ID from backend
      const order = await createOrderAPI(amount, token);

      // 2. Initialize Razorpay Checkout
      /*
      var options = {
        description: `Upgrade to ${planName}`,
        image: 'https://apnafoto.ai/logo.png',
        currency: 'INR',
        key: 'rzp_test_YOURKEY',
        amount: order.amount,
        name: 'ApnaFoto',
        order_id: order.id,
        prefill: {
          email: user.email,
          contact: '9999999999',
          name: user.name
        },
        theme: {color: Colors.accent.primary}
      }
      
      RazorpayCheckout.open(options).then((data) => {
        // handle success
        Alert.alert(`Success: ${data.razorpay_payment_id}`);
      }).catch((error) => {
        // handle failure
        Alert.alert(`Error: ${error.code} | ${error.description}`);
      });
      */

      // Mock Payment Success for Expo Go demonstration
      setTimeout(() => {
        Alert.alert('Payment Successful! ✨', `You have successfully purchased the ${planName}.`);
        setLoading(false);
        navigation.goBack();
      }, 1500);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Payment failed to initiate.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Choose Your Plan</Text>
        <Text style={styles.pageDesc}>Unlock premium templates, remove watermarks, and run high-converting ad campaigns.</Text>

        {/* Pro Plan Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.planName}>PRO SUBSCRIPTION</Text>
            <View style={styles.popularBadge}><Text style={styles.popularText}>POPULAR</Text></View>
          </View>
          <Text style={styles.price}>₹499 <Text style={styles.billingCycle}>/ month</Text></Text>
          
          <View style={styles.featureList}>
            <FeatureItem text="Unlimited HD Downloads" />
            <FeatureItem text="Access to all Premium Templates" />
            <FeatureItem text="Custom Brand Kit Fonts" />
            <FeatureItem text="Zero Watermarks" />
          </View>

          <Button 
            title={loading ? "Processing..." : "Upgrade to Pro"} 
            onPress={() => handlePayment('Pro Subscription', 499)} 
            style={styles.actionBtn}
          />
        </View>

        {/* Ad Campaign Card */}
        <View style={[styles.card, styles.adCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.planName}>SINGLE AD CAMPAIGN</Text>
          </View>
          <Text style={styles.price}>₹199 <Text style={styles.billingCycle}>/ campaign</Text></Text>
          
          <View style={styles.featureList}>
            <FeatureItem text="1 Custom Designed Banner Ad" />
            <FeatureItem text="Optimized for Instagram/Facebook" />
            <FeatureItem text="Delivered in 24 hours" />
          </View>

          <Button 
            title={loading ? "Processing..." : "Buy Ad Campaign"} 
            onPress={() => handlePayment('Ad Campaign', 199)} 
            style={styles.secondaryBtn}
            textStyle={{ color: Colors.text.primary }}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const FeatureItem = ({ text }) => (
  <View style={styles.featureItem}>
    <Feather name="check-circle" size={16} color={Colors.accent.primary} style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 18,
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 32,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  pageDesc: {
    fontFamily: Typography.family.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  adCard: {
    borderColor: Colors.border.default,
    shadowOpacity: 0,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontFamily: Typography.family.bold,
    fontSize: 12,
    color: Colors.accent.primary,
    letterSpacing: 1.5,
  },
  popularBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontFamily: Typography.family.bold,
    fontSize: 10,
    color: Colors.accent.primary,
  },
  price: {
    fontFamily: Typography.family.bold,
    fontSize: 48,
    color: Colors.text.primary,
    marginBottom: 24,
  },
  billingCycle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  featureList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: Typography.family.regular,
    fontSize: 14,
    color: Colors.text.primary,
  },
  actionBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: Colors.background.app,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
});
