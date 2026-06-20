import { StyleSheet } from 'react-native';

export const Typography = {
  family: {
    regular: 'Inter-Regular', // Need to load these fonts
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fonts: [
    { id: 'inter', name: 'Inter' },
    { id: 'sora', name: 'Sora Bold' },
    { id: 'georgia', name: 'Georgia Serif' },
  ],
};

export const GlobalStyles = StyleSheet.create({
  heading: {
    fontFamily: Typography.family.bold,
    color: '#FFFFFF',
    fontSize: 24,
  },
  subtitle: {
    fontFamily: Typography.family.semiBold,
    color: '#8B949E',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
