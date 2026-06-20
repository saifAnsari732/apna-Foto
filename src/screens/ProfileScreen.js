import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, GlobalStyles } from '../theme/typography';
import { Feather } from '@expo/vector-icons';
import Card from '../components/Card';
import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen({ navigation }) {
  const authStore = useAuthStore();
  const user = authStore.user || {};

  const handleLogout = () => {
    authStore.logout();
  };

  const SETTINGS_OPTIONS = [
    { id: '1', title: 'Subscription Management', icon: 'credit-card', action: () => navigation.navigate('Pricing') },
    { id: '2', title: 'Linked Social Accounts', icon: 'share-2' },
    { id: '3', title: 'App Settings', icon: 'settings' },
    { id: '4', title: 'Help & Support', icon: 'help-circle' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Header: Avatar & Info */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.avatar} 
            />
            {user.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user.name || 'Creator'}</Text>
          <Text style={styles.userEmail}>{user.email || 'Welcome back'}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.accent.primary }]}>128</Text>
            <Text style={styles.statLabel}>POSTERS CREATED</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FFD700' }]}>12</Text>
            <Text style={styles.statLabel}>ACTIVE PROJECTS</Text>
          </Card>
        </View>

        {/* Settings Menu */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
          {SETTINGS_OPTIONS.map((option) => (
            <TouchableOpacity key={option.id} style={styles.settingRow} onPress={option.action}>
              <View style={styles.settingRowLeft}>
                <Feather name={option.icon} size={20} color={Colors.accent.primary} style={styles.settingIcon} />
                <Text style={styles.settingTitle}>{option.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.accent.warning} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Designed for high-octane creators. v2.4.0-magic</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.background.app,
  },
  proBadge: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proBadgeText: {
    fontFamily: Typography.family.bold,
    color: Colors.text.dark,
    fontSize: 10,
    letterSpacing: 1,
  },
  userName: {
    fontFamily: Typography.family.bold,
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Typography.family.regular,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'transparent', // Can add subtle border if needed
  },
  statValue: {
    fontFamily: Typography.family.bold,
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionLabel: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.primary,
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: 'rgba(26, 31, 43, 0.5)',
    marginBottom: 40,
  },
  logoutText: {
    fontFamily: Typography.family.bold,
    color: Colors.accent.warning,
    fontSize: 14,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'monospace',
    color: Colors.text.secondary,
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.5,
  },
});
