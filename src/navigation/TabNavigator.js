import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import StudioScreen from '../screens/StudioScreen';
import StylesScreen from '../screens/StylesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Create') {
            iconName = 'star';
          } else if (route.name === 'Studio') {
            iconName = 'grid';
          } else if (route.name === 'Styles') {
            iconName = 'aperture';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: ((route) => {
          // Hide tab navigation bar on the editor screen for full-screen focus
          if (route.name === 'Create') {
            return { display: 'none' };
          }
          return {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: Colors.border.default,
            height: Platform.OS === 'ios' ? 84 : 110,
            paddingBottom: Platform.OS === 'ios' ? 24 :20,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          };
        })(route),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Studio" component={StudioScreen} />
      <Tab.Screen name="Styles" component={StylesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
