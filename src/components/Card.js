import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

const Card = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    // Add subtle border or shadow if needed
  },
});

export default Card;
