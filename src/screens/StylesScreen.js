import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, GlobalStyles } from '../theme/typography';
import { useBrandStore } from '../store/useBrandStore';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function StylesScreen() {
  const brandStore = useBrandStore();

  const [businessName, setBusinessName] = useState(brandStore.businessName);
  const [whatsappNumber, setWhatsappNumber] = useState(brandStore.whatsappNumber);
  const [logoUri, setLogoUri] = useState(brandStore.logoUri);
  const [primaryColor, setPrimaryColor] = useState(brandStore.primaryColor);
  const [primaryFont, setPrimaryFont] = useState(brandStore.primaryFont);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleApply = () => {
    brandStore.updateBrandDetails({
      businessName,
      whatsappNumber,
      logoUri,
      primaryColor,
      primaryFont,
    });
    Alert.alert('Success ✨', 'Global styles applied successfully! They will now be used in all new designs.');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Global Styles</Text>
          <Text style={styles.headerDesc}>Configure your brand identity once and apply it to every design instantly.</Text>
        </View>

        {/* Section 1: Business Details */}
        <Card style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Feather name="briefcase" size={18} color={Colors.accent.primary} />
            <Text style={styles.cardTitle}>Business Details</Text>
          </View>
          
          <Input 
            label="Default Business Name" 
            placeholder="e.g. Creative Studio" 
            value={businessName} 
            onChangeText={setBusinessName} 
          />
          <Input 
            label="Default WhatsApp Number" 
            placeholder="+1 234 567 890" 
            value={whatsappNumber} 
            onChangeText={setWhatsappNumber} 
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Brand Logo</Text>
          <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
            <Feather name="upload-cloud" size={24} color={Colors.text.secondary} />
            <Text style={styles.uploadText}>{logoUri ? 'Change Logo' : 'Upload PNG or SVG'}</Text>
          </TouchableOpacity>
        </Card>

        {/* Section 2: Brand Kit Colors & Fonts */}
        <Card style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Feather name="palette" size={18} color={Colors.accent.primary} />
            <Text style={styles.cardTitle}>Brand Kit</Text>
          </View>

          <Text style={styles.label}>Primary Colors</Text>
          <View style={styles.swatchRow}>
            {Colors.swatches.map((color) => (
              <TouchableOpacity 
                key={color} 
                style={[
                  styles.swatch, 
                  { backgroundColor: color },
                  primaryColor === color && styles.swatchActive
                ]}
                onPress={() => setPrimaryColor(color)}
              />
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 24 }]}>Brand Fonts</Text>
          {Typography.fonts.map((font) => (
            <TouchableOpacity 
              key={font.id} 
              style={[styles.fontCard, primaryFont === font.id && styles.fontCardActive]}
              onPress={() => setPrimaryFont(font.id)}
            >
              <Text style={styles.fontName}>{font.name}</Text>
              <View style={[styles.radioBtn, primaryFont === font.id && styles.radioBtnActive]}>
                {primaryFont === font.id && <View style={styles.radioBtnInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <Button 
          title="Apply Global Styles ✨" 
          onPress={handleApply}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  headerDesc: {
    fontFamily: Typography.family.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  cardSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: Typography.family.bold,
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 10,
  },
  label: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontFamily: Typography.family.regular,
    color: Colors.text.primary,
    marginTop: 8,
    fontSize: 14,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  swatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: '#FFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  fontCard: {
    backgroundColor: Colors.background.app,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  fontCardActive: {
    borderColor: Colors.border.active,
  },
  fontName: {
    fontFamily: Typography.family.semiBold,
    color: Colors.text.primary,
    fontSize: 16,
  },
  radioBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtnActive: {
    borderColor: Colors.border.active,
  },
  radioBtnInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border.active,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.nav,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
});
