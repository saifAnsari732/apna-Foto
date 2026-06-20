import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Feather } from '@expo/vector-icons';

import { loginAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authStore = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    
    setLoading(true);
    try {
      const data = await loginAPI(email, password);
      // Assuming API returns { user, token }
      authStore.login(data.user, data.token);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', error.message || 'Network error');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContent}>
          <Feather name="zap" size={48} color={Colors.accent.primary} style={styles.icon} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue creating magic.</Text>

          <Input 
            label="Email Address" 
            placeholder="julian@example.com" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            label="Password" 
            placeholder="••••••••" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />

          <Button 
            title={loading ? "Signing In..." : "Sign In"} 
            onPress={handleLogin} 
            style={styles.loginBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  innerContent: {
    width: '100%',
  },
  icon: {
    marginBottom: 24,
    alignSelf: 'center',
  },
  title: {
    fontFamily: Typography.family.bold,
    fontSize: 32,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.family.regular,
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  loginBtn: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontFamily: Typography.family.regular,
    color: Colors.text.secondary,
  },
  footerLink: {
    fontFamily: Typography.family.bold,
    color: Colors.accent.primary,
  },
});
