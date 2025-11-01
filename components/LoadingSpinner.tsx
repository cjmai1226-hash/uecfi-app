import React, { useEffect, useRef, useState } from 'react';
import { createHomeStyles } from '../assets/styles';
import { useTheme } from '../hooks';
import { Animated, Easing, Text, View } from 'react-native';

type LoadingSpinnerProps = {
  // Optional determinate progress (0..1). If omitted, a gentle auto-progress up to ~90% is shown.
  progress?: number;
  // Optional message to display under the bar
  message?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ progress, message }) => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  // Animated progress value (0..1)
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [visualProgress, setVisualProgress] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  // Drive animation when explicit progress changes
  useEffect(() => {
    const target = typeof progress === 'number' ? Math.max(0, Math.min(1, progress)) : undefined;
    if (typeof target === 'number') {
      Animated.timing(progressAnim, {
        toValue: target,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // animating width
      }).start();
    }
  }, [progress, progressAnim]);

  // Gentle auto-progress when indeterminate (no progress provided)
  useEffect(() => {
    if (typeof progress === 'number') return; // external control present
    const anim = Animated.timing(progressAnim, {
      toValue: 0.9,
      duration: 8000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, progressAnim]);

  // Keep a readable percentage for the label
  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => setVisualProgress(value));
    return () => progressAnim.removeListener(id);
  }, [progressAnim]);

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
    width: 280,
    paddingVertical: 20,
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

  const trackStyle = {
    width: '100%' as any,
    height: 10,
    borderRadius: 9999,
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    overflow: 'hidden' as const,
    marginBottom: 12,
  };

  const barBaseStyle = {
    height: '100%',
    borderRadius: 9999,
    backgroundColor: colors.primary,
  } as const;

  const messageStyle = {
    fontSize: 13,
    color: colors.text,
    opacity: 0.9,
    textAlign: 'center' as const,
    marginTop: 4,
    letterSpacing: 0.4,
  };

  return (
    <View style={[homeStyles.container, { backgroundColor: colors.background }]}>
      <View style={overlayStyle} pointerEvents="none">
        <View style={cardStyle}>
          <View
            style={trackStyle}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[
                barBaseStyle,
                trackWidth
                  ? {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, trackWidth],
                      }),
                    }
                  : { width: '0%' },
              ]}
            />
          </View>
          <Text style={messageStyle}>
            {message ?? 'Loading your app content…'} {` ${Math.round(visualProgress * 100)}%`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingSpinner;
