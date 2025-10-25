import React from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks';

export type AppBackgroundProps = {
  children?: React.ReactNode;
  overlayIntensity?: number; // multiplier for overlay alpha (combined with theme base)
  source?: ImageSourcePropType;
  gradientOverlay?: boolean; // optional gradient overlay tint
};

const AppBackground: React.FC<AppBackgroundProps> = ({
  children,
  overlayIntensity,
  gradientOverlay,
}) => {
  const { colors, isDark } = useTheme();
  // Add a subtle brand-tinted overlay that adapts to theme primary color
  const tintBase = isDark ? 0.04 : 0.06;
  const overlayAlpha = Math.max(0, Math.min(0.18, tintBase * (overlayIntensity ?? 3)));

  const hexToRgba = React.useCallback((hex: string, alpha: number) => {
    try {
      let c = hex.replace('#', '');
      if (c.length === 3) {
        c = c
          .split('')
          .map((ch) => ch + ch)
          .join('');
      }
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(0,0,0,${alpha})`;
    }
  }, []);

  // Background image and intensity are no longer user-configurable.

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative full background image (touches pass through) */}
      <View pointerEvents="none" style={styles.rightHalfWrapper}>
        {/* <ImageBackground
          source={source || require('../assets/images/uecfi-icon.jpg')}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          imageStyle={{ opacity: imageOpacity }}
        /> */}
        {/* Theme-tinted overlay to reflect selected brand/theme */}
        {gradientOverlay ? (
          <LinearGradient
            colors={[
              hexToRgba(colors.primary, overlayAlpha * 1.1),
              hexToRgba(colors.primary, overlayAlpha * 0.7),
              hexToRgba(colors.primary, overlayAlpha * 0.4),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: hexToRgba(colors.primary, overlayAlpha) },
            ]}
          />
        )}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  rightHalfWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
  content: { flex: 1 },
});

export default AppBackground;
