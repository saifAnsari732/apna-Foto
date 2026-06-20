import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import PricingScreen from './src/screens/PricingScreen';
import StickersScreen from './src/screens/StickersScreen';
import AIGenerateScreen from './src/screens/AIGenerateScreen';
import { useAuthStore } from './src/store/useAuthStore';
  
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthenticatedApp() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="MainTabs" component={TabNavigator} />
      <AuthStack.Screen name="Pricing" component={PricingScreen} />
      <AuthStack.Screen name="Stickers" component={StickersScreen} />
      <AuthStack.Screen name="AIGenerate" component={AIGenerateScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function setupNavigationBar() {
      if (Platform.OS === 'android') {
        try {
          await NavigationBar.setPositionAsync('relative');
          await NavigationBar.setVisibilityAsync('visible');
          await NavigationBar.setBackgroundColorAsync('#FFFFFF');
          await NavigationBar.setButtonStyleAsync('dark');
        } catch (error) {
          console.error('Error configuring NavigationBar:', error);
        }
      }
    }
    setupNavigationBar();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="App" component={AuthenticatedApp} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
