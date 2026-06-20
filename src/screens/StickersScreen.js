import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal, Share, Alert, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const STICKER_TABS = ['Feedback Request', 'Anniversary', 'Greetings'];

const MOCK_STICKERS = {
  'Greetings': [
    { id: 'gm', emoji: '☕', title: 'Good Morning', bgColor: '#FF9800', textColor: '#FFF' },
    { id: 'gn', emoji: '🌙', title: 'Good Night', bgColor: '#3F51B5', textColor: '#FFF' },
    { id: 'hi', emoji: '💬', title: 'Hi!', bgColor: '#E91E63', textColor: '#FFF' },
    { id: 'welcome', emoji: '🙏', title: 'Welcome', bgColor: '#4CAF50', textColor: '#FFF' },
    { id: 'ty', emoji: '🎁', title: 'Thank You', bgColor: '#9C27B0', textColor: '#FFF' },
    { id: 'congrats', emoji: '🎉', title: 'Badhai Ho', bgColor: '#FF5722', textColor: '#FFF' },
  ],
  'Anniversary': [
    { id: 'hwa', emoji: '🏆', title: 'Happy Anniversary', bgColor: '#FFD700', textColor: '#000' },
    { id: 'lc', emoji: '❤️', title: 'Loving & Caring', bgColor: '#FF2E93', textColor: '#FFF' },
    { id: 'both', emoji: '💑', title: 'Congratulations Both', bgColor: '#00BCD4', textColor: '#FFF' },
  ],
  'Feedback Request': [
    { id: 'review', emoji: '⭐', title: 'Feedback Request', bgColor: '#607D8B', textColor: '#FFF' },
    { id: 'stars', emoji: '✨', title: 'Rate Us 5 Stars', bgColor: '#FFC107', textColor: '#000' },
  ]
};

export default function StickersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Greetings');
  
  // Customizer Modal States
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [customText, setCustomText] = useState('Business Name');
  const [stickerTextColor, setStickerTextColor] = useState('#FFFFFF');
  const [customizerVisible, setCustomizerVisible] = useState(false);
  const [savingSticker, setSavingSticker] = useState(false);

  const handleStickerPress = (sticker) => {
    setSelectedSticker(sticker);
    setCustomizerVisible(true);
  };

  const handleShare = async () => {
    try {
      const shareContent = `✨ ${selectedSticker.emoji} ${selectedSticker.title} - ${customText} ✨\nSent via ApnaFoto Stickers!`;
      await Share.share({
        message: shareContent,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    setSavingSticker(true);
    setTimeout(() => {
      setSavingSticker(false);
      setCustomizerVisible(false);
      Alert.alert('Success ✨', 'Sticker saved to your gallery successfully!');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WhatsApp Sticker</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {STICKER_TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sticker Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stickerGrid}>
          {MOCK_STICKERS[activeTab].map(sticker => (
            <TouchableOpacity 
              key={sticker.id} 
              style={styles.stickerCard}
              onPress={() => handleStickerPress(sticker)}
            >
              <View style={[styles.stickerPreview, { backgroundColor: sticker.bgColor }]}>
                <Text style={styles.stickerEmoji}>{sticker.emoji}</Text>
                <Text style={[styles.stickerTitleText, { color: sticker.textColor }]}>{sticker.title}</Text>
                <Text style={[styles.stickerTextOverlay, { color: sticker.textColor }]}>{customText || 'Business Name'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Customizer Modal */}
      <Modal
        visible={customizerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCustomizerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Customize Sticker</Text>
              <TouchableOpacity onPress={() => setCustomizerVisible(false)} style={styles.closeBtn}>
                <Feather name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {selectedSticker && (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                
                {/* Visual Sticker Card */}
                <View style={styles.stickerDisplayContainer}>
                  <View style={[styles.stickerPreviewLarge, { backgroundColor: selectedSticker.bgColor }]}>
                    <Text style={styles.stickerEmojiLarge}>{selectedSticker.emoji}</Text>
                    <Text style={[styles.stickerTitleLarge, { color: selectedSticker.textColor }]}>{selectedSticker.title}</Text>
                    <Text style={[styles.stickerTextOverlayLarge, { color: stickerTextColor }]}>{customText || 'Your Brand'}</Text>
                  </View>
                </View>

                {/* Customizer form */}
                <View style={styles.section}>
                  <Text style={styles.label}>Sticker Name / Brand</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Enter Business Name"
                    placeholderTextColor={Colors.text.secondary}
                    value={customText}
                    onChangeText={setCustomText}
                  />

                  <Text style={styles.label}>Text Color</Text>
                  <View style={styles.colorPalette}>
                    {['#FFFFFF', '#FFEB3B', '#000000', '#00F2FE', '#FF2E93', '#4CAF50'].map(color => (
                      <TouchableOpacity 
                        key={color} 
                        onPress={() => setStickerTextColor(color)}
                        style={[styles.colorCircle, { backgroundColor: color }, stickerTextColor === color && styles.colorCircleActive]} 
                      />
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleDownload}>
                  <Feather name="download" size={16} color={Colors.text.dark} style={{ marginRight: 8 }} />
                  <Text style={styles.actionBtnPrimaryText}>{savingSticker ? 'Saving...' : 'Download Sticker ✨'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleShare}>
                  <Feather name="share-2" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.actionBtnSecondaryText}>Share to WhatsApp 💬</Text>
                </TouchableOpacity>

              </ScrollView>
            )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  headerTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 18,
    color: '#FFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.background.card,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  tabBtnActive: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  tabText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 11,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.background.app,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stickerCard: {
    width: (width - 56) / 2, // 2 Columns
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    padding: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  stickerPreview: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  stickerEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  stickerTitleText: {
    fontFamily: Typography.family.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  stickerTextOverlay: {
    fontFamily: Typography.family.medium,
    fontSize: 9,
    marginTop: 4,
    opacity: 0.85,
    textAlign: 'center',
  },
  // Customizer modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '75%',
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
  modalHeaderTitle: {
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
  stickerDisplayContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stickerPreviewLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  stickerEmojiLarge: {
    fontSize: 44,
    marginBottom: 6,
  },
  stickerTitleLarge: {
    fontFamily: Typography.family.bold,
    fontSize: 14,
    textAlign: 'center',
  },
  stickerTextOverlayLarge: {
    fontFamily: Typography.family.bold,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.app,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
    fontFamily: Typography.family.regular,
    marginBottom: 16,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: Colors.accent.primary,
  },
  actionBtnPrimary: {
    width: '100%',
    backgroundColor: Colors.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtnPrimaryText: {
    fontFamily: Typography.family.bold,
    color: Colors.text.dark,
    fontSize: 14,
  },
  actionBtnSecondary: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    fontFamily: Typography.family.bold,
    color: '#FFF',
    fontSize: 14,
  },
});
