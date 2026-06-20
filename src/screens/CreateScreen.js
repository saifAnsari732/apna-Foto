import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Alert, Dimensions, PanResponder, Animated, TextInput, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography, GlobalStyles } from '../theme/typography';
import { useBrandStore } from '../store/useBrandStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import { API_URL } from '../config/api';
import { uploadToImageKit } from '../utils/imagekit';

const { width } = Dimensions.get('window');
const CATEGORIES = ['ALL', 'FESTIVALS', 'BUSINESS', 'POLITICAL'];

const TEMPLATES = [
  {
    id: 'f_newyear',
    name: 'New Year',
    category: 'FESTIVALS',
    type: 'newyear',
    bgColor: '#0B1E36',
    textColor: '#F8FAFC',
    accentColor: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1546733749-659155543c6e?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'HAPPY NEW YEAR',
    defaultSubheadline: 'May God bless your family with prosperity, health and happiness.',
    defaultCta: 'Welcome 2026! 🎉'
  },
  {
    id: 'f_pongal',
    name: 'Happy Pongal',
    category: 'FESTIVALS',
    type: 'pongal',
    bgColor: '#E65C00',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1610116306796-6ebd3051c330?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'HAPPY PONGAL',
    defaultSubheadline: 'May the sweetness of Pongal fill your life with happiness and joy.',
    defaultCta: 'Happy Harvest! 🌾'
  },
  {
    id: 'f_lohri',
    name: 'Happy Lohri',
    category: 'FESTIVALS',
    type: 'lohri',
    bgColor: '#4B0082',
    textColor: '#FFFFFF',
    accentColor: '#FFA500',
    bgImage: 'https://images.unsplash.com/photo-1594913785162-e67853b23c28?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'लोहड़ी दी लख-लख बधाइयां',
    defaultSubheadline: 'लोहड़ी का प्रकाशमय त्यौहार सबके जीवन में शुभता और संपन्नता लाए।',
    defaultCta: 'Happy Lohri! 🔥'
  },
  {
    id: 'f_diwali',
    name: 'Shubh Diwali',
    category: 'FESTIVALS',
    type: 'diwali',
    bgColor: '#1E1405',
    textColor: '#FFF3E0',
    accentColor: '#FF9800',
    bgImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'शुभ दीपावली',
    defaultSubheadline: 'सुख, समृद्धि और खुशियों का यह पावन पर्व आपके जीवन में प्रकाश लाए।',
    defaultCta: 'Shubh Diwali! 🪔'
  },
  {
    id: 'f_durga',
    name: 'Durga Ashtami',
    category: 'FESTIVALS',
    type: 'durga_ashtami',
    bgColor: '#4A0404',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'शुभ दुर्गा अष्टमी',
    defaultSubheadline: 'या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता। दुर्गा अष्टमी की हार्दिक शुभकामनाएं।',
    defaultCta: 'जय माता दी! 🪔'
  },
  {
    id: 'b_sale',
    name: 'Super Sale',
    category: 'BUSINESS',
    type: 'sale',
    bgColor: '#D32F2F',
    textColor: '#FFFFFF',
    accentColor: '#FFEB3B',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'MEGA SALE',
    defaultSubheadline: 'UP TO 50% OFF ON ALL ITEMS. VALID FOR THIS WEEKEND ONLY.',
    defaultCta: 'Shop Now! 🛍️'
  },
  {
    id: 'b_cafe',
    name: 'Cafe Promo',
    category: 'BUSINESS',
    type: 'cafe',
    bgColor: '#2E1A11',
    textColor: '#FFF8E1',
    accentColor: '#D7CCC8',
    bgImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'COFFEE DAY',
    defaultSubheadline: 'Taste our premium freshly brewed coffee and premium cookies.',
    defaultCta: 'Visit Us! ☕'
  },
  {
    id: 'p_campaign',
    name: 'Election Slogan',
    category: 'POLITICAL',
    type: 'politics_campaign',
    bgColor: '#FF9933',
    textColor: '#FFFFFF',
    accentColor: '#128807',
    bgImage: 'https://images.unsplash.com/photo-1610483178766-857500561c28?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'सबका विकास संकल्प',
    defaultSubheadline: 'ईमानदार नेतृत्व और विकास की नई सोच। इस बार भारी मतों से विजयी बनाएं।',
    defaultCta: 'Vote for Progress! 🗳️'
  },
  {
    id: 'p_birthday',
    name: 'Leader Birthday',
    category: 'POLITICAL',
    type: 'politics_birthday',
    bgColor: '#002F6C',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'हार्दिक शुभकामनाएं',
    defaultSubheadline: 'हमारे जनप्रिय नेता एवं प्रेरणास्रोत को जन्मदिन की कोटि-कोटि बधाई।',
    defaultCta: 'Long Live Leader! 🌟'
  },
  {
    id: 'p_ajsu',
    name: 'AJSU Foundation',
    category: 'POLITICAL',
    type: 'politics_ajsu',
    bgColor: '#1B5E20',
    textColor: '#FFFFFF',
    accentColor: '#FFEB3B',
    bgImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'स्थापना दिवस समारोह',
    defaultSubheadline: 'झारखंड छात्र संघ के स्थापना दिवस पर सभी कार्यकर्ताओं को बधाई।',
    defaultCta: 'एकता और विकास! 🚩'
  },
  {
    id: 'b_youtube_qr',
    name: 'YouTube Subscribe',
    category: 'BUSINESS',
    type: 'youtube_qr',
    bgColor: '#1A1A1A',
    textColor: '#FFFFFF',
    accentColor: '#FF0000',
    bgImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'SUBSCRIBE OUR CHANNEL',
    defaultSubheadline: 'Scan QR code to get daily business tips, updates, and tutorial videos.',
    defaultCta: 'Search: MyBusinessChannel 📺'
  },
  {
    id: 'p_kids_birthday',
    name: 'Kids Birthday',
    category: 'POLITICAL',
    type: 'kids_birthday',
    bgColor: '#1B0B2E',
    textColor: '#FFFFFF',
    accentColor: '#FF007F',
    bgImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'HAPPY BIRTHDAY CHAMP',
    defaultSubheadline: 'May your day be filled with lots of fun, laughter, and beautiful surprises! Happy birthday cutie pie!',
    defaultCta: 'Party Time! 🎈🎂'
  },
  {
    id: 'p_breaking_news',
    name: 'Breaking News',
    category: 'POLITICAL',
    type: 'breaking_news',
    bgColor: '#8B0000',
    textColor: '#FFFFFF',
    accentColor: '#FFCC00',
    bgImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
    defaultHeadline: 'BREAKING NEWS',
    defaultSubheadline: 'ApnaFoto launches state-of-the-art neon editing features. Millions of users are joining the platform daily!',
    defaultCta: 'Live from Ranchi 🎥'
  }
];

// Reusable Custom Draggable Hook using PanResponder
const useDraggable = (initialX = 0, initialY = 0, onTap = null) => {
  const base = useRef({ x: initialX, y: initialY });
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  
  // Keep onTap ref updated
  const onTapRef = useRef(onTap);
  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setPos({
          x: base.current.x + gestureState.dx,
          y: base.current.y + gestureState.dy,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Detect tap vs drag (less than 5 pixels movement)
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          if (onTapRef.current) onTapRef.current();
        }
        
        base.current = {
          x: base.current.x + gestureState.dx,
          y: base.current.y + gestureState.dy,
        };
        setPos(base.current);
      },
    })
  ).current;

  const reset = (x = initialX, y = initialY) => {
    base.current = { x, y };
    setPos({ x, y });
  };

  return [pos, responder, reset];
};

const useResizeHandle = (currentSize, setSize, isScale = false) => {
  const base = useRef(currentSize);
  
  useEffect(() => {
    base.current = currentSize;
  }, [currentSize]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        const delta = (gestureState.dx + gestureState.dy) / 2;
        if (isScale) {
          let newSize = base.current + (delta / 150);
          setSize(Math.max(0.2, Math.min(5.0, newSize)));
        } else {
          let newSize = base.current + (delta / 4);
          setSize(Math.max(8, Math.min(150, newSize)));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const delta = (gestureState.dx + gestureState.dy) / 2;
        if (isScale) {
          base.current = Math.max(0.2, Math.min(5.0, base.current + (delta / 150)));
        } else {
          base.current = Math.max(8, Math.min(150, base.current + (delta / 4)));
        }
      },
    })
  ).current;

  return responder;
};

const useRotateHandle = (currentAngle, setAngle) => {
  const base = useRef(currentAngle);
  
  useEffect(() => {
    base.current = currentAngle;
  }, [currentAngle]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        const delta = gestureState.dx; // 1 pixel = 1 degree
        setAngle(base.current + delta);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const delta = gestureState.dx;
        base.current = base.current + delta;
      },
    })
  ).current;

  return responder;
};

const CustomSlider = ({ min, max, value, onValueChange, step = 1 }) => {
  const containerWidth = useRef(150);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouch(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleTouch = (locationX) => {
    let percentage = locationX / containerWidth.current;
    percentage = Math.max(0, Math.min(1, percentage));
    const rawVal = min + percentage * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    onValueChange(Math.max(min, Math.min(max, steppedVal)));
  };

  const percentage = (value - min) / (max - min);

  return (
    <View 
      style={styles.sliderTrack} 
      {...panResponder.panHandlers}
      onLayout={(e) => { containerWidth.current = e.nativeEvent.layout.width || 150; }}
    >
      <View style={[styles.sliderFill, { width: `${percentage * 100}%` }]} />
      <View style={[styles.sliderHandle, { left: `${percentage * 100}%`, marginLeft: -8 }]} />
    </View>
  );
};

export default function CreateScreen({ route, navigation }) {

  const brandStore = useBrandStore();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  // Coordinates states for Draggable items
  const [headlinePos, headlineResponder, resetHeadline] = useDraggable(0, 0, () => { setSelectedCanvasEl('HEADLINE'); setActiveElement('HEADLINE'); });
  const [subheadlinePos, subheadlineResponder, resetSubheadline] = useDraggable(0, 0, () => { setSelectedCanvasEl('SUBHEADLINE'); setActiveElement('SUBHEADLINE'); });
  const [logoPos, logoResponder, resetLogo] = useDraggable(0, 0, () => { setSelectedCanvasEl('LOGO'); setActiveElement('LOGO'); });
  const [businessNamePos, businessNameResponder, resetBusinessName] = useDraggable(0, 0, () => { setSelectedCanvasEl('BRANDNAME'); setActiveElement('BRANDNAME'); });
  const [footerPos, footerResponder, resetFooter] = useDraggable(0, 0, () => { setSelectedCanvasEl('FOOTER'); setActiveElement('FOOTER'); });

  // Draggable emoji states (per template type) — REMOVED, emojis removed from canvas
  // (kept as unused refs to avoid breaking existing code)
  const [, emoji1Responder] = useDraggable(0, 0);
  const [, emoji2Responder] = useDraggable(0, 0);
  const [, emoji3Responder] = useDraggable(0, 0);
  const [, emoji4Responder] = useDraggable(0, 0);
  const [, emoji5Responder] = useDraggable(0, 0);
  const [, emoji6Responder] = useDraggable(0, 0);

  // Uploaded user image on canvas (draggable)
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [uploadedImgPos, uploadedImgResponder, resetUploadedImg] = useDraggable(0, 0, () => { setSelectedCanvasEl('UPLOADED_IMG'); setActiveElement('UPLOADED_IMG'); });
  const [uploadedImgScale, setUploadedImgScale] = useState(1.0);
  const [uploadedImgOpacity, setUploadedImgOpacity] = useState(1.0);

  // Sizing controls states
  const [headlineSize, setHeadlineSize] = useState(26);
  const [subheadlineSize, setSubheadlineSize] = useState(14);
  const [brandNameSize, setBrandNameSize] = useState(15);
  const [logoScale, setLogoScale] = useState(1.0);

  // Resize Handle Responders
  const headlineResize = useResizeHandle(headlineSize, setHeadlineSize, false);
  const subheadlineResize = useResizeHandle(subheadlineSize, setSubheadlineSize, false);
  const brandNameResize = useResizeHandle(brandNameSize, setBrandNameSize, false);
  const logoResize = useResizeHandle(logoScale, setLogoScale, true);
  const uploadedImgResize = useResizeHandle(uploadedImgScale, setUploadedImgScale, true);

  // Rotation states and responders
  const [headlineRotation, setHeadlineRotation] = useState(0);
  const [subheadlineRotation, setSubheadlineRotation] = useState(0);
  const [brandNameRotation, setBrandNameRotation] = useState(0);
  const [logoRotation, setLogoRotation] = useState(0);
  const [uploadedImgRotation, setUploadedImgRotation] = useState(0);

  const headlineRot = useRotateHandle(headlineRotation, setHeadlineRotation);
  const subheadlineRot = useRotateHandle(subheadlineRotation, setSubheadlineRotation);
  const brandNameRot = useRotateHandle(brandNameRotation, setBrandNameRotation);
  const logoRot = useRotateHandle(logoRotation, setLogoRotation);
  const uploadedImgRot = useRotateHandle(uploadedImgRotation, setUploadedImgRotation);

  // Color selection override states
  const [customTextColor, setCustomTextColor] = useState('#FFFFFF');
  const [customBgColor, setCustomBgColor] = useState(null);

  // AI background image states
  const [aiBgImageUri, setAiBgImageUri] = useState(null);
  const [aiImgPrompt, setAiImgPrompt] = useState('');
  const [aiImgLoading, setAiImgLoading] = useState(false);

  // Canvas element selection state (click to select, then drag)
  const [selectedCanvasEl, setSelectedCanvasEl] = useState(null); // 'HEADLINE' | 'SUBHEADLINE' | 'BRANDNAME' | 'FOOTER' | 'LOGO' | null

  // Opacity and D-pad active element states
  const [activeElement, setActiveElement] = useState('HEADLINE'); // 'HEADLINE' | 'SUBHEADLINE' | 'LOGO' | 'BRANDNAME' | 'FOOTER'
  const [headlineOpacity, setHeadlineOpacity] = useState(1.0);
  const [subheadlineOpacity, setSubheadlineOpacity] = useState(1.0);
  const [logoOpacity, setLogoOpacity] = useState(1.0);
  const [brandNameOpacity, setBrandNameOpacity] = useState(1.0);
  const [footerOpacity, setFooterOpacity] = useState(1.0);
  const [selectedFrame, setSelectedFrame] = useState('glass'); // 'glass' | 'tricolor' | 'gold' | 'white_red' | 'gradient'

  // Editable text contents
  const [headlineText, setHeadlineText] = useState(TEMPLATES[0].defaultHeadline);
  const [subheadlineText, setSubheadlineText] = useState(TEMPLATES[0].defaultSubheadline);
  const [ctaText, setCtaText] = useState(TEMPLATES[0].defaultCta);

  // User details inputs
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [businessName, setBusinessName] = useState(brandStore.businessName);
  const [phone, setPhone] = useState(brandStore.whatsappNumber);
  const [logoUri, setLogoUri] = useState(brandStore.logoUri);

  // Images for special slots
  const [productImageUri, setProductImageUri] = useState(null);
  const [candidateImageUri, setCandidateImageUri] = useState(null);
  const [partySymbolUri, setPartySymbolUri] = useState(null);

  // Control tabs below Canvas
  const [activeControlTab, setActiveControlTab] = useState('TEXT'); // 'TEXT' | 'ADJUST' | 'COLOR' | 'AI'

  // AI copywriting prompt and state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const viewShotRef = useRef();

  useEffect(() => {
    if (!businessName && brandStore.businessName) setBusinessName(brandStore.businessName);
    if (!phone && brandStore.whatsappNumber) setPhone(brandStore.whatsappNumber);
    if (!logoUri && brandStore.logoUri) setLogoUri(brandStore.logoUri);
  }, [brandStore.businessName, brandStore.whatsappNumber, brandStore.logoUri]);

  // Deep linking and feature selection params listener
  useEffect(() => {
    if (route.params) {
      if (route.params.templateId) {
        const template = TEMPLATES.find(t => t.id === route.params.templateId);
        if (template) {
          handleSelectTemplate(template);
        }
      }
      if (route.params.category) {
        setSelectedCategory(route.params.category);
        const firstOfCategory = TEMPLATES.find(t => t.category === route.params.category);
        if (firstOfCategory) {
          handleSelectTemplate(firstOfCategory);
        }
      }
      if (route.params.candidateImage) {
        setCandidateImageUri(route.params.candidateImage);
      }
      if (route.params.generatedBgImage) {
        setAiBgImageUri(route.params.generatedBgImage);
      }
      if (route.params.activeTab) {
        setActiveControlTab(route.params.activeTab);
      }
    }
  }, [route.params]);


  const pickImage = async (setter) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setter(localUri); // Optimistic UI preview
      
      try {
        const cdnUrl = await uploadToImageKit(localUri);
        if (cdnUrl) {
          setter(cdnUrl);
        }
      } catch (error) {
        console.error('Failed to upload image to ImageKit:', error);
      }
    }
  };

  const nudgeElement = (direction) => {
    let dx = 0;
    let dy = 0;
    const step = 2; // move by 2 pixels

    if (direction === 'UP') dy = -step;
    if (direction === 'DOWN') dy = step;
    if (direction === 'LEFT') dx = -step;
    if (direction === 'RIGHT') dx = step;

    if (activeElement === 'HEADLINE') {
      resetHeadline(headlinePos.x + dx, headlinePos.y + dy);
    } else if (activeElement === 'SUBHEADLINE') {
      resetSubheadline(subheadlinePos.x + dx, subheadlinePos.y + dy);
    } else if (activeElement === 'LOGO') {
      resetLogo(logoPos.x + dx, logoPos.y + dy);
    } else if (activeElement === 'BRANDNAME') {
      resetBusinessName(businessNamePos.x + dx, businessNamePos.y + dy);
    } else if (activeElement === 'FOOTER') {
      resetFooter(footerPos.x + dx, footerPos.y + dy);
    } else if (activeElement === 'UPLOADED_IMG') {
      resetUploadedImg(uploadedImgPos.x + dx, uploadedImgPos.y + dy);
    }
  };

  const resetElementPosition = () => {
    if (activeElement === 'HEADLINE') resetHeadline(0, 0);
    else if (activeElement === 'SUBHEADLINE') resetSubheadline(0, 0);
    else if (activeElement === 'LOGO') resetLogo(0, 0);
    else if (activeElement === 'BRANDNAME') resetBusinessName(0, 0);
    else if (activeElement === 'FOOTER') resetFooter(0, 0);
    else if (activeElement === 'UPLOADED_IMG') resetUploadedImg(0, 0);
  };

  const getSelectedElementOpacity = () => {
    if (activeElement === 'HEADLINE') return headlineOpacity;
    if (activeElement === 'SUBHEADLINE') return subheadlineOpacity;
    if (activeElement === 'LOGO') return logoOpacity;
    if (activeElement === 'BRANDNAME') return brandNameOpacity;
    if (activeElement === 'FOOTER') return footerOpacity;
    if (activeElement === 'UPLOADED_IMG') return uploadedImgOpacity;
    return 1.0;
  };

  const setSelectedElementOpacity = (val) => {
    if (activeElement === 'HEADLINE') setHeadlineOpacity(val);
    else if (activeElement === 'SUBHEADLINE') setSubheadlineOpacity(val);
    else if (activeElement === 'LOGO') setLogoOpacity(val);
    else if (activeElement === 'BRANDNAME') setBrandNameOpacity(val);
    else if (activeElement === 'FOOTER') setFooterOpacity(val);
    else if (activeElement === 'UPLOADED_IMG') setUploadedImgOpacity(val);
  };

  const getSelectedElementSize = () => {
    if (activeElement === 'HEADLINE') return headlineSize;
    if (activeElement === 'SUBHEADLINE') return subheadlineSize;
    if (activeElement === 'BRANDNAME') return brandNameSize;
    if (activeElement === 'LOGO') return logoScale;
    if (activeElement === 'UPLOADED_IMG') return uploadedImgScale;
    return 14;
  };

  const setSelectedElementSize = (val) => {
    if (activeElement === 'HEADLINE') setHeadlineSize(val);
    else if (activeElement === 'SUBHEADLINE') setSubheadlineSize(val);
    else if (activeElement === 'BRANDNAME') setBrandNameSize(val);
    else if (activeElement === 'LOGO') setLogoScale(val);
    else if (activeElement === 'UPLOADED_IMG') setUploadedImgScale(val);
  };

  const getFooterStyle = () => {
    switch (selectedFrame) {
      case 'tricolor':
        return {
          backgroundColor: '#FF9933',
          borderWidth: 2,
          borderColor: '#128807',
          borderRadius: 8,
        };
      case 'gold':
        return {
          backgroundColor: '#800020', // Burgundy/Crimson
          borderWidth: 2,
          borderColor: '#FFD700', // Gold
          borderRadius: 12,
        };
      case 'white_red':
        return {
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#D32F2F', // Red
          borderRadius: 10,
        };
      case 'gradient':
        return {
          backgroundColor: '#2A085C', // Dark Purple
          borderWidth: 1.5,
          borderColor: '#FF007F', // Neon Pink
          borderRadius: 15,
        };
      case 'glass':
      default:
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderWidth: 1,
          borderColor: '#00F2FE', // Neon Cyan
          borderRadius: 12,
        };
    }
  };

  const getFooterTextStyle = () => {
    switch (selectedFrame) {
      case 'white_red':
        return { color: '#000000' };
      default:
        return { color: '#FFFFFF' };
    }
  };

  const getFooterCtaColor = () => {
    switch (selectedFrame) {
      case 'tricolor':
        return '#FFFFFF';
      case 'gold':
        return '#FFD700';
      case 'white_red':
        return '#D32F2F';
      case 'gradient':
        return '#FF007F';
      case 'glass':
      default:
        return '#00F2FE';
    }
  };


  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setHeadlineText(template.defaultHeadline);
    setSubheadlineText(template.defaultSubheadline);
    setCtaText(template.defaultCta);
    setCustomBgColor(null);
    setCustomTextColor(template.textColor || '#FFFFFF');

    // Reset default sizes and scales
    if (template.category === 'BUSINESS') {
      setHeadlineSize(28);
      setSubheadlineSize(14);
      setLogoScale(1.1);
    } else if (template.category === 'POLITICAL') {
      setHeadlineSize(24);
      setSubheadlineSize(13);
      setLogoScale(1.3);
    } else {
      setHeadlineSize(26);
      setSubheadlineSize(14);
      setLogoScale(1.0);
    }

    // Reset default offsets
    resetHeadline(0, 0);
    resetSubheadline(0, 0);
    resetLogo(0, 0);
    resetBusinessName(0, 0);
    resetFooter(0, 0);
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your media library to save the poster.');
        return;
      }

      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success ✨', 'Poster saved to your gallery!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save the poster.');
    }
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Share.share({
          message: `Check out my custom poster from ApnaFoto! 🎨\n${Platform.OS === 'ios' ? '' : uri}`,
          url: Platform.OS === 'ios' ? uri : undefined,
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to share poster.');
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt) {
      Alert.alert('Error', 'Please describe what you want the AI to write.');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: selectedTemplate.category.toLowerCase(),
          context: selectedTemplate.name
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setHeadlineText(data.headline);
        setSubheadlineText(data.subheadline);
        if (data.cta) setCtaText(data.cta);
        if (data.bgColor) setCustomBgColor(data.bgColor);
        if (data.textColor) setCustomTextColor(data.textColor);
        Alert.alert('AI Success ✨', 'Poster content generated successfully!');
      } else {
        Alert.alert('AI Error', data.error || 'Failed to generate copy.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Connection Error', 'Could not connect to the backend server. Make sure the Node server is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateImageAI = async () => {
    if (!aiImgPrompt) {
      Alert.alert('Error', 'Please enter a prompt to generate the background image.');
      return;
    }

    setAiImgLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiImgPrompt,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiBgImageUri(data.url);
        Alert.alert('AI Success 🎨', 'Background image generated and set successfully!');
      } else {
        Alert.alert('AI Error', data.error || 'Failed to generate background image.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Connection Error', 'Could not connect to the backend server. Make sure the Node server is running.');
    } finally {
      setAiImgLoading(false);
    }
  };


  const filteredTemplates = TEMPLATES.filter(t => {
    if (selectedCategory === 'ALL') return true;
    return t.category === selectedCategory;
  });

  const renderTemplateItem = ({ item }) => {
    const isSelected = selectedTemplate.id === item.id;
    return (
      <TouchableOpacity onPress={() => handleSelectTemplate(item)} style={styles.templateCardContainer}>
        <View style={[styles.templateImageWrapper, isSelected && styles.templateImageWrapperActive]}>
          <Image source={{ uri: item.bgImage }} style={styles.templateImage} />
          {isSelected && (
            <View style={styles.templateCheckmark}>
              <Feather name="check" size={10} color={Colors.background.app} />
            </View>
          )}
        </View>
        <Text style={styles.templateBelowText} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderCanvasContent = () => {
    const isFestival = selectedTemplate.category === 'FESTIVALS';
    const isBusiness = selectedTemplate.category === 'BUSINESS';
    const isPolitical = selectedTemplate.category === 'POLITICAL';
    const type = selectedTemplate.type;
    const isNewsOrKids = type === 'kids_birthday' || type === 'breaking_news';

    const textStyle = {
      color: customTextColor,
    };

    const candidateSlotStyle = [
      styles.candidatePhotoSlot,
      type === 'breaking_news' && {
        width: 170,
        height: 170,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFCC00',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }
    ];

    return (
      <View style={StyleSheet.absoluteFill}>
        {/* Emoji overlays removed — cleaner poster look */}

        {/* ─── Uploaded User Image (draggable) ─── */}
        {uploadedImageUri && (
          <Animated.View
            style={[
              styles.draggableEmoji,
              {
                top: '30%',
                left: '50%',
                marginLeft: -50,
                transform: [
                  { translateX: uploadedImgPos.x },
                  { translateY: uploadedImgPos.y },
                  { scale: uploadedImgScale },
                  { rotate: `${uploadedImgRotation}deg` }
                ],
                zIndex: 20,
                touchAction: 'none'
              }
            ]}
            {...uploadedImgResponder.panHandlers}
          >
            <Image
              source={{ uri: uploadedImageUri }}
              style={{ width: 100, height: 100, borderRadius: 8, borderWidth: 2, borderColor: '#FFF' }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setUploadedImageUri(null)}
              style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#FF3B30', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
            >
              <Feather name="x" size={12} color="#FFF" />
            </TouchableOpacity>
            {selectedCanvasEl === 'UPLOADED_IMG' && (
              <>
                <View style={[styles.moveHandle, { transform: [{ scale: 1 / uploadedImgScale }] }]}>
                  <Feather name="move" size={10} color="#FFF" />
                </View>
                <View style={[styles.resizeHandle, { transform: [{ scale: 1 / uploadedImgScale }] }]} {...uploadedImgResize.panHandlers}>
                  <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <View style={[styles.rotateHandle, { transform: [{ scale: 1 / uploadedImgScale }] }]} {...uploadedImgRot.panHandlers}>
                  <Feather name="rotate-cw" size={10} color="#FFF" />
                </View>
              </>
            )}
          </Animated.View>
        )}
        {type === 'breaking_news' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 42, backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: '#FFCC00', flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#FFCC00', paddingHorizontal: 8, paddingVertical: 2, marginRight: 8, borderRadius: 4 }}>
                <Text style={{ fontSize: 11, fontFamily: Typography.family.bold, color: '#000' }}>BREAKING</Text>
              </View>
              <Text style={{ fontSize: 13, fontFamily: Typography.family.bold, color: '#FFF', letterSpacing: 1 }}>NEWS REPORT</Text>
            </View>
            <View style={{ position: 'absolute', top: 52, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E50914', marginRight: 6 }} />
              <Text style={{ fontSize: 9, fontFamily: Typography.family.bold, color: '#FFF' }}>LIVE</Text>
            </View>
          </View>
        )}

        {/* Dynamic Image Slots */}
        {isBusiness && (
          <Animated.View 
            style={[{ transform: [{ translateX: logoPos.x }, { translateY: logoPos.y }, { scale: logoScale }, { rotate: `${logoRotation}deg` }] }, { position: 'absolute', top: 110, left: '50%', marginLeft: -70, opacity: logoOpacity, touchAction: 'none' }]} 
            {...logoResponder.panHandlers}
            key="biz-product"
          >
            <TouchableOpacity onPress={() => pickImage(setProductImageUri)} style={[styles.productImageSlot, selectedCanvasEl === 'LOGO' && styles.canvasSelected]}>
              {productImageUri ? (
                <Image source={{ uri: productImageUri }} style={styles.fillImage} />
              ) : (
                <View style={styles.slotPlaceholder}>
                  <Feather name={type === 'youtube_qr' ? 'grid' : 'image'} size={24} color="#A0A0A0" />
                  <Text style={styles.slotPlaceholderText}>
                    {type === 'youtube_qr' ? 'Tap to Add QR Code' : 'Tap to Add Product'}
                  </Text>
                </View>
              )}
              {selectedCanvasEl === 'LOGO' && (
                <>
                  <View style={[styles.moveHandle, { transform: [{ scale: 1 / logoScale }] }]}>
                    <Feather name="move" size={10} color="#FFF" />
                  </View>
                  <View style={[styles.resizeHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoResize.panHandlers}>
                    <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                  </View>
                  <View style={[styles.rotateHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoRot.panHandlers}>
                    <Feather name="rotate-cw" size={10} color="#FFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}

        {isPolitical && (
          <>
            {/* Candidate Frame */}
            <Animated.View 
              style={[{ transform: [{ translateX: logoPos.x }, { translateY: logoPos.y }, { scale: logoScale }, { rotate: `${logoRotation}deg` }] }, { position: 'absolute', top: 110, left: '50%', marginLeft: type === 'breaking_news' ? -85 : -55, zIndex: 10, opacity: logoOpacity, touchAction: 'none' }]} 
              {...logoResponder.panHandlers}
              key="candidate-avatar"
            >
              <TouchableOpacity onPress={() => pickImage(setCandidateImageUri)} style={[candidateSlotStyle, selectedCanvasEl === 'LOGO' && styles.canvasSelected]}>
                {candidateImageUri ? (
                  <Image source={{ uri: candidateImageUri }} style={styles.fillImage} />
                ) : (
                  <View style={styles.slotPlaceholder}>
                    <Feather name={type === 'kids_birthday' ? 'gift' : type === 'breaking_news' ? 'video' : 'user'} size={30} color="#A0A0A0" />
                    <Text style={styles.slotPlaceholderText}>
                      {type === 'kids_birthday' ? 'Tap Child Photo' : type === 'breaking_news' ? 'Tap Video/Photo' : 'Tap Candidate'}
                    </Text>
                  </View>
                )}
                {selectedCanvasEl === 'LOGO' && (
                  <>
                    <View style={[styles.moveHandle, { transform: [{ scale: 1 / logoScale }] }]}>
                      <Feather name="move" size={10} color="#FFF" />
                    </View>
                    <View style={[styles.resizeHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoResize.panHandlers}>
                      <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                    </View>
                    <View style={[styles.rotateHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoRot.panHandlers}>
                      <Feather name="rotate-cw" size={10} color="#FFF" />
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Political Party Symbol */}
            {!isNewsOrKids && (
              <View style={[styles.partySymbolContainer]}>
                <TouchableOpacity onPress={() => pickImage(setPartySymbolUri)} style={styles.partySymbolSlot}>
                  {partySymbolUri ? (
                    <Image source={{ uri: partySymbolUri }} style={styles.fillImage} />
                  ) : (
                    <View style={styles.partySymbolPlaceholder}>
                      <Feather name="flag" size={14} color="#FFF" />
                      <Text style={styles.partySymbolText}>Symbol</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Tricolor Indicator strip */}
            {!isNewsOrKids && (
              <View style={styles.tricolorStripe}>
                <View style={[styles.tricolorBand, { backgroundColor: '#FF9933' }]} />
                <View style={[styles.tricolorBand, { backgroundColor: '#FFFFFF' }]} />
                <View style={[styles.tricolorBand, { backgroundColor: '#128807' }]} />
              </View>
            )}
          </>
        )}

        {isFestival && logoUri && (
          <Animated.View 
            style={[{ transform: [{ translateX: logoPos.x }, { translateY: logoPos.y }, { scale: logoScale }, { rotate: `${logoRotation}deg` }] }, { position: 'absolute', top: 110, left: '50%', marginLeft: -24, opacity: logoOpacity, touchAction: 'none' }]} 
            {...logoResponder.panHandlers}
            key="festival-logo"
          >
            <View style={[selectedCanvasEl === 'LOGO' && styles.canvasSelected]}>
              <Image source={{ uri: logoUri }} style={styles.canvasBrandLogo} />
              {selectedCanvasEl === 'LOGO' && (
                <>
                  <View style={[styles.moveHandle, { transform: [{ scale: 1 / logoScale }] }]}>
                    <Feather name="move" size={10} color="#FFF" />
                  </View>
                  <View style={[styles.resizeHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoResize.panHandlers}>
                    <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                  </View>
                  <View style={[styles.rotateHandle, { transform: [{ scale: 1 / logoScale }] }]} {...logoRot.panHandlers}>
                    <Feather name="rotate-cw" size={10} color="#FFF" />
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {/* Draggable Text Elements — drag directly on the Animated.View */}

        {/* Headline */}
        <Animated.View
          style={[{ transform: [{ translateX: headlinePos.x }, { translateY: headlinePos.y }, { rotate: `${headlineRotation}deg` }] }, { position: 'absolute', top: 24, left: 0, right: 0, width: '100%', alignItems: 'center', opacity: headlineOpacity, zIndex: 10, touchAction: 'none' }]}
          {...headlineResponder.panHandlers}
          key="canvas-headline"
        >
          <View style={[styles.canvasSelectWrapper, selectedCanvasEl === 'HEADLINE' && styles.canvasSelected]}>
            <Text
              style={[styles.canvasHeadline, textStyle, { fontSize: headlineSize, fontFamily: Typography.family.bold }]}
            >
              {headlineText || 'HEADLINE'}
            </Text>
            {selectedCanvasEl === 'HEADLINE' && (
              <>
                <View style={styles.moveHandle}>
                  <Feather name="move" size={10} color="#FFF" />
                </View>
                <View style={styles.resizeHandle} {...headlineResize.panHandlers}>
                  <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <View style={styles.rotateHandle} {...headlineRot.panHandlers}>
                  <Feather name="rotate-cw" size={10} color="#FFF" />
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Subheadline */}
        <Animated.View
          style={[{ transform: [{ translateX: subheadlinePos.x }, { translateY: subheadlinePos.y }, { rotate: `${subheadlineRotation}deg` }] }, { position: 'absolute', top: 68, left: 0, right: 0, width: '100%', alignItems: 'center', paddingHorizontal: 20, opacity: subheadlineOpacity, zIndex: 10, touchAction: 'none' }]}
          {...subheadlineResponder.panHandlers}
          key="canvas-subheadline"
        >
          <View style={[styles.canvasSelectWrapper, selectedCanvasEl === 'SUBHEADLINE' && styles.canvasSelected]}>
            <Text
              style={[styles.canvasSubheadline, textStyle, { fontSize: subheadlineSize }]}
            >
              {subheadlineText || 'Your description goes here.'}
            </Text>
            {selectedCanvasEl === 'SUBHEADLINE' && (
              <>
                <View style={styles.moveHandle}>
                  <Feather name="move" size={10} color="#FFF" />
                </View>
                <View style={styles.resizeHandle} {...subheadlineResize.panHandlers}>
                  <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <View style={styles.rotateHandle} {...subheadlineRot.panHandlers}>
                  <Feather name="rotate-cw" size={10} color="#FFF" />
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Brand Name */}
        <Animated.View
          style={[{ transform: [{ translateX: businessNamePos.x }, { translateY: businessNamePos.y }, { rotate: `${brandNameRotation}deg` }] }, { position: 'absolute', bottom: 84, left: 0, right: 0, width: '100%', alignItems: 'center', opacity: brandNameOpacity, zIndex: 10, touchAction: 'none' }]}
          {...businessNameResponder.panHandlers}
          key="canvas-brandname"
        >
          <View style={[styles.canvasSelectWrapper, selectedCanvasEl === 'BRANDNAME' && styles.canvasSelected]}>
            <Text
              style={[styles.canvasBrandName, { color: selectedTemplate.accentColor || Colors.accent.primary, fontSize: brandNameSize }]}
            >
              {isPolitical ? (fullName || 'Candidate Quote') : (businessName || 'Your Business Name')}
            </Text>
            {selectedCanvasEl === 'BRANDNAME' && (
              <>
                <View style={styles.moveHandle}>
                  <Feather name="move" size={10} color="#FFF" />
                </View>
                <View style={styles.resizeHandle} {...brandNameResize.panHandlers}>
                  <Feather name="maximize-2" size={10} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <View style={styles.rotateHandle} {...brandNameRot.panHandlers}>
                  <Feather name="rotate-cw" size={10} color="#FFF" />
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Dynamic Poster Footer */}
        <Animated.View
          style={[{ transform: [{ translateX: footerPos.x }, { translateY: footerPos.y }] }, { position: 'absolute', bottom: 12, left: '5%', width: '90%', opacity: footerOpacity, zIndex: 10, touchAction: 'none' }]}
          {...footerResponder.panHandlers}
          key="canvas-footer"
        >
          <View style={[selectedCanvasEl === 'FOOTER' && styles.canvasSelected]}>
            <View style={[styles.canvasFooter, getFooterStyle()]}>
              <View>
                <Text style={[styles.footerName, getFooterTextStyle()]}>
                  {isPolitical ? (designation || 'Constituency') : (fullName || 'Your Name')}
                </Text>
                <Text style={[styles.footerDesignation, { color: selectedFrame === 'white_red' ? '#555555' : '#DDDDDD' }]}>
                  {isPolitical ? '' : (designation || 'Owner')}
                </Text>
              </View>
              <View style={styles.footerContact}>
                {phone ? <Text style={[styles.footerPhone, getFooterTextStyle()]}>📞 {phone}</Text> : null}
                {ctaText ? <Text style={[styles.footerCta, { color: getFooterCtaColor() }]}>{ctaText}</Text> : null}
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="chevron-left" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.logoText}>Edit Poster</Text>
          </View>
          <View style={styles.avatar}>
            <Feather name="user" size={20} color={Colors.text.primary} />
          </View>
        </View>

        {/* Category Tabs Filter */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category} 
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryTab, 
                selectedCategory === category && styles.categoryTabActive
              ]}
            >
              <Feather 
                name={category === 'ALL' ? 'grid' : category === 'FESTIVALS' ? 'calendar' : category === 'BUSINESS' ? 'briefcase' : 'flag'} 
                size={13} 
                color={selectedCategory === category ? Colors.background.app : Colors.text.secondary} 
                style={{ marginRight: 6 }}
              />
              <Text style={[
                styles.categoryTabText, 
                selectedCategory === category && styles.categoryTabTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Template List Selector */}
        <View style={styles.section}>
          <FlatList
            data={filteredTemplates}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderTemplateItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.templateList}
          />
        </View>

        {/* Dynamic Poster Canvas Box */}
        <View style={styles.canvasContainer}>
          <ViewShot 
            ref={viewShotRef} 
            options={{ format: 'png', quality: 1, width: 1080, height: 1080 }} 
            style={[
              styles.viewShot, 
              { backgroundColor: customBgColor || selectedTemplate.bgColor }
            ]}
          >
            {aiBgImageUri ? (
              <Image source={{ uri: aiBgImageUri }} style={styles.canvasBgImage} />
            ) : selectedTemplate.bgImage && !customBgColor ? (
              <Image source={{ uri: selectedTemplate.bgImage }} style={styles.canvasBgImage} />
            ) : null}
            
            {renderCanvasContent()}
          </ViewShot>
        </View>

        {/* Live Drag Info (Outside canvas container) */}
        <View style={styles.dragInfoContainer}>
          <Feather name="move" size={12} color={Colors.accent.primary} />
          <Text style={styles.dragInfoText}>
            {selectedCanvasEl ? `✦ ${selectedCanvasEl} SELECTED — DRAG TO MOVE` : 'TAP ANY TEXT / EMOJI TO SELECT & DRAG'}
          </Text>
        </View>

        {/* Control Sub-Panel Tabs */}
        <View style={styles.controlTabsBar}>
          <TouchableOpacity 
            style={[styles.controlTabBtn, activeControlTab === 'TEXT' && styles.controlTabBtnActive]} 
            onPress={() => setActiveControlTab('TEXT')}
          >
            <Feather name="edit" size={16} color={activeControlTab === 'TEXT' ? Colors.accent.primary : Colors.text.secondary} />
            <Text style={[styles.controlTabBtnText, activeControlTab === 'TEXT' && styles.controlTabBtnTextActive]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlTabBtn, activeControlTab === 'PHOTO' && styles.controlTabBtnActive]} 
            onPress={() => setActiveControlTab('PHOTO')}
          >
            <Feather name="image" size={16} color={activeControlTab === 'PHOTO' ? Colors.accent.primary : Colors.text.secondary} />
            <Text style={[styles.controlTabBtnText, activeControlTab === 'PHOTO' && styles.controlTabBtnTextActive]}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlTabBtn, activeControlTab === 'FRAMES' && styles.controlTabBtnActive]} 
            onPress={() => setActiveControlTab('FRAMES')}
          >
            <Feather name="layout" size={16} color={activeControlTab === 'FRAMES' ? Colors.accent.primary : Colors.text.secondary} />
            <Text style={[styles.controlTabBtnText, activeControlTab === 'FRAMES' && styles.controlTabBtnTextActive]}>Frames</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlTabBtn, activeControlTab === 'COLOR' && styles.controlTabBtnActive]} 
            onPress={() => setActiveControlTab('COLOR')}
          >
            <Feather name="aperture" size={16} color={activeControlTab === 'COLOR' ? Colors.accent.primary : Colors.text.secondary} />
            <Text style={[styles.controlTabBtnText, activeControlTab === 'COLOR' && styles.controlTabBtnTextActive]}>Colors</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlTabBtn, activeControlTab === 'AI' && styles.controlTabBtnActive]} 
            onPress={() => setActiveControlTab('AI')}
          >
            <Feather name="cpu" size={16} color={activeControlTab === 'AI' ? Colors.accent.primary : Colors.text.secondary} />
            <Text style={[styles.controlTabBtnText, activeControlTab === 'AI' && styles.controlTabBtnTextActive]}>AI</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Panels rendering */}
        <View style={styles.controlPanelContainer}>
          {activeControlTab === 'TEXT' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.panel}>
              <Text style={styles.panelTitle}>Customize Poster Text</Text>
              <Input label="Main Headline" placeholder="Enter headline" value={headlineText} onChangeText={setHeadlineText} />
              <Input label="Subheadline Slogan" placeholder="Enter details" value={subheadlineText} onChangeText={setSubheadlineText} />
              <Input label="CTA/Greeting Badge" placeholder="e.g. Shop Now! / Happy Pongal!" value={ctaText} onChangeText={setCtaText} />
            </MotiView>
          )}

          {activeControlTab === 'PHOTO' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.panel}>
              <Text style={styles.panelTitle}>Add Photos & Stickers</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity 
                  style={[styles.secondaryBtn, { flex: 1, height: 60, justifyContent: 'center' }]} 
                  onPress={() => pickImage(setUploadedImageUri)}
                >
                  <Feather name="plus-circle" size={20} color={Colors.accent.primary} />
                  <Text style={[styles.secondaryBtnText, { marginTop: 4 }]}>Upload Photo</Text>
                </TouchableOpacity>
                {uploadedImageUri && (
                  <TouchableOpacity 
                    style={[styles.secondaryBtn, { flex: 1, height: 60, justifyContent: 'center', backgroundColor: '#FFF0F0', borderColor: '#FF3B30' }]} 
                    onPress={() => setUploadedImageUri(null)}
                  >
                    <Feather name="trash-2" size={20} color="#FF3B30" />
                    <Text style={[styles.secondaryBtnText, { color: '#FF3B30', marginTop: 4 }]}>Remove Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.panelSubtitle, { marginTop: 12, textAlign: 'center' }]}>
                Uploaded photo can be moved and resized directly on the canvas!
              </Text>
            </MotiView>
          )}

          {activeControlTab === 'FRAMES' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.panel}>
              <Text style={styles.panelTitle}>Select Bottom Frame Style</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.framesScroll}>
                {[
                  { id: 'glass', name: 'Glassmorphism', desc: 'Neon blue' },
                  { id: 'tricolor', name: 'Tricolor', desc: 'Saffron & green' },
                  { id: 'gold', name: 'Royal Gold', desc: 'Crimson gold' },
                  { id: 'white_red', name: 'Crimson White', desc: 'Red & white' },
                  { id: 'gradient', name: 'Magic Purple', desc: 'Purple pink glow' },
                ].map(frame => {
                  const isActive = selectedFrame === frame.id;
                  return (
                    <TouchableOpacity 
                      key={frame.id} 
                      onPress={() => setSelectedFrame(frame.id)}
                      style={[styles.frameCard, isActive && styles.frameCardActive]}
                    >
                      <View style={[styles.frameCardMini, { 
                        backgroundColor: 
                          frame.id === 'glass' ? 'rgba(22, 27, 34, 0.95)' : 
                          frame.id === 'tricolor' ? '#FF9933' : 
                          frame.id === 'gold' ? '#800020' : 
                          frame.id === 'white_red' ? '#FFFFFF' : '#2A085C',
                        borderColor: 
                          frame.id === 'glass' ? '#00F2FE' : 
                          frame.id === 'tricolor' ? '#128807' : 
                          frame.id === 'gold' ? '#FFD700' : 
                          frame.id === 'white_red' ? '#D32F2F' : '#FF007F',
                        borderWidth: 2,
                        borderRadius: 8,
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                        height: 42,
                        width: '100%',
                        marginBottom: 6
                      }]}>
                        {/* Styled Wireframe Representation inside the mockup */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <View>
                            <View style={{ width: 32, height: 4, backgroundColor: frame.id === 'white_red' ? '#333' : '#FFF', borderRadius: 2, marginBottom: 3 }} />
                            <View style={{ width: 22, height: 3, backgroundColor: frame.id === 'white_red' ? '#555' : '#BBB', borderRadius: 1.5 }} />
                          </View>
                          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: frame.id === 'glass' ? '#00F2FE' : frame.id === 'tricolor' ? '#128807' : frame.id === 'gold' ? '#FFD700' : frame.id === 'white_red' ? '#D32F2F' : '#FF007F', opacity: 0.8 }} />
                        </View>
                      </View>
                      <Text style={styles.frameCardTitle} numberOfLines={1}>{frame.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <Text style={[styles.colorGroupLabel, { marginTop: 12 }]}>Quick Frame Colours</Text>
              <View style={styles.colorPalette}>
                {['#00F2FE', '#FFD700', '#FF007F', '#128807', '#D32F2F', '#8A2BE2', '#FFFFFF'].map(color => (
                  <TouchableOpacity 
                    key={color} 
                    onPress={() => setCustomTextColor(color)}
                    style={[styles.colorCircle, { backgroundColor: color }, customTextColor === color && styles.colorCircleActive]} 
                  />
                ))}
              </View>
            </MotiView>
          )}

          {activeControlTab === 'COLOR' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.panel}>
              <Text style={styles.panelTitle}>Custom Styling Colors</Text>
              
              <Text style={styles.colorGroupLabel}>Text Colors</Text>
              <View style={styles.colorPalette}>
                {['#FFFFFF', '#FFEB3B', '#FF5722', '#00F2FE', '#4CAF50', '#000000', '#F8BBD0'].map(color => (
                  <TouchableOpacity 
                    key={color} 
                    onPress={() => setCustomTextColor(color)}
                    style={[styles.colorCircle, { backgroundColor: color }, customTextColor === color && styles.colorCircleActive]} 
                  />
                ))}
              </View>

              <Text style={styles.colorGroupLabel}>Background Solid Overrides</Text>
              <View style={styles.colorPalette}>
                {['#000000', '#1A2E40', '#4B0082', '#E65C00', '#1E1405', '#D32F2F', '#1B5E20'].map(color => (
                  <TouchableOpacity 
                    key={color} 
                    onPress={() => setCustomBgColor(color)}
                    style={[styles.colorCircle, { backgroundColor: color }, customBgColor === color && styles.colorCircleActive]} 
                  />
                ))}
                <TouchableOpacity onPress={() => setCustomBgColor(null)} style={[styles.resetBgCircle, !customBgColor && styles.colorCircleActive]}>
                  <Feather name="refresh-cw" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </MotiView>
          )}

          {activeControlTab === 'AI' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.panel}>
              <Text style={styles.panelTitle}>AI Copywriter Assistant ✨</Text>
              
              {/* Helper Copy Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.helperPillsRow}>
                {(selectedTemplate.category === 'POLITICAL' 
                  ? ['सत्य और संकल्प के साथ विकास', 'सदा जनसेवा में समर्पित नेता', 'ईमानदार नेतृत्व हमारी पसंद']
                  : selectedTemplate.category === 'BUSINESS'
                    ? ['Mega Sale 50% Off Today', 'Fresh Bakery Promos', 'Discount Gym Membership']
                    : ['Happy New Year Greetings', 'Sweet Pongal Blessings', 'Happy Lohri Festival']
                ).map(pill => (
                  <TouchableOpacity 
                    key={pill} 
                    onPress={() => setAiPrompt(pill)}
                    style={styles.helperPill}
                  >
                    <Text style={styles.helperPillText}>{pill}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput 
                style={styles.aiInput}
                placeholder="What details should the AI write for this poster? (e.g., 'Bakery cake promo')"
                placeholderTextColor={Colors.text.secondary}
                value={aiPrompt}
                onChangeText={setAiPrompt}
                multiline
              />
              <Button 
                title={aiLoading ? "Generating Slogans..." : "Generate with AI 🔮"}
                onPress={handleGenerateAI}
                disabled={aiLoading}
              />

              <View style={styles.divider} />

              <Text style={styles.panelTitle}>AI Background Generator 🎨</Text>
              
              {/* Helper Background Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.helperPillsRow}>
                {['Cyberpunk neon grid pattern', 'Elegant gold glitter overlay', 'Vibrant flower harvest texture', 'Tricolor patriotic flag backdrop'].map(pill => (
                  <TouchableOpacity 
                    key={pill} 
                    onPress={() => setAiImgPrompt(pill)}
                    style={styles.helperPill}
                  >
                    <Text style={styles.helperPillText}>{pill}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput 
                style={styles.aiInput}
                placeholder="Describe details for AI to generate unique background image..."
                placeholderTextColor={Colors.text.secondary}
                value={aiImgPrompt}
                onChangeText={setAiImgPrompt}
                multiline
              />

              <Button 
                title={aiImgLoading ? "Generating Graphic..." : "Generate Background with AI 🎨"}
                onPress={handleGenerateImageAI}
                disabled={aiImgLoading}
              />

              {aiBgImageUri && (
                <View style={styles.aiBgPreviewContainer}>
                  <View style={styles.aiBgPreviewRow}>
                    <Image source={{ uri: aiBgImageUri }} style={styles.aiBgThumbnail} />
                    <View style={styles.aiBgDetails}>
                      <Text style={styles.aiBgText}>Custom AI Background Applied</Text>
                      <TouchableOpacity style={styles.clearBgBtn} onPress={() => setAiBgImageUri(null)}>
                        <Feather name="trash-2" size={14} color={Colors.accent.warning} />
                        <Text style={styles.clearBgBtnText}>Remove AI Graphic</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </MotiView>
          )}
        </View>


        {/* Dynamic Personal / Brand Input Form depending on layout type */}
        <View style={styles.section}>
          <Text style={styles.formTitle}>
            {selectedTemplate.category === 'POLITICAL' ? 'Candidate Details' : 'Brand Details'}
          </Text>
          {selectedTemplate.category === 'POLITICAL' ? (
            <>
              <Input label="Candidate Name" placeholder="e.g. S. Kumar" value={fullName} onChangeText={setFullName} />
              <Input label="Constituency / Party Role" placeholder="e.g. East Delhi MLA" value={designation} onChangeText={setDesignation} />
              <Input label="Election Slogan / Slogan" placeholder="e.g. सेवा और संकल्प" value={businessName} onChangeText={setBusinessName} />
            </>
          ) : (
            <>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input label="Full Name" placeholder="John Doe" value={fullName} onChangeText={setFullName} />
                </View>
                <View style={styles.halfWidth}>
                  <Input label="Designation" placeholder="Owner" value={designation} onChangeText={setDesignation} />
                </View>
              </View>
              <Input label="Business Name" placeholder="Creative Studio" value={businessName} onChangeText={setBusinessName} />
              <Input label="Phone / WhatsApp" placeholder="+91 98765 43210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              
              <TouchableOpacity style={styles.uploadContainer} onPress={() => pickImage(setLogoUri)}>
                {logoUri ? (
                  <View style={styles.row}>
                    <Image source={{ uri: logoUri }} style={styles.formLogoPreview} />
                    <Text style={styles.uploadText}>Update Business Logo</Text>
                  </View>
                ) : (
                  <>
                    <Feather name="upload-cloud" size={24} color={Colors.text.secondary} />
                    <Text style={styles.uploadText}>Upload Business Logo</Text>
                    <Text style={styles.uploadSubtext}>PNG OR JPG (MAX 2MB)</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12), paddingVertical: 12 }]}>
        <Button 
          title="Download HD Poster" 
          icon={<Feather name="download" size={18} color={Colors.text.dark} />} 
          style={styles.downloadBtn}
          onPress={handleDownload}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <Feather name="share-2" size={18} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoText: {
    fontFamily: Typography.family.bold,
    fontSize: 20,
    color: '#1A1A2E',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  categoryTabText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 12,
    color: '#6B7280',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  templateList: {
    paddingRight: 20,
  },
  templateCard: {
    width: 84,
    height: 84,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  templateCardActive: {
    borderColor: Colors.accent.primary,
  },
  templateImage: {
    width: '100%',
    height: '100%',
  },
  templateCardLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  templateCardText: {
    fontSize: 9,
    fontFamily: Typography.family.medium,
    color: '#FFF',
  },
  templateCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.accent.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  viewShot: {
    width: width - 32,
    height: width - 32,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasBgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  emojiOverlay: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  draggableEmoji: {
    position: 'absolute',
    zIndex: 15,
  },
  productImageSlot: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: '#FFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  candidatePhotoSlot: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fillImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slotPlaceholder: {
    padding: 10,
    alignItems: 'center',
  },
  slotPlaceholderText: {
    fontSize: 9,
    fontFamily: Typography.family.bold,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
  },
  partySymbolContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  partySymbolSlot: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  partySymbolPlaceholder: {
    alignItems: 'center',
  },
  partySymbolText: {
    fontSize: 7,
    fontFamily: Typography.family.bold,
    color: '#FFF',
  },
  tricolorStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    flexDirection: 'row',
  },
  tricolorBand: {
    flex: 1,
  },
  canvasBrandLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  canvasHeadline: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  canvasSubheadline: {
    textAlign: 'center',
    fontFamily: Typography.family.medium,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: 18,
  },
  canvasBrandName: {
    fontSize: 15,
    fontFamily: Typography.family.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  canvasFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerName: {
    color: '#FFF',
    fontFamily: Typography.family.bold,
    fontSize: 12,
  },
  footerDesignation: {
    color: '#DDD',
    fontFamily: Typography.family.regular,
    fontSize: 9,
    marginTop: 1,
  },
  footerContact: {
    alignItems: 'flex-end',
  },
  footerPhone: {
    color: '#FFF',
    fontFamily: Typography.family.semiBold,
    fontSize: 11,
  },
  footerCta: {
    fontFamily: Typography.family.bold,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent.primary,
    marginRight: 6,
  },
  liveBadgeText: {
    color: Colors.text.primary,
    fontFamily: Typography.family.bold,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  controlTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  controlTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlTabBtnActive: {
    backgroundColor: '#CCFBF1',
  },
  controlTabBtnText: {
    fontFamily: Typography.family.semiBold,
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 5,
  },
  controlTabBtnTextActive: {
    color: Colors.accent.primary,
  },
  controlPanelContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  panel: {
    width: '100%',
  },
  panelTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  adjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adjustLabel: {
    fontFamily: Typography.family.medium,
    fontSize: 13,
    color: Colors.text.secondary,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterVal: {
    fontFamily: Typography.family.bold,
    fontSize: 13,
    color: '#FFF',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  colorGroupLabel: {
    fontFamily: Typography.family.medium,
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: Colors.accent.primary,
    borderWidth: 2.5,
  },
  resetBgCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  aiInput: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontFamily: Typography.family.regular,
    fontSize: 13,
    color: '#1A1A2E',
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  formTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FAFBFD',
    marginTop: 10,
  },
  uploadText: {
    fontFamily: Typography.family.semiBold,
    color: '#1A1A2E',
    marginTop: 4,
    fontSize: 13,
  },
  uploadSubtext: {
    fontFamily: Typography.family.regular,
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  formLogoPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  downloadBtn: {
    flex: 1,
    marginRight: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  // Custom Slider styles
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: 3,
  },
  sliderHandle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Element Selector styles
  elementSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  elementPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  elementPillActive: {
    backgroundColor: '#CCFBF1',
    borderColor: Colors.accent.primary,
  },
  elementPillText: {
    fontFamily: Typography.family.medium,
    fontSize: 11,
    color: '#6B7280',
  },
  elementPillTextActive: {
    color: Colors.accent.primary,
    fontFamily: Typography.family.bold,
  },

  // Adjust Panel details
  adjustMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  slidersColumn: {
    flex: 1.1,
    marginRight: 16,
  },
  sliderControlGroup: {
    marginBottom: 14,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontFamily: Typography.family.medium,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  sliderValText: {
    fontFamily: Typography.family.bold,
    fontSize: 12,
    color: Colors.accent.primary,
  },
  dpadColumn: {
    flex: 0.9,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 12,
  },
  dpadTitle: {
    fontFamily: Typography.family.semiBold,
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dpadContainer: {
    width: 90,
    height: 90,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#F5F7FA',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
  },
  dpadUp: {
    top: 0,
    alignSelf: 'center',
  },
  dpadDown: {
    bottom: 0,
    alignSelf: 'center',
  },
  dpadLeft: {
    left: 0,
  },
  dpadRight: {
    right: 0,
  },
  dpadCenter: {
    backgroundColor: '#CCFBF1',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent.primary,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  dpadCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.primary,
  },
  sliderLabel: {
    fontFamily: Typography.family.medium,
    fontSize: 12,
    color: '#6B7280',
  },
  sliderValText: {
    fontFamily: Typography.family.bold,
    fontSize: 12,
    color: Colors.accent.primary,
  },

  // Helper pills & divider
  helperPillsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  helperPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  helperPillText: {
    fontSize: 10,
    fontFamily: Typography.family.medium,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
    width: '100%',
  },

  // AI Bg Image Preview styles
  aiBgPreviewContainer: {
    marginTop: 14,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiBgPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBgThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
  },
  aiBgDetails: {
    flex: 1,
  },
  aiBgText: {
    fontFamily: Typography.family.bold,
    fontSize: 11,
    color: '#1A1A2E',
  },
  clearBgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  clearBgBtnText: {
    fontFamily: Typography.family.bold,
    fontSize: 10,
    color: Colors.accent.warning,
    marginLeft: 4,
  },

  // Frame Selector Styles
  framesScroll: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingVertical: 4,
  },
  frameCard: {
    width: 94,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  frameCardActive: {
    borderColor: Colors.accent.primary,
    backgroundColor: '#CCFBF1',
  },
  frameCardMini: {
    width: '100%',
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCardTitle: {
    fontFamily: Typography.family.medium,
    fontSize: 9,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateCardContainer: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
  },
  templateImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5F7FA',
  },
  templateImageWrapperActive: {
    borderColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  templateBelowText: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: Typography.family.medium,
    color: '#6B7280',
    textAlign: 'center',
    width: '100%',
  },
  dragInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#CCFBF1',
    borderRadius: 10,
    marginBottom: 4,
    marginTop: 2,
  },
  dragInfoText: {
    color: Colors.accent.primary,
    fontFamily: Typography.family.bold,
    fontSize: 10,
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  // Selection ring styles
  canvasSelectWrapper: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
    userSelect: 'none',
  },
  canvasSelected: {
    borderColor: '#0D9488',
    borderWidth: 2,
    borderRadius: 6,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
  },
  resizeHandle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  moveHandle: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  rotateHandle: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});


