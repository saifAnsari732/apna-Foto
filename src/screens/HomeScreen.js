import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, TextInput, Dimensions, Modal, ActivityIndicator, Alert, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useBrandStore } from '../store/useBrandStore';
import { useAuthStore } from '../store/useAuthStore';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const EXPLORE_FEATURES = [
  { id: 'remove_bg', title: 'Remove Background', icon: 'scissors', color: '#FF7B00', desc: 'AI Background Eraser' },
  { id: 'auto_ad', title: 'Auto Product Ad', icon: 'shopping-bag', color: '#00F2FE', desc: 'Generate business ads' },
  { id: 'wa_sticker', title: 'WhatsApp Sticker', icon: 'smile', color: '#25D366', desc: 'Custom text stickers' },
  { id: 'free_status', title: 'Free Status', icon: 'image', color: '#FF007F', desc: 'Daily greetings templates' },
  { id: 'bday_greetings', title: "B'day Greetings", icon: 'gift', color: '#8A2BE2', desc: 'Anniversary & birthday ads' },
  { id: 'feeds', title: 'Trending Feeds', icon: 'zap', color: '#FFD700', desc: 'Latest designs feed', tag: 'NEW' },
];

const DURGA_TEMPLATES = [
  { id: 'f_durga', name: 'Durga Ashtami', image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop' },
  { id: 'f_diwali', name: 'Shubh Diwali', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop' },
  { id: 'f_newyear', name: 'Happy New Year', image: 'https://images.unsplash.com/photo-1546733749-659155543c6e?q=80&w=600&auto=format&fit=crop' },
];

const AJSU_TEMPLATES = [
  { id: 'p_ajsu', name: 'AJSU Foundation', image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop' },
  { id: 'p_campaign', name: 'Election Slogan', image: 'https://images.unsplash.com/photo-1610483178766-857500561c28?q=80&w=600&auto=format&fit=crop' },
  { id: 'p_birthday', name: 'Leader Birthday', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop' },
];

const NEWS_TEMPLATES = [
  { id: 'p_breaking_news', name: 'Breaking News', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop' },
  { id: 'p_campaign', name: 'Live Campaign Update', image: 'https://images.unsplash.com/photo-1610483178766-857500561c28?q=80&w=600&auto=format&fit=crop' },
];

const YOUTUBE_TEMPLATES = [
  { id: 'b_youtube_qr', name: 'YouTube Subscribe', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop' },
  { id: 'b_cafe', name: 'Cafe Promo', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop' },
];

const BIRTHDAY_TEMPLATES = [
  { id: 'p_kids_birthday', name: 'Kids Birthday Neon', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop' },
  { id: 'p_birthday', name: 'Leader Birthday', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop' },
];

export default function HomeScreen({ navigation }) {
  const brandStore = useBrandStore();
  const authStore = useAuthStore();
  const user = authStore.user || {};

  const [searchQuery, setSearchQuery] = useState('');
  
  // Background Remover Sub-tool States
  const [bgModalVisible, setBgModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingBg, setProcessingBg] = useState(false);
  const [removedBgImage, setRemovedBgImage] = useState(null);

  const handleFeaturePress = (id) => {
    if (id === 'remove_bg') {
      setBgModalVisible(true);
    } else if (id === 'auto_ad') {
      navigation.navigate('Create', { category: 'BUSINESS', templateId: 'b_sale' });
    } else if (id === 'wa_sticker') {
      navigation.navigate('Stickers');
    } else if (id === 'bday_greetings') {
      navigation.navigate('Create', { category: 'POLITICAL', templateId: 'p_birthday' });
    } else if (id === 'free_status') {
      navigation.navigate('Create', { category: 'FESTIVALS' });
    } else {
      Alert.alert('Info 💡', `${EXPLORE_FEATURES.find(f => f.id === id).title} feature is ready for customization.`);
    }
  };

  const pickRemoveBgImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setRemovedBgImage(null);
    }
  };

  const startBgRemoval = () => {
    if (!selectedImage) return;
    setProcessingBg(true);
    // Simulate background removal API delay
    setTimeout(() => {
      setProcessingBg(false);
      // We use the selected image as mock removed background image, but we render checkerboard behind
      setRemovedBgImage(selectedImage);
    }, 2500);
  };

  const handleSendToCanvas = () => {
    if (!removedBgImage) return;
    setBgModalVisible(false);
    // Navigate to Create Screen and pass the image uri to fit into political candidate frame
    navigation.navigate('Create', { 
      category: 'POLITICAL', 
      candidateImage: removedBgImage 
    });
    setSelectedImage(null);
    setRemovedBgImage(null);
  };

  const renderCarouselSection = (title, data, categoryName) => (
    <View style={styles.templatesSection}>
      <View style={styles.templatesHeader}>
        <Text style={[styles.sectionTitle, { color: '#1A1A2E', marginBottom: 0 }]}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Create', { category: categoryName })}>
          <Text style={styles.viewAllText}>View All <Feather name="chevron-right" size={12} /></Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.templateCard} 
            onPress={() => navigation.navigate('Create', { templateId: item.id, category: categoryName })}
          >
            <Image source={{ uri: item.image }} style={styles.templateImage} />
            <View style={styles.templateOverlay}>
              <Text style={styles.templateName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.templatesList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <TouchableOpacity style={styles.brandRow}>
              <Text style={styles.brandName}>{brandStore.businessName || 'Business Name'}</Text>
              <Feather name="chevron-down" size={16} color={Colors.accent.primary} style={styles.chevron} />
            </TouchableOpacity>
            <Text style={styles.subHeader}>Add City</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="bell" size={18} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Posts */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color={Colors.text.secondary} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search Posts by Topics"
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Feather name="mic" size={18} color={Colors.text.secondary} style={styles.micIcon} />
          </View>
        </View>

        {/* AI Poster Creator Banner */}
        <TouchableOpacity 
          style={styles.aiBannerContainer} 
          onPress={() => navigation.navigate('AIGenerate')}
          activeOpacity={0.9}
        >
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0D9488', borderRadius: 20 }]} />
          <View style={styles.aiBannerLeft}>
            <View style={styles.aiIconWrapper}>
              <Feather name="cpu" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.aiBannerTextContainer}>
              <Text style={styles.aiBannerTitle}>AI Poster Generator 🔮</Text>
              <Text style={styles.aiBannerDesc}>Generate premium backgrounds & layouts in seconds using AI prompts!</Text>
            </View>
          </View>
          <View style={styles.aiBannerBtn}>
            <Feather name="chevron-right" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Explore Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresGrid}>
            {EXPLORE_FEATURES.map((feature) => (
              <TouchableOpacity 
                key={feature.id} 
                style={styles.featureCard}
                onPress={() => handleFeaturePress(feature.id)}
                activeOpacity={0.8}
              >
              <View style={[styles.featureIconBg]}>
                  <Feather name={feature.icon} size={22} color={feature.color} />
                  {feature.tag && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>{feature.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureTitle} numberOfLines={1}>{feature.title}</Text>
                <Text style={styles.featureDesc} numberOfLines={1}>{feature.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Durga Ashtami Banners Section */}
        {renderCarouselSection('Durga Ashtami Banners', DURGA_TEMPLATES, 'FESTIVALS')}

        {/* AJSU Foundation Day Section */}
        {renderCarouselSection('AJSU Foundation Day', AJSU_TEMPLATES, 'POLITICAL')}

        {/* Hot Topics (News Layouts) Section */}
        {renderCarouselSection('Hot Topics (News Layouts)', NEWS_TEMPLATES, 'POLITICAL')}

        {/* YouTube Channel Subscribe Section */}
        {renderCarouselSection('YouTube Channel Subscribe', YOUTUBE_TEMPLATES, 'BUSINESS')}

        {/* Kids Birthday Posters Section */}
        {renderCarouselSection('Kids Birthday Posters', BIRTHDAY_TEMPLATES, 'POLITICAL')}

      </ScrollView>

      {/* AI Remove Background Modal Sub-tool */}
      <Modal
        visible={bgModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBgModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Background Eraser</Text>
              <TouchableOpacity onPress={() => setBgModalVisible(false)} style={styles.closeBtn}>
                <Feather name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              
              <TouchableOpacity style={styles.imageSelector} onPress={pickRemoveBgImage}>
                {selectedImage ? (
                  <View style={styles.previewContainer}>
                    {removedBgImage ? (
                      // Removed BG checkered representation
                      <View style={styles.checkerboardContainer}>
                        <View style={styles.checkerboardPattern} />
                        <Image source={{ uri: removedBgImage }} style={styles.pickedImage} />
                      </View>
                    ) : (
                      <Image source={{ uri: selectedImage }} style={styles.pickedImage} />
                    )}
                    {processingBg && (
                      <View style={styles.scanningOverlay}>
                        <MotiView
                          from={{ translateY: -100 }}
                          animate={{ translateY: 100 }}
                          transition={{ type: 'timing', duration: 1200, loop: true }}
                          style={styles.scanningLine}
                        />
                        <ActivityIndicator size="large" color={Colors.accent.primary} />
                        <Text style={styles.scanningText}>AI Removing Background...</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Feather name="image" size={48} color={Colors.accent.primary} />
                    <Text style={styles.uploadPlaceholderTitle}>Select Candidate or Product Photo</Text>
                    <Text style={styles.uploadPlaceholderSub}>Background will be cut out instantly</Text>
                  </View>
                )}
              </TouchableOpacity>

              {selectedImage && !processingBg && !removedBgImage && (
                <TouchableOpacity style={styles.removeBgBtn} onPress={startBgRemoval}>
                  <Feather name="scissors" size={18} color={Colors.text.dark} style={{ marginRight: 8 }} />
                  <Text style={styles.removeBgBtnText}>Erase Background with AI 🔮</Text>
                </TouchableOpacity>
              )}

              {removedBgImage && (
                <View style={styles.successActions}>
                  <View style={styles.successBadge}>
                    <Feather name="check" size={16} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.successText}>Background Removed!</Text>
                  </View>
                  <TouchableOpacity style={styles.sendEditorBtn} onPress={handleSendToCanvas}>
                    <Text style={styles.sendEditorBtnText}>Import to Editor Canvas 🎨</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelectedImage(null); setRemovedBgImage(null); }}>
                    <Text style={styles.resetBtnText}>Upload Another</Text>
                  </TouchableOpacity>
                </View>
              )}

            </ScrollView>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontFamily: Typography.family.bold,
    fontSize: 20,
    color: '#1A1A2E',
  },
  chevron: {
    marginLeft: 6,
  },
  subHeader: {
    fontFamily: Typography.family.medium,
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.accent.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1A1A2E',
    fontFamily: Typography.family.regular,
    fontSize: 14,
  },
  micIcon: {
    marginLeft: 8,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: '#F5F7FA',
  },
  sectionTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    backgroundColor: '#F5F7FA',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#FF7B00',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newBadgeText: {
    fontSize: 7,
    fontFamily: Typography.family.bold,
    color: '#FFF',
  },
  featureTitle: {
    fontFamily: Typography.family.semiBold,
    fontSize: 11,
    color: '#1A1A2E',
    textAlign: 'center',
  },
  featureDesc: {
    fontFamily: Typography.family.regular,
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  templatesSection: {
    marginBottom: 24,
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewAllText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 12,
    color: Colors.accent.primary,
  },
  templatesList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  templateCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  templateImage: {
    width: '100%',
    height: '100%',
  },
  templateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  templateName: {
    fontSize: 9,
    fontFamily: Typography.family.bold,
    color: '#FFF',
  },
  newsBannerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newsCard: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  newsImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  newsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  proBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proBadgeText: {
    fontFamily: Typography.family.bold,
    fontSize: 8,
    color: '#FFF',
  },
  newsTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 16,
    color: '#FFF',
  },
  newsSub: {
    fontFamily: Typography.family.regular,
    fontSize: 11,
    color: '#DDD',
    marginTop: 4,
  },
  // Modal background removal tool styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: Colors.background.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  modalTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 18,
    color: '#FFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    padding: 20,
    alignItems: 'center',
  },
  imageSelector: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  checkerboardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    position: 'relative',
  },
  checkerboardPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    // Represent checkerboard
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  scanningText: {
    fontFamily: Typography.family.semiBold,
    color: '#FFF',
    fontSize: 14,
    marginTop: 14,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  uploadPlaceholderTitle: {
    fontFamily: Typography.family.bold,
    color: '#FFF',
    fontSize: 14,
    marginTop: 14,
    textAlign: 'center',
  },
  uploadPlaceholderSub: {
    fontFamily: Typography.family.regular,
    color: Colors.text.secondary,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  removeBgBtn: {
    width: '100%',
    backgroundColor: Colors.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBgBtnText: {
    fontFamily: Typography.family.bold,
    color: Colors.text.dark,
    fontSize: 14,
  },
  successActions: {
    width: '100%',
    alignItems: 'center',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  successText: {
    fontFamily: Typography.family.bold,
    color: '#FFF',
    fontSize: 12,
  },
  sendEditorBtn: {
    width: '100%',
    backgroundColor: Colors.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendEditorBtnText: {
    fontFamily: Typography.family.bold,
    color: Colors.text.dark,
    fontSize: 14,
  },
  resetBtn: {
    paddingVertical: 10,
  },
  resetBtnText: {
    fontFamily: Typography.family.bold,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  aiBannerContainer: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  aiIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  aiBannerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  aiBannerTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  aiBannerDesc: {
    fontFamily: Typography.family.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    lineHeight: 15,
  },
  aiBannerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});
