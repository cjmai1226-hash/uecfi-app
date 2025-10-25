import React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { useTheme } from '../hooks';

type Props = {
  label?: string;
  size?: number; // font size
  style?: TextStyle;
};

// Reusable brand title: icon + label (e.g., tab/page name)
export const BrandTitle: React.FC<Props> = ({ label = 'uecfi', size = 36, style }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* <Image
        source={iconSource}
        style={{ width: 50, height: 50, borderRadius: Math.ceil(iconSize / 5), marginRight: 8 }}
        resizeMode="contain"
      /> */}
      <Text
        style={[
          {
            fontSize: 20,
            fontWeight: '900',
            color: isDark ? '#F2F2F2' : colors.primary,
            letterSpacing: 0.5,
            // textTransform: 'capitalize',
          },
          style,
        ]}>
        {label}
      </Text>
    </View>
  );
};

export default BrandTitle;
