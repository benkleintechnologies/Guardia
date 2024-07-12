// CustomMarker.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const CustomMarker = () => {
  const scale = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]),
  ).start();

  return (
    <View style={styles.marker}>
      <Animated.View style={[styles.pulse, { transform: [{ scale }] }]} />
      <View style={styles.dot} />
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 150, 255, 0.3)',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 150, 255, 1)',
  },
});

export default CustomMarker;