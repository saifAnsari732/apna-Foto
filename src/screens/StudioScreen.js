import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, GlobalStyles } from '../theme/typography';
import Input from '../components/Input';
import Card from '../components/Card';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 columns, 20px padding on sides + 20px gap

const MOCK_PROJECTS = [
  { id: '1', title: 'Diwali Festival', status: 'COMPLETED', image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=600&auto=format&fit=crop' },
  { id: '2', title: 'Summer Clearance', status: 'COMPLETED', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop' },
  { id: '3', title: 'Hiring: Designer', status: 'COMPLETED', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop' },
];

export default function StudioScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Studio');

  const renderProjectCard = ({ item }) => {
    if (item.isNew) {
      return (
        <TouchableOpacity 
          style={styles.newCard}
          onPress={() => navigation.navigate('Create')}
        >
          <Feather name="plus" size={32} color={Colors.accent.primary} />
          <Text style={styles.newCardText}>NEW DESIGN</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.projectCard}>
        <Image source={{ uri: item.image }} style={styles.projectImage} />
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.projectStatus}>{item.status}</Text>
        </View>
      </View>
    );
  };

  const data = [{ id: 'new', isNew: true }, ...MOCK_PROJECTS];

  return (
    <View style={styles.container}>
      
      {/* Header & Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <Input 
            placeholder="Search designs..." 
            value={search} 
            onChangeText={setSearch} 
            // override default input styles to hide label and margin
            style={{ marginBottom: 0, paddingLeft: 40 }} 
          />
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Studio')}>
            <Text style={[styles.tabText, activeTab === 'Studio' && styles.tabTextActive]}>Studio</Text>
            {activeTab === 'Studio' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Drafts')}>
            <Text style={[styles.tabText, activeTab === 'Drafts' && styles.tabTextActive]}>Drafts</Text>
            {activeTab === 'Drafts' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid List */}
      <FlatList
        data={data}
        renderItem={renderProjectCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Studio Insights Card */}
      <View style={styles.insightsContainer}>
        <Card style={styles.insightsCard}>
          <View>
            <Text style={styles.insightsTitle}>Studio Insights</Text>
            <Text style={styles.insightsSub}>3 Completed • 12 Drafts</Text>
          </View>
          <View style={styles.insightsAvatars}>
            {/* Mocking recent project small avatars */}
            <Image source={{ uri: MOCK_PROJECTS[0].image }} style={[styles.insightImage, { zIndex: 3 }]} />
            <Image source={{ uri: MOCK_PROJECTS[1].image }} style={[styles.insightImage, { marginLeft: -15, zIndex: 2 }]} />
            <View style={[styles.insightMore, { marginLeft: -15, zIndex: 1 }]}>
              <Text style={styles.insightMoreText}>+9</Text>
            </View>
          </View>
        </Card>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  tabText: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  tabTextActive: {
    color: Colors.text.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.accent.primary,
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // space for insights
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  projectCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
  },
  projectInfo: {
    padding: 12,
  },
  projectTitle: {
    fontFamily: Typography.family.bold,
    color: Colors.text.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  projectStatus: {
    fontFamily: Typography.family.bold,
    color: Colors.accent.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  newCard: {
    width: CARD_WIDTH,
    height: (CARD_WIDTH * 1.5) + 50, // Image height + info height approx
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCardText: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 1,
  },
  insightsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  insightsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 43, 0.95)',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  insightsTitle: {
    fontFamily: Typography.family.bold,
    color: Colors.accent.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  insightsSub: {
    fontFamily: Typography.family.regular,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  insightsAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  insightMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.background.card,
    backgroundColor: Colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightMoreText: {
    fontFamily: Typography.family.bold,
    color: Colors.background.app,
    fontSize: 10,
  },
});
