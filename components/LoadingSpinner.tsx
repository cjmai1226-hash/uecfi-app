import React, { useEffect, useRef } from 'react';
import { createHomeStyles } from '../assets/styles';
import { useTheme } from '../hooks';
import { ActivityIndicator, Animated, Easing, Text, View } from 'react-native';

const LoadingSpinner = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  // Pulse animation for a subtle breathing effect around the spinner
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.20)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const cardStyle = {
    width: 220,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: (colors as any).headerBackground ?? colors.background,
    // Soft elevation/shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: `${colors.primary}33`, // primary with ~20% alpha
  };

  const haloStyle = {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: `${colors.primary}10`, // faint inner glow
    borderWidth: 2,
    borderColor: `${colors.primary}55`,
    marginBottom: 14,
  };

  const messageStyle = {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.9,
    textAlign: 'center' as const,
    marginTop: 2,
    letterSpacing: 0.4,
  };

  return (
    <View style={[homeStyles.container, { backgroundColor: colors.background }]}>
      <View style={overlayStyle} pointerEvents="none">
        <View style={cardStyle}>
          <Animated.View style={[haloStyle, { transform: [{ scale: pulse }] }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </Animated.View>
          <Text style={messageStyle}>Loading your App Content...</Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingSpinner;
