// CustomMarker.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface CustomMarkerProps {
  color?: 'blue' | 'red';
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ color = 'blue' }) => {
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
      <Animated.View style={[color == 'blue' ? styles.bluePulse : styles.redPulse, { transform: [{ scale }] }]} />
      <View style={color == 'blue' ? styles.blueDot : styles.redDot} />
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluePulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 150, 255, 0.3)',
  },
  redPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  blueDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 150, 255, 1)',
  },
  redDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 0, 0, 1)',
  },
});

export default CustomMarker;