import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Image, ActivityIndicator, Alert,
  Platform, Share, Dimensions, Animated
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { API_URL } from '../config/api';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const PRESETS = [
  { label: '⚡ Cyberpunk Neon', prompt: 'Cyberpunk neon grid, glowing purple lines, futuristic city' },
  { label: '✨ Gold Luxury', prompt: 'Elegant gold glitter abstract, luxury backdrop, shimmer' },
  { label: '🇮🇳 Indian Tricolor', prompt: 'Patriotic Indian tricolor theme, subtle gradient background' },
  { label: '🌸 Floral Pastel', prompt: 'Festive floral greetings backdrop, soft pastel tones, flowers' },
  { label: '💼 Tech Corporate', prompt: 'Corporate abstract technology circuit, dark blue and cyan' },
  { label: '🎨 Watercolor Splash', prompt: 'Vibrant watercolor splash art, bright colorful background' },
  { label: '🌅 Sunrise Gradient', prompt: 'Stunning sunrise gradient, warm orange and pink sky, golden hour' },
  { label: '🪐 Space Galaxy', prompt: 'Deep space nebula, purple and blue galaxy, glowing stars' },
  { label: '🎆 Diwali Festival', prompt: 'Diwali festival lights, diyas, golden glow, Indian celebration' },
];

export default function AIGenerateScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Prompt Empty ⚠️', 'Please enter a description for the AI to generate.');
      return;
    }
    setLoading(true);
    setResultImage(null);
    startPulse();
    try {
      const response = await fetch(`${API_URL}/api/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setResultImage(data.url);
        pulseAnim.stopAnimation();
      } else {
        Alert.alert('Generation Failed ❌', data.error || 'Failed to generate image.');
      }
    } catch (error) {
      Alert.alert('Connection Error 🔌', 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseInEditor = () => {
    if (!resultImage) return;
    navigation.navigate('MainTabs', {
      screen: 'Create',
      params: { generatedBgImage: resultImage, activeTab: 'AI' }
    });
  };

  const handleShare = async () => {
    if (!resultImage) return;
    try {
      await Share.share({ message: `AI generated poster: ${resultImage}`, url: resultImage });
    } catch (e) {}
  };

  const handlePreset = (preset, index) => {
    setPrompt(preset.prompt);
    setSelectedPreset(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header — gradient-style dark */}
      <View style={styles.header}>
        <View style={styles.headerGradient} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Poster Generator</Text>
          <Text style={styles.headerSub}>Powered by Google Imagen 4</Text>
        </View>
        <View style={styles.aiChip}>
          <Text style={styles.aiChipText}>FAST</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconRow}>
            <Text style={styles.heroEmoji}>🔮</Text>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Describe Your Vision</Text>
              <Text style={styles.heroSub}>AI will paint it in seconds</Text>
            </View>
          </View>
        </View>

        {/* Prompt Input Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Feather name="edit-3" size={16} color={Colors.accent.primary} />
            <Text style={styles.inputLabel}>Your Prompt</Text>
          </View>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder={"e.g. 'Diwali fireworks background, golden bokeh lights, festive'"}
            placeholderTextColor="#9CA3AF"
            value={prompt}
            onChangeText={(t) => { setPrompt(t); setSelectedPreset(null); }}
            textAlignVertical="top"
          />
          {prompt.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setPrompt(''); setSelectedPreset(null); }}>
              <Feather name="x" size={14} color="#9CA3AF" />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preset Chips */}
        <View style={styles.presetsSection}>
          <View style={styles.presetsSectionHeader}>
            <Feather name="zap" size={14} color="#F59E0B" />
            <Text style={styles.presetsLabel}>Quick Presets</Text>
          </View>
          <View style={styles.presetsGrid}>
            {PRESETS.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetChip,
                  selectedPreset === index && styles.presetChipActive
                ]}
                onPress={() => handlePreset(preset, index)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.presetChipText,
                  selectedPreset === index && styles.presetChipTextActive
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.85}
        >
          <View style={styles.generateBtnInner}>
            {loading ? (
              <>
                <ActivityIndicator color="#FFF" size="small" style={{ marginRight: 10 }} />
                <Text style={styles.generateBtnText}>Creating Magic...</Text>
              </>
            ) : (
              <>
                <Feather name="cpu" size={20} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.generateBtnText}>Generate with AI 🔮</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Cost Info */}
        <View style={styles.costInfo}>
          <Feather name="info" size={12} color="#9CA3AF" />
          <Text style={styles.costInfoText}>~₹1.67 per generation • Imagen 4 Fast model</Text>
        </View>

        {/* Loading Animation */}
        {loading && (
          <View style={styles.loadingCard}>
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: 260 }}
              transition={{ type: 'timing', duration: 1400, loop: true }}
              style={styles.scannerLine}
            />
            <View style={styles.loadingContent}>
              <View style={styles.loadingIconBg}>
                <Feather name="cpu" size={32} color={Colors.accent.primary} />
              </View>
              <Text style={styles.loadingTitle}>AI is Painting... 🎨</Text>
              <Text style={styles.loadingSub}>Google Imagen 4 • Usually 5-10 seconds</Text>
              <View style={styles.loadingDots}>
                {[0, 1, 2].map(i => (
                  <MotiView
                    key={i}
                    from={{ opacity: 0.3, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 600, loop: true, delay: i * 200 }}
                    style={styles.loadingDot}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Result */}
        {resultImage && !loading && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>✨ Your AI Masterpiece</Text>
              <TouchableOpacity onPress={() => setResultImage(null)} style={styles.regenerateBtn}>
                <Feather name="refresh-cw" size={14} color={Colors.accent.primary} />
                <Text style={styles.regenerateBtnText}>Redo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageWrapper}>
              <Image source={{ uri: resultImage }} style={styles.generatedImage} />
              <View style={styles.imageBadge}>
                <Text style={styles.imageBadgeText}>🔮 AI Generated</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.useInEditorBtn} onPress={handleUseInEditor} activeOpacity={0.85}>
              <View style={styles.useInEditorBtnInner}>
                <Feather name="edit-2" size={18} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.useInEditorBtnText}>Use in Poster Editor 🎨</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
              <Feather name="share-2" size={16} color={Colors.accent.primary} style={{ marginRight: 8 }} />
              <Text style={styles.shareBtnText}>Share / Download Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // ─── Header ───────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 18,
    backgroundColor: '#1A1A2E',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#16213E',
    opacity: 0.9,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontFamily: Typography.family.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
  },
  aiChip: {
    backgroundColor: '#0D9488',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiChipText: {
    fontFamily: Typography.family.bold,
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },

  // ─── Hero Banner ──────────────────────────────────────────
  heroBanner: {
    backgroundColor: '#0D9488',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 42,
    marginRight: 16,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  heroSub: {
    fontFamily: Typography.family.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

  // ─── Input Card ───────────────────────────────────────────
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: Typography.family.bold,
    fontSize: 14,
    color: '#1A1A2E',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    color: '#1A1A2E',
    fontFamily: Typography.family.regular,
    fontSize: 14,
    padding: 14,
    minHeight: 110,
    lineHeight: 22,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  clearBtnText: {
    fontFamily: Typography.family.medium,
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },

  // ─── Presets ──────────────────────────────────────────────
  presetsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  presetsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  presetsLabel: {
    fontFamily: Typography.family.bold,
    fontSize: 14,
    color: '#1A1A2E',
    marginLeft: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  presetChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  presetChipText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 12,
    color: '#0F766E',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },

  // ─── Generate Button ──────────────────────────────────────
  generateBtn: {
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnInner: {
    backgroundColor: '#0D9488',
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    fontFamily: Typography.family.bold,
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  costInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 5,
  },
  costInfoText: {
    fontFamily: Typography.family.medium,
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },

  // ─── Loading State ────────────────────────────────────────
  loadingCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    height: 280,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    backgroundColor: '#0D9488',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    zIndex: 2,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 24,
  },
  loadingIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,122,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,122,255,0.3)',
  },
  loadingTitle: {
    fontFamily: Typography.family.bold,
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 6,
  },
  loadingSub: {
    fontFamily: Typography.family.regular,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D9488',
  },

  // ─── Result Section ───────────────────────────────────────
  resultSection: {
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultTitle: {
    fontFamily: Typography.family.bold,
    color: '#1A1A2E',
    fontSize: 18,
  },
  regenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 5,
  },
  regenerateBtnText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 12,
    color: '#0D9488',
    marginLeft: 4,
  },
  imageWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    aspectRatio: 1,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#CCFBF1',
  },
  generatedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backdropFilter: 'blur(8px)',
  },
  imageBadgeText: {
    fontFamily: Typography.family.bold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  useInEditorBtn: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  useInEditorBtnInner: {
    backgroundColor: '#0D9488',
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  useInEditorBtnText: {
    fontFamily: Typography.family.bold,
    color: '#FFFFFF',
    fontSize: 15,
  },
  shareBtn: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
  },
  shareBtnText: {
    fontFamily: Typography.family.bold,
    color: '#0D9488',
    fontSize: 14,
  },
});
