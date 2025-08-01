import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

export default function MsgBox({ message, type = 'success', visible, duration = 3000 }) {
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 5,
        duration: 400,
        useNativeDriver: false,
      }).start();

      // Hide after delay
      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.box, {
      top: slideAnim,
      backgroundColor: type === 'success' ? '#28a745' : '#dc3545'
    }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    alignItems: 'center',
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  }
});
